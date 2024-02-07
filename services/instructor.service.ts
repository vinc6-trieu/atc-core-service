import INSTRUCTOR_MODEL, { InstructorDocument } from '../models/instructor.model'
import { BaseService } from '../shared/base/service.base'

class InstructorService extends BaseService<InstructorDocument> {
  constructor() {
    super(INSTRUCTOR_MODEL)
  }
}

export const instructorService = new InstructorService()
