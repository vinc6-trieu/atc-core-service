import { PermissionDocument } from '../../../models/permission.model'
import { permissionService } from '../../../services/auth/permission.service'
import { BaseController } from '../../../shared/base/controller.base'

class PermissionController extends BaseController<PermissionDocument> {
  constructor() {
    super(permissionService, PermissionController.name)
  }
}

export const permissionController = new PermissionController()
