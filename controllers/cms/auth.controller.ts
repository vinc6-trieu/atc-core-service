import { NextFunction, Request, Response } from 'express'
import { adminService } from '../../services/auth/admin.service'
import { ROLE_NAMES } from '../../constants/auth.constant'

class AuthViewController {
  refillPassword = (req: Request, _: Response, next: NextFunction) => {
    if (!req.body.password) {
      req.body.password = '   '
    }
    return next()
  }

  renderLoginPage = async (_: Request, res: Response, __: NextFunction) => {
    return res.render('login', { title: 'TRANG QUẢN TRỊ CMS', wrong: false, message: '' })
  }

  destroySession = async (req: Request, res: Response, _: NextFunction) => {
    res.clearCookie('connect.sid')
    req.session.regenerate((err) => {
      if (err) {
        console.error('Error regenerating session:', err)
      }
      req.logout(function (err) {
        req.session.destroy(function (err) {
          // destroys the session
          console.log(err)
          console.log('Logout successful')
        })
      })
      return res.redirect('/')
    })
  }

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
    const user = signalGetUserInfo.data

    return res.render('cms', {
      inc: 'inc/cms/admins/reset_password',
      title: 'Đổi mật khẩu quản trị viên',
      user,
    })
  }
}

export const authViewController = new AuthViewController()
