import { UpdateBlogDto } from '../../../dto/update-blog.dto';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Trim } from '../../../../../../core/decorators/transform/trim';

export class CreateBlogInputDto {
  @Trim()
  @IsNotEmpty()
  @IsString()
  @Length(1, 15)
  name: string;
  @Trim()
  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  description: string;
  @Trim()
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  )
  websiteUrl: string;
}

export class UpdateBlogInputDto implements UpdateBlogDto {
  @Trim()
  @IsNotEmpty()
  @IsString()
  @Length(1, 15)
  name: string;
  @Trim()
  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  description: string;
  @Trim()
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  )
  websiteUrl: string;
}
