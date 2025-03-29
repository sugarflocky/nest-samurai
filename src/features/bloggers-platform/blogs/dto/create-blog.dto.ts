export type CreateBlogDto = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  isMembership: boolean;
  createdAt: Date;
  deletedAt: Date | null;
};
