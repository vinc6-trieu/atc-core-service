import { NextFunction, Request, Response } from 'express'
import { newsEventsService } from '../../../services/news-events.service'
import { PaginationBuilder } from '../../../shared/helpers/pagination.helper'
import { newsEventsInfoService } from '../../../services/news-events-info.service'
import { ELanguage } from '../../../shared/enums/locale.enum'
import { LIST_STATUS_POST } from '../../../constants/post.constant'
import { FORMAT_ID_FN, DATE_FORMAT_FN } from '../../../shared/utils/format.util'
import { newsEventsCategoryService } from '../../../services/news-events-category.service'
import { ENewsEventType, ENewsEventsStatus } from '../../../shared/enums/news-events.enum'

class NewsEventsViewController {
  renderListNews = async (req: Request, res: Response, next: NextFunction) => {
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
      const signalGetListStatus = await newsEventsInfoService.getList({
        queryConditions: { status, type: ENewsEventType.News },
        cacheOptions: {
          ttl: 30,
        },
      })

      if (signalGetListStatus.data) {
        const listArticleIds = signalGetListStatus.data.map((item: any) => item._id)
        if (listArticleIds.length > 0) {
          filter['$or'] = [
            {
              vi: { $in: listArticleIds },
              en: { $in: listArticleIds },
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

    const signalGetList = await newsEventsService.getList({
      skip,
      limit,
      queryConditions: {
        ...filter,
        ...(search ? { $text: { $search: search as string } } : {}),
        type: ENewsEventType.News,
      },
      populates: ['vi', 'en'],
      sort: {
        modifiedAt: -1,
        createdAt: -1,
      },
    })

    const signalGetCount = await newsEventsService.count({
      ...filter,
      ...(search ? { $text: { $search: search as string } } : {}),
      type: ENewsEventType.News,
    })

    const total = signalGetCount.data
    const pagination = PaginationBuilder(total, limit, url)

    if (signalGetList.error)
      return res.render('cms', { inc: 'error', message: signalGetList.message, error: {} })
    const news = signalGetList.data

    // listCategories
    const signalGetListCate = await newsEventsCategoryService.getList({
      queryConditions: {
        type: ENewsEventType.News,
      },
      sort: { createdAt: -1 },
    })

    let listCategories = signalGetListCate.data ?? []

    const listStatus = LIST_STATUS_POST.VI

    return res.render('cms', {
      inc: 'inc/cms/news/list',
      title: 'Danh sách tin tức',
      news,
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

  renderListEvents = async (req: Request, res: Response, next: NextFunction) => {
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
      const signalGetListStatus = await newsEventsInfoService.getList({
        queryConditions: { status, type: ENewsEventType.Events },
        cacheOptions: {
          ttl: 30,
        },
      })

      if (signalGetListStatus.data) {
        const listArticleIds = signalGetListStatus.data.map((item: any) => item._id)
        if (listArticleIds.length > 0) {
          filter['$or'] = [
            {
              vi: { $in: listArticleIds },
              en: { $in: listArticleIds },
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

    const signalGetList = await newsEventsService.getList({
      skip,
      limit,
      queryConditions: {
        ...filter,
        ...(search ? { $text: { $search: search as string } } : {}),
        type: ENewsEventType.Events,
      },
      populates: ['vi', 'en'],
      sort: {
        modifiedAt: -1,
        createdAt: -1,
      },
    })

    const signalGetCount = await newsEventsService.count({
      ...filter,
      ...(search ? { $text: { $search: search as string } } : {}),
      type: ENewsEventType.Events,
    })

    const total = signalGetCount.data
    const pagination = PaginationBuilder(total, limit, url)

    if (signalGetList.error)
      return res.render('cms', { inc: 'error', message: signalGetList.message, error: {} })
    const events = signalGetList.data

    // listCategories
    const signalGetListCate = await newsEventsCategoryService.getList({
      queryConditions: { type: ENewsEventType.Events },
      sort: { createdAt: -1 },
    })

    let listCategories = signalGetListCate.data ?? []

    const listStatus = LIST_STATUS_POST.VI

    return res.render('cms', {
      inc: 'inc/cms/events/list',
      title: 'Danh sách sự kiện',
      events,
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

  renderEditNews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params
    const lang = req.query.lang ?? ELanguage.VI

    const switchLangs = {
      vi: `/cms/news/${id}?lang=${ELanguage.VI}`,
      en: `/cms/news/${id}?lang=${ELanguage.EN}`,
    }

    const signalGet = await newsEventsService.getOne({
      queryConditions: { _id: id.trim() },
    })

    const news = signalGet?.data ?? { _id: id }

    const signalGetInfo = await newsEventsInfoService.getOne({
      queryConditions: {
        news_events: news._id,
        lang,
      },
      populates: ['thumbnail'],
    })

    const info = signalGetInfo?.data ?? {}

    const signalGetCategories = await newsEventsCategoryService.getList({
      queryConditions: { parent: null, type: ENewsEventType.News },
    })

    if (signalGetCategories.error) return res.render('error')

    const categories = signalGetCategories.data

    return res.render('cms', {
      inc: 'inc/cms/news/update',
      title: 'Chỉnh sửa bài viết',
      news,
      newsInfo: info,
      lang,
      switchLangs,
      categories,
    })
  }

  renderEditEvents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params
    const lang = req.query.lang ?? ELanguage.VI

    const switchLangs = {
      vi: `/cms/news/${id}?lang=${ELanguage.VI}`,
      en: `/cms/news/${id}?lang=${ELanguage.EN}`,
    }

    const signalGet = await newsEventsService.getOne({
      queryConditions: { _id: id.trim() },
    })

    const events = signalGet?.data ?? { _id: id }

    const signalGetInfo = await newsEventsInfoService.getOne({
      queryConditions: {
        news_events: events._id,
        lang,
      },
      populates: ['thumbnail'],
    })

    const info = signalGetInfo?.data ?? {}

    const signalGetCategories = await newsEventsCategoryService.getList({
      queryConditions: { parent: null, type: ENewsEventType.Events },
    })
    if (signalGetCategories.error) return res.render('error')

    const categories = signalGetCategories.data

    return res.render('cms', {
      inc: 'inc/cms/events/update',
      title: 'Chỉnh sửa sự kiện',
      events,
      eventsInfo: info,
      lang,
      switchLangs,
      categories,
    })
  }
}

export const newsEventsViewController = new NewsEventsViewController()
