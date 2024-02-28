import { NextFunction, Request, Response } from 'express'
import { STATUS_CODE } from '../../constants/base.constant'
import DynamicController from '../../shared/factories/dynamic-controller/controller.interface'
import { courseInfoService } from '../../services/course-info.service'
import { ECourseStatus } from '../../shared/enums/course.enum'

class CourseController implements DynamicController {
  async handleGetBySlugRequest(req: Request, res: Response, _: NextFunction) {
    const { slug } = req.params

    const getCourseInfo = await courseInfoService.getOne({
      queryConditions: {
        slug,
        status: { $in: [ECourseStatus.PublicIndex, ECourseStatus.PublicNoIndex] },
      },
      populates: ['thumbnail', 'gallery', 'tags', 'category'],
    })

    const getRelatedCourses = await courseInfoService.getList({
      queryConditions: {
        category: getCourseInfo.data?.category,
      },
      populates: ['thumbnail', 'gallery', 'tags', 'category'],
      limit: 3,
    })

    const relatedCourses = getRelatedCourses.data ?? []

    if (getCourseInfo.error) return res.status(STATUS_CODE.SERVER_ERROR).json(getCourseInfo)

    return res.status(STATUS_CODE.OK).json({
      error: false,
      data: { info: getCourseInfo.data, related: relatedCourses },
      message: getCourseInfo.message,
    })
  }

  async getList(req: Request, res: Response, _: NextFunction) {
    const { search = '', category, tag, skip = 0, limit = 10, level = 0, sort = 0 } = req.query

    const getCourses = await courseInfoService.getList({
      skip: +skip,
      limit: +limit,
      queryConditions: {
        ...(search ? { $text: { $search: search as string } } : {}),
        ...(category ? { category } : {}),
        ...(level ? { level } : {}),
        ...(tag ? { tags: { $elemMatch: { $eq: tag } } } : {}),
        status: { $in: [ECourseStatus.PublicIndex, ECourseStatus.PublicNoIndex] },
      },
      sort: {
        ...(sort === 0 ? { createdAt: -1, updatedAt: -1 } : { views: -1 }),
      },
      populates: ['thumbnail', 'gallery', 'tags', 'category'],
    })

    if (getCourses.error) return res.status(STATUS_CODE.SERVER_ERROR).json(getCourses)

    return res.status(STATUS_CODE.OK).json({
      error: false,
      data: { list: getCourses.data },
      message: getCourses.message,
    })
  }
}

export const courseController = new CourseController()
