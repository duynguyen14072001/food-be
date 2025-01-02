import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RouterModule } from '@nestjs/core';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    AuthModule,
    ProductsModule,
    RouterModule.register([
      {
        path: 'users',
        module: AuthModule,
      },
      {
        path: 'users',
        module: ProductsModule,
      },
    ]),
  ],
  providers: [],
})
export class UsersApp {}
