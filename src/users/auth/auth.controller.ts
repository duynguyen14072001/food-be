import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Request,
  Patch,
  Get,
  UseGuards,
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
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignupDto } from './dto/signup.dto';
import { UpdateInfoDto } from './dto/update-info.dto';
import { AuthGuard } from './auth.guard';

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

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard)
  getMe(@Request() req) {
    return this.authService.getMe(req);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  @ApiOkResponse({
    type: LoginRes,
  })
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  signUp(@Body() signupDto: SignupDto): Promise<any> {
    return this.authService.signUp(signupDto);
  }

  @Patch('update-info')
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard)
  async updateInfo(@Request() req, @Body() updateInfoDto: UpdateInfoDto) {
    return await this.authService.updateInfo(req, updateInfoDto);
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
