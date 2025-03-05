import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './post.schemas';
import { PostCreateDto, PostUpdateDto } from './post.types';

@Injectable()
export class PostRepository {
  constructor(@InjectModel(Post.name) private PostModel: Model<PostDocument>) {}
  async createPost(createDto: PostCreateDto): Promise<PostDocument | null> {
    try {
      createDto.blogId = new Types.ObjectId(createDto.blogId);
      const createdPost = await this.PostModel.create(createDto);
      return createdPost;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async updatePost(
    id: string,
    updateDto: PostUpdateDto,
  ): Promise<PostDocument | null> {
    try {
      if (id.length !== 24) return null;
      updateDto.blogId = new Types.ObjectId(updateDto.blogId);
      const updatedPost = await this.PostModel.findByIdAndUpdate(id, updateDto);
      return updatedPost;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async deletePost(id: string): Promise<PostDocument | null> {
    try {
      if (id.length !== 24) return null;
      const result = await this.PostModel.findByIdAndDelete(id);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
