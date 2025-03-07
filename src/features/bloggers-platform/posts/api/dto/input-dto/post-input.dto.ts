import { IsNotEmpty, IsString, Length, Validate } from 'class-validator';
import { toTrimmedString } from '../../../../../../core/pipes/to-trimmed-string.pipe';
import { Transform } from 'class-transformer';
import { BlogExistsValidator } from '../../../../../../core/validators/blog-exists.validator';

export class CreatePostInputDto {
  @Transform(({ value }) => toTrimmedString(value))
  @IsNotEmpty()
  @IsString()
  @Length(1, 30)
  title: string;
  @Transform(({ value }) => toTrimmedString(value))
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  shortDescription: string;
  @Transform(({ value }) => toTrimmedString(value))
  @IsNotEmpty()
  @IsString()
  @Length(1, 1000)
  content: string;
  @Transform(({ value }) => toTrimmedString(value))
  @IsNotEmpty()
  @IsString()
  @Validate(BlogExistsValidator)
  blogId: string;
}

export class CreatePostForBlogInputDto {
  @Transform(({ value }) => toTrimmedString(value))
  @IsNotEmpty()
  @IsString()
  @Length(1, 30)
  title: string;
  @Transform(({ value }) => toTrimmedString(value))
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  shortDescription: string;
  @Transform(({ value }) => toTrimmedString(value))
  @IsNotEmpty()
  @IsString()
  @Length(1, 1000)
  content: string;
}

export class UpdatePostInputDto {
  @Transform(({ value }) => toTrimmedString(value))
  @IsNotEmpty()
  @IsString()
  @Length(1, 30)
  title: string;
  @Transform(({ value }) => toTrimmedString(value))
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  shortDescription: string;
  @Transform(({ value }) => toTrimmedString(value))
  @IsNotEmpty()
  @IsString()
  @Length(1, 1000)
  content: string;
  @Transform(({ value }) => toTrimmedString(value))
  @IsNotEmpty()
  @IsString()
  @Validate(BlogExistsValidator)
  blogId: string;
}
