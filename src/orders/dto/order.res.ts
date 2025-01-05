import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { OrderDto } from './order.dto';

export class ResponseList {
  @AutoMap()
  @ApiProperty()
  data: OrderDto[];

  @AutoMap()
  @ApiProperty()
  page: number;

  @AutoMap()
  @ApiProperty()
  perPage: number;

  @AutoMap()
  @ApiProperty()
  total: number;
}
