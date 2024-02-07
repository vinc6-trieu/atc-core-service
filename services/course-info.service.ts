import COURSE_INFO_MODEL, { CourseInfoDocument } from '../models/course-info.model'
import { BaseService } from '../shared/base/service.base'

class CourseInfoService extends BaseService<CourseInfoDocument> {
  constructor() {
    super(COURSE_INFO_MODEL)
  }
}

export const courseInfoService = new CourseInfoService()
