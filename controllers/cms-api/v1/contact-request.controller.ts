import { NextFunction, Response } from 'express'
import { ContactRequestDocument } from '../../../models/contact-request.model'
import { contactRequestService } from '../../../services/contact-request.service'
import { BaseController } from '../../../shared/base/controller.base'
import { MESSAGES, STATUS_CODE } from '../../../constants/base.constant'
import { RequestWithPassport } from '../../../authentication/passport'

class ContactRequestController extends BaseController<ContactRequestDocument> {
  constructor() {
    super(contactRequestService, ContactRequestController.name)
  }

  createOrUpdate = async (
    req: RequestWithPassport,
    res: Response,
    _: NextFunction,
  ): Promise<Response> => {
    let id = req.params.id.trim()
    const dataUpdate = req.body
    const user = req.session?.passport?.user

    dataUpdate.processUser = user?._id || null

    const signalUpdate = await contactRequestService.createOrUpdate({
      queryConditions: {
        _id: id,
      },
      data: dataUpdate,
      populates: ['processUser'],
    })

    const responseJson = {
      data: signalUpdate.data,
      message: MESSAGES.CREATED_SUCCEED,
    }
    return res.status(STATUS_CODE.OK).json(responseJson)
  }
}

export const contactRequestController = new ContactRequestController()
