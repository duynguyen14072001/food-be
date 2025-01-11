import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

export class BannerDto {
  @AutoMap()
  @ApiProperty()
  id: number;

  @AutoMap()
  @ApiProperty()
  image_url: string;

  @AutoMap()
  @ApiProperty()
  number: number;
}
