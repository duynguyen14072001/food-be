import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Validate } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  mail_address: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
