import { MailsModule } from './../../mailers/mailers.module';
import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { AdminProfile } from './admins.profile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Admin]), MailsModule],
  controllers: [AdminsController],
  providers: [
    AdminsService,
    AdminProfile,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [AdminsService],
})
export class AdminsModule {}
