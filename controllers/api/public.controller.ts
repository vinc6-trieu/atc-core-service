import { NextFunction, Request, Response } from 'express'
import { MESSAGES, STATUS_CODE } from '../../constants/base.constant'
import { pageTypeService } from '../../services/page-type.service'
import { ControllerFactory } from '../../shared/factories/dynamic-controller/dynamic-controller.factory'
import DynamicController from '../../shared/factories/dynamic-controller/controller.interface'
import { ERROR_CODES, ERROR_MESSAGES } from '../../constants/response-message.constant'
import { contactRequestService } from '../../services/contact-request.service'
import { ContactRequestDocument } from '../../models/contact-request.model'

const statusProcess = {
  '3': 'Tư vấn thành công',
  '2': 'Đã tư vấn đang chờ xác nhận từ khách',
  '1': 'Đã chuyển Calling Center CSKH',
  '0': 'Chờ tư vấn',
  '-1': 'Khách hàng hủy',
}

const emailRegexp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

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

  async createContactRequest(req: Request, res: Response, next: NextFunction) {
    const { firstName = '', lastName = '', phone = '', email = '', message = '' } = req.body

    const fullName = `${lastName} ${firstName}`
    if (email && email != '' && (email.length < 6 || !emailRegexp.test(email)))
      return res.status(STATUS_CODE.SERVER_ERROR).json({
        error: true,
        data: null,
        message: 'invalid_email',
      })

    if (fullName.length < 2)
      return res.status(STATUS_CODE.SERVER_ERROR).json({
        error: true,
        data: null,
        message: 'invalid_name',
      })

    if (phone.length < 6)
      return res.status(STATUS_CODE.SERVER_ERROR).json({
        error: true,
        data: null,
        message: 'invalid_phone',
      })

    const dataCreate: Partial<ContactRequestDocument> = {
      fullName,
      phone,
      email,
      message,
    }

    const signalCreate = await contactRequestService.create(dataCreate)

    const responseJson = {
      data: signalCreate.data,
      message: MESSAGES.CREATED_SUCCEED,
    }

    return res.status(STATUS_CODE.OK).json(responseJson)
  }
}

export const publicController = new PublicController()
