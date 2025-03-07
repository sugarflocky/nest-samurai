import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { LikeStatus } from '../../posts/domain/post.entity';
import { CreateLikeDto } from '../dto/create-like.dto';

@Schema({ timestamps: true })
export class Like {
  @Prop({ type: String, enum: LikeStatus, required: true })
  status: LikeStatus;

  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  parentId: Types.ObjectId;

  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  static createInstance(dto: CreateLikeDto) {
    const like = new this();
    like.status = dto.status;
    like.userId = new Types.ObjectId(dto.userId);
    like.parentId = new Types.ObjectId(dto.parentId);

    return like as LikeDocument;
  }

  changeStatus(status: LikeStatus) {
    if (this.status !== status) this.status = status;
  }
}

export const LikeSchema = SchemaFactory.createForClass(Like);

LikeSchema.loadClass(Like);

export type LikeDocument = HydratedDocument<Like>;

export type LikeModelType = Model<LikeDocument> & typeof Like;
