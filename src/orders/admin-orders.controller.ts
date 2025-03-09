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
import { UpdateStatusOrderDto } from './dto/update-status-order.dto';
import { UpdateStatusPaymentOrderDto } from './dto/update-status-payment-order.dto';

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

  @Patch('status/:id')
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiBearerAuth('JWT-auth')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusOrderDto: UpdateStatusOrderDto,
  ) {
    return await this.ordersService.updateStatus(+id, updateStatusOrderDto);
  }

  @Patch('status-payment/:id')
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiBearerAuth('JWT-auth')
  async updateStatusPayment(
    @Param('id') id: string,
    @Body() updateStatusPaymentOrderDto: UpdateStatusPaymentOrderDto,
  ) {
    return await this.ordersService.updateStatusPayment(
      +id,
      updateStatusPaymentOrderDto,
    );
  }
}
