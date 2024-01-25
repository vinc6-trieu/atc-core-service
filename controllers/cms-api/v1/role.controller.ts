import { NextFunction, Request, Response } from 'express'
import { RoleDocument } from '../../../models/role.model'
import { roleService } from '../../../services/auth/role.service'
import { BaseController } from '../../../shared/base/controller.base'
import { MESSAGES, STATUS_CODE } from '../../../constants/base.constant'

class RoleController extends BaseController<RoleDocument> {
  constructor() {
    super(roleService, RoleController.name)
  }

  /**
   * @override
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  createOrUpdate = async (req: Request, res: Response, _: NextFunction) => {
    let id = req.params.id.trim()
    const { roleName, roleDescription, roleStatus, selectedPolicies = [] } = req.body

    const updateData: Partial<RoleDocument> = {
      name: roleName,
      description: roleDescription,
      policies: selectedPolicies,
      status: roleStatus,
    }

    const signalUpdate = await roleService.createOrUpdate({
      queryConditions: { _id: id },
      data: updateData,
      populates: ['policies'],
    })

    if (signalUpdate.error) return res.status(STATUS_CODE.SERVER_ERROR).json(signalUpdate)
    const role = signalUpdate.data

    console.log({role})

    const responseJson = {
      data: { role },
      message: MESSAGES.CREATED_SUCCEED,
    }

    return res.status(STATUS_CODE.OK).json(responseJson)
  }
}

export const roleController = new RoleController()
