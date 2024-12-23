import { Module } from '@nestjs/common';
import { AdminsModule } from './admins/admins.module';
import { AuthModule } from './auth/auth.module';
import { RouterModule } from '@nestjs/core';
import { ProductsModule } from 'src/products/products.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { CodesModule } from 'src/codes/codes.module';

@Module({
  imports: [
    AdminsModule,
    AuthModule,
    ProductsModule,
    CategoriesModule,
    CodesModule,
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
        module: ProductsModule,
      },
      {
        path: 'admins',
        module: CategoriesModule,
      },
      {
        path: 'admins',
        module: CodesModule,
      },
    ]),
  ],
  providers: [],
})
export class AdminsApp {}
