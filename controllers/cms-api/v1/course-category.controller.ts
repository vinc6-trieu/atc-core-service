import { BaseController } from '../../../shared/base/controller.base'
import {
  CourseCategoryDocument,
  CourseCategoryLanguages,
} from '../../../models/course-category.model'
import { courseCategoryService } from '../../../services/course-category.service'
import { courseCategoryInfoService } from '../../../services/course-category-info.service'
import { NextFunction, Request, Response } from 'express'
import { MESSAGES, STATUS_CODE } from '../../../constants/base.constant'
import { ELanguage } from '../../../shared/enums/locale.enum'
import { ERROR_CODES, ERROR_MESSAGES } from '../../../constants/response-message.constant'
import mongoose from 'mongoose'

class CourseCategoryController extends BaseController<CourseCategoryDocument> {
  constructor() {
    super(courseCategoryService, CourseCategoryController.name)
  }

  /**
   * @override
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  createOrUpdate = async (req: Request, res: Response, _: NextFunction) => {
    let id = req.params.id.trim()
    const dataUpdate = req.body
    const lang = dataUpdate.lang.trim()

    const signalUpdateInfo = await courseCategoryInfoService.createOrUpdate({
      queryConditions: { newsEventsCategory: id, lang },
      data: dataUpdate,
    })
    if (!signalUpdateInfo.data) return res.status(STATUS_CODE.SERVER_ERROR).json(signalUpdateInfo)

    const info = signalUpdateInfo.data

    const update: Partial<CourseCategoryLanguages> = UPDATE_NAME_SLUG_BY_LANG({
      name: info.name,
      lang,
      slug: info.slug,
    })

    if (lang === ELanguage.EN) update.en = info._id
    if (lang === ELanguage.VI) update.vi = info._id

    update.parent = dataUpdate?.parent || null
    update.thumbnail = dataUpdate.thumbnail

    const signalUpdate = await courseCategoryService.createOrUpdate({
      queryConditions: { _id: id },
      data: update,
    })
    if (signalUpdate.error) return res.status(STATUS_CODE.SERVER_ERROR).json(signalUpdate)
    let newsEventsCategory = signalUpdate.data

    const responseJson = {
      data: { newsEventsCategory, info },
      message: MESSAGES.CREATED_SUCCEED,
    }
    return res.status(STATUS_CODE.OK).json(responseJson)
  }

  updateCategoryStatus = async (req: Request, res: Response, _: NextFunction) => {
    let { id, status } = req.params

    // validate status
    if ([0, 1, 2].indexOf(parseInt(status)) < 0)
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        error: true,
        message: ERROR_MESSAGES[ERROR_CODES.INVALID_STATUS_PARAMETER],
      })

    //update status to news category
    const signalUpdate = await courseCategoryInfoService.updateOne({
      queryConditions: { _id: id },
      data: { status: +status },
    })

    if (signalUpdate.error) return res.status(STATUS_CODE.SERVER_ERROR).json(signalUpdate)

    return res.status(STATUS_CODE.OK).json(signalUpdate)
  }

  removeInfo = async (req: Request, res: Response, _: NextFunction) => {
    const { id, lang } = req.params
    const signalGetResult = await courseCategoryService.getOne({
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

    const dataRemove: CourseCategoryDocument = signalGetResult.data

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
      courseCategoryInfoService.remove(
        lang === ELanguage.VI
          ? (signalGetResult.data.vi as mongoose.Types.ObjectId)
          : (signalGetResult.data.en as mongoose.Types.ObjectId),
      ),
      courseCategoryService.updateOne({
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

    const signalGetResult = await courseCategoryService.getOne({ queryConditions: { _id: id } })

    if (signalGetResult.error || !signalGetResult.data)
      return res.status(STATUS_CODE.BAD_REQUEST).json(signalGetResult)

    const result = signalGetResult.data

    const removeSignals = await Promise.all([
      courseCategoryService.remove(result._id),
      ...(result.vi ? [courseCategoryInfoService.remove(result.vi as any)] : []),
      ...(result.en ? [courseCategoryInfoService.remove(result.en as any)] : []),
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

function UPDATE_NAME_SLUG_BY_LANG({ dataUpdate = {}, lang = 'vi', name = '', slug = '' }) {
  const update =
    lang === ELanguage.VI ? { viSlug: slug, viName: name } : { enSlug: slug, enName: name }
  return { ...dataUpdate, ...update }
}

export const courseCategoryController = new CourseCategoryController()
