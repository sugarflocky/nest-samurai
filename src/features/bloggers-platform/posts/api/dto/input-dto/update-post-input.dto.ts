import { Trim } from '../../../../../../core/decorators/transform/trim';
import { IsNotEmpty, IsString, Length, Validate } from 'class-validator';
import { BlogExistsValidator } from '../../../../../../core/validators/blog-exists.validator';

export class UpdatePostInputDto {
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
  @Trim()
  @IsNotEmpty()
  @IsString()
  @Validate(BlogExistsValidator)
  blogId: string;
}