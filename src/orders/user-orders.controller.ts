import {
  Controller,
  HttpStatus,
  HttpCode,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Query,
  Param,
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

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  async list(@Request() req, @Query() query) {
    return await this.ordersService.findAllByUser(query, req);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  async detail(@Request() req, @Param('id') id: string) {
    return await this.ordersService.findOneByID(+id, req);
  }
}
