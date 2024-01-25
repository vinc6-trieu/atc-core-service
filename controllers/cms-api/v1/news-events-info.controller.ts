import { BaseController } from '../../../shared/base/controller.base'
import { newsEventsInfoService } from '../../../services/news-events-info.service'
import { NewsEventsInfoDocument } from '../../../models/news-events-info.model'

class NewsEventsInfoController extends BaseController<NewsEventsInfoDocument> {
  constructor() {
    super(newsEventsInfoService, NewsEventsInfoController.name)
  }
}

export const newsEventsInfoController = new NewsEventsInfoController()
