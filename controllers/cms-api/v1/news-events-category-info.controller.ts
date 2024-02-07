import { BaseController } from '../../../shared/base/controller.base'
import { NewsEventsCategoryInfoDocument } from '../../../models/news-events-category-info.model'
import { newsEventsCategoryInfoService } from '../../../services/news-events-category-info.service'

class NewsEventsCategoryInfoController extends BaseController<NewsEventsCategoryInfoDocument> {
  constructor() {
    super(newsEventsCategoryInfoService, NewsEventsCategoryInfoController.name)
  }
}

export const newsEventsCategoryInfoController = new NewsEventsCategoryInfoController()
