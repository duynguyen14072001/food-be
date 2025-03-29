import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVNPayDto {
  @AutoMap()
  @ApiProperty()
  order_id: number;

  @AutoMap()
  @ApiProperty()
  amount: number;
}
