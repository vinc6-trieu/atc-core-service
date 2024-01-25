import NEWS_EVENTS_CATEGORY_MODEL, { NewsEventsCategoryDocument } from '../models/news-events-category.model'
import { BaseService } from '../shared/base/service.base'

class NewsEventsCategoryService extends BaseService<NewsEventsCategoryDocument> {
  constructor() {
    super(NEWS_EVENTS_CATEGORY_MODEL)
  }
}

export const newsEventsCategoryService = new NewsEventsCategoryService()
