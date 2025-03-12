import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentModelType } from '../domain/comment.entity';
import { CommentsRepository } from '../infrastructure/comments.repository';
import { PostsRepository } from '../../posts/infrastructure/posts.repository';
import { UsersRepository } from '../../../user-accounts/infrastructure/users.repository';
import { CreateCommentInServiceDto } from '../dto/create-comment.dto';
import { UpdateCommentInServiceDto } from '../dto/update-comment.dto';
import { CreateLikeDto } from '../../likes/dto/create-like.dto';
import { LikesService } from '../../likes/application/likes.service';
import { ForbiddenDomainException } from '../../../../core/exceptions/domain-exceptions';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
    private readonly commentsRepository: CommentsRepository,
    private readonly postsRepository: PostsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly likesService: LikesService,
  ) {}

  async createComment(dto: CreateCommentInServiceDto): Promise<string> {
    await this.postsRepository.findOrNotFoundFail(dto.postId);
    const user = await this.usersRepository.findOrNotFoundFail(dto.userId);

    const comment = this.CommentModel.createInstance({
      content: dto.content,
      postId: dto.postId,
      userId: dto.userId,
      userLogin: user.login,
    });

    await this.commentsRepository.save(comment);
    return comment._id.toString();
  }

  async updateComment(
    id: string,
    dto: UpdateCommentInServiceDto,
  ): Promise<string> {
    const comment = await this.commentsRepository.findOrNotFoundFail(id);
    await this.usersRepository.findOrNotFoundFail(dto.userId);

    if (dto.userId !== comment.commentatorInfo.userId.toString()) {
      throw ForbiddenDomainException.create();
    }

    comment.update(dto.content);
    await this.commentsRepository.save(comment);
    return comment._id.toString();
  }

  async deleteComment(id: string, userId: string) {
    const comment = await this.commentsRepository.findOrNotFoundFail(id);

    if (userId !== comment.commentatorInfo.userId.toString()) {
      throw ForbiddenDomainException.create();
    }

    comment.makeDeleted();

    await this.commentsRepository.save(comment);
  }

  async likeComment(dto: CreateLikeDto) {
    const comment = await this.commentsRepository.findOrNotFoundFail(
      dto.parentId,
    );

    await this.likesService.like(dto);
    const { likes, dislikes } = await this.likesService.countLikesAndDislikes(
      dto.parentId,
    );

    comment.changeLikesCount(likes, dislikes);
    await this.commentsRepository.save(comment);
  }
}
