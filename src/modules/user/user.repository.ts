import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schemas';
import { UserCreateDto } from './user.types';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

  async createUser(createDto: UserCreateDto): Promise<UserDocument | null> {
    try {
      const user = await this.UserModel.create(createDto);
      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async deleteUser(id: string): Promise<UserDocument | null> {
    try {
      const user = await this.UserModel.findByIdAndDelete(id);
      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
