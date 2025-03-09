import {
  Controller,
  HttpStatus,
  HttpCode,
  Post,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateOrderDetailListDto } from './dto/create-order-detail.dto';
import { AuthGuard } from 'src/users/auth/auth.guard';

@Controller('orders')
export class UserOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  async create(
    @Request() req,
    @Body() createOrderDetailDto: CreateOrderDetailListDto,
  ) {
    return await this.ordersService.create(createOrderDetailDto, req);
  }
}
