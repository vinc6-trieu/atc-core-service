import ROLE_MODEL, { RoleDocument } from '../../models/role.model'
import { BaseService } from '../../shared/base/service.base'

class RoleService extends BaseService<RoleDocument> {
  constructor() {
    super(ROLE_MODEL)
  }
}

export const roleService = new RoleService()
