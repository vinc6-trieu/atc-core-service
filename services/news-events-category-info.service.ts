import NEWS_CATEGORY_INFO_MODEL, {
  NewsEventsCategoryInfoDocument,
} from '../models/news-events-category-info.model'
import { BaseService } from '../shared/base/service.base'

class NewsEventsCategoryInfoService extends BaseService<NewsEventsCategoryInfoDocument> {
  constructor() {
    super(NEWS_CATEGORY_INFO_MODEL)
  }
}

export const newsEventsCategoryInfoService = new NewsEventsCategoryInfoService()
