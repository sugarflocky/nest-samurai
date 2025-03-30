import { Injectable } from '@nestjs/common';
import { PostViewDto } from '../api/dto/view-dto/post-view.dto';
import { LikesRepository } from '../../likes/infrastructure/likes.repository';

@Injectable()
export class PostsViewService {
  constructor(private likesRepository: LikesRepository) {}

  async mapToView(post, userId: string): Promise<PostViewDto> {
    const dto = new PostViewDto();
    const status = await this.likesRepository.getMyStatus(post.id, userId);
    const likesInfo = await this.likesRepository.countLikes(post.id);
    const lastLikes = await this.likesRepository.getLastLikes(post.id);

    dto.id = post.id;
    dto.title = post.title;
    dto.shortDescription = post.shortDescription;
    dto.content = post.content;
    dto.blogId = post.blogId;
    dto.blogName = post.blogName;
    dto.createdAt = post.createdAt;
    dto.extendedLikesInfo = {
      likesCount: +likesInfo.likesCount,
      dislikesCount: +likesInfo.dislikesCount,
      myStatus: status,
      newestLikes: lastLikes,
    };

    return dto;
  }

  async mapToViewList(posts, userId: string): Promise<PostViewDto[]> {
    return Promise.all(posts.map((post) => this.mapToView(post, userId)));
  }
}
