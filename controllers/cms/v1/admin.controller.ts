import { NextFunction, Request, Response } from 'express'
import { adminService } from '../../../services/auth/admin.service'
import { ROLE_NAMES } from '../../../constants/auth.constant'

class AdminViewController {
  renderList = async (req: Request, res: Response, _: NextFunction) => {
    const signalGetListUsers = await adminService.getList({
      queryConditions: {},
    })

    if (signalGetListUsers.error) return res.render('error')

    const admins = signalGetListUsers.data ?? []

    return res.render('cms', {
      inc: 'inc/cms/admins/list',
      title: 'Danh sách quản trị viên',
      admins,
      ROLE_NAMES,
      currentUserRole: 'admin',
      user: req.user,
    })
  }

  renderUpdatePassword = async (req: Request, res: Response, _: NextFunction) => {
    const userID = req.params.userID
    const signalGetUserInfo = await adminService.getOne({
      queryConditions: { _id: userID },
    })

    if (signalGetUserInfo.error) res.status(500).json(signalGetUserInfo)
    const userChange = signalGetUserInfo.data

    return res.render('cms', {
      inc: 'inc/cms/admins/admin_reset_pass',
      title: 'Đổi mật khẩu quản trị viên',
      userChange,
    })
  }
}

export const adminViewController = new AdminViewController()
