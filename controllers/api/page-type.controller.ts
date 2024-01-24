import { NextFunction, Request, Response } from 'express'
import { STATUS_CODE } from '../../constants/base.constant'
import { pageTypeService } from '../../services/page-type.service'
import { EPageTypeStatus, ERenderType } from '../../shared/enums/index.enum'

class PageTypeController {
  async getInfo(req: Request, res: Response, _: NextFunction) {
    const { slug } = req.query
    const pageType = await pageTypeService.getOne({
      queryConditions: {
        slug,
        status: EPageTypeStatus.Active,
      },
      cacheOptions: {
        ttl: 300,
      },
    })

    if (pageType.error) return res.status(STATUS_CODE.SERVER_ERROR).json(pageType)

    return res.status(STATUS_CODE.OK).json(pageType)
  }

  async getListByStaticRendering(_: Request, res: Response, __: NextFunction) {
    const pageType = await pageTypeService.getList({
      queryConditions: {
        status: EPageTypeStatus.Active,
        renderType: ERenderType.Static,
      },
    })

    if (pageType.error) return res.status(STATUS_CODE.SERVER_ERROR).json(pageType)

    return res.status(STATUS_CODE.OK).json(pageType)
  }
}
export const pageTypeController = new PageTypeController()
