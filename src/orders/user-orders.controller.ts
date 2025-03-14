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
import dayjs from 'dayjs';
import * as crypto from 'crypto';
import { CreateVNPayDto } from './dto/create-vn-pay.dto';

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

  @Post('create_vn_pay_url')
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  async createVNPayUrl(@Body() createVNPayDto: CreateVNPayDto) {
    if (!createVNPayDto.amount || createVNPayDto.amount <= 0) {
      return { error: 'Số tiền không hợp lệ!' };
    }

    const vnp_TmnCode = process.env.VN_PAY_TMN_CODE;
    const vnp_HashSecret = process.env.VN_PAY_HASH_SECRET;
    const vnp_Url = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    const vnp_ReturnUrl = process.env.ORIGIN_URL_USER;

    const vnp_Params: Record<string, string> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: vnp_TmnCode,
      vnp_Amount: (createVNPayDto.amount * 100).toString(),
      vnp_CurrCode: 'VND',
      vnp_TxnRef: dayjs().format('YYYYMMDDHHmmss'),
      vnp_OrderInfo: `Thanh toán đơn hàng - ${dayjs().format('YYYYMMDDHHmmss')}`,
      vnp_OrderType: 'billpayment',
      vnp_Locale: 'vn',
      vnp_ReturnUrl: vnp_ReturnUrl,
      vnp_IpAddr: '127.0.0.1',
      vnp_CreateDate: dayjs().format('YYYYMMDDHHmmss'),
    };

    const sortedParams = Object.keys(vnp_Params)
      .sort()
      .reduce(
        (acc, key) => {
          acc[key] = vnp_Params[key];
          return acc;
        },
        {} as Record<string, string>,
      );

    const querystring = new URLSearchParams(sortedParams).toString();
    const hmac = crypto.createHmac('sha512', vnp_HashSecret);
    const secureHash = hmac.update(querystring).digest('hex');

    return `${vnp_Url}?${querystring}&vnp_SecureHash=${secureHash}`;
  }
}
