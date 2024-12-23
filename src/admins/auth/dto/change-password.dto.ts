import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Match } from '../match.decorator';

export class ChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  old_password: string;

  @ApiProperty()
  @IsNotEmpty()
  new_password: string;

  @ApiProperty()
  @IsNotEmpty()
  @Match('new_password')
  conf_password: string;
}
