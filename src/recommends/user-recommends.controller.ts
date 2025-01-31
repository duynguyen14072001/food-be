import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { RecommendsService } from './recommends.service';
import { Public } from 'src/users/auth/public.decorator';

@Controller('recommends')
export class UserRecommendsController {
  constructor(private readonly recommendsService: RecommendsService) {}

  @Get()
  @Public()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query) {
    return await this.recommendsService.findAll(query);
  }
}
