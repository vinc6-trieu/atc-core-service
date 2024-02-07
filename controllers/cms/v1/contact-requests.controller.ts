import { NextFunction, Request, Response } from 'express'
import { PaginationBuilder } from '../../../shared/helpers/pagination.helper'
import { ELanguage } from '../../../shared/enums/locale.enum'
import { DATE_FORMAT_FN, FORMAT_ID_FN } from '../../../shared/utils/format.util'
import { courseCategoryService } from '../../../services/course-category.service'
import { contactRequestService } from '../../../services/contact-request.service'

class ContactRequestsViewController {
  renderList = async (req: Request, res: Response, next: NextFunction) => {
    const { page = 1, search = '', ...filter } = req.query

    const url = req.originalUrl

    let status: number | null = null

    if (filter.status || filter.status === '0') {
      status = parseInt(filter.status.toString())
    }

    delete filter['status']

    if (parseInt(`${page}`) < 0) return res.render('error')

    const limit = 5
    const skip = (parseInt(`${page}`) - 1) * limit

    const signalGetList = await courseCategoryService.getList({
      skip,
      limit,
      queryConditions: {
        ...filter,
        ...(status ? { status } : {}),
        ...(search ? { $text: { $search: search as string } } : {}),
      },
      sort: {
        modifiedAt: -1,
        createdAt: -1,
      },
    })

    const signalGetCount = await courseCategoryService.count({
      ...filter,
      ...(status ? { status } : {}),
      ...(search ? { $text: { $search: search as string } } : {}),
    })

    const total = signalGetCount.data
    const pagination = PaginationBuilder(total, limit, url)

    if (signalGetList.error)
      return res.render('cms', { inc: 'error', message: signalGetList.message, error: {} })

    return res.render('cms', {
      inc: 'inc/cms/contact-requests/list',
      title: 'Danh sách tư vấn',
      listData: signalGetList.data ?? [],
      pagination,
      status,
      page,
      total,
      search,
      filter,
      FORMAT_ID_FN,
      DATE_FORMAT_FN,
    })
  }

  renderEdit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params
    const lang = req.query.lang ?? ELanguage.VI

    const signalGet = await contactRequestService.getOne({
      queryConditions: { _id: id.trim() },
      populates: ['processUser'],
    })

    const info = signalGet?.data ?? {}

    return res.render('cms', {
      inc: 'inc/cms/contact-requests/update',
      title: 'Chỉnh sửa',
      contact: info,
      DATE_FORMAT_FN,
      FORMAT_ID_FN,
    })
  }
}

export const contactRequestsViewController = new ContactRequestsViewController()
