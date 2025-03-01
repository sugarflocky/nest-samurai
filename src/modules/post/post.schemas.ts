import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum LikeStatus {
  'None' = 'None',
  'Like' = 'Like',
  'Dislike' = 'Dislike',
}

@Schema({ _id: false })
export class LikeDetails {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  addedAt: Date;
}

const LikeDetailsSchema = SchemaFactory.createForClass(LikeDetails);

@Schema({ _id: false })
export class ExtendedLikesInfo {
  @Prop({ default: 0 })
  likesCount: number;

  @Prop({ default: 0 })
  dislikesCount: number;

  @Prop({ default: 'None' })
  myStatus: LikeStatus;

  @Prop({ type: [LikeDetailsSchema], default: [] })
  newestLikes: LikeDetails[];
}

const ExtendedLikesInfoSchema = SchemaFactory.createForClass(ExtendedLikesInfo);

@Schema()
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  shortDescription: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  blogId: Types.ObjectId;

  @Prop({ required: true })
  blogName: string;

  @Prop({ default: () => new Date() })
  createdAt: Date;

  @Prop({ type: ExtendedLikesInfoSchema, default: {} })
  extendedLikesInfo: ExtendedLikesInfo;
}

export const PostSchema = SchemaFactory.createForClass(Post);

export type PostDocument = HydratedDocument<Post>;
