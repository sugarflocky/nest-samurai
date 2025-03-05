import { SortOrder } from 'mongoose';
import { UserDocument } from './user.schemas';

export type UserCreateDto = {
  login: string;
  password: string;
  email: string;
};

export type UserViewModel = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

export type UserSortData = {
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
  sortBy: string;
  sortDirection: SortOrder;
  pageNumber: number;
  pageSize: number;
};

export const userMapper = (user: UserDocument): UserViewModel => {
  return {
    id: user._id.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  };
};
