import { BaseSortablePaginationParams } from '../../../../../../core/dto/base.query-params.input-dto';
import { IsEnum } from 'class-validator';
import { Trim } from '../../../../../../core/decorators/transform/trim';

export enum CommentsSortBy {
  createdAt = 'createdAt',
}

export class GetCommentsQueryParams extends BaseSortablePaginationParams<CommentsSortBy> {
  @Trim()
  @IsEnum(CommentsSortBy)
  sortBy = CommentsSortBy.createdAt;
}
