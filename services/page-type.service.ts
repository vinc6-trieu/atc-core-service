import TYPE_PAGE_MODEL, { PageTypeDocument } from '../models/page-type.model'
import { BaseService } from '../shared/base/service.base'

class PageTypeService extends BaseService<PageTypeDocument> {
  constructor() {
    super(TYPE_PAGE_MODEL)
  }
}

export const pageTypeService = new PageTypeService()
