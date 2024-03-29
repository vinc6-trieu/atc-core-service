import { NextFunction, Request, Response } from 'express'
import { adminService } from '../../../services/auth/admin.service'
import { AdminDocument } from '../../../models/admin.model'
import { BaseController } from '../../../shared/base/controller.base'

class AdminController extends BaseController<AdminDocument> {
  constructor() {
    super(adminService, AdminController.name)
  }

  create = async (req: Request, res: Response, _: NextFunction) => {
    const signalCreate = await adminService.createAdmin(req.body)
    return res.status(signalCreate.error ? 400 : 200).json(signalCreate)
  }

  getInfoById = async (req: Request, res: Response, _: NextFunction) => {
    const { adminId } = req.params

    const signalCreate = await adminService.getOne({
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

  updatePassword = async (req: Request, res: Response, _: NextFunction) => {
    const { password, userID, oldPassword } = req.body

    if (password != oldPassword) {
      return res.status(400).json({ error: true, message: 'Mật khẩu Không khớp' })
    }

    const signalUpdate = await adminService.updatePassword(userID, password)
    return res.status(signalUpdate.error ? 400 : 200).json(signalUpdate)
  }
}

export const adminController = new AdminController()
