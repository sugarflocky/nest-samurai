import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';

@Schema({ _id: false })
class EmailConfirmation {
  @Prop({ type: String, default: () => uuidv4() })
  code: string;

  @Prop({ type: Date, default: () => add(new Date(), { hours: 24 }) })
  expirationDate: Date;

  @Prop({ type: Boolean, default: false })
  isConfirmed: boolean;
}

@Schema({ _id: false })
class PasswordRecovery {
  @Prop({ type: String, default: () => uuidv4() })
  code: string;

  @Prop({ type: Date, default: () => add(new Date(), { minutes: 30 }) })
  expirationDate: Date;
}

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

  @Prop({ type: EmailConfirmation, default: new EmailConfirmation() })
  emailConfirmation: EmailConfirmation;

  @Prop({ type: PasswordRecovery })
  passwordRecovery: PasswordRecovery;

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

  confirmEmail() {
    if (this.emailConfirmation.isConfirmed) {
      throw new Error('email already confirmed');
    }
    this.emailConfirmation.isConfirmed = true;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

//регистрирует методы сущности в схеме
UserSchema.loadClass(User);

//Типизация документа
export type UserDocument = HydratedDocument<User>;

//Типизация модели + статические методы
export type UserModelType = Model<UserDocument> & typeof User;
