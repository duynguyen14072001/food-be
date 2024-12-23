import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { CategoryDto } from './category.dto';

export class ResponseList {
  @AutoMap()
  @ApiProperty()
  data: CategoryDto[];

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
