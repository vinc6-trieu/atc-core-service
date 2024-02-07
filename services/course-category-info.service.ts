import COURSE_CATEGORY_INFO_MODEL, {
  CourseCategoryInfoDocument,
} from '../models/course-category-info.model'
import { BaseService } from '../shared/base/service.base'

class CourseCategoryInfoService extends BaseService<CourseCategoryInfoDocument> {
  constructor() {
    super(COURSE_CATEGORY_INFO_MODEL)
  }
}

export const courseCategoryInfoService = new CourseCategoryInfoService()
