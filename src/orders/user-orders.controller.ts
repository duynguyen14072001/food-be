import {
  Controller,
  HttpStatus,
  HttpCode,
  Post,
  Body,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateOrderDetailListDto } from './dto/create-order-detail.dto';

@Controller('orders')
export class UserOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiBearerAuth('JWT-auth')
  async create(
    @Request() req,
    @Body() createOrderDetailDto: CreateOrderDetailListDto,
  ) {
    return await this.ordersService.create(createOrderDetailDto, req);
  }
}
