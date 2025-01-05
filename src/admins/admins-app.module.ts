import { Module } from '@nestjs/common';
import { AdminCategoriesController } from '../categories/admin-categories.controller';
import { CategoriesService } from '../categories/categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { AuthModule } from './auth/auth.module';
import { User } from '../users/users/entities/user.entity';
import { Code } from '../codes/entities/code.entity';
import { Product } from '../products/entities/product.entity';
import { AdminCodesController } from '../codes/admin-codes.controller';
import { AdminProductsController } from '../products/admin-products.controller';
import { CodesService } from '../codes/codes.service';
import { ProductsService } from '../products/products.service';
import { ProductCategoryService } from 'src/products/product-category.service';
import { ProductCategory } from '../products/entities/product-category.entity';
import { RouterModule } from '@nestjs/core';
import { ProductsProfile } from '../products/products.profile';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, User, Code, Product, ProductCategory]),
    AuthModule,
    RouterModule.register([
      {
        path: 'admins',
        module: AuthModule,
      },
    ]),
  ],
  controllers: [
    AdminCodesController,
    AdminCategoriesController,
    AdminProductsController,
  ],
  providers: [
    CategoriesService,
    CodesService,
    ProductsService,
    ProductCategoryService,
    ProductsProfile,
  ],
})
export class AdminsApp {}
