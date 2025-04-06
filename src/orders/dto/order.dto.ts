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
  payment_method: number;

  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  payment_status: number;

  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  expected_delivery_time: Date;

  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  created_at: Date;

  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  user_name: string;

  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  item_count: number;

  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  total_price: number;

  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  shipping_address: string;

  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  note: string;
}
