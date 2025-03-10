import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BlogsService } from '../../features/bloggers-platform/blogs/application/blogs.service';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'isBlogExists', async: true })
@Injectable()
export class BlogExistsValidator implements ValidatorConstraintInterface {
  constructor(protected readonly blogsService: BlogsService) {}

  async validate(blogId: string): Promise<boolean> {
    if (!blogId) return false;
    return await this.blogsService.exists(blogId);
  }

  defaultMessage(args: ValidationArguments) {
    return `Blog with id ${args.value} does not exist`;
  }
}
