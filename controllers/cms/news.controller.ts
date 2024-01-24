import { NextFunction, Request, Response } from 'express'
import { newsService } from '../../services/news.service'
import { PaginationBuilder } from '../../shared/helpers/pagination.helper'
import { newsInfoService } from '../../services/news-info.service'
import { ELanguage } from '../../shared/enums/locale.enum'
import { LIST_STATUS_POST } from '../../constants/post.constant'
import { FORMAT_ID_FN, DATE_FORMAT_FN } from '../../shared/utils/format.util'
import { newsCategoryService } from '../../services/news-category.service'

class NewsViewController {
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
      const signalGetListStatus = await newsInfoService.getList({
        queryConditions: { status },
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

    const signalGetList = await newsService.getList({
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

    const signalGetCount = await newsService.count({
      ...filter,
      ...(search ? { $text: { $search: search as string } } : {}),
    })

    const total = signalGetCount.data
    const pagination = PaginationBuilder(total, limit, url)

    if (signalGetList.error)
      return res.render('cms', { inc: 'error', message: signalGetList.message, error: {} })
    const news = signalGetList.data

    // listCategories
    const signalGetListCate = await newsCategoryService.getList({
      sort: { createdAt: -1 },
    })

    let listCategories = signalGetListCate.data ?? []

    const listStatus = LIST_STATUS_POST.VI

    return res.render('cms', {
      inc: 'inc/cms/news/list',
      title: 'Danh sách bài viết',
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

  renderEdit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params
    const lang = req.query.lang ?? ELanguage.VI

    const switchLangs = {
      vi: `/cms/news/${id}?lang=${ELanguage.VI}`,
      en: `/cms/news/${id}?lang=${ELanguage.EN}`,
    }

    const signalGet = await newsService.getOne({
      queryConditions: { _id: id.trim() },
      populates: ['thumbnail'],
    })

    const news = signalGet?.data ?? { _id: id }

    const signalGetInfo = await newsInfoService.getOne({
      queryConditions: {
        news: news._id,
        lang,
      },
      populates: ['thumbnail', 'gallery'],
    })

    const info = signalGetInfo?.data ?? {}

    const signalGetCategories = await newsCategoryService.getList({
      queryConditions: { parent: null },
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
}

export const newsViewController = new NewsViewController()
