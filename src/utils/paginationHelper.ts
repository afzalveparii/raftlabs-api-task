import { PaginateOptions } from 'mongoose';

export const getPaginationOptions = (query: any): PaginateOptions => {
  const {
    page = 1, 
    limit = 10, 
    sort = 'createdAt',
    order = 'asc', 
  } = query;

  return {
    page: Number(page) || 1,
    limit: Number(limit) || 10,
    sort: { [sort]: order === 'desc' ? -1 : 1 },
  };
};
