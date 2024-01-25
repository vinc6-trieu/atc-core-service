import { NextFunction, Request, Response } from 'express'
import { PolicyDocument } from '../../../models/policy.model'
import { policyService } from '../../../services/auth/policy.service'
import { BaseController } from '../../../shared/base/controller.base'
import { MESSAGES, STATUS_CODE } from '../../../constants/base.constant'
import { PermissionDocument } from '../../../models/permission.model'
import { permissionService } from '../../../services/auth/permission.service'

class PolicyController extends BaseController<PolicyDocument> {
  constructor() {
    super(policyService, PolicyController.name)
  }

  /**
   * @override
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  createOrUpdate = async (req: Request, res: Response, _: NextFunction) => {
    let id = req.params.id.trim()
    const { policyName, policyDescription, departmentCode, selectedPermissions = [] } = req.body

    const updateData: Partial<PolicyDocument> = {
      name: policyName,
      description: policyDescription,
      permissions: selectedPermissions,
      departmentCode,
    }

    const policyPermissions = updateData?.permissions as PermissionDocument[]

    // check the sub permissions
    if (policyPermissions) {
      const policyPermissionsSet = new Set(policyPermissions)

      for (const policyPermission of policyPermissions) {
        const permission = await permissionService.getOne({
          queryConditions: {
            _id: policyPermission,
            root: null,
          },
        })

        if (permission && permission.data) {
          const listSubPermission = await permissionService.getList({
            queryConditions: { root: permission.data._id },
          })

          listSubPermission.data?.forEach((subPermission) => {
            policyPermissionsSet.add(subPermission._id)
          })
        }
      }
      updateData.permissions = Array.from(policyPermissionsSet.values())
    }

    const signalUpdate = await policyService.createOrUpdate({
      queryConditions: { _id: id },
      data: updateData,
      populates: ['permissions'],
    })

    if (signalUpdate.error) return res.status(STATUS_CODE.SERVER_ERROR).json(signalUpdate)
    const policy = signalUpdate.data

    const responseJson = {
      data: { policy },
      message: MESSAGES.CREATED_SUCCEED,
    }

    return res.status(STATUS_CODE.OK).json(responseJson)
  }
}

export const policyController = new PolicyController()
