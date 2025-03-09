import { AdminsModule } from './../admins/admins.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { config as dotenvConfig } from 'dotenv';
import { AuthController } from './auth.controller';
import { ValidateMail } from './dto/mail-validation.dto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordResetToken } from '../../password-reset-tokens/entity/password-reset-token.entity';
import { MailsModule } from '../../mailers/mailers.module';
import { Admin } from '../admins/entities/admin.entity';
import { AdminsService } from '../admins/admins.service';

dotenvConfig();

@Module({
  imports: [
    AdminsModule,
    TypeOrmModule.forFeature([PasswordResetToken, Admin]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
    MailsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AdminsService, ValidateMail],
})
export class AuthModule {}
