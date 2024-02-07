import { BaseController } from '../../../shared/base/controller.base'
import { courseInfoService } from '../../../services/course-info.service'
import { CourseInfoDocument } from '../../../models/course-info.model'

class CourseInfoController extends BaseController<CourseInfoDocument> {
  constructor() {
    super(courseInfoService, CourseInfoController.name)
  }
}

export const courseInfoController = new CourseInfoController()
