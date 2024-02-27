import { PageComponentDocument } from '../../../models/page-component.model'
import { pageComponentService } from '../../../services/page-component.service'
import { BaseController } from '../../../shared/base/controller.base'

class PageComponentController extends BaseController<PageComponentDocument> {
  constructor() {
    super(pageComponentService, PageComponentController.name)
  }
}

export const pageComponentController = new PageComponentController()
