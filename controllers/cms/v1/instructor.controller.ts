import { NextFunction, Request, Response } from 'express'
import { PaginationBuilder } from '../../../shared/helpers/pagination.helper'
import { DATE_FORMAT_FN, FORMAT_ID_FN } from '../../../shared/utils/format.util'
import { instructorService } from '../../../services/instructor.service'
import { ELanguage } from '../../../shared/enums/locale.enum'
import { instructorInfoService } from '../../../services/instructor-info.service'

class InstructorViewController {
  renderList = async (req: Request, res: Response, next: NextFunction) => {
    const { page = 1, search = '', ...filter } = req.query

    const url = req.originalUrl

    if (parseInt(`${page}`) < 0) return res.render('error')

    const limit = 5
    const skip = (parseInt(`${page}`) - 1) * limit

    const signalGetList = await instructorService.getList({
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

    const signalGetCount = await instructorService.count({
      ...filter,
      ...(search ? { $text: { $search: search as string } } : {}),
    })

    const total = signalGetCount.data
    const pagination = PaginationBuilder(total, limit, url)

    if (signalGetList.error)
      return res.render('cms', { inc: 'error', message: signalGetList.message, error: {} })

    return res.render('cms', {
      inc: 'inc/cms/instructors/list',
      title: 'Danh sách người hướng dẫn',
      instructors: signalGetList.data ?? [],
      pagination,
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

    const switchLangs = {
      vi: `/cms/instructors/${id}?lang=${ELanguage.VI}`,
      en: `/cms/instructors/${id}?lang=${ELanguage.EN}`,
    }

    const signalGet = await instructorService.getOne({
      queryConditions: { _id: id.trim() },
    })

    const instructor = signalGet?.data ?? { _id: id }

    const signalGetInfo = await instructorInfoService.getOne({
      queryConditions: {
        instructor: instructor._id,
        lang,
      },
      populates: ['avatar'],
    })

    const info = signalGetInfo?.data ?? {}

    return res.render('cms', {
      inc: 'inc/cms/instructors/update',
      title: 'Chỉnh sửa',
      instructorInfo: info,
      instructor,
      lang,
      switchLangs,
      DATE_FORMAT_FN,
      FORMAT_ID_FN,
    })
  }
}

export const instructorViewController = new InstructorViewController()
