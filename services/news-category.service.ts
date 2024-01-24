import NEWS_CATEGORY_MODEL, { NewsCategoryDocument } from '../models/news-category.model'
import { BaseService } from '../shared/base/service.base'

class PostCategoryService extends BaseService<NewsCategoryDocument> {
  constructor() {
    super(NEWS_CATEGORY_MODEL)
  }
}

export const newsCategoryService = new PostCategoryService()
