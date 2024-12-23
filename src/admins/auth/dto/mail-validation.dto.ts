import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { AdminsService } from '../../admins/admins.service';

@ValidatorConstraint({ name: 'ValidateMail', async: true })
@Injectable()
export class ValidateMail implements ValidatorConstraintInterface {
  constructor(private readonly adminService: AdminsService) {}

  async validate(value: any, args: ValidationArguments) {
    try {
      const admin = await this.adminService.findOneByEmail(value);

      return !!admin;
    } catch (e) {
      return false;
    }
  }

  defaultMessage() {
    return `メールアドレスが正しくありません。`;
  }
}
