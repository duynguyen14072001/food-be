import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class CartDto {
  @AutoMap()
  @ApiProperty()
  id: number;

  @AutoMap()
  @ApiProperty()
  product_id: number;

  @AutoMap()
  @ApiProperty()
  user_id: number;

  @AutoMap()
  @ApiProperty()
  quantity: number;
}
