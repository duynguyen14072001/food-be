import { Injectable } from '@nestjs/common';
import { CreateVNPayDto } from './dto/create-vn-pay.dto';
import dayjs from 'dayjs';
import * as crypto from 'crypto';

@Injectable()
export class VNPayService {
  async createVNPayUrl(createVNPayDto: CreateVNPayDto) {
    if (!createVNPayDto.amount || createVNPayDto.amount <= 0) {
      throw new Error('Amount is unavailable');
    }

    const vnp_TmnCode = process.env.VN_PAY_TMN_CODE;
    const vnp_HashSecret = process.env.VN_PAY_HASH_SECRET;
    const vnp_Url = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    const vnp_ReturnUrl = process.env.ORIGIN_URL_USER + '/orders/vn-pay-return';

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
