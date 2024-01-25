import { NextFunction, Request, Response } from 'express'
import { newsEventsCategoryService } from '../../services/news-events-category.service'
import { LANGUAGES, MESSAGES, STATUS_CODE } from '../../constants/base.constant'
import HeaderMenuMock  from '../../__mocks__/advance-mega-menus.mock.json'
import HomeMock  from '../../__mocks__/home.mock.json'
class HomeController {
  async getJSONHome(req: Request, res: Response, _: NextFunction) {
    console.log("Header",HomeMock)
    return res.status(STATUS_CODE.OK).json({
      error: false,
      data: HomeMock,
      message: MESSAGES.GET_SUCCEED,
    })
  }

  async getJSONMenu (req: Request, res: Response, _: NextFunction){
    console.log("Header",HeaderMenuMock)
    return res.status(STATUS_CODE.OK).json({
      error: false,
      data: HeaderMenuMock,
      message: MESSAGES.GET_SUCCEED,
    })
  }

  async getMenu(req: Request, res: Response, _: NextFunction) {
    const { lang = LANGUAGES.vi } = req.query
    const postCategories = await newsEventsCategoryService.getList({
      queryConditions: {},
      populates: [`${lang}`],
      limit: 10,
    })
    if (postCategories.error) return res.status(STATUS_CODE.SERVER_ERROR).json(postCategories)

    const resData = postCategories.data?.map((e) => {
      if (lang === LANGUAGES.vi) return e.vi

      return e.en
    })
    return res.status(STATUS_CODE.OK).json({
      error: false,
      data: resData,
      message: MESSAGES.GET_SUCCEED,
    })
  }
}
export const homeController = new HomeController()
