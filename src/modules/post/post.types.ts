import { ExtendedLikesInfo, PostDocument } from './post.schemas';
import { SortOrder, Types } from 'mongoose';

export type PostCreateDto = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string | Types.ObjectId;
  blogName?: string;
};

export type PostUpdateDto = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string | Types.ObjectId;
  blogName?: string;
};

export type PostViewModel = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: ExtendedLikesInfo;
};

export type PostSortData = {
  sortBy: string;
  sortDirection: SortOrder;
  pageNumber: number;
  pageSize: number;
};

export const postMapper = (post: PostDocument): PostViewModel => {
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId.toString(),
    blogName: post.blogName,
    createdAt: post.createdAt.toISOString(),
    extendedLikesInfo: post.extendedLikesInfo,
  };
};
