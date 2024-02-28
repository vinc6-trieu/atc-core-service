import { NextFunction, Request, Response } from 'express'
import { STATUS_CODE } from '../../constants/base.constant'
import { newsEventsInfoService } from '../../services/news-events-info.service'
import DynamicController from '../../shared/factories/dynamic-controller/controller.interface'
import { ENewsEventsStatus } from '../../shared/enums/news-events.enum'

class NewsEventsController implements DynamicController {
  async handleGetBySlugRequest(req: Request, res: Response, _: NextFunction) {
    const { slug } = req.params

    const getNewsInfo = await newsEventsInfoService.getOne({
      queryConditions: {
        slug,
        status: { $in: [ENewsEventsStatus.PublicIndex, ENewsEventsStatus.PublicNoIndex] },
      },
      populates: ['thumbnail', 'gallery', 'tags', 'category'],
    })

    if (getNewsInfo.error) return res.status(STATUS_CODE.SERVER_ERROR).json(getNewsInfo)

    const getRelatedNewsEvents = await newsEventsInfoService.getList({
      queryConditions: {
        category: getNewsInfo.data?.category,
      },
      sort: { createdAt: -1, updatedAt: -1 },
      populates: ['thumbnail', 'gallery', 'tags', 'category'],
      limit: 3,
    })

    const relatedNewsEvents = getRelatedNewsEvents.data ?? []

    const getRecentNewsEvents = await newsEventsInfoService.getList({
      sort: { createdAt: -1, updatedAt: -1 },
      populates: ['thumbnail', 'gallery', 'tags', 'category'],
      limit: 3,
    })

    const recentNewsEvents = getRecentNewsEvents.data ?? []

    return res.status(STATUS_CODE.OK).json({
      error: false,
      data: { info: getNewsInfo.data, related: relatedNewsEvents, recent: recentNewsEvents },
      message: getNewsInfo.message,
    })
  }
}

export const newsEventsController = new NewsEventsController()
