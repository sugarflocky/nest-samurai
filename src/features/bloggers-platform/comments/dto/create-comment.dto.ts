export class CreateCommentDto {
  id: string;
  content: string;
  postId: string;
  userId: string;
  createdAt: Date;
  deletedAt: Date | null;
}

export class CreateCommentInServiceDto {
  content: string;
  postId: string;
  userId: string;
}
