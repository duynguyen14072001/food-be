import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class OrderDetailDto {
  @AutoMap()
  @ApiProperty()
  id: number;

  @AutoMap()
  @ApiProperty()
  product_id: number;

  @AutoMap()
  @ApiProperty()
  order_id: number;

  @AutoMap()
  @ApiProperty()
  quantity: number;

  @AutoMap()
  @ApiProperty()
  amount: number;
}
