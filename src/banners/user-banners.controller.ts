import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { BannersService } from './banners.service';
import { Public } from '../users/auth/public.decorator';

@Controller('banners')
export class UserBannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Get()
  @Public()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query) {
    return await this.bannersService.findAll(query);
  }
}
