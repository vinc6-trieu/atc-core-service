import { NextFunction, Request, Response } from 'express'
import { policyService } from '../../../services/auth/policy.service'
import { PaginationBuilder } from '../../../shared/helpers/pagination.helper'
import { permissionService } from '../../../services/auth/permission.service'
import { DATE_FORMAT_FN, FORMAT_ID_FN } from '../../../shared/utils/format.util'
import { DEPARTMENTS } from '../../../constants/base.constant'

class PolicyViewController {
  renderList = async (req: Request, res: Response, next: NextFunction) => {
    const { page = 1, search = '', ...filter } = req.query

    const url = req.originalUrl

    if (parseInt(`${page}`) < 0) return res.render('error')

    const limit = 5
    const skip = (parseInt(`${page}`) - 1) * limit

    const signalGetList = await policyService.getList({
      skip,
      limit,
      queryConditions: {
        ...filter,
        ...(search ? { $text: { $search: search as string } } : {}),
      },
      sort: {
        modifiedAt: -1,
        createdAt: -1,
      },
    })

    const signalGetCount = await policyService.count({
      ...filter,
      ...(search ? { $text: { $search: search as string } } : {}),
    })

    const total = signalGetCount.data
    const pagination = PaginationBuilder(total, limit, url)

    if (signalGetList.error)
      return res.render('cms', { inc: 'error', message: signalGetList.message, error: {} })
    const listData = signalGetList.data

    return res.render('cms', {
      inc: 'inc/cms/policies/list',
      title: 'Danh sách nhom quyen',
      list: listData,
      pagination,
      page,
      total,
      search,
      FORMAT_ID_FN,
      DATE_FORMAT_FN,
      DEPARTMENTS,
    })
  }

  renderEdit = async (req: Request, res: Response, _: NextFunction): Promise<void> => {
    const { id } = req.params

    const signalGet = await policyService.getOne({
      queryConditions: { _id: id.trim() },
      populates: ['permissions'],
    })

    const policy = signalGet?.data ?? { _id: id }

    const signalGetPermissions = await permissionService.getList({
      queryConditions: {},
      sort: {
        level: -1,
      },
    })
    if (signalGetPermissions.error) return res.render('error')

    const permissions = signalGetPermissions.data

    return res.render('cms', {
      inc: 'inc/cms/policies/update',
      title: 'Chỉnh sửa nhóm quyền',
      policy,
      permissions,
      DEPARTMENTS,
    })
  }
}

export const policyViewController = new PolicyViewController()
