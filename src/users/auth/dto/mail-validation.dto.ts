import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersService } from '../../../users/users/users.service';

@ValidatorConstraint({ name: 'ValidateMail', async: true })
@Injectable()
export class ValidateMail implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UsersService) {}

  async validate(value: any, args: ValidationArguments) {
    try {
      const admin = await this.usersService.findOneByID(value);

      return !!admin;
    } catch (e) {
      return false;
    }
  }

  defaultMessage() {
    return `メールアドレスが正しくありません。`;
  }
}
