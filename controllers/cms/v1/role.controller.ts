import { NextFunction, Request, Response } from 'express'
import { newsEventsCategoryService } from '../../../services/news-events-category.service'
import { PaginationBuilder } from '../../../shared/helpers/pagination.helper'
import { newsEventsCategoryInfoService } from '../../../services/news-events-category-info.service'
import { ELanguage } from '../../../shared/enums/locale.enum'
import { DATE_FORMAT_FN, FORMAT_ID_FN } from '../../../shared/utils/format.util'
import { ERoleStatus } from '../../../shared/enums/roles.enum'
import { roleService } from '../../../services/auth/role.service'
import { policyService } from '../../../services/auth/policy.service'

class RoleViewController {
  renderList = async (req: Request, res: Response, next: NextFunction) => {
    const { page = 1, search = '', ...filter } = req.query

    const url = req.originalUrl

    let status: number | null = null

    if (parseInt(`${page}`) < 0) return res.render('error')

    const limit = 5
    const skip = (parseInt(`${page}`) - 1) * limit

    const signalGetList = await roleService.getList({
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

    const signalGetCount = await roleService.count({
      ...filter,
      ...(search ? { $text: { $search: search as string } } : {}),
    })

    const total = signalGetCount.data
    const pagination = PaginationBuilder(total, limit, url)

    if (signalGetList.error)
      return res.render('cms', { inc: 'error', message: signalGetList.message, error: {} })
    const roles = signalGetList.data

    return res.render('cms', {
      inc: 'inc/cms/roles/list',
      title: 'Danh sách vai trò',
      roles,
      pagination,
      page,
      total,
      search,
      listStatus: ERoleStatus,
      status,
      FORMAT_ID_FN,
      DATE_FORMAT_FN
    })
  }

  renderEdit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params
    const lang = req.query.lang ?? ELanguage.VI

    const switchLangs = {
      vi: `/cms/roles/${id}?lang=${ELanguage.VI}`,
      en: `/cms/roles/${id}?lang=${ELanguage.EN}`,
    }

    const signalGet = await roleService.getOne({
      queryConditions: { _id: id.trim() },
      populates: { path: 'policies' },
    })

    const role = signalGet?.data ?? { _id: id }

    const signalGetPolicies = await policyService.getList({
      queryConditions: {},
    })
    if (signalGetPolicies.error) return res.render('error')

    const policies = signalGetPolicies.data

    return res.render('cms', {
      inc: 'inc/cms/roles/update',
      title: 'Chỉnh sửa vai trò',
      role: role,
      lang,
      listStatus: ERoleStatus,
      switchLangs,
      policies: policies,
    })
  }
}

export const roleViewController = new RoleViewController()
