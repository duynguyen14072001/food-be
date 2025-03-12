import {
  Controller,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminRoleDto } from './dto/update-admin-role.dto';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('admins')
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiBearerAuth('JWT-auth')
  async findAll(@Query() query) {
    return await this.adminsService.findAll(query);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse()
  @UseGuards(AuthGuard)
  @ApiBadRequestResponse()
  @ApiBearerAuth('JWT-auth')
  create(@Request() req, @Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.create(createAdminDto, req);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiBearerAuth('JWT-auth')
  async findOne(@Param('id') id: string) {
    return await this.adminsService.findOneByID(+id);
  }

  @Patch('/update-role/:id')
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  updateRole(
    @Request() req,
    @Param('id') id: string,
    @Body() updateAdminRoleDto: UpdateAdminRoleDto,
  ) {
    return this.adminsService.updateRole(+id, updateAdminRoleDto, req);
  }

  @Delete(':id')
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  delete(@Request() req, @Param('id') id: string) {
    return this.adminsService.remove(+id, req);
  }
}
