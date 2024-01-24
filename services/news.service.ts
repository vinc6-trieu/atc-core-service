import POST_MODEL, { NewsDocument } from '../models/news.model'
import { BaseService } from '../shared/base/service.base'

class PostService extends BaseService<NewsDocument> {
  constructor() {
    super(POST_MODEL)
  }
}

export const newsService = new PostService()
