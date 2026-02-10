import { FilterQuery } from 'mongoose';

/**
 * Builds a Mongoose filter object from query params.
 * Only includes known keys to prevent NoSQL injection.
 */
export function buildFilter<T>(
  allowedKeys: string[],
  query: Record<string, any>,
  baseFilter: FilterQuery<T> = {},
): FilterQuery<T> {
  const filter: FilterQuery<T> = { ...baseFilter };

  for (const key of allowedKeys) {
    if (query[key] !== undefined && query[key] !== null && query[key] !== '') {
      (filter as any)[key] = query[key];
    }
  }

  return filter;
}

/**
 * Builds a date range filter for a given field.
 */
export function buildDateRangeFilter(
  dateFrom?: string,
  dateTo?: string,
  field: string = 'createdAt',
): Record<string, any> {
  if (!dateFrom && !dateTo) return {};

  const dateFilter: any = {};
  if (dateFrom) dateFilter.$gte = new Date(dateFrom);
  if (dateTo) dateFilter.$lte = new Date(dateTo);

  return { [field]: dateFilter };
}
