import { AutoMap } from '@automapper/classes';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { RecommendDto } from './recommend.dto';

class CreateRecommendDto extends PartialType(RecommendDto) {}

export class CreateRecommendListDto {
  @AutoMap()
  @ApiProperty()
  recommends: CreateRecommendDto[];
}
