import { LikeStatus, PostDocument } from '../domain/post.entity';
import { Injectable } from '@nestjs/common';
import { LikesService } from '../../likes/application/likes.service';
import { PostViewDto } from '../api/dto/view-dto/post-view.dto';
import { UsersRepository } from '../../../user-accounts/infrastructure/users.repository';
import { BlogsRepository } from '../../blogs/infrastructure/blogs-repository';

@Injectable()
export class PostsViewService {
  constructor(
    private readonly likesService: LikesService,
    private readonly usersRepository: UsersRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  async mapToView(post, userId: string): Promise<PostViewDto> {
    const dto = new PostViewDto();

    const blog = await this.blogsRepository.selectById(post.blogId);

    dto.id = post.id;
    dto.title = post.title;
    dto.shortDescription = post.shortDescription;
    dto.content = post.content;
    dto.blogId = post.blogId;
    dto.blogName = post.blogName;
    dto.createdAt = post.createdAt;
    dto.extendedLikesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: LikeStatus.None,
      newestLikes: [],
    };

    return dto;
  }

  async mapToViewList(posts, userId: string): Promise<PostViewDto[]> {
    return Promise.all(posts.map((post) => this.mapToView(post, userId)));
  }
}
