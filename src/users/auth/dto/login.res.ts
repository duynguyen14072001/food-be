import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../../users/users/dto/user.dto';

export class LoginRes {
  @ApiProperty()
  me: UserDto;
  access_token: string;
  token_type: string;
  expires_in: string;
}
