import COURSE_MODAL, { CourseDocument } from '../models/course.model'
import { BaseService } from '../shared/base/service.base'

class CourseService extends BaseService<CourseDocument> {
  constructor() {
    super(COURSE_MODAL)
  }
}

export const courseService = new CourseService()
