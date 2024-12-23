import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Validate } from 'class-validator';
import { ValidateMail } from './mail-validation.dto';

export class ForgotPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @Validate(ValidateMail)
  mail_address: string;
}
