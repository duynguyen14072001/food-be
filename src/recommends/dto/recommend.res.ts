import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { RecommendDto } from './recommend.dto';

export class ResponseList {
  @AutoMap()
  @ApiProperty()
  data: RecommendDto[];

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
