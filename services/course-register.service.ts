import COURSE_REGISTER_MODEL, { CourseRegisterDocument } from '../models/course-register.model'
import { BaseService } from '../shared/base/service.base'

class CourseRegisterService extends BaseService<CourseRegisterDocument> {
  constructor() {
    super(COURSE_REGISTER_MODEL)
  }
}

export const courseRegisterService = new CourseRegisterService()
