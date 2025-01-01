import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { IsEmail } from 'class-validator';

export class UserDto {
  @AutoMap()
  @ApiProperty()
  id: number;

  @AutoMap()
  @ApiProperty()
  @IsEmail()
  mail_address: string;

  @AutoMap()
  @ApiProperty()
  @IsEmail()
  phone_number: string;

  @AutoMap()
  @ApiProperty()
  @IsEmail()
  name: string;
}
