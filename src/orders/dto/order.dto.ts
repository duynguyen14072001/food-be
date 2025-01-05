import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import dayjs from 'dayjs';

export class OrderDto {
  @AutoMap()
  @ApiProperty()
  id: number;

  @AutoMap()
  @IsNotEmpty()
  @ApiProperty()
  user_id: number;

  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  status: number;

  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => dayjs(new Date(value)).format('YYYY-MM-DD'))
  order_date: Date;

  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  user_name: string;

  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  shipping_address: string;
}
