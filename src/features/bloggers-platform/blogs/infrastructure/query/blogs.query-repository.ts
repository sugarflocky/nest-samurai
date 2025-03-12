import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../../domain/blog.entity';
import { BlogViewDto } from '../../api/dto/view-dto/blog-view.dto';
import { GetBlogsQueryParams } from '../../api/dto/input-dto/get-blogs-query-params.input-dto';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { NotFoundDomainException } from '../../../../../core/exceptions/domain-exceptions';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
  ) {}

  async getByIdOrNotFoundFail(id: string): Promise<BlogViewDto> {
    const blog = await this.BlogModel.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!blog) {
      throw NotFoundDomainException.create();
    }

    return BlogViewDto.mapToView(blog);
  }

  async getAll(
    query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    const { sortBy, sortDirection, pageSize, pageNumber, searchNameTerm } =
      query;

    let filter: any = {
      deletedAt: null,
    };

    if (searchNameTerm) {
      filter = {
        name: { $regex: searchNameTerm, $options: 'i' },
        deletedAt: null,
      };
    }

    const items = await this.BlogModel.find(filter)
      .sort([[sortBy, sortDirection]])
      .skip(query.calculateSkip())
      .limit(pageSize)
      .exec();
    const totalCount = await this.BlogModel.countDocuments(filter).exec();

    const data = {
      items: items.map((blog) => BlogViewDto.mapToView(blog)),
      page: pageNumber,
      size: pageSize,
      totalCount: totalCount,
    };

    return PaginatedViewDto.mapToView(data);
  }
}
