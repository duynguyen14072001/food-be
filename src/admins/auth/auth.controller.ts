import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Request,
  Patch,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginRes } from './dto/login.res';
import { LoginDto } from './dto/login.dto';
import { Public } from './public.decorator';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOkResponse({
    type: LoginRes,
  })
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  signIn(@Body() loginDto: LoginDto): Promise<LoginRes> {
    return this.authService.signIn(loginDto.mail_address, loginDto.password);
  }

  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiBearerAuth('JWT-auth')
  changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(req.user, changePasswordDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Patch('forgot-password')
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
