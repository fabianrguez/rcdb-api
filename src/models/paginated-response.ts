import type { PaginationMetadata } from '@app/types';

export default class PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMetadata;

  constructor(data: T[], offset: number = 0, limit: number = 4000) {
    this.data = [...data].splice(offset, limit);
    this.pagination = {
      count: limit,
      total: data.length,
      offset,
      limit,
    };
  }
}
