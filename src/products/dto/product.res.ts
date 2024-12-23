import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { ProductDto } from './product.dto';

export class ResponseList {
  @AutoMap()
  @ApiProperty()
  data: ProductDto[];

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
