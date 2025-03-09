import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { config as dotenvConfig } from 'dotenv';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordResetToken } from '../../password-reset-tokens/entity/password-reset-token.entity';
import { MailsModule } from '../../mailers/mailers.module';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

dotenvConfig();

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([PasswordResetToken, User]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
    MailsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService],
})
export class AuthModule {}
