import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/users/users/dto/user.dto';

export class LoginRes {
  @ApiProperty()
  me: UserDto;
  access_token: string;
  token_type: string;
  expires_in: string;
}
