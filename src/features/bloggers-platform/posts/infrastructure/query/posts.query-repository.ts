import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../../domain/post.entity';
import { PostViewDto } from '../../api/dto/view-dto/post-view.dto';
import { GetPostsQueryParams } from '../../api/dto/input-dto/get-posts-query-params.input-dto';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { Types } from 'mongoose';
import { PostsViewService } from '../../application/posts-view.service';
import { NotFoundDomainException } from '../../../../../core/exceptions/domain-exceptions';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name) private PostModel: PostModelType,
    private postsViewService: PostsViewService,
  ) {}

  async getByIdOrNotFoundFail(
    id: string,
    userId: string = new Types.ObjectId().toString(),
  ): Promise<PostViewDto> {
    const post = await this.PostModel.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!post) {
      throw NotFoundDomainException.create('post not found');
    }

    return this.postsViewService.mapToView(post, userId);
  }

  async getAll(
    query: GetPostsQueryParams,
    blogId: string | null = null,
    userId: string = new Types.ObjectId().toString(),
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
      items: await this.postsViewService.mapToViewList(items, userId),
      page: pageNumber,
      size: pageSize,
      totalCount: totalCount,
    };

    return PaginatedViewDto.mapToView(data);
  }
}
