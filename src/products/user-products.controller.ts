import {
  Controller,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Public } from 'src/users/auth/public.decorator';

@Controller('products')
export class UserProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query) {
    return await this.productsService.findAll(query);
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOneByID(+id);
  }
}
