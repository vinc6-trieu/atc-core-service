import INSTRUCTOR_INFO_MODEL, { InstructorInfoDocument } from '../models/instructor-info.model'
import { BaseService } from '../shared/base/service.base'

class InstructorInfoService extends BaseService<InstructorInfoDocument> {
  constructor() {
    super(INSTRUCTOR_INFO_MODEL)
  }
}

export const instructorInfoService = new InstructorInfoService()
