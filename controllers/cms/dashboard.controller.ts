import { NextFunction, Request, Response } from 'express'
import { userService } from '../../services/auth/user.service'
import { newsService } from '../../services/news.service'

class DashboardViewController {
  async renderAdminDashboard(req: Request, res: Response, _: NextFunction) {
    const lang = req.query.lang ?? 'vi'

    const signalCountPost = await newsService.count()
    const totalPost = signalCountPost.data

    const signalCountUser = await userService.count()
    const totalUser = signalCountUser.data

    return res.render('cms', {
      inc: 'inc/cms/dashboard',
      title: 'CMS Dashboard - Văn Lang Group',
      lang,
      totalPost,
      totalUser,
    })
  }
}

export const dashboardViewController = new DashboardViewController()
