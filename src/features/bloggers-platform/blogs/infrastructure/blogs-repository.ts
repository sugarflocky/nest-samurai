import { Injectable } from '@nestjs/common';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';

@Injectable()
export class BlogsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async selectById(id: string) {
    const blogQuery = await this.dataSource.query(
      `
    SELECT * FROM "Blogs"
    WHERE "id"=$1 AND "deletedAt" IS NULL
    `,
      [id],
    );

    return blogQuery[0];
  }

  async selectOrNotFoundFail(id: string) {
    const blog = await this.selectById(id);
    if (!blog) {
      throw NotFoundDomainException.create();
    }
    return blog;
  }

  async create(dto: CreateBlogDto) {
    const blogQuery = await this.dataSource.query(
      `
    INSERT INTO "Blogs"(
    "id", "name", "description", "websiteUrl", "isMembership", "createdAt", "deletedAt")
    VALUES ($1, $2, $3, $4, $5, $6, $7);
    `,
      [
        dto.id,
        dto.name,
        dto.description,
        dto.websiteUrl,
        dto.isMembership,
        dto.createdAt,
        dto.deletedAt,
      ],
    );
  }

  async update(id: string, dto: UpdateBlogDto) {
    await this.selectOrNotFoundFail(id);

    const blogQuery = await this.dataSource.query(
      `
      UPDATE "Blogs"
      SET "name"=$1, "description"=$2, "websiteUrl"=$3
      WHERE "id"=$4
      `,
      [dto.name, dto.description, dto.websiteUrl, id],
    );
  }

  async delete(id: string) {
    await this.selectOrNotFoundFail(id);

    const blogQuery = await this.dataSource.query(
      `
      UPDATE "Blogs"
      SET "deletedAt"=$2
      WHERE "id"=$1
      `,
      [id, new Date()],
    );
  }
}
