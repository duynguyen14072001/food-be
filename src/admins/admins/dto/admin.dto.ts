import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { IsEmail } from 'class-validator';

export class AdminDto {
  @AutoMap()
  @ApiProperty()
  id: number;

  @AutoMap()
  @ApiProperty()
  role: number;

  @AutoMap()
  @ApiProperty()
  @IsEmail()
  mail_address: string;
}
