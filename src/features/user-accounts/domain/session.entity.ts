import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { CreateSessionDto } from '../dto/create-session.dto';
import { UpdateSessionDto } from '../dto/update-session.dto';

@Schema({ timestamps: true })
export class Session {
  @Prop({ type: String, required: true })
  ip: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  issuedAt: string;

  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  deviceId: Types.ObjectId;

  @Prop({ type: Date, nullable: true, default: null })
  deletedAt: Date | null;

  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  static createInstance(dto: CreateSessionDto): SessionDocument {
    const session = new this();

    session.deviceId = new Types.ObjectId(dto.deviceId);
    session.userId = new Types.ObjectId(dto.userId);
    session.ip = dto.ip;
    session.title = dto.title;
    session.issuedAt = dto.issuedAt;

    return session as SessionDocument;
  }

  updateSession(dto: UpdateSessionDto) {
    this.ip = dto.ip;
    this.title = dto.title;
    this.issuedAt = dto.issuedAt;
  }

  makeDeleted() {
    if (this.deletedAt !== null) {
      throw new Error('Entity already deleted');
    }
    this.deletedAt = new Date();
  }
}

export const SessionSchema = SchemaFactory.createForClass(Session);

//регистрирует методы сущности в схеме
SessionSchema.loadClass(Session);

//Типизация документа
export type SessionDocument = HydratedDocument<Session>;

//Типизация модели + статические методы
export type SessionModelType = Model<SessionDocument> & typeof Session;
