import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('orders')
export class AdminOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiBearerAuth('JWT-auth')
  async findAll(@Query() query) {
    return await this.ordersService.findAll(query);
  }
}
