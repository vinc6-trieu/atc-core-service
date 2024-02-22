import { NextFunction, Request, Response } from 'express'

class HomeViewController {
  //   renderList = async (req: Request, res: Response, next: NextFunction) => {
  //     const { page = 1, search = '', ...filter } = req.query
  //   }

  renderEdit = async (req: Request, res: Response, next: NextFunction) => {
    return res.render('cms', {
      inc: 'inc/cms/home/update',
      title: 'Chỉnh sửa danh mục khóa học',
      lang: 'vi',
      switchLangs: {
        vi: `/cms/course-categories/${1}?lang=`,
        en: `/cms/course-categories/${1}?lang=`,
      },
    })
  }
}

export const homeViewController = new HomeViewController()
