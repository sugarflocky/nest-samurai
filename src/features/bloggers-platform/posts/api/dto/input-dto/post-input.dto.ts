export class CreatePostInputDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}

export class CreatePostForBlogInputDto {
  title: string;
  shortDescription: string;
  content: string;
}

export class UpdatePostInputDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}
