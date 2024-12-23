import { ApiProperty } from '@nestjs/swagger';
import { AdminDto } from '../../admins/dto/admin.dto';

export class LoginRes {
  @ApiProperty()
  me: AdminDto;
  access_token: string;
  token_type: string;
  expires_in: string;
}
