import { PostDocument } from '../domain/post.entity';
import { Injectable } from '@nestjs/common';
import { LikesService } from '../../likes/application/likes.service';
import { PostViewDto } from '../api/dto/view-dto/post-view.dto';
import { UsersRepository } from '../../../user-accounts/infrastructure/users.repository';

@Injectable()
export class PostsViewService {
  constructor(
    private readonly likesService: LikesService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async mapToView(post: PostDocument, userId: string): Promise<PostViewDto> {
    const dto = new PostViewDto();

    let lastLikes: any = [];
    const likes = await this.likesService.getThreeLastLikes(
      post._id.toString(),
    );

    if (likes && likes.length > 0) {
      lastLikes = await Promise.all(
        likes.map(async (like) => {
          const user = await this.usersRepository.findById(
            like.userId.toString(),
          );
          return {
            addedAt: like.updatedAt,
            userId: like.userId.toString(),
            login: user!.login,
          };
        }),
      );
    }

    dto.id = post._id.toString();
    dto.title = post.title;
    dto.shortDescription = post.shortDescription;
    dto.content = post.content;
    dto.blogId = post.blogId.toString();
    dto.blogName = post.blogName;
    dto.createdAt = post.createdAt;
    dto.extendedLikesInfo = {
      likesCount: post.extendedLikesInfo.likesCount,
      dislikesCount: post.extendedLikesInfo.dislikesCount,
      myStatus: await this.likesService.getStatus(userId, post._id.toString()),
      newestLikes: lastLikes,
    };

    return dto;
  }

  async mapToViewList(
    posts: PostDocument[],
    userId: string,
  ): Promise<PostViewDto[]> {
    return Promise.all(posts.map((post) => this.mapToView(post, userId)));
  }
}
