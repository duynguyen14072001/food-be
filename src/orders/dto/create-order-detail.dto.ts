import { ApiProperty, PartialType } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { OrderDetail } from '../entities/order-detail.entity';

export class CreateOrderDetailDto extends PartialType(OrderDetail) {}

export class CreateOrderDetailListDto {
  @AutoMap()
  @ApiProperty()
  orders: CreateOrderDetailDto[];
  shipping_address: string;
  note: string;
  payment_method: number;
}
