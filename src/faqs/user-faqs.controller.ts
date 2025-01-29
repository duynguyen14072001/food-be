import { Controller, Get, HttpStatus, HttpCode, Query } from '@nestjs/common';
import { FaqsService } from './faqs.service';
import { Public } from 'src/admins/auth/public.decorator';

@Controller('faqs')
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  @Get()
  @Public()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query) {
    return await this.faqsService.findAll(query);
  }
}
