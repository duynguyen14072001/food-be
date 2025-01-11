import { ApiProperty, PartialType } from '@nestjs/swagger';
import { BannerDto } from './banner.dto';
import { AutoMap } from '@automapper/classes';

class CreateBannerDto extends PartialType(BannerDto) {}

export class CreateBannerListDto {
  @AutoMap()
  @ApiProperty()
  banners: CreateBannerDto[];
}
