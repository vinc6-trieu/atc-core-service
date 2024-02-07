import { BaseController } from '../../../shared/base/controller.base'
import { MESSAGES, STATUS_CODE } from '../../../constants/base.constant'
import { NextFunction, Request, Response } from 'express'
import { ERROR_CODES, ERROR_MESSAGES } from '../../../constants/response-message.constant'
import { ELanguage } from '../../../shared/enums/locale.enum'
import mongoose from 'mongoose'
import { InstructorDocument, InstructorLanguages } from '../../../models/instructor.model'
import { instructorService } from '../../../services/instructor.service'
import { instructorInfoService } from '../../../services/instructor-info.service'

class InstructorController extends BaseController<InstructorDocument> {
  constructor() {
    super(instructorService, InstructorController.name)
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

    const signalUpdateInfo = await instructorInfoService.createOrUpdate({
      queryConditions: { instructor: id, lang },
      data: dataUpdate,
    })
    if (!signalUpdateInfo.data) return res.status(STATUS_CODE.SERVER_ERROR).json(signalUpdateInfo)

    const info = signalUpdateInfo.data

    const update: Partial<InstructorLanguages> =
      lang === ELanguage.VI
        ? {
            vi: info._id,
            viSlug: info.slug,
            viName: info.name,
            viIntroduce: info.introduce,
            viTitle: info.title,
          }
        : {
            en: info._id,
            enSlug: info.slug,
            enName: info.name,
            enIntroduce: info.introduce,
            enTitle: info.title,
          }

    const signalUpdate = await instructorService.createOrUpdate({
      queryConditions: { _id: id },
      data: { ...update, phone: dataUpdate.phone, email: dataUpdate.email },
    })
    if (signalUpdate.error) return res.status(STATUS_CODE.SERVER_ERROR).json(signalUpdate)
    let instructor = signalUpdate.data

    const responseJson = {
      data: { instructor, info },
      message: MESSAGES.CREATED_SUCCEED,
    }
    return res.status(STATUS_CODE.OK).json(responseJson)
  }

  removeInfo = async (req: Request, res: Response, _: NextFunction) => {
    const { id, lang } = req.params
    const signalGetResult = await instructorService.getOne({
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

    const dataRemove: InstructorDocument = signalGetResult.data

    if (lang === ELanguage.VI) {
      dataRemove.vi = null
      dataRemove.viName = ''
      dataRemove.viSlug = ''
      dataRemove.viTitle = ''
      dataRemove.viIntroduce = ''
    }

    if (lang === ELanguage.EN) {
      dataRemove.en = null
      dataRemove.enName = ''
      dataRemove.enSlug = ''
      dataRemove.enIntroduce = ''
      dataRemove.enTitle = ''
    }

    const removeSignals = await Promise.all([
      instructorInfoService.remove(
        lang === ELanguage.VI
          ? (signalGetResult.data.vi as mongoose.Types.ObjectId)
          : (signalGetResult.data.en as mongoose.Types.ObjectId),
      ),
      instructorService.updateOne({
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

    const signalGetResult = await instructorService.getOne({ queryConditions: { _id: id } })

    if (signalGetResult.error || !signalGetResult.data)
      return res.status(STATUS_CODE.BAD_REQUEST).json(signalGetResult)

    const result = signalGetResult.data

    const removeSignals = await Promise.all([
      instructorService.remove(result._id),
      ...(result.vi ? [instructorInfoService.remove(result.vi as any)] : []),
      ...(result.en ? [instructorInfoService.remove(result.en as any)] : []),
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

export const instructorController = new InstructorController()
