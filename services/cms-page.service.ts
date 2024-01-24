import CMS_PAGE_MODEL, { CMSPageDocument } from '../models/department.model'
import { BaseService } from '../shared/base/service.base'

class CMSPageService extends BaseService<CMSPageDocument> {
  constructor() {
    super(CMS_PAGE_MODEL)
  }
}

export const cmsPageService = new CMSPageService()
