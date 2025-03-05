import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Match } from '../match.decorator';

export class UpdateInfoDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  image_url: string;

  @ApiProperty()
  @ApiPropertyOptional()
  old_password: string;

  @ApiProperty()
  @ApiPropertyOptional()
  new_password: string;
}
