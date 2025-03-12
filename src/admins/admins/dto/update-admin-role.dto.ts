import { ApiProperty, PartialType } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

export class UpdateAdminRoleDto {
  @AutoMap()
  @ApiProperty()
  role: number;
}
