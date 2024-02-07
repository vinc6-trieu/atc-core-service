import { BaseController } from '../../../shared/base/controller.base'
import { courseCategoryInfoService } from '../../../services/course-category-info.service'
import { CourseCategoryInfoDocument } from '../../../models/course-category-info.model'

class CourseCategoryInfoController extends BaseController<CourseCategoryInfoDocument> {
  constructor() {
    super(courseCategoryInfoService, CourseCategoryInfoController.name)
  }
}

export const courseCategoryInfoController = new CourseCategoryInfoController()
