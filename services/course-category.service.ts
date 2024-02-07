import COURSE_CATEGORY_MODEL, { CourseCategoryDocument } from '../models/course-category.model'
import { BaseService } from '../shared/base/service.base'

class CourseCategoryService extends BaseService<CourseCategoryDocument> {
  constructor() {
    super(COURSE_CATEGORY_MODEL)
  }
}

export const courseCategoryService = new CourseCategoryService()
