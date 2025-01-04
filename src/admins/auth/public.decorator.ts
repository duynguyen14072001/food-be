import { SetMetadata } from '@nestjs/common';
import { EXPIRED_IN_TOKEN } from '../../password-reset-tokens/entity/password-reset-token.entity';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const isExpiredToken = (
  data: Record<string, any>,
  minute = EXPIRED_IN_TOKEN,
) => {
  const date = new Date(data.created_at);
  const currentDate = new Date();
  const diffInMilliseconds = currentDate.getTime() - date.getTime();

  return Math.floor(diffInMilliseconds / 1000 / 60) > minute;
};
