import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { RecommendsService } from './recommends.service';
import { CreateRecommendListDto } from './dto/create-recommend.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('recommends')
export class AdminRecommendsController {
  constructor(private readonly recommendsService: RecommendsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiBearerAuth('JWT-auth')
  async create(@Body() createRecommendListDto: CreateRecommendListDto) {
    return await this.recommendsService.upsert(createRecommendListDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiBearerAuth('JWT-auth')
  async findAll(@Query() query) {
    return await this.recommendsService.findAll(query);
  }
}
