import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from '../domain/user.entity';
import { Injectable } from '@nestjs/common';
import {
  BadRequestDomainException,
  NotFoundDomainException,
  UnauthorizedDomainException,
} from '../../../core/exceptions/domain-exceptions';

@Injectable()
export class UsersRepository {
  //инжектирование модели через DI
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {}

  async findById(id: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({
      _id: id,
      deletedAt: null,
    });
  }

  async save(user: UserDocument) {
    await user.save();
  }

  async findOrNotFoundFail(id: string): Promise<UserDocument> {
    const user = await this.findById(id);

    if (!user) {
      throw NotFoundDomainException.create();
    }

    return user;
  }

  async findByLoginOrEmail(loginOrEmail: string): Promise<UserDocument> {
    const user = await this.UserModel.findOne({
      $or: [
        { login: loginOrEmail, deletedAt: null },
        { email: loginOrEmail, deletedAt: null },
      ],
    });
    if (!user) {
      throw UnauthorizedDomainException.create();
    }
    return user;
  }

  async findOrBadRequestByEmailCode(code: string): Promise<UserDocument> {
    const user = await this.UserModel.findOne({
      'emailConfirmation.code': code,
      deletedAt: null,
    });
    if (!user) {
      throw BadRequestDomainException.create('user not found', 'user');
    }
    return user;
  }

  async findOrBadRequestByRecoveryCode(code: string): Promise<UserDocument> {
    const user = await this.UserModel.findOne({
      'passwordRecovery.code': code,
      deletedAt: null,
    });
    if (!user)
      throw BadRequestDomainException.create(
        'recovery code is incorrect, expired or already been applied',
        'code',
      );
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    const user = await this.UserModel.findOne({
      email: email,
      deletedAt: null,
    });
    return user;
  }

  async findByLogin(login: string): Promise<UserDocument | null> {
    const user = await this.UserModel.findOne({
      login: login,
      deletedAt: null,
    });
    return user;
  }
}
