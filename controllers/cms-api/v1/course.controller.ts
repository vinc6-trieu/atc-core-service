import { BaseController } from '../../../shared/base/controller.base'
import { MESSAGES, STATUS_CODE } from '../../../constants/base.constant'
import { NextFunction, Request, Response } from 'express'
import { ERROR_CODES, ERROR_MESSAGES } from '../../../constants/response-message.constant'
import { ELanguage } from '../../../shared/enums/locale.enum'
import mongoose from 'mongoose'
import createToc from '../../../shared/helpers/create-toc'
import { newsEventsService } from '../../../services/news-events.service'
import { pageTypeService } from '../../../services/page-type.service'
import { PAGE_TYPE_KEYS } from '../../../constants/page-type.constant'
import { CourseDocument } from '../../../models/course.model'
import { courseService } from '../../../services/course.service'
import { CourseInfoDocument } from '../../../models/course-info.model'
import { courseInfoService } from '../../../services/course-info.service'
import { ECourseStatus } from '../../../shared/enums/course.enum'

class CourseController extends BaseController<CourseDocument> {
  constructor() {
    super(courseService, CourseController.name)
  }

  /**
   * @override
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  createOrUpdate = async (req: Request, res: Response, _: NextFunction): Promise<Response> => {
    let id = req.params.id.trim()
    const dataUpdate = req.body
    const lang = dataUpdate.lang.trim()

    const update: Partial<CourseInfoDocument> = dataUpdate
    update['category'] = dataUpdate['category'] ? dataUpdate['category'] : null

    let {
      gallery,
      seatTotal,
      seatOccupied,
      code,
      lectures,
      quizzes,
      duration,
      openingDate,
      seoTitle,
      seoDescription,
      seoKeywords,
      seoSchema,
      seoCanonical,
      seoRedirect,
      seoLang,
      instructor1 = null,
      instructor2 = null,
    } = dataUpdate

    // create TOC
    const dataCreate = createToc(dataUpdate.content)
    update.toc = dataCreate.html
    update.content = dataCreate.content
    update.instructor1 = instructor1 ? instructor1 : null
    update.instructor2 = instructor2 ? instructor1 : null

    gallery = [...gallery].filter((e) => (e ? true : false))

    let session = null
    try {
      session = await courseService.startTransaction()
      const signalUpdateInfo = await courseInfoService.createOrUpdate({
        queryConditions: { course: id, lang },
        data: {
          ...update,
          gallery,
          duration,
        },
      })

      if (signalUpdateInfo.error || !signalUpdateInfo.data)
        return res.status(STATUS_CODE.SERVER_ERROR).json(signalUpdateInfo)

      const courseInfo = signalUpdateInfo.data

      const courseUpdate: Partial<CourseDocument> =
        lang === ELanguage.VI
          ? {
              viSlug: courseInfo.slug,
              viName: courseInfo.name,
              viPrice: courseInfo.price,
              viOriginalPrice: courseInfo.originalPrice,
              viDuration: courseInfo.duration,
            }
          : {
              enSlug: courseInfo.slug,
              enName: courseInfo.name,
              enPrice: courseInfo.price,
              enOriginalPrice: courseInfo.originalPrice,
              enDuration: courseInfo.duration,
            }
      if (lang === ELanguage.VI) {
        courseUpdate.vi = courseInfo._id
      }

      if (lang === ELanguage.EN) {
        courseUpdate.en = courseInfo._id
      }

      courseUpdate['category'] = dataUpdate['category']
      courseUpdate['type'] = dataUpdate['type']

      const signalUpdateCourse = await courseService.createOrUpdate({
        queryConditions: { _id: id },
        data: {
          ...courseUpdate,
          seatTotal,
          seatOccupied,
          lectures,
          quizzes,
          openingDate,
          code,
        },
      })
      if (signalUpdateCourse.error)
        return res.status(STATUS_CODE.SERVER_ERROR).json(signalUpdateCourse)
      const course = signalUpdateCourse.data

      const responseJson = {
        data: { course: course, courseInfo: courseInfo },
        message: MESSAGES.CREATED_SUCCEED,
      }

      // create page type
      await pageTypeService.createOrUpdate({
        queryConditions: {
          name: PAGE_TYPE_KEYS.COURSE_DETAIL,
          slug: courseInfo.slug,
        },
        data: {
          seo: {
            seoTitle,
            seoDescription,
            seoKeywords,
            seoSchema,
            seoCanonical,
            seoRedirect,
            seoLang,
          },
        },
      })

      await session.commitTransaction()

      return res.status(STATUS_CODE.OK).json(responseJson)
    } catch (error: unknown) {
      console.log(error)
      if (session) await session.abortTransaction()

      return res.status(STATUS_CODE.SERVER_ERROR).json({
        error: true,
        message: ERROR_MESSAGES[ERROR_CODES.INTERNAL_SERVER_ERROR],
        error_code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      })
    } finally {
      if (session) await session.endSession()
    }
  }

  updateStatus = async (req: Request, res: Response, _: NextFunction) => {
    let { id, status } = req.params
    // validate status
    if (!status || !Object.values(ECourseStatus).includes(status as any))
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        error: true,
        message: ERROR_MESSAGES[ERROR_CODES.INVALID_STATUS_PARAMETER],
      })

    //update status to news category
    const signalUpdate = await courseInfoService.updateOne({
      queryConditions: { _id: id },
      data: { status: status as ECourseStatus },
    })

    if (signalUpdate.error) return res.status(STATUS_CODE.SERVER_ERROR).json(signalUpdate)

    return res.status(STATUS_CODE.OK).json(signalUpdate)
  }

  removeInfo = async (req: Request, res: Response, _: NextFunction) => {
    const { id, lang } = req.params
    const signalGetResult = await courseService.getOne({
      queryConditions: { _id: id },
    })

    if (
      !signalGetResult.data ||
      signalGetResult.error ||
      !lang ||
      !id ||
      !Object.values(ELanguage).includes(lang as any) ||
      (lang === ELanguage.VI ? !signalGetResult.data?.vi : !signalGetResult.data?.en)
    )
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        error: true,
        message: ERROR_MESSAGES[ERROR_CODES.DATA_NOT_FOUND],
      })

    const dataRemove: CourseDocument = signalGetResult.data

    if (lang === ELanguage.VI) {
      dataRemove.vi = null
      dataRemove.viName = ''
      dataRemove.viSlug = ''
    }

    if (lang === ELanguage.EN) {
      dataRemove.en = null
      dataRemove.enName = ''
      dataRemove.enSlug = ''
    }

    const removeSignals = await Promise.all([
      courseInfoService.remove(
        lang === ELanguage.VI
          ? (signalGetResult.data.vi as mongoose.Types.ObjectId)
          : (signalGetResult.data.en as mongoose.Types.ObjectId),
      ),
      courseService.updateOne({
        queryConditions: { _id: id },
        data: dataRemove,
      }),
    ])

    const signalError = removeSignals.find((e) => e.error)

    if (signalError) {
      console.log(signalError)
      return res.status(STATUS_CODE.SERVER_ERROR).json(signalError)
    }

    return res.status(STATUS_CODE.OK).json({
      data: {
        result: removeSignals[0].data,
        info: removeSignals[1].data,
      },
      message: MESSAGES.DELETE_SUCCEED,
    })
  }

  /**
   * @override
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  remove = async (req: Request, res: Response, _: NextFunction) => {
    const { id } = req.params

    const signalGetResult = await courseService.getOne({ queryConditions: { _id: id } })

    if (signalGetResult.error || !signalGetResult.data)
      return res.status(STATUS_CODE.BAD_REQUEST).json(signalGetResult)

    const result = signalGetResult.data

    const removeSignals = await Promise.all([
      newsEventsService.remove(result._id),
      ...(result.vi ? [courseInfoService.remove(result.vi as any)] : []),
      ...(result.en ? [courseInfoService.remove(result.en as any)] : []),
    ])

    const signalError = removeSignals.find((e) => e.error)
    if (signalError) return res.status(STATUS_CODE.SERVER_ERROR).json(signalError)

    const data = {
      result: removeSignals[0].data,
      InfoVi: removeSignals[1].data,
      InfoEn: removeSignals[2].data,
    }

    return res.status(STATUS_CODE.OK).json({ data, message: MESSAGES.DELETE_SUCCEED })
  }
}

export const courseController = new CourseController()
