import mongoose, { Document, Schema } from 'mongoose'
import { ImageDocument } from './image.model'
import { NewsEventsCategoryInfoDocument } from './news-events-category-info.model'
import { ENewsEventType } from '../shared/enums/news-events.enum'

export type NewsEventsCategoryEn = {
  en: mongoose.Types.ObjectId | null | NewsEventsCategoryInfoDocument
  enName: string
  enSlug: string
}

export type NewsEventsCategoryVi = {
  vi: mongoose.Types.ObjectId | null | NewsEventsCategoryInfoDocument
  viName: string
  viSlug: string
}

export type NewsEventsCategoryLanguages = {
  parent: mongoose.Types.ObjectId | null | NewsEventsCategoryDocument
  thumbnail?: mongoose.Types.ObjectId | null | ImageDocument
} & NewsEventsCategoryVi &
  NewsEventsCategoryEn

export type NewsEventsCategory = {
  thumbnail?: mongoose.Types.ObjectId | null | ImageDocument
  parent?: mongoose.Types.ObjectId | null | NewsEventsCategoryDocument
  createdAt: Date
  type?: ENewsEventType
  modifiedAt: Date
} & NewsEventsCategoryVi &
  NewsEventsCategoryEn

export type NewsEventsCategoryDocument = NewsEventsCategory & Document

const newsEventsCategorySchema = new Schema<NewsEventsCategoryDocument>(
  {
    vi: { type: mongoose.Types.ObjectId, ref: 'news_events_category_info' },
    viName: { type: String },
    viSlug: { type: String },
    type: { type: String, enum: ENewsEventType, default: ENewsEventType.News },
    thumbnail: { type: mongoose.Types.ObjectId, ref: 'image' },
    en: { type: mongoose.Types.ObjectId, ref: 'news_events_category_info' },
    parent: { type: mongoose.Types.ObjectId, ref: 'news_events_category', default: null },
    enName: { type: String },
    enSlug: { type: String },
    createdAt: { type: Date, default: new Date() },
    modifiedAt: { type: Date, default: new Date() },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
)

newsEventsCategorySchema.index({
  viName: 'text',
  viSlug: 'text',
  enName: 'text',
  enSlug: 'text',
})

const NEWS_EVENTS_CATEGORY_MODEL = mongoose.model<NewsEventsCategoryDocument>(
  'news_events_category',
  newsEventsCategorySchema,
)

export default NEWS_EVENTS_CATEGORY_MODEL
