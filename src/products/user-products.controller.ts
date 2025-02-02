import {
  Controller,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Public } from '../users/auth/public.decorator';

@Controller('products')
export class UserProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query) {
    return await this.productsService.findAllNoMapper(query);
  }

  @Public()
  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('slug') slug: string) {
    return await this.productsService.findOneBySlug(slug);
  }
}
