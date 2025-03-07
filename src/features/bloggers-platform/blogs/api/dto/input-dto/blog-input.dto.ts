import { CreateBlogDto } from '../../../dto/create-blog.dto';
import { UpdateBlogDto } from '../../../dto/update-blog.dto';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { toTrimmedString } from '../../../../../../core/pipes/to-trimmed-string.pipe';
import { Transform } from 'class-transformer';

export class CreateBlogInputDto implements CreateBlogDto {
  @Transform(({ value }) => toTrimmedString(value))
  @IsNotEmpty()
  @IsString()
  @Length(1, 15)
  name: string;
  @Transform(({ value }) => toTrimmedString(value))
  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  description: string;
  @Transform(({ value }) => toTrimmedString(value))
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  )
  websiteUrl: string;
}

export class UpdateBlogInputDto implements UpdateBlogDto {
  @Transform(({ value }) => toTrimmedString(value))
  @IsNotEmpty()
  @IsString()
  @Length(1, 15)
  name: string;
  @Transform(({ value }) => toTrimmedString(value))
  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  description: string;
  @Transform(({ value }) => toTrimmedString(value))
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  )
  websiteUrl: string;
}
