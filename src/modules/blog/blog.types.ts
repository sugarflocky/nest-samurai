import { BlogDocument } from './blog.schemas';
import { SortOrder } from 'mongoose';

export type BlogCreateDto = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type BlogUpdateDto = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type BlogViewModel = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

export type BlogSortData = {
  searchNameTerm: string | null;
  sortBy: string;
  sortDirection: SortOrder;
  pageNumber: number;
  pageSize: number;
};

export const blogMapper = (blog: BlogDocument): BlogViewModel => {
  return {
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt.toISOString(),
    isMembership: blog.isMembership,
  };
};
