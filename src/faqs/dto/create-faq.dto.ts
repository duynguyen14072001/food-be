import { AutoMap } from '@automapper/classes';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { FaqDto } from './faq.dto';

class CreateFaqDto extends PartialType(FaqDto) {}

export class CreateFaqListDto {
  @AutoMap()
  @ApiProperty()
  faqs: CreateFaqDto[];
}
