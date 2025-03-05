import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument, PostModelType } from '../domain/post.entity';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name) private PostModel: Model<PostModelType>,
  ) {}

  async findById(id: string): Promise<PostDocument | null> {
    return this.PostModel.findOne({
      _id: id,
      deletedAt: null,
    });
  }

  async save(post: PostDocument): Promise<void> {
    await post.save();
  }

  async findOrNotFoundFail(id: string): Promise<PostDocument> {
    const post = await this.findById(id);
    if (!post) {
      throw new NotFoundException('post not found');
    }

    return post;
  }
}
