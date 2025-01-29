import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { FaqDto } from './faq.dto';

export class ResponseList {
  @AutoMap()
  @ApiProperty()
  data: FaqDto[];

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
