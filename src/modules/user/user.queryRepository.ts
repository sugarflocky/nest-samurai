import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schemas';
import { Model } from 'mongoose';
import { userMapper, UserSortData, UserViewModel } from './user.types';
import { Pagination } from '../../common/common.types';

@Injectable()
export class UserQueryRepository {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

  async getUsers(
    sortData: UserSortData,
  ): Promise<Pagination<UserViewModel> | null> {
    try {
      const {
        sortDirection,
        sortBy,
        pageSize,
        pageNumber,
        searchLoginTerm,
        searchEmailTerm,
      } = sortData;

      let filter = {};

      if (searchLoginTerm && searchEmailTerm) {
        filter = {
          $or: [
            { login: { $regex: searchLoginTerm, $options: 'i' } },
            { email: { $regex: searchEmailTerm, $options: 'i' } },
          ],
        };
      } else if (searchLoginTerm) {
        filter = {
          login: { $regex: searchLoginTerm, $options: 'i' },
        };
      } else if (searchEmailTerm) {
        filter = {
          email: { $regex: searchEmailTerm, $options: 'i' },
        };
      }

      const users = await this.UserModel.find(filter)
        .sort([[sortBy, sortDirection]])
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .lean();

      const totalCount = await this.UserModel.countDocuments(filter);
      const pagesCount = Math.ceil(totalCount / pageSize);

      return {
        pageSize,
        page: pageNumber,
        pagesCount,
        totalCount,
        items: users.map(userMapper),
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
