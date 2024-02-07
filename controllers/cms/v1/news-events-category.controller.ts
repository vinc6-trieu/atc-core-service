import { NextFunction, Request, Response } from 'express'
import { newsEventsCategoryService } from '../../../services/news-events-category.service'
import { PaginationBuilder } from '../../../shared/helpers/pagination.helper'
import { newsEventsCategoryInfoService } from '../../../services/news-events-category-info.service'
import { ELanguage } from '../../../shared/enums/locale.enum'
import { LIST_STATUS_POST_CATEGORY } from '../../../constants/post-category.constant'
import { DATE_FORMAT_FN, FORMAT_ID_FN } from '../../../shared/utils/format.util'
import { ENewsEventType } from '../../../shared/enums/news-events.enum'

class NewsCategoryViewController {
  renderListNews = async (req: Request, res: Response, next: NextFunction) => {
    const { page = 1, search = '', ...filter } = req.query

    const url = req.originalUrl

    let status: number | null = null
    if (filter.status) {
      status = parseInt(`${filter.status}`)
      const signalGetListStatus = await newsEventsCategoryInfoService.getList({
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

    const signalGetList = await newsEventsCategoryService.getList({
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

    const signalGetCount = await newsEventsCategoryService.count({
      ...filter,
      ...(search ? { $text: { $search: search as string } } : {}),
      type: ENewsEventType.News,
    })

    const total = signalGetCount.data
    const pagination = PaginationBuilder(total, limit, url)

    if (signalGetList.error)
      return res.render('cms', { inc: 'error', message: signalGetList.message, error: {} })
    const categories = signalGetList.data

    const listStatus = LIST_STATUS_POST_CATEGORY.VI

    return res.render('cms', {
      inc: 'inc/cms/news-categories/list',
      title: 'Danh sách danh mục tin tức',
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

  renderListEvents = async (req: Request, res: Response, next: NextFunction) => {
    const { page = 1, search = '', ...filter } = req.query

    const url = req.originalUrl

    let status: number | null = null
    if (filter.status) {
      status = parseInt(`${filter.status}`)
      const signalGetListStatus = await newsEventsCategoryInfoService.getList({
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

    const signalGetList = await newsEventsCategoryService.getList({
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

    const signalGetCount = await newsEventsCategoryService.count({
      ...filter,
      ...(search ? { $text: { $search: search as string } } : {}),
      type: ENewsEventType.Events,
    })

    const total = signalGetCount.data
    const pagination = PaginationBuilder(total, limit, url)

    if (signalGetList.error)
      return res.render('cms', { inc: 'error', message: signalGetList.message, error: {} })
    const categories = signalGetList.data

    const listStatus = LIST_STATUS_POST_CATEGORY.VI

    return res.render('cms', {
      inc: 'inc/cms/events-categories/list',
      title: 'Danh sách danh mục bài viết',
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

  renderEditNews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params
    const lang = req.query.lang ?? ELanguage.VI

    const switchLangs = {
      vi: `/cms/news-categories/${id}?lang=${ELanguage.VI}`,
      en: `/cms/news-categories/${id}?lang=${ELanguage.EN}`,
    }

    const signalGet = await newsEventsCategoryService.getOne({
      queryConditions: { _id: id.trim() },
      populates: ['thumbnail'],
    })

    const category = signalGet?.data ?? { _id: id }

    const signalGetInfo = await newsEventsCategoryInfoService.getOne({
      queryConditions: {
        newsEventsCategory: id,
        lang,
      },
    })

    const info = signalGetInfo?.data ?? {}

    const signalGetCategories = await newsEventsCategoryService.getList({
      queryConditions: { parent: null, type: ENewsEventType.News },
    })
    if (signalGetCategories.error) return res.render('error')

    const categories = signalGetCategories.data

    return res.render('cms', {
      inc: 'inc/cms/news-categories/update',
      title: 'Chỉnh sửa danh mục',
      category: category,
      categoryInfo: info,
      lang,
      switchLangs,
      categories,
    })
  }

  renderEditEvents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params
    const lang = req.query.lang ?? ELanguage.VI

    const switchLangs = {
      vi: `/cms/events-categories/${id}?lang=${ELanguage.VI}`,
      en: `/cms/events-categories/${id}?lang=${ELanguage.EN}`,
    }

    const signalGet = await newsEventsCategoryService.getOne({
      queryConditions: { _id: id.trim() },
      populates: ['thumbnail'],
    })

    const category = signalGet?.data ?? { _id: id }

    const signalGetInfo = await newsEventsCategoryInfoService.getOne({
      queryConditions: {
        newsEventsCategory: id,
        lang,
      },
    })

    const info = signalGetInfo?.data ?? {}

    const signalGetCategories = await newsEventsCategoryService.getList({
      queryConditions: { parent: null, type: ENewsEventType.Events },
    })
    if (signalGetCategories.error) return res.render('error')

    const categories = signalGetCategories.data

    return res.render('cms', {
      inc: 'inc/cms/events-categories/update',
      title: 'Chỉnh sửa danh mục',
      category: category,
      categoryInfo: info,
      lang,
      switchLangs,
      categories,
    })
  }
}

export const newsEventsCategoryViewController = new NewsCategoryViewController()
