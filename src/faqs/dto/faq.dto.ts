import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

export class FaqDto {
  @AutoMap()
  @ApiProperty()
  id: number;

  @AutoMap()
  @ApiProperty()
  question: string;

  @AutoMap()
  @ApiProperty()
  answer: string;

  @AutoMap()
  @ApiProperty()
  number: number;
}
