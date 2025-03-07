export class CreateCommentDto {
  content: string;
  postId: string;
  userId: string;
  userLogin: string;
}

export class CreateCommentInServiceDto {
  content: string;
  postId: string;
  userId: string;
}
