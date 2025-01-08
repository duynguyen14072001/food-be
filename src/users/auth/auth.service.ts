import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { LoginRes } from './dto/login.res';
import { ConfigService } from '@nestjs/config';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { isExpiredToken } from './public.decorator';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '../../mailers/mailers.service';
import { PasswordResetToken } from '../../password-reset-tokens/entity/password-reset-token.entity';
import { UsersService } from '../users/users.service';

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

  async changePassword(user: any, changePasswordDto: ChangePasswordDto) {
    const userData = await this.usersService.findOneByEmail(user.mail_address);

    if (
      !userData ||
      !(await argon2.verify(userData.password, changePasswordDto.old_password))
    ) {
      throw new NotFoundException('Failed');
    }
    const password = await argon2.hash(changePasswordDto.new_password);
    return this.usersService.updatePassword(userData.id, password);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { mail_address } = forgotPasswordDto;
    const data = await this.passwordResetRepository.find({
      where: { mail_address },
      order: { created_at: 'desc' },
    });

    const { length: existData } = data;
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
        subject: 'パスワードリセットリクエストを受け取りました',
        template: `mail-forgot-password.pug`,
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
}
