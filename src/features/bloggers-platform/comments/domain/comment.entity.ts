import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { CreateCommentDto } from '../dto/create-comment.dto';

@Schema({ _id: false })
export class LikesInfo {
  @Prop({ type: Number, default: 0 })
  likesCount: number;

  @Prop({ type: Number, default: 0 })
  dislikesCount: number;
}

@Schema({ _id: false })
export class CommentatorInfo {
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  userLogin: string;
}

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: CommentatorInfo, required: true })
  commentatorInfo: CommentatorInfo;

  @Prop({ type: LikesInfo, default: () => new LikesInfo() })
  likesInfo: LikesInfo;

  @Prop({ type: Types.ObjectId, required: true })
  postId: Types.ObjectId;

  @Prop({ type: Date, nullable: true, default: null })
  deletedAt: Date | null;

  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  static createInstance(dto: CreateCommentDto): CommentDocument {
    const comment = new this();

    comment.content = dto.content;
    comment.postId = new Types.ObjectId(dto.postId);
    comment.commentatorInfo = {
      userLogin: dto.userLogin,
      userId: new Types.ObjectId(dto.userId),
    };

    return comment as CommentDocument;
  }

  makeDeleted() {
    if (this.deletedAt !== null) {
      throw new Error('Entity already deleted');
    }
    this.deletedAt = new Date();
  }

  update(content: string) {
    this.content = content;
  }

  changeLikesCount(likes: number, dislikes: number) {
    this.likesInfo.likesCount = likes;
    this.likesInfo.dislikesCount = dislikes;
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.loadClass(Comment);

export type CommentDocument = HydratedDocument<Comment>;

export type CommentModelType = Model<CommentDocument> & typeof Comment;
