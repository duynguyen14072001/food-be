import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVNPayDto {
  @AutoMap()
  @ApiProperty()
  amount: number;
}
