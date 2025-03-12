import { MailsModule } from './../../mailers/mailers.module';
import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { AdminProfile } from './admins.profile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admin]), MailsModule],
  controllers: [AdminsController],
  providers: [AdminsService, AdminProfile],
  exports: [AdminsService],
})
export class AdminsModule {}
