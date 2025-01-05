import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { ProductCategory } from '../products/entities/product-category.entity';
import { UserProductsController } from '../products/user-products.controller';
import { ProductsService } from '../products/products.service';
import { ProductCategoryService } from '../products/product-category.service';
import { ProductsProfile } from '../products/products.profile';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductCategory]),
    AuthModule,
    RouterModule.register([
      {
        path: 'users',
        module: AuthModule,
      },
    ]),
  ],
  controllers: [UserProductsController],
  providers: [ProductsService, ProductCategoryService, ProductsProfile],
})
export class UsersApp {}
