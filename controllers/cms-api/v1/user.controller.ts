import { NextFunction, Request, Response } from 'express'
import { userService } from '../../../services/auth/user.service'
import { BaseController } from '../../../shared/base/controller.base'
import { UserDocument } from '../../../models/user.model'

export class UserController extends BaseController<UserDocument> {
  constructor() {
    super(userService, UserController.name)
  }

  register = async (req: Request, res: Response, _: NextFunction) => {
    const signalCreate = await userService.register(req.body)
    return res.status(signalCreate.error ? 400 : 200).json(signalCreate)
  }

  getInfoById = async (req: Request, res: Response, _: NextFunction) => {
    const { adminId } = req.params

    const signalCreate = await userService.getOne({
      queryConditions: { _id: adminId },
    })

    if (signalCreate.error) return res.status(400).json(signalCreate)

    return res.status(200).json({
      error: signalCreate.error,
      message: signalCreate.message,
      data: {
        ...signalCreate.data,
        password: undefined,
      },
    })
  }
}

export const userController = new UserController()
