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
import { ProductCategoryService } from '../products/product-category.service';
import { ProductCategory } from '../products/entities/product-category.entity';
import { RouterModule } from '@nestjs/core';
import { ProductsProfile } from '../products/products.profile';
import { CategoriesProfile } from '../categories/categories.profile';
import { UserProfile } from '../users/users/users.profile';
import { AdminUsersController } from '../users/users/admin-users.controller';
import { UsersService } from '../users/users/users.service';
import { MailService } from '../mailers/mailers.service';
import { OrderDetail } from '../orders/entities/order-detail.entity';
import { Order } from '../orders/entities/order.entity';
import { AdminOrdersController } from '../orders/admin-orders.controller';
import { OrdersProfile } from '../orders/orders.profile';
import { OrdersService } from '../orders/orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      User,
      Code,
      Product,
      ProductCategory,
      Order,
      OrderDetail,
    ]),
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
    AdminUsersController,
    AdminOrdersController,
  ],
  providers: [
    CategoriesService,
    CodesService,
    ProductsService,
    ProductCategoryService,
    UsersService,
    MailService,
    OrdersService,
    ProductsProfile,
    CategoriesProfile,
    UserProfile,
    OrdersProfile,
  ],
})
export class AdminsApp {}
