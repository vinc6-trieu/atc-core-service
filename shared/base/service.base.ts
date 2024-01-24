import mongoose, {
  ClientSession,
  Document,
  FilterQuery,
  Model,
  UpdateWriteOpResult,
} from 'mongoose'
import { MESSAGES } from '../../constants/base.constant'
import {
  IFindOneUpdateWithOptions,
  IGetListWithOptions,
  IGetOneWithOptions,
  IPagingDataFormat,
  IResponseData,
  IUpdateWithOptions,
} from '../interfaces/base.interface'
import {
  ERROR_CODES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from '../../constants/response-message.constant'
import { cacheDbKeyBuilder } from '../helpers/redis-cache.helper'

export class BaseService<T extends Document> {
  private model: Model<T>

  constructor(model: Model<T>) {
    this.model = model
  }

  async startTransaction(): Promise<ClientSession> {
    const session = await mongoose.startSession()
    session.startTransaction()
    return session
  }

  async getOne({
    queryConditions = {},
    populates,
    select,
    cacheOptions,
  }: IGetOneWithOptions<T>): Promise<IResponseData<T>> {
    try {
      let queryPromisePipeline = this.model.findOne(queryConditions)
      if (select) queryPromisePipeline.select(select)

      if (populates) queryPromisePipeline.populate(populates)

      if (cacheOptions) {
        const hashedKey = Bun.hash(JSON.stringify(queryConditions)).toString()
        const cacheKey = cacheDbKeyBuilder(this.model.modelName, hashedKey)
        console.log('caching from key: ' + cacheKey)
        // @ts-ignore
        queryPromisePipeline.cache(cacheOptions.ttl || 30, cacheKey)
      }

      const data: T = (await queryPromisePipeline.lean()) as T

      return { error: false, data, message: SUCCESS_MESSAGES.GET_SUCCEED }
    } catch (error) {
      console.log('Error reading data from database', error)
      return {
        error: true,
        message: ERROR_MESSAGES[ERROR_CODES.READ_OPERATOR_FAILED],
        error_code: ERROR_CODES.READ_OPERATOR_FAILED,
      }
    }
  }

  async getList({
    queryConditions = {},
    populates,
    select,
    skip,
    limit,
    sort = { createdAt: -1, updatedAt: -1 },
    cacheOptions,
  }: IGetListWithOptions<T>): Promise<IResponseData<T[]>> {
    try {
      let queryPromisePipeline = this.model.find(queryConditions)

      if (populates) queryPromisePipeline.populate(populates)

      if (select) queryPromisePipeline.select(select)

      if (limit && +limit <= 0)
        return {
          error: true,
          message: ERROR_MESSAGES[ERROR_CODES.INVALID_PAGINATION],
          error_code: ERROR_CODES.INVALID_PAGINATION,
        }

      if (limit && limit > 0) queryPromisePipeline.limit(limit)

      if (skip && +skip < 0)
        return {
          error: true,
          message: ERROR_MESSAGES[ERROR_CODES.INVALID_PAGINATION],
          error_code: ERROR_CODES.INVALID_PAGINATION,
        }

      if (skip && +skip > 0) queryPromisePipeline.skip(+skip)

      if (sort) queryPromisePipeline.sort(sort)

      if (cacheOptions) {
        const hashedKey = Bun.hash(JSON.stringify({ ...queryConditions, skip, limit })).toString()
        const cacheKey = cacheDbKeyBuilder(this.model.modelName, hashedKey)
        console.log('caching from key: ' + cacheKey)
        // @ts-ignore
        queryPromisePipeline.cache(cacheOptions.ttl || 30, cacheKey)
      }

      const result: T[] = (await queryPromisePipeline.lean()) || []

      return {
        error: false,
        data: result,
        message: SUCCESS_MESSAGES.GET_SUCCEED,
      }
    } catch (error) {
      console.log('Error reading data from database', error)
      return {
        error: true,
        message: ERROR_MESSAGES[ERROR_CODES.READ_OPERATOR_FAILED],
        error_code: ERROR_CODES.READ_OPERATOR_FAILED,
      }
    }
  }

  async paginate({
    queryConditions = {},
    populates,
    select,
    skip,
    limit,
    sort = { createdAt: -1, updatedAt: -1 },
    cacheOptions,
  }: IGetListWithOptions<T>): Promise<IResponseData<IPagingDataFormat<T>>> {
    try {
      let queryPromisePipeline = this.model.find(queryConditions)

      if (populates) queryPromisePipeline.populate(populates)

      if (select) queryPromisePipeline.select(select)

      if (limit && +limit <= 0)
        return {
          error: true,
          message: ERROR_MESSAGES[ERROR_CODES.INVALID_PAGINATION],
          error_code: ERROR_CODES.INVALID_PAGINATION,
        }

      if (limit && limit > 0) queryPromisePipeline.limit(limit)

      if (skip && +skip < 0)
        return {
          error: true,
          message: ERROR_MESSAGES[ERROR_CODES.INVALID_PAGINATION],
          error_code: ERROR_CODES.INVALID_PAGINATION,
        }

      if (skip && +skip > 0) queryPromisePipeline.skip(+skip)

      if (sort) queryPromisePipeline.sort(sort)

      if (cacheOptions) {
        const hashedKey = Bun.hash(JSON.stringify({ ...queryConditions, skip, limit })).toString()
        const cacheKey = cacheDbKeyBuilder(this.model.modelName, hashedKey)
        console.log('caching from key: ' + cacheKey)
        // @ts-ignore
        queryPromisePipeline.cache(cacheOptions.ttl || 30, cacheKey)
      }

      const result: T[] = (await queryPromisePipeline.lean()) || []

      const totalCount = await this.model.countDocuments(queryConditions)

      const pagination = {
        totalCount,
        totalPages: limit ? Math.ceil(totalCount / (+limit || 1)) : null,
        currentPage: skip && limit ? Math.floor(skip / (+limit || 1)) + 1 : 1,
        pageSize: limit ? +limit : null,
      }

      return {
        error: false,
        data: {
          pagination,
          docs: result,
        },
        message: SUCCESS_MESSAGES.GET_SUCCEED,
      }
    } catch (error) {
      console.log('Error reading data from database', error)
      return {
        error: true,
        message: ERROR_MESSAGES[ERROR_CODES.READ_OPERATOR_FAILED],
        error_code: ERROR_CODES.READ_OPERATOR_FAILED,
      }
    }
  }

  async createOrUpdate({
    queryConditions = {},
    data = {},
    populates = [],
  }: IFindOneUpdateWithOptions<T>): Promise<IResponseData<T>> {
    try {
      const updateResult: T = await this.model
        .findOneAndUpdate(queryConditions, { $set: data }, { upsert: true, new: true })
        .populate(populates)
        .lean()

      return {
        data: updateResult,
        message: SUCCESS_MESSAGES.CREATED_SUCCEED,
      }
    } catch (error) {
      console.log('Error writing data from database', error)
      return {
        error: true,
        message: ERROR_MESSAGES[ERROR_CODES.WRITE_OPERATOR_FAILED],
        error_code: ERROR_CODES.WRITE_OPERATOR_FAILED,
      }
    }
  }

  createID(): IResponseData<Record<string, mongoose.Types.ObjectId>> {
    return {
      error: false,
      data: { _id: new mongoose.Types.ObjectId() },
      message: SUCCESS_MESSAGES.CREATED_SUCCEED,
    }
  }

  async create(dataCreate: Partial<T>): Promise<IResponseData<any>> {
    try {
      const createResult = await new this.model(dataCreate).save()
      return {
        error: false,
        data: createResult,
        message: SUCCESS_MESSAGES.CREATED_SUCCEED,
      }
    } catch (error) {
      console.log('Error writing data from database', error)
      return {
        error: true,
        message: ERROR_MESSAGES[ERROR_CODES.WRITE_OPERATOR_FAILED],
        error_code: ERROR_CODES.WRITE_OPERATOR_FAILED,
      }
    }
  }

  async createMany(payloads = {}): Promise<IResponseData<T[]>> {
    try {
      const docs = await this.model.insertMany(payloads)
      return {
        error: false,
        data: docs,
        message: SUCCESS_MESSAGES.CREATED_MANY_SUCCEED,
      }
    } catch (error) {
      console.log('Error writing data from database', error)
      return {
        error: true,
        message: ERROR_MESSAGES[ERROR_CODES.WRITE_OPERATOR_FAILED],
        error_code: ERROR_CODES.WRITE_OPERATOR_FAILED,
      }
    }
  }

  async remove(id: mongoose.Types.ObjectId, callback = () => {}): Promise<IResponseData<any>> {
    try {
      const removeResult = await this.model.findOneAndDelete({ _id: id })
      callback()
      return {
        data: removeResult,
        message: SUCCESS_MESSAGES.DELETE_SUCCEED,
      }
    } catch (error) {
      console.log('Error writing data from database', error)
      return {
        error: true,
        message: ERROR_MESSAGES[ERROR_CODES.WRITE_OPERATOR_FAILED],
        error_code: ERROR_CODES.WRITE_OPERATOR_FAILED,
      }
    }
  }

  async updateOne({
    queryConditions = {},
    data = {},
  }: IUpdateWithOptions<T>): Promise<IResponseData<UpdateWriteOpResult>> {
    try {
      const updateResult = await this.model.updateOne(
        queryConditions,
        { $set: data },
        { new: true },
      )
      return {
        data: updateResult,
        message: SUCCESS_MESSAGES.UPDATE_SUCCEED,
      }
    } catch (error) {
      console.log('Error writing data from database', error)
      return {
        error: true,
        message: ERROR_MESSAGES[ERROR_CODES.WRITE_OPERATOR_FAILED],
        error_code: ERROR_CODES.WRITE_OPERATOR_FAILED,
      }
    }
  }

  async updateMany({
    queryConditions = {},
    data = {},
  }: IUpdateWithOptions<T>): Promise<IResponseData<UpdateWriteOpResult>> {
    try {
      const updateResult = await this.model.updateMany(queryConditions, {
        $set: data,
      })
      return {
        data: updateResult,
        message: SUCCESS_MESSAGES.UPDATE_SUCCEED,
      }
    } catch (error) {
      console.log('Error writing data from database', error)
      return {
        error: true,
        message: ERROR_MESSAGES[ERROR_CODES.WRITE_OPERATOR_FAILED],
        error_code: ERROR_CODES.WRITE_OPERATOR_FAILED,
      }
    }
  }

  async count(matchConditions: FilterQuery<T> = {}): Promise<IResponseData<number>> {
    try {
      const result = await this.model.countDocuments(matchConditions)
      return { data: result, message: MESSAGES.DELETE_SUCCEED }
    } catch (error) {
      console.log('Error reading data from database', error)
      return {
        error: true,
        message: ERROR_MESSAGES[ERROR_CODES.WRITE_OPERATOR_FAILED],
        error_code: ERROR_CODES.WRITE_OPERATOR_FAILED,
      }
    }
  }
}
