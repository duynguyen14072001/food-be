import { Module } from '@nestjs/common';
import { AdminsModule } from './admins/admins.module';
import { AuthModule } from './auth/auth.module';
import { RouterModule } from '@nestjs/core';
import { CategoriesModule } from '../categories/categories.module';
import { CodesModule } from '../codes/codes.module';
import { UploadsModule } from '../uploads/uploads.module';
import { UsersModule } from '../users/users/users.module';

@Module({
  imports: [
    AdminsModule,
    AuthModule,
    CategoriesModule,
    CodesModule,
    UploadsModule,
    UsersModule,
    RouterModule.register([
      {
        path: 'admins',
        module: AdminsModule,
      },
      {
        path: 'admins',
        module: AuthModule,
      },
      {
        path: 'admins',
        module: CategoriesModule,
      },
      {
        path: 'admins',
        module: CodesModule,
      },
      {
        path: 'admins',
        module: UploadsModule,
      },
      {
        path: 'admins',
        module: UsersModule,
      },
    ]),
  ],
  providers: [],
})
export class AdminsApp {}
