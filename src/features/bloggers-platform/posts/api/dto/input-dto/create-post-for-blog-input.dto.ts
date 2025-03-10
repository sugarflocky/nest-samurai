import { Trim } from '../../../../../../core/decorators/transform/trim';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreatePostForBlogInputDto {
  @Trim()
  @IsNotEmpty()
  @IsString()
  @Length(1, 30)
  title: string;
  @Trim()
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  shortDescription: string;
  @Trim()
  @IsNotEmpty()
  @IsString()
  @Length(1, 1000)
  content: string;
}