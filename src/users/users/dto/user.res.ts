import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { UserDto } from './user.dto';

export class ResponseList {
  @AutoMap()
  @ApiProperty()
  data: UserDto[];

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
