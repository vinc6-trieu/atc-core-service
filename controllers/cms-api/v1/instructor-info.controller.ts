import { BaseController } from '../../../shared/base/controller.base'
import { InstructorInfoDocument } from '../../../models/instructor-info.model'
import { instructorInfoService } from '../../../services/instructor-info.service'

class InstructorInfoController extends BaseController<InstructorInfoDocument> {
  constructor() {
    super(instructorInfoService, InstructorInfoController.name)
  }
}

export const instructorInfoController = new InstructorInfoController()
