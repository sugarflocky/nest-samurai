import { CreateBlogDto } from '../../../dto/create-blog.dto';
import { UpdateBlogDto } from '../../../dto/update-blog.dto';
import { IsNotEmpty } from 'class-validator';

export class CreateBlogInputDto implements CreateBlogDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  websiteUrl: string;
}

export class UpdateBlogInputDto implements UpdateBlogDto {
  name: string;
  description: string;
  websiteUrl: string;
}
