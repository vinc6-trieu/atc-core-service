import NEWS_EVENTS_MODEL, { NewsEventsDocument } from '../models/news-events.model'
import { BaseService } from '../shared/base/service.base'

class NewsEventsService extends BaseService<NewsEventsDocument> {
  constructor() {
    super(NEWS_EVENTS_MODEL)
  }
}

export const newsEventsService = new NewsEventsService()
