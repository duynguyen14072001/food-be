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
import { UploadsService } from '../uploads/uploads.service';
import { Banner } from '../banners/entities/banner.entity';
import { AdminBannersController } from '../banners/admin-banners.controller';
import { BannersService } from '../banners/banners.service';
import { File } from '../uploads/entities/upload.entity';
import { UploadsCloudinaryService } from '../uploads/uploads-cloudinary.service';
import { UploadsModule } from '../uploads/uploads.module';
import { BannersProfile } from 'src/banners/banners.profile';
import { AdminFaqsController } from 'src/faqs/admin-faqs.controller';
import { Faq } from 'src/faqs/entities/faq.entity';
import { FaqsProfile } from 'src/faqs/faqs.profile';
import { FaqsService } from 'src/faqs/faqs.service';

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
      Banner,
      File,
      Faq,
    ]),
    AuthModule,
    UploadsModule,
    RouterModule.register([
      {
        path: 'admins',
        module: AuthModule,
      },
      {
        path: 'admins',
        module: UploadsModule,
      },
    ]),
  ],
  controllers: [
    AdminCodesController,
    AdminCategoriesController,
    AdminProductsController,
    AdminUsersController,
    AdminOrdersController,
    AdminBannersController,
    AdminFaqsController,
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
    UploadsService,
    UploadsCloudinaryService,
    BannersService,
    BannersProfile,
    FaqsProfile,
    FaqsService,
  ],
})
export class AdminsApp {}
