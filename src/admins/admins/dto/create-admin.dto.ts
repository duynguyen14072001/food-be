import { OmitType } from '@nestjs/swagger';
import { AdminDto } from './admin.dto';

export class CreateAdminDto extends OmitType(AdminDto, ['id'] as const) {}
