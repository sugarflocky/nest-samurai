import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from '../domain/user.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

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
      //TODO: replace with domain exception
      throw new NotFoundException('user not found');
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
      throw new UnauthorizedException('incorrect login or password');
    }
    return user;
  }

  async findOrBadRequestByEmailCode(code: string): Promise<UserDocument> {
    const user = await this.UserModel.findOne({
      'emailConfirmation.code': code,
      deletedAt: null,
    });
    if (!user)
      throw new BadRequestException([
        {
          message:
            'confirmation code is incorrect, expired or already been applied',
          field: 'code',
        },
      ]);
    return user;
  }

  async findOrBadRequestByRecoveryCode(code: string): Promise<UserDocument> {
    const user = await this.UserModel.findOne({
      'passwordRecovery.code': code,
      deletedAt: null,
    });
    if (!user)
      throw new BadRequestException([
        {
          message:
            'recovery code is incorrect, expired or already been applied',
          field: 'code',
        },
      ]);
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
