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
import { CreateVNPayDto } from './dto/create-vn-pay.dto';
import { VNPayService } from './vn-pay.service';

@Controller('orders')
export class UserOrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly vnPayService: VNPayService,
  ) {}

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

  @Get('return/:id')
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  async detailReturn(@Request() req, @Param('id') id: string) {
    return await this.ordersService.findOneByIDHaveMapper(+id, req);
  }

  @Post('create_vn_pay_url')
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  async createVNPayUrl(@Body() createVNPayDto: CreateVNPayDto) {
    return await this.vnPayService.createVNPayUrl(createVNPayDto);
  }

  @Post('verify_vn_pay')
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  async verifyVNPayUrl(@Body() query: any) {
    return await this.vnPayService.verifyPaymentVNPay(query);
  }
}
