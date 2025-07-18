import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Request,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/users/auth/auth.guard';

@Controller('carts')
export class UserCartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  async upsert(@Request() req, @Body() createCartDto: CreateCartDto) {
    return await this.cartsService.upsert(createCartDto, req);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  async findAll(@Request() req, @Query() query) {
    return await this.cartsService.findAll(req, query);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateCartDto: UpdateCartDto,
  ) {
    return await this.cartsService.update(+id, updateCartDto, req);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  async remove(@Request() req, @Body() data: Record<string, any>) {
    return await this.cartsService.remove(data.ids, req);
  }
}
