import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

export class RecommendDto {
  @AutoMap()
  @ApiProperty()
  id: number;

  @AutoMap()
  @ApiProperty()
  product_id: number;

  @AutoMap()
  @ApiProperty()
  number: number;
}
