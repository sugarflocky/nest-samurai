import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDocument,
  CommentModelType,
} from '../domain/comment.entity';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
  ) {}

  async findById(id: string): Promise<CommentDocument | null> {
    return this.CommentModel.findOne({
      _id: id,
      deletedAt: null,
    });
  }

  async save(comment: CommentDocument): Promise<void> {
    await comment.save();
  }

  async findOrNotFoundFail(id: string): Promise<CommentDocument> {
    const comment = await this.findById(id);
    if (!comment) {
      throw NotFoundDomainException.create('comment not found');
    }

    return comment;
  }
}
