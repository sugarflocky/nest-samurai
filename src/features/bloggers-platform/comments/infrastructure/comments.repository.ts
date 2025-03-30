import { Injectable } from '@nestjs/common';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateCommentDto } from '../dto/create-comment.dto';
@Injectable()
export class CommentsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async selectById(id: string) {
    const commentQuery = await this.dataSource.query(
      `SELECT * FROM "Comments" 
       WHERE "id"=$1 AND "deletedAt" IS NULL
`,
      [id],
    );

    return commentQuery[0];
  }

  async selectOrNotFoundFail(id: string) {
    const comment = await this.selectById(id);
    if (!comment) {
      throw NotFoundDomainException.create();
    }

    return comment;
  }

  async create(dto: CreateCommentDto) {
    const commentQuery = await this.dataSource.query(
      `INSERT INTO "Comments"(
      "id", "content", "postId", "userId", "createdAt", "deletedAt")
    VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        dto.id,
        dto.content,
        dto.postId,
        dto.userId,
        dto.createdAt,
        dto.deletedAt,
      ],
    );
  }

  async update(id: string, content: string) {
    await this.selectOrNotFoundFail(id);

    const commentQuery = await this.dataSource.query(
      `
      UPDATE "Comments"
      SET "content"=$2
      WHERE "id"=$1`,
      [id, content],
    );
  }

  async delete(id: string) {
    await this.selectOrNotFoundFail(id);

    const commentQuery = await this.dataSource.query(
      `
      UPDATE "Comments"
      SET "deletedAt"=$2
      WHERE "id"=$1`,
      [id, new Date()],
    );
  }
}
