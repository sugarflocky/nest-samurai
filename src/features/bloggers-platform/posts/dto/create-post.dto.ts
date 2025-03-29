export type CreatePostDto = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  createdAt: Date;
  deletedAt: Date | null;
};
