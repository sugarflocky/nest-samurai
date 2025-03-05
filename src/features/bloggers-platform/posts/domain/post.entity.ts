import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

export enum LikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

@Schema({ _id: false })
export class LikeDetails {
  @Prop({ type: Date })
  addedAt: Date;

  @Prop({ type: Types.ObjectId })
  userId: Types.ObjectId;

  @Prop({ type: String })
  login: string;
}

@Schema({ _id: false })
export class ExtendedLikesInfo {
  @Prop({ type: Number, default: 0 })
  likesCount: number;

  @Prop({ type: Number, default: 0 })
  dislikesCount: number;

  @Prop({ default: LikeStatus.None })
  myStatus: LikeStatus;

  @Prop({ type: Array, default: [] })
  newestLikes: LikeDetails[];
}
@Schema({ timestamps: true })
export class Post {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  shortDescription: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Types.ObjectId, required: true })
  blogId: Types.ObjectId;

  @Prop({ type: String, required: true })
  blogName: string;

  @Prop({ type: Date, nullable: true, default: null })
  deletedAt: Date | null;

  @Prop({ type: ExtendedLikesInfo, default: () => new LikeDetails() })
  extendedLikesInfo: ExtendedLikesInfo;

  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  static createInstance(dto: CreatePostDto): PostDocument {
    const post = new this();
    console.log(post);

    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = new Types.ObjectId(dto.blogId);
    post.blogName = dto.blogName;

    return post as PostDocument;
  }

  makeDeleted() {
    if (this.deletedAt !== null) {
      throw new Error('Entity already deleted');
    }
    this.deletedAt = new Date();
  }

  update(dto: UpdatePostDto) {
    this.title = dto.title;
    this.shortDescription = dto.shortDescription;
    this.content = dto.content;
    this.blogId = new Types.ObjectId(dto.blogId);
    this.blogName = dto.blogName;
  }
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.loadClass(Post);

export type PostDocument = HydratedDocument<Post>;

export type PostModelType = Model<PostDocument> & typeof Post;
