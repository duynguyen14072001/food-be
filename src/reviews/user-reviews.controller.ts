import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from 'src/admins/auth/public.decorator';

@Controller('reviews')
export class UserReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiBearerAuth('JWT-auth')
  create(@Request() req, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto, req);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Public()
  async findAll(@Query() query) {
    return await this.reviewsService.findAll(query);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiBearerAuth('JWT-auth')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(+id, updateReviewDto, req);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiBearerAuth('JWT-auth')
  remove(@Request() req, @Param('id') id: string) {
    return this.reviewsService.remove(+id, req);
  }
}
