import NEWS_EVENTS_INFO_MODEL, { NewsEventsInfoDocument } from '../models/news-events-info.model'
import { BaseService } from '../shared/base/service.base'

class NewsEventsInfoService extends BaseService<NewsEventsInfoDocument> {
  constructor() {
    super(NEWS_EVENTS_INFO_MODEL)
  }
}

export const newsEventsInfoService = new NewsEventsInfoService()
