import PERMISSION_MODEL, { PermissionDocument } from '../../models/permission.model'
import { BaseService } from '../../shared/base/service.base'

class PermissionService extends BaseService<PermissionDocument> {
  constructor() {
    super(PERMISSION_MODEL)
  }
}

export const permissionService = new PermissionService()
