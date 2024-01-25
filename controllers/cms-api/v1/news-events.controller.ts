import { BaseController } from '../../../shared/base/controller.base'
import { MESSAGES, STATUS_CODE } from '../../../constants/base.constant'
import { NextFunction, Request, Response } from 'express'
import { ERROR_CODES, ERROR_MESSAGES } from '../../../constants/response-message.constant'
import { ELanguage } from '../../../shared/enums/locale.enum'
import mongoose from 'mongoose'
import createToc from '../../../shared/helpers/create-toc'
import { newsEventsInfoService } from '../../../services/news-events-info.service'
import { NewsEventsDocument } from '../../../models/news-events.model'
import { NewsEventsInfoDocument } from '../../../models/news-events-info.model'
import { newsEventsService } from '../../../services/news-events.service'
import { ENewsEventsStatus } from '../../../shared/enums/news-events.enum'
import { pageTypeService } from '../../../services/page-type.service'
import { PAGE_TYPE_KEYS } from '../../../constants/page-type.constant'

class NewsEventsController extends BaseController<NewsEventsDocument> {
  constructor() {
    super(newsEventsService, NewsEventsController.name)
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

    const update: Partial<NewsEventsInfoDocument> = dataUpdate
    update['category'] = dataUpdate['category'] ? dataUpdate['category'] : null

    console.log({ update })
    const { seoTitle, seoDescription, seoKeywords, seoSchema, seoCanonical, seoRedirect, seoLang } =
      dataUpdate

    // create TOC
    const dataCreate = createToc(dataUpdate.content)
    update.toc = dataCreate.html
    update.content = dataCreate.content

    let session = null
    try {
      session = await newsEventsService.startTransaction()
      const signalUpdateNewsEventsInfo = await newsEventsInfoService.createOrUpdate({
        queryConditions: { news_events: id, lang },
        data: update,
      })

      if (signalUpdateNewsEventsInfo.error || !signalUpdateNewsEventsInfo.data)
        return res.status(STATUS_CODE.SERVER_ERROR).json(signalUpdateNewsEventsInfo)

      const newsEventsInfo = signalUpdateNewsEventsInfo.data

      const newsEventsUpdate: Partial<NewsEventsDocument> =
        lang === ELanguage.VI
          ? { viSlug: newsEventsInfo.slug, viName: newsEventsInfo.name }
          : { enSlug: newsEventsInfo.slug, enName: newsEventsInfo.name }

      if (lang === ELanguage.VI) {
        newsEventsUpdate.vi = newsEventsInfo._id
      }

      if (lang === ELanguage.EN) {
        newsEventsUpdate.en = newsEventsInfo._id
      }

      newsEventsUpdate['category'] = dataUpdate['category']
      newsEventsUpdate['type'] = dataUpdate['type']

      const signalUpdateNewsEvents = await newsEventsService.createOrUpdate({
        queryConditions: { _id: id },
        data: newsEventsUpdate,
      })
      if (signalUpdateNewsEvents.error)
        return res.status(STATUS_CODE.SERVER_ERROR).json(signalUpdateNewsEvents)
      const news_events = signalUpdateNewsEvents.data

      const responseJson = {
        data: { news_events, newsEventsInfo: newsEventsInfo },
        message: MESSAGES.CREATED_SUCCEED,
      }

      // create page type
      await pageTypeService.createOrUpdate({
        queryConditions: {
          name: PAGE_TYPE_KEYS.NEWS_EVENTS,
          slug: newsEventsInfo.slug,
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

  quickUpdate = async (req: Request, res: Response, _: NextFunction) => {
    const { id } = req.params
    const { name, slug, createdAt, seoTitle, seoDescription } = req.body

    const signalGetNews = await newsEventsService.getOne({ queryConditions: { _id: id } })

    const news = signalGetNews.data

    if (!news) return res.status(400).json(signalGetNews)

    const result = await Promise.all([
      newsEventsService.updateOne({
        queryConditions: { _id: id },
        data: {
          viName: name,
          viSlug: slug,
          createdAt,
        },
      }),
      newsEventsInfoService.updateOne({
        queryConditions: {
          _id: news.vi,
        },
        data: {
          name,
          slug,
          createdAt,
          seoDescription,
          seoTitle,
        },
      }),
    ])

    return res.status(result[0]?.error ? STATUS_CODE.BAD_REQUEST : STATUS_CODE.OK).json(result[0])
  }

  updatENewsEventsStatus = async (req: Request, res: Response, _: NextFunction) => {
    let { id, status } = req.params
    // validate status
    if (!status || !Object.values(ENewsEventsStatus).includes(status as any))
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        error: true,
        message: ERROR_MESSAGES[ERROR_CODES.INVALID_STATUS_PARAMETER],
      })

    //update status to news category
    const signalUpdate = await newsEventsInfoService.updateOne({
      queryConditions: { _id: id },
      data: { status: status as ENewsEventsStatus },
    })

    if (signalUpdate.error) return res.status(STATUS_CODE.SERVER_ERROR).json(signalUpdate)

    return res.status(STATUS_CODE.OK).json(signalUpdate)
  }

  removeInfo = async (req: Request, res: Response, _: NextFunction) => {
    const { id, lang } = req.params
    const signalGetResult = await newsEventsService.getOne({
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

    const dataRemove: NewsEventsDocument = signalGetResult.data

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
      newsEventsInfoService.remove(
        lang === ELanguage.VI
          ? (signalGetResult.data.vi as mongoose.Types.ObjectId)
          : (signalGetResult.data.en as mongoose.Types.ObjectId),
      ),
      newsEventsService.updateOne({
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

    const signalGetResult = await newsEventsService.getOne({ queryConditions: { _id: id } })

    if (signalGetResult.error || !signalGetResult.data)
      return res.status(STATUS_CODE.BAD_REQUEST).json(signalGetResult)

    const result = signalGetResult.data

    const removeSignals = await Promise.all([
      newsEventsService.remove(result._id),
      ...(result.vi ? [newsEventsInfoService.remove(result.vi as any)] : []),
      ...(result.en ? [newsEventsInfoService.remove(result.en as any)] : []),
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

export const newsEventsController = new NewsEventsController()
