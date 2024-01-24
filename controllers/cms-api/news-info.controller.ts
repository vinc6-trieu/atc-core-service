import { BaseController } from '../../shared/base/controller.base'
import { newsInfoService } from '../../services/news-info.service'
import { NewsInfoDocument } from '../../models/news-info.model'

class NewsInfoController extends BaseController<NewsInfoDocument> {
  constructor() {
    super(newsInfoService, NewsInfoController.name)
  }
}

export const newsInfoController = new NewsInfoController()
