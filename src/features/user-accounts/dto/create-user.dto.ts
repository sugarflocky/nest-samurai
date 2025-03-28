export type CreateUserDto = {
  id: string;
  login: string;
  password: string;
  email: string;
  createdAt: Date;
  deletedAt: Date | null;
  code: string | null;
  expirationDate: Date | null;
  isConfirmed: boolean;
};
