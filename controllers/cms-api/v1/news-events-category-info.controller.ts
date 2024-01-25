import { BaseController } from '../../../shared/base/controller.base'
import { NewsEventsCategoryInfoDocument } from '../../../models/news-events-category-info.model'
import { newsEventsCategoryInfoService } from '../../../services/news-events-category-info.service'

class NewsEventsCategoryController extends BaseController<NewsEventsCategoryInfoDocument> {
  constructor() {
    super(newsEventsCategoryInfoService, NewsEventsCategoryController.name)
  }
}

export const newsEventsCategoryInfoController = new NewsEventsCategoryController()
