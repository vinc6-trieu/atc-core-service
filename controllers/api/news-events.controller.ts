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

    return res.status(STATUS_CODE.OK).json(getNewsInfo)
  }
}

export const newsEventsController = new NewsEventsController()
