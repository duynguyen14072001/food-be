import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class ReviewDto {
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
  star_number: number;

  @AutoMap()
  @ApiProperty()
  comment: string;
}
