import { SetMetadata } from '@nestjs/common';
import { AdminRole } from './admins.constants';

export const ROLES_KEY = 'role';
export const Role = (...role: AdminRole[]) => SetMetadata(ROLES_KEY, role);
