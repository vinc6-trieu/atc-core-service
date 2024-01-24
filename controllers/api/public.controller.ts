import { NextFunction, Request, Response } from 'express'
import { STATUS_CODE } from '../../constants/base.constant'
import { pageTypeService } from '../../services/page-type.service'
import { ControllerFactory } from '../../shared/factories/dynamic-controller/dynamic-controller.factory'
import DynamicController from '../../shared/factories/dynamic-controller/controller.interface'
import { ERROR_CODES, ERROR_MESSAGES } from '../../constants/response-message.constant'

class PublicController {
  async getBySlug(req: Request, res: Response, next: NextFunction) {
    const { slug } = req.params

    // get page type by slug
    const getPageType = await pageTypeService.getOne({
      queryConditions: {
        slug,
      },
    })

    if (getPageType.error) return res.status(STATUS_CODE.SERVER_ERROR).json(getPageType)
    if (!getPageType.data) return res.status(STATUS_CODE.BAD_REQUEST).json(getPageType)

    const pageType = getPageType.data

    const controller: DynamicController = ControllerFactory.createController(pageType.name)

    if (!controller)
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        error: true,
        data: null,
        message: ERROR_MESSAGES[ERROR_CODES.DATA_NOT_FOUND],
        error_code: ERROR_CODES.DATA_NOT_FOUND,
      })
    return controller.handleGetBySlugRequest(req, res, next)
  }
}

export const publicController = new PublicController()
