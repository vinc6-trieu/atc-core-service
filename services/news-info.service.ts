import NEWS_INFO_MODEL, { NewsInfoDocument } from '../models/news-info.model'
import { BaseService } from '../shared/base/service.base'

class NewsInfoService extends BaseService<NewsInfoDocument> {
  constructor() {
    super(NEWS_INFO_MODEL)
  }
}

export const newsInfoService = new NewsInfoService()
