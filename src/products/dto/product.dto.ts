import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class ProductDto {
  @AutoMap()
  @ApiProperty()
  id: number;

  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(255)
  slug: string;

  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(255)
  image_url: string;

  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  price: number;

  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  show_flag: number;

  @ApiProperty()
  @AutoMap()
  category_id: number[];

  @ApiProperty()
  @AutoMap()
  category_names: string[];

  @ApiProperty()
  @AutoMap()
  image_urls: string[];
}
