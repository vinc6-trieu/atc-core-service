import { NextFunction, Request, Response } from 'express'
import { PaginationBuilder } from '../../../shared/helpers/pagination.helper'
import { ELanguage } from '../../../shared/enums/locale.enum'
import { LIST_STATUS_POST_CATEGORY } from '../../../constants/post-category.constant'
import { DATE_FORMAT_FN, FORMAT_ID_FN } from '../../../shared/utils/format.util'
import { courseCategoryInfoService } from '../../../services/course-category-info.service'
import { courseCategoryService } from '../../../services/course-category.service'

class CourseViewController {
  renderList = async (req: Request, res: Response, next: NextFunction) => {
    const { page = 1, search = '', ...filter } = req.query

    const url = req.originalUrl

    let status: number | null = null
    if (filter.status) {
      status = parseInt(`${filter.status}`)
      const signalGetListStatus = await courseCategoryInfoService.getList({
        queryConditions: { status },
        cacheOptions: {
          ttl: 30,
        },
      })

      if (signalGetListStatus.data) {
        const listIds = signalGetListStatus.data.map((item: any) => item._id)
        if (listIds.length > 0) {
          filter['$or'] = [
            {
              vi: { $in: listIds },
              en: { $in: listIds },
            },
          ]
        } else {
          filter['$or'] = [
            {
              vi: { $in: [] },
              en: { $in: [] },
            },
          ]
        }
      }
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
        ...(search ? { $text: { $search: search as string } } : {}),
      },
      populates: ['vi', 'en'],
      sort: {
        modifiedAt: -1,
        createdAt: -1,
      },
    })

    const signalGetCount = await courseCategoryService.count({
      ...filter,
      ...(search ? { $text: { $search: search as string } } : {}),
    })

    const total = signalGetCount.data
    const pagination = PaginationBuilder(total, limit, url)

    if (signalGetList.error)
      return res.render('cms', { inc: 'error', message: signalGetList.message, error: {} })
    const categories = signalGetList.data

    const listStatus = LIST_STATUS_POST_CATEGORY.VI

    return res.render('cms', {
      inc: 'inc/cms/course-categories/list',
      title: 'Danh sách danh mục khóa học',
      categories,
      pagination,
      page,
      total,
      search,
      listStatus,
      status,
      FORMAT_ID_FN,
      DATE_FORMAT_FN,
    })
  }

  renderEdit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params
    const lang = req.query.lang ?? ELanguage.VI

    const switchLangs = {
      vi: `/cms/course-categories/${id}?lang=${ELanguage.VI}`,
      en: `/cms/course-categories/${id}?lang=${ELanguage.EN}`,
    }

    const signalGet = await courseCategoryService.getOne({
      queryConditions: { _id: id.trim() },
    })

    const category = signalGet?.data ?? { _id: id }

    const signalGetInfo = await courseCategoryInfoService.getOne({
      queryConditions: {
        courseCategory: id,
        lang,
      },
      populates: ['thumbnail'],
    })

    const info = signalGetInfo?.data ?? {}

    const signalGetCategories = await courseCategoryService.getList({
      queryConditions: { parent: null },
    })
    if (signalGetCategories.error) return res.render('error')

    const categories = signalGetCategories.data

    return res.render('cms', {
      inc: 'inc/cms/course-categories/update',
      title: 'Chỉnh sửa danh mục khóa học',
      category: category,
      categoryInfo: info,
      lang,
      switchLangs,
      categories,
    })
  }
}

export const courseCategoryViewController = new CourseViewController()
