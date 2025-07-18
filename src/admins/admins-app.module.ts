import { Module } from '@nestjs/common';
import { AdminCategoriesController } from '../categories/admin-categories.controller';
import { CategoriesService } from '../categories/categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { AuthModule } from './auth/auth.module';
import { User } from '../users/users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { AdminProductsController } from '../products/admin-products.controller';
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
import { BannersProfile } from 'src/banners/banners.profile';
import { AdminFaqsController } from 'src/faqs/admin-faqs.controller';
import { Faq } from 'src/faqs/entities/faq.entity';
import { FaqsProfile } from 'src/faqs/faqs.profile';
import { FaqsService } from 'src/faqs/faqs.service';
import { Recommend } from 'src/recommends/entities/recommend.entity';
import { AdminRecommendsController } from 'src/recommends/admin-recommends.controller';
import { RecommendsService } from 'src/recommends/recommends.service';
import { ProductImagesService } from 'src/products/product-images.service';
import { ProductImages } from 'src/products/entities/product-images.entity';
import { OrderDetailsService } from 'src/orders/order-details.service';
import { UploadsController } from 'src/uploads/uploads.controller';
import { MapsService } from 'src/maps/maps.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      User,
      Product,
      ProductCategory,
      ProductImages,
      Order,
      OrderDetail,
      Banner,
      File,
      Faq,
      Recommend,
    ]),
    AuthModule,
    HttpModule,
    RouterModule.register([
      {
        path: 'admins',
        module: AuthModule,
      },
    ]),
  ],
  controllers: [
    AdminCategoriesController,
    AdminProductsController,
    AdminUsersController,
    AdminOrdersController,
    AdminBannersController,
    AdminFaqsController,
    AdminRecommendsController,
    UploadsController,
  ],
  providers: [
    CategoriesService,
    ProductsService,
    ProductCategoryService,
    ProductImagesService,
    UsersService,
    MailService,
    OrdersService,
    OrderDetailsService,
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
    RecommendsService,
    MapsService,
  ],
})
export class AdminsApp {}
