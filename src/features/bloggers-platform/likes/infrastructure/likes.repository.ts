import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateLikeDto } from '../dto/create-like.dto';
import { LikeStatus } from '../dto/like-status.enum';

@Injectable()
export class LikesRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  async selectById(id: string, userId: string) {
    const likeQuery = await this.dataSource.query(
      `
    SELECT * FROM "Likes"
    WHERE "parentId"=$1 AND "userId"=$2
    `,
      [id, userId],
    );

    return likeQuery[0];
  }

  async selectOrNotFoundFail(id: string, userId: string) {
    const like = await this.selectById(id, userId);
    if (!like) {
      throw NotFoundDomainException.create();
    }

    return like;
  }

  async create(dto: CreateLikeDto) {
    const likeQuery = await this.dataSource.query(
      `
    INSERT INTO "Likes"(
    "id", "status", "parentId", "userId", "createdAt", "updatedAt")
    VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        dto.id,
        dto.status,
        dto.parentId,
        dto.userId,
        dto.createdAt,
        dto.updatedAt,
      ],
    );
  }

  async update(id: string, status: string) {
    const likeQuery = await this.dataSource.query(
      `
    UPDATE "Likes"
    SET "status"=$2, "updatedAt"=$3
    WHERE "id"=$1;
    `,
      [id, status, new Date()],
    );
  }

  async getMyStatus(id: string, userId: string): Promise<LikeStatus> {
    const likeQuery = await this.dataSource.query(
      `
    SELECT "status" FROM "Likes"
    WHERE "parentId"=$1 AND "userId"=$2
    `,
      [id, userId],
    );

    const like = likeQuery[0];

    if (!like) {
      return LikeStatus.None;
    }

    return like.status;
  }

  async getLastLikes(id: string) {
    const likeQuery = await this.dataSource.query(
      `
      SELECT l."userId", l."updatedAt" as "addedAt", u."login"
      FROM "Likes" l
      LEFT JOIN "Users" u ON l."userId" = u."id"
      WHERE l."parentId"=$1 AND l."status"='Like'
      ORDER BY l."updatedAt" desc
      LIMIT 3 OFFSET 0
      `,
      [id],
    );

    return likeQuery;
  }

  async countLikes(id: string) {
    const likesQuery = await this.dataSource.query(
      `
    SELECT COUNT(*) FROM "Likes"
    WHERE "parentId"=$1 AND "status"='Like'
    `,
      [id],
    );

    const dislikesQuery = await this.dataSource.query(
      `
    SELECT COUNT(*) FROM "Likes"
    WHERE "parentId"=$1 AND "status"='Dislike'
    `,
      [id],
    );

    return {
      likesCount: likesQuery[0].count,
      dislikesCount: dislikesQuery[0].count,
    };
  }
}
