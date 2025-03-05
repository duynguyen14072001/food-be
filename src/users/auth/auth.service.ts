import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { LoginRes } from './dto/login.res';
import { ConfigService } from '@nestjs/config';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { isExpiredToken } from './public.decorator';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '../../mailers/mailers.service';
import { PasswordResetToken } from '../../password-reset-tokens/entity/password-reset-token.entity';
import { UsersService } from '../users/users.service';
import { UpdateInfoDto } from './dto/update-info.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
    private mailService: MailService,
    @InjectRepository(PasswordResetToken)
    private passwordResetRepository: Repository<PasswordResetToken>,
  ) {}

  async signIn(email: string, password: string): Promise<LoginRes> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user || !(await argon2.verify(user.password, password))) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
    };

    return {
      me: await this.usersService.findOneByID(user.id),
      access_token: await this.jwtService.signAsync(payload),
      token_type: 'Bearer',
      expires_in: this.configService.get<string>('JWT_EXPIRES_IN'),
    };
  }

  async signUp(payload: any): Promise<any> {
    return await this.usersService.create(payload);
  }

  async updateInfo(req: any, updateInfoDto: UpdateInfoDto) {
    const userData = await this.usersService.findOneByEmail(
      req.user.mail_address,
    );
    const { new_password, old_password, ...dataUpdate } = updateInfoDto;
    if (!userData) {
      throw new NotFoundException('Failed');
    }
    if (old_password) {
      if (!(await argon2.verify(userData.password, old_password))) {
        throw new ForbiddenException('Failed');
      }
      const password = await argon2.hash(new_password);
      const data = {
        ...dataUpdate,
        password,
      };
      return await this.usersService.updateData(+userData.id, data);
    }
    return await this.usersService.updateData(+userData.id, dataUpdate);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { mail_address } = forgotPasswordDto;
    const data = await this.passwordResetRepository.find({
      where: { mail_address },
      order: { created_at: 'desc' },
    });

    const { length: existData } = data;
    const dataUser = await this.usersService.findOneByEmail(mail_address);

    if (!dataUser) {
      throw new ForbiddenException(`No data`);
    }

    if (!existData || (existData && isExpiredToken(data[0]))) {
      const token = uuidv4();
      const createData = this.passwordResetRepository.create({
        mail_address,
        token,
      });

      await this.passwordResetRepository.save(createData);
      const url =
        process.env.ORIGIN_URL_user + '/reset-password?token=' + token;

      await this.mailService.sendMail({
        mail_to: forgotPasswordDto.mail_address,
        subject: 'FOOD_TLU-FORGOT_PASSWORD',
        template: `user/mail-forgot-password.pug`,
        context: { url },
      });
    }

    return true;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, new_password } = resetPasswordDto;

    const data = await this.passwordResetRepository.find({ where: { token } });
    const { length: existData } = data;
    if (!existData || (existData && isExpiredToken(data[0]))) {
      existData && this.passwordResetRepository.delete(data[0].id);
      throw new NotFoundException();
    }

    const user = await this.usersService.findOneByEmail(data[0].mail_address);
    const password = await argon2.hash(new_password);
    await this.usersService.updatePassword(user.id, password);
    await this.passwordResetRepository.delete(data[0].id);

    return true;
  }

  async getMe(req: any) {
    return await this.usersService.findOneByID(req.user.id);
  }
}
