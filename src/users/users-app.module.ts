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
import { Banner } from '../banners/entities/banner.entity';
import { BannersProfile } from '../banners/banners.profile';
import { UserBannersController } from '../banners/user-banners.controller';
import { BannersService } from '../banners/banners.service';
import { UploadsCloudinaryService } from '../uploads/uploads-cloudinary.service';
import { UploadsService } from '../uploads/uploads.service';
import { File } from '../uploads/entities/upload.entity';
import { Faq } from 'src/faqs/entities/faq.entity';
import { UserFaqsController } from 'src/faqs/user-faqs.controller';
import { FaqsService } from 'src/faqs/faqs.service';
import { FaqsProfile } from 'src/faqs/faqs.profile';
import { Recommend } from 'src/recommends/entities/recommend.entity';
import { UserRecommendsController } from 'src/recommends/user-recommends.controller';
import { RecommendsService } from 'src/recommends/recommends.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductCategory,
      Banner,
      File,
      Faq,
      Recommend,
    ]),
    AuthModule,
    RouterModule.register([
      {
        path: 'users',
        module: AuthModule,
      },
    ]),
  ],
  controllers: [
    UserProductsController,
    UserBannersController,
    UserFaqsController,
    UserRecommendsController,
  ],
  providers: [
    ProductsService,
    ProductCategoryService,
    ProductsProfile,
    BannersProfile,
    BannersService,
    UploadsService,
    UploadsCloudinaryService,
    FaqsService,
    FaqsProfile,
    RecommendsService,
  ],
})
export class UsersApp {}
