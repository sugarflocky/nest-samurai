import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../../domain/post.entity';
import { PostViewDto } from '../../api/dto/view-dto/post-view.dto';
import { GetPostsQueryParams } from '../../api/dto/input-dto/get-posts-query-params.input-dto';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { Types } from 'mongoose';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectModel(Post.name) private PostModel: PostModelType) {}

  async getByIdOrNotFoundFail(id: string): Promise<PostViewDto> {
    const post = await this.PostModel.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!post) {
      throw new NotFoundException('post not found');
    }

    return PostViewDto.mapToView(post);
  }

  async getAll(
    query: GetPostsQueryParams,
    blogId: string | null = null,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    const { sortBy, sortDirection, pageSize, pageNumber } = query;
    let filter: any = {
      deletedAt: null,
    };

    if (blogId) {
      filter = {
        deletedAt: null,
        blogId: new Types.ObjectId(blogId),
      };
    }

    const items = await this.PostModel.find(filter)
      .sort([[sortBy, sortDirection]])
      .skip(query.calculateSkip())
      .limit(pageSize)
      .exec();

    const totalCount = await this.PostModel.countDocuments(filter).exec();

    const data = {
      items: items.map((post) => PostViewDto.mapToView(post)),
      page: pageNumber,
      size: pageSize,
      totalCount: totalCount,
    };

    return PaginatedViewDto.mapToView(data);
  }
}
