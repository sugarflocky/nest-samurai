import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostModelType } from '../domain/post.entity';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UpdatePostDto } from '../dto/update-post.dto';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name) private PostModel: PostModelType,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async findById(id: string): Promise<PostDocument | null> {
    return this.PostModel.findOne({
      _id: id,
      deletedAt: null,
    });
  }

  async save(post: PostDocument): Promise<void> {
    await post.save();
  }

  async findOrNotFoundFail(id: string): Promise<PostDocument> {
    const post = await this.findById(id);
    if (!post) {
      throw NotFoundDomainException.create();
    }

    return post;
  }

  async selectById(id: string) {
    const postQuery = await this.dataSource.query(
      `
    SELECT * FROM "Posts"
    WHERE "id"=$1 AND "deletedAt" IS NULL
    `,
      [id],
    );

    return postQuery[0];
  }

  async selectOrNotFoundFail(id: string) {
    const post = await this.selectById(id);
    if (!post) {
      throw NotFoundDomainException.create();
    }
    return post;
  }

  async create(dto) {
    const postQuery = await this.dataSource.query(
      `
    INSERT INTO "Posts"(
    "id", "title", "shortDescription", "content", "blogId", "deletedAt", "createdAt")
    VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        dto.id,
        dto.title,
        dto.shortDescription,
        dto.content,
        dto.blogId,
        dto.deletedAt,
        dto.createdAt,
      ],
    );
  }

  async update(blogId: string, postId: string, dto: UpdatePostDto) {
    await this.selectOrNotFoundFail(postId);

    const postQuery = await this.dataSource.query(
      `
    UPDATE "Posts"
    SET "title"=$3, "shortDescription"=$4, "content"=$5
    WHERE "id"=$2 AND "blogId"=$1
    
    `,
      [blogId, postId, dto.title, dto.shortDescription, dto.content],
    );
  }

  async delete(blogId: string, postId: string) {
    await this.selectOrNotFoundFail(postId);

    const postQuery = await this.dataSource.query(
      `
    UPDATE "Posts"
    SET "deletedAt"=$3
    WHERE "id"=$1 AND "blogId"=$2
    `,
      [postId, blogId, new Date()],
    );
  }
}
