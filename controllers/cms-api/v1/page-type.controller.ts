import { PageTypeDocument } from '../../../models/page-type.model'
import { pageTypeService } from '../../../services/page-type.service'
import { BaseController } from '../../../shared/base/controller.base'

class PageTypeController extends BaseController<PageTypeDocument> {
  constructor() {
    super(pageTypeService, PageTypeController.name)
  }
}

export const pageTypeController = new PageTypeController()
