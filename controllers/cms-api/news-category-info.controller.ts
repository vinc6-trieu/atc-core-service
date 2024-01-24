import { BaseController } from '../../shared/base/controller.base'
import { NewsCategoryInfoDocument } from '../../models/news-category-info.model'
import { newsCategoryInfoService } from '../../services/news-category-info.service'

class NewsCategoryController extends BaseController<NewsCategoryInfoDocument> {
  constructor() {
    super(newsCategoryInfoService, NewsCategoryController.name)
  }
}

export const newsCategoryInfoController = new NewsCategoryController()
