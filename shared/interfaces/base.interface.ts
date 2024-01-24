import { FilterQuery, PopulateOptions, SortOrder } from 'mongoose'

export interface IPagingDataFormat<T> {
  docs: T[]
  pagination: {
    totalCount: number | null
    totalPages: number | null
    currentPage: number | null
    pageSize: number | null
  }
}

export interface IResponseData<T> {
  error?: boolean
  data?: T
  message: string
  error_code?: string
}

export interface IGetOneWithOptions<T> {
  queryConditions?: FilterQuery<T>
  populates?: PopulateOptions | (PopulateOptions | string)[]
  select?: string | string[] | Record<string, number | boolean | object>
  cacheOptions?: {
    ttl: number
  }
}

export interface IGetListWithOptions<T> extends IGetOneWithOptions<T> {
  sort?: string | { [key: string]: SortOrder | { $meta: string } } | [string, SortOrder][] | null
  limit?: number
  skip?: number
}

export interface IFindOneUpdateWithOptions<T>
  extends Pick<IGetOneWithOptions<T>, 'queryConditions' | 'populates'> {
  data: Partial<T>
}

export interface IUpdateWithOptions<T> extends Pick<IGetOneWithOptions<T>, 'queryConditions'> {
  data: Partial<T>
}
