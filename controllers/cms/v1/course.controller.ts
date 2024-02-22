import { NextFunction, Request, Response } from 'express'
import { PaginationBuilder } from '../../../shared/helpers/pagination.helper'
import { LIST_STATUS_POST } from '../../../constants/post.constant'
import { FORMAT_ID_FN, DATE_FORMAT_FN } from '../../../shared/utils/format.util'
import { courseInfoService } from '../../../services/course-info.service'
import { courseService } from '../../../services/course.service'
import { courseCategoryService } from '../../../services/course-category.service'
import { ELanguage } from '../../../shared/enums/locale.enum'
import { instructorService } from '../../../services/instructor.service'

class CourseViewController {
  renderList = async (req: Request, res: Response, next: NextFunction) => {
    const { page = 1, search = '', ...filter } = req.query

    const url = req.originalUrl

    // clean object
    Object.entries(filter).forEach(([key, _]) => {
      if (!filter[key]) {
        delete filter[key]
      }
    })

    let status: number | null = null
    if (filter.status) {
      status = parseInt(`${filter.status}`)
      const signalGetListStatus = await courseInfoService.getList({
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

    const signalGetList = await courseService.getList({
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

    const signalGetCount = await courseService.count({
      ...filter,
      ...(search ? { $text: { $search: search as string } } : {}),
    })

    const total = signalGetCount.data
    const pagination = PaginationBuilder(total, limit, url)

    if (signalGetList.error)
      return res.render('cms', { inc: 'error', message: signalGetList.message, error: {} })
    const courses = signalGetList.data

    // listCategories
    const signalGetListCate = await courseCategoryService.getList({
      queryConditions: {},
      sort: { createdAt: -1 },
    })

    let listCategories = signalGetListCate.data ?? []

    const listStatus = LIST_STATUS_POST.VI

    return res.render('cms', {
      inc: 'inc/cms/courses/list',
      title: 'Danh sách khóa học',
      courses,
      listCategories,
      pagination,
      filter,
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
      vi: `/cms/courses/${id}?lang=${ELanguage.VI}`,
      en: `/cms/courses/${id}?lang=${ELanguage.EN}`,
    }

    const signalGet = await courseService.getOne({
      queryConditions: { _id: id.trim() },
    })

    const course = signalGet?.data ?? { _id: id }

    const signalGetInfo = await courseInfoService.getOne({
      queryConditions: {
        course: course._id,
        lang,
      },
      populates: ['thumbnail', 'gallery'],
    })

    const info = signalGetInfo?.data

    const gallery = info?.gallery ?? []

    const signalGetCategories = await courseCategoryService.getList({
      queryConditions: { parent: null },
    })
    if (signalGetCategories.error) return res.render('error')

    const categories = signalGetCategories.data

    const signalGetInstructors = await instructorService.getList({
      queryConditions: {},
    })
    if (signalGetInstructors.error) return res.render('error')

    const instructors = signalGetInstructors.data

    return res.render('cms', {
      inc: 'inc/cms/courses/update',
      title: 'Chỉnh sửa khóa học',
      course,
      courseInfo: info ?? {},
      lang,
      gallery,
      switchLangs,
      categories,
      instructors,
      DATE_FORMAT_FN,
    })
  }
}

export const courseViewController = new CourseViewController()
