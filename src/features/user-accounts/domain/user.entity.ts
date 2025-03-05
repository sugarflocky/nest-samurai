import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  login: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: Date, nullable: true, default: null })
  deletedAt: Date | null;

  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  static createInstance(dto: CreateUserDto): UserDocument {
    const user = new this();
    user.login = dto.login;
    user.password = dto.password;
    user.email = dto.email;

    return user as UserDocument;
  }

  makeDeleted() {
    if (this.deletedAt !== null) {
      throw new Error('Entity already deleted');
    }
    this.deletedAt = new Date();
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

//регистрирует методы сущности в схеме
UserSchema.loadClass(User);

//Типизация документа
export type UserDocument = HydratedDocument<User>;

//Типизация модели + статические методы
export type UserModelType = Model<UserDocument> & typeof User;
