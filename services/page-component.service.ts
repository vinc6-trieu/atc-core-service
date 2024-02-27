import PAGE_COMPONENT_MODEL, { PageComponentDocument } from '../models/page-component.model'
import { BaseService } from '../shared/base/service.base'

class PageComponentService extends BaseService<PageComponentDocument> {
  constructor() {
    super(PAGE_COMPONENT_MODEL)
  }
}

export const pageComponentService = new PageComponentService()
