import { BaseController } from '../../shared/base/controller.base'
import { MESSAGES, STATUS_CODE } from '../../constants/base.constant'
import { NextFunction, Request, Response } from 'express'
import { ERROR_CODES, ERROR_MESSAGES } from '../../constants/response-message.constant'
import { ELanguage } from '../../shared/enums/locale.enum'
import mongoose from 'mongoose'
import createToc from '../../shared/helpers/create-toc'
import { newsInfoService } from '../../services/news-info.service'
import { NewsDocument } from '../../models/news.model'
import { NewsInfoDocument } from '../../models/news-info.model'
import { newsService } from '../../services/news.service'
import { ENewsStatus } from '../../shared/enums/news.enum'
import { pageTypeService } from '../../services/page-type.service'
import { PAGE_TYPE_KEYS } from '../../constants/page-type.constant'

class NewsController extends BaseController<NewsDocument> {
  constructor() {
    super(newsService, NewsController.name)
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

    const update: Partial<NewsInfoDocument> = dataUpdate
    update['category'] = dataUpdate['category'] ? dataUpdate['category'] : null

    const { seoTitle, seoDescription, seoKeywords, seoSchema, seoCanonical, seoRedirect, seoLang } =
      dataUpdate

    // create TOC
    const dataCreate = createToc(dataUpdate.content)
    update.toc = dataCreate.html
    update.content = dataCreate.content

    let session = null
    try {
      session = await newsService.startTransaction()
      const signalUpdateNewsInfo = await newsInfoService.createOrUpdate({
        queryConditions: { news: id, lang },
        data: update,
      })

      if (signalUpdateNewsInfo.error || !signalUpdateNewsInfo.data)
        return res.status(STATUS_CODE.SERVER_ERROR).json(signalUpdateNewsInfo)

      const newsInfo = signalUpdateNewsInfo.data

      const newsUpdate: Partial<NewsDocument> =
        lang === ELanguage.VI
          ? { viSlug: newsInfo.slug, viName: newsInfo.name }
          : { enSlug: newsInfo.slug, enName: newsInfo.name }

      if (lang === ELanguage.VI) {
        newsUpdate.vi = newsInfo._id
      }

      if (lang === ELanguage.EN) {
        newsUpdate.en = newsInfo._id
      }

      newsUpdate['category'] = dataUpdate['category']

      const signalUpdateNews = await newsService.createOrUpdate({
        queryConditions: { _id: id },
        data: newsUpdate,
      })
      if (signalUpdateNews.error) return res.status(STATUS_CODE.SERVER_ERROR).json(signalUpdateNews)
      const news = signalUpdateNews.data

      const responseJson = {
        data: { news, newsInfo: newsInfo },
        message: MESSAGES.CREATED_SUCCEED,
      }

      // create page type
      await pageTypeService.createOrUpdate({
        queryConditions: {
          name: PAGE_TYPE_KEYS.NEWS,
          slug: newsInfo.slug,
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

    const signalGetNews = await newsService.getOne({ queryConditions: { _id: id } })

    const news = signalGetNews.data

    if (!news) return res.status(400).json(signalGetNews)

    const result = await Promise.all([
      newsService.updateOne({
        queryConditions: { _id: id },
        data: {
          viName: name,
          viSlug: slug,
          createdAt,
        },
      }),
      newsInfoService.updateOne({
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

  updateNewsStatus = async (req: Request, res: Response, _: NextFunction) => {
    let { id, status } = req.params
    // validate status
    if ([-1, 0, 1, 2].indexOf(parseInt(status)) < 0)
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        error: true,
        message: ERROR_MESSAGES[ERROR_CODES.INVALID_STATUS_PARAMETER],
      })

    //update status to news category
    const signalUpdate = await newsInfoService.updateOne({
      queryConditions: { _id: id },
      data: { status: ENewsStatus.PublicIndex },
    })

    if (signalUpdate.error) return res.status(STATUS_CODE.SERVER_ERROR).json(signalUpdate)

    return res.status(STATUS_CODE.OK).json(signalUpdate)
  }

  removeInfo = async (req: Request, res: Response, _: NextFunction) => {
    const { id, lang } = req.params
    const signalGetResult = await newsService.getOne({
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

    const dataRemove: NewsDocument = signalGetResult.data

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
      newsInfoService.remove(
        lang === ELanguage.VI
          ? (signalGetResult.data.vi as mongoose.Types.ObjectId)
          : (signalGetResult.data.en as mongoose.Types.ObjectId),
      ),
      newsService.updateOne({
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

    const signalGetResult = await newsService.getOne({ queryConditions: { _id: id } })

    if (signalGetResult.error || !signalGetResult.data)
      return res.status(STATUS_CODE.BAD_REQUEST).json(signalGetResult)

    const result = signalGetResult.data

    const removeSignals = await Promise.all([
      newsService.remove(result._id),
      ...(result.vi ? [newsInfoService.remove(result.vi as any)] : []),
      ...(result.en ? [newsInfoService.remove(result.en as any)] : []),
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

export const newsController = new NewsController()
