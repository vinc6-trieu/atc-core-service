import { Request, Response, NextFunction } from 'express'
import mongoose, { Document } from 'mongoose'
import { BaseService } from './service.base'
import { APP_ENV, APP_PREFIX, STATUS_CODE } from '../../constants/base.constant'
import { EOrderBy } from '../enums/index.enum'

export class BaseController<T extends Document> {
  readonly controllerName: string
  private service: BaseService<T>

  constructor(service: BaseService<T>, name: string) {
    this.service = service
    this.controllerName = name
  }

  createID = async (req: Request, res: Response, _: NextFunction): Promise<Response> => {
    const { ...params } = req.query

    const signalResponse = this.service.createID()

    const responseData = {
      error: signalResponse.error,
      data: {
        ...params,
        ...signalResponse.data,
      },
      message: signalResponse.message,
    }

    return res
      .status(signalResponse.error ? STATUS_CODE.BAD_REQUEST : STATUS_CODE.OK)
      .json(responseData)
  }

  create = async (req: Request, res: Response, _: NextFunction): Promise<Response> => {
    const data = req.body
    const signalResponse = await this.service.create(data)

    return res
      .status(signalResponse.error ? STATUS_CODE.BAD_REQUEST : STATUS_CODE.OK)
      .json(signalResponse)
  }

  getOne = async (req: Request, res: Response, _: NextFunction): Promise<Response> => {
    const { id } = req.params

    const signalResponse = await this.service.getOne({
      queryConditions: { _id: id },
      cacheOptions: { ttl: 30 },
    })
    return res
      .status(signalResponse.error ? STATUS_CODE.BAD_REQUEST : STATUS_CODE.OK)
      .json(signalResponse)
  }

  getList = async (req: Request, res: Response, _: NextFunction): Promise<Response> => {
    const { skip, limit, search, sortBy, direction = EOrderBy.DESC, ...query } = req.query

    const sort: Record<string, any> = {}

    if (sortBy && direction) sort[`${sortBy}`] = direction === EOrderBy.DESC ? -1 : 1

    const signalResponse = await this.service.getList({
      queryConditions: {
        ...query,
        ...(search ? { $text: { $search: search as string } } : {}),
      } as any,
      skip: skip ? +skip : undefined,
      limit: limit ? +limit : undefined,
      sort: sortBy ? sort : { createdAt: -1 },
      cacheOptions: { ttl: 30 },
    })
    return res
      .status(signalResponse.error ? STATUS_CODE.BAD_REQUEST : STATUS_CODE.OK)
      .json(signalResponse)
  }

  paginate = async (req: Request, res: Response, _: NextFunction): Promise<Response> => {
    const {
      skip,
      limit,
      search,
      sortBy,
      direction = EOrderBy.DESC,
      field,
      operator,
      value,
      ...query
    } = req.query
    const sort: Record<string, any> = {}

    if (sortBy && direction) sort[`${sortBy}`] = direction === EOrderBy.DESC ? -1 : 1

    const signalResponse = await this.service.paginate({
      queryConditions: {
        ...query,
        ...(search ? { $text: { $search: search as string } } : {}),
        ...(field ? {} : {}),
      } as any,
      skip: skip ? +skip : undefined,
      limit: limit ? +limit : undefined,
      sort: sortBy ? sort : { createdAt: -1 },
      cacheOptions: { ttl: 30 },
    })
    return res
      .status(signalResponse.error ? STATUS_CODE.BAD_REQUEST : STATUS_CODE.OK)
      .json(signalResponse)
  }

  removeOne = async (req: Request, res: Response, _: NextFunction): Promise<Response> => {
    const { id } = req.params
    const signalResponse = await this.service.remove(new mongoose.Types.ObjectId(id))
    return res
      .status(signalResponse.error ? STATUS_CODE.BAD_REQUEST : STATUS_CODE.OK)
      .json(signalResponse)
  }

  createOrUpdate = async (req: Request, res: Response, _: NextFunction): Promise<Response> => {
    let { id = null } = req.params
    const dataUpdate = req.body

    const signalResponse = await this.service.createOrUpdate({
      queryConditions: { _id: id },
      data: dataUpdate,
    })
    return res
      .status(signalResponse.error ? STATUS_CODE.BAD_REQUEST : STATUS_CODE.OK)
      .json(signalResponse)
  }

  updateOne = async (req: Request, res: Response, _: NextFunction): Promise<Response> => {
    const matchingConditions: any = req.query
    const dataUpdate = req.body
    const signalResponse = await this.service.updateOne({
      queryConditions: matchingConditions,
      data: dataUpdate,
    })
    return res
      .status(signalResponse.error ? STATUS_CODE.BAD_REQUEST : STATUS_CODE.OK)
      .json(signalResponse)
  }
}
