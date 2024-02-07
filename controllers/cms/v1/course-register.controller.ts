import { NextFunction, Request, Response } from 'express'
import { PaginationBuilder } from '../../../shared/helpers/pagination.helper'
import { DATE_FORMAT_FN, FORMAT_ID_FN } from '../../../shared/utils/format.util'
import { courseRegisterService } from '../../../services/course-register.service'

class CourseRegisterViewController {
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

    const signalGetList = await courseRegisterService.getList({
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

    const signalGetCount = await courseRegisterService.count({
      ...filter,
      ...(status ? { status } : {}),
      ...(search ? { $text: { $search: search as string } } : {}),
    })

    const total = signalGetCount.data
    const pagination = PaginationBuilder(total, limit, url)

    if (signalGetList.error)
      return res.render('cms', { inc: 'error', message: signalGetList.message, error: {} })

    return res.render('cms', {
      inc: 'inc/cms/course-registers/list',
      title: 'Danh sách đăng kí',
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

    const signalGet = await courseRegisterService.getOne({
      queryConditions: { _id: id.trim() },
      populates: ['processUser', 'course'],
    })

    const info = signalGet?.data ?? {}

    return res.render('cms', {
      inc: 'inc/cms/course-registers/update',
      title: 'Chỉnh sửa',
      courseRegister: info,
      DATE_FORMAT_FN,
      FORMAT_ID_FN,
    })
  }
}

export const courseRegisterViewController = new CourseRegisterViewController()
