import { OmitType } from '@nestjs/swagger';
import { CartDto } from './cart.dto';

export class CreateCartDto extends OmitType(CartDto, ['id'] as const) {}
