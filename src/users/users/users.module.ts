import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MailService } from '../../mailers/mailers.service';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailsModule } from '../../mailers/mailers.module';
import { UserProfile } from './users.profile';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MailsModule],
  controllers: [UsersController],
  providers: [UsersService, MailService, UserProfile],
  exports: [UsersService],
})
export class UsersModule {}
