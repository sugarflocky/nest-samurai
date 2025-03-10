import { BaseSortablePaginationParams } from '../../../../../../core/dto/base.query-params.input-dto';
import { IsEnum } from 'class-validator';
import { Trim } from '../../../../../../core/decorators/transform/trim';

export enum PostsSortBy {
  CreatedAt = 'createdAt',
  Title = 'title',
}

export class GetPostsQueryParams extends BaseSortablePaginationParams<PostsSortBy> {
  @Trim()
  @IsEnum(PostsSortBy)
  sortBy = PostsSortBy.CreatedAt;
}
