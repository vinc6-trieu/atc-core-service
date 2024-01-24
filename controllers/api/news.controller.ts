import { NextFunction, Request, Response } from 'express'
import { STATUS_CODE } from '../../constants/base.constant'
import { newsInfoService } from '../../services/news-info.service'
import DynamicController from '../../shared/factories/dynamic-controller/controller.interface'
import { ENewsStatus } from '../../shared/enums/news.enum'

class NewsController implements DynamicController {
  async handleGetBySlugRequest(req: Request, res: Response, _: NextFunction) {
    const { slug } = req.params

    const getNewsInfo = await newsInfoService.getOne({
      queryConditions: {
        slug,
        status: { $in: [ENewsStatus.PublicIndex, ENewsStatus.PublicNoIndex] },
      },
      populates: ['thumbnail', 'gallery', 'tags', 'category']
    })

    if (getNewsInfo.error) return res.status(STATUS_CODE.SERVER_ERROR).json(getNewsInfo)

    return res.status(STATUS_CODE.OK).json(getNewsInfo)
  }
}

export const newsController = new NewsController()
