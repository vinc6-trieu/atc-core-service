import mongoose, { Document, Schema } from 'mongoose'
import { ImageDocument } from './image.model'
import { NewsEventsInfoDocument } from './news-events-info.model'
import { ENewsEventType } from '../shared/enums/news-events.enum'

export type NewsEventsEn = {
  en: mongoose.Types.ObjectId | null | NewsEventsInfoDocument
  enName: string
  enSlug: string
}

export type NewsEventsVi = {
  vi: mongoose.Types.ObjectId | null | NewsEventsInfoDocument
  viName: string
  viSlug: string
}

export type NewsEventsLanguages = {
  parent?: mongoose.Types.ObjectId | null | NewsEventsDocument
  thumbnail?: mongoose.Types.ObjectId | null | ImageDocument
} & NewsEventsVi &
  NewsEventsEn

export type NewsEvents = {
  thumbnail?: mongoose.Types.ObjectId | null | ImageDocument
  parent?: mongoose.Types.ObjectId | null | NewsEventsDocument
  category?: mongoose.Types.ObjectId | null | NewsEventsDocument
  oldCategories?: string[]
  id?: string
  type?: ENewsEventType
  createdAt: Date
  modifiedAt: Date
} & NewsEventsVi &
  NewsEventsEn

export type NewsEventsDocument = NewsEvents & Document

const newsEventsSchema = new Schema<NewsEventsDocument>(
  {
    vi: { type: mongoose.Types.ObjectId, ref: 'news_events_info' },
    viName: { type: String },
    viSlug: { type: String },
    thumbnail: { type: mongoose.Types.ObjectId, ref: 'image' },
    type: { type: String, enum: ENewsEventType, default: ENewsEventType.News },
    en: { type: mongoose.Types.ObjectId, ref: 'news_events_info' },
    parent: { type: mongoose.Types.ObjectId, ref: 'news_events_category', default: null },
    enName: { type: String },
    enSlug: { type: String },
    createdAt: { type: Date, default: new Date() },
    modifiedAt: { type: Date, default: new Date() },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
)

newsEventsSchema.index({
  viName: 'text',
  viSlug: 'text',
  enName: 'text',
  enSlug: 'text',
})

const NEWS_EVENTS_MODEL = mongoose.model<NewsEventsDocument>('news_events', newsEventsSchema)

export default NEWS_EVENTS_MODEL
