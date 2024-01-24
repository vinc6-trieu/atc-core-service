import NEWS_CATEGORY_INFO_MODEL, {
  NewsCategoryInfoDocument,
} from '../models/news-category-info.model'
import { BaseService } from '../shared/base/service.base'

class PostCategoryInfoService extends BaseService<NewsCategoryInfoDocument> {
  constructor() {
    super(NEWS_CATEGORY_INFO_MODEL)
  }
}

export const newsCategoryInfoService = new PostCategoryInfoService()
