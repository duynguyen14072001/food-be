export const CHARACTERS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const randomStr = (length: number) => {
  let result = '';
  const charactersLength = CHARACTERS.length;
  let counter = 0;
  while (counter < length) {
    result += CHARACTERS.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export enum AdminRole {
  ADMIN = 1,
  EDITOR = 2,
}
