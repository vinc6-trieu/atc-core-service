import mongoose, { Document, Schema } from 'mongoose'
import { ImageDocument } from './image.model'
import { NewsEventsCategoryDocument } from './news-events-category.model'
import { ELanguage } from '../shared/enums/locale.enum'
import { ENewsEventType, ENewsEventsStatus } from '../shared/enums/news-events.enum'
import { TagDocument } from './tag.model'

export interface NewsEventsInfoDocument extends Document {
  name?: string
  content?: string
  summary?: string
  thumbnail?: mongoose.Types.ObjectId | null | ImageDocument
  gallery?: [mongoose.Types.ObjectId | ImageDocument]
  description?: string
  type?: ENewsEventType
  status?: ENewsEventsStatus
  slug?: string
  lang?: ELanguage
  views?: number
  category?: mongoose.Types.ObjectId | null | NewsEventsCategoryDocument
  news_events?: mongoose.Types.ObjectId
  tags?: [mongoose.Types.ObjectId | null | TagDocument]
  author?: string
  toc?: string

  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
  seoSchema?: string
  seoCanonical?: string
  seoRedirect?: string
  seoLang?: string

  createdBy?: mongoose.Types.ObjectId
  publishedDate?: Date

  createdAt?: Date
  modifiedAt?: Date
}

const newsEventsInfoSchema = new Schema<NewsEventsInfoDocument>(
  {
    name: { type: String, required: false, trim: true },
    content: { type: String, required: false, trim: true },
    summary: { type: String, required: false, trim: true },
    thumbnail: { type: mongoose.Types.ObjectId, ref: 'image', required: true },
    gallery: [{ type: mongoose.Types.ObjectId, ref: 'image', required: false }],
    description: { type: String, required: false, trim: true },
    status: { type: String, enum: ENewsEventsStatus, default: ENewsEventsStatus.Draft },
    slug: { type: String, required: false, index: { unique: true } },
    lang: { type: String, enum: ELanguage },
    type: { type: String, enum: ENewsEventType, default: ENewsEventType.News },

    views: { type: Number, required: false, default: 0 },
    toc: { type: String },
    category: { type: mongoose.Types.ObjectId, ref: 'news_events_category' },
    news_events: { type: mongoose.Types.ObjectId, ref: 'news_events' },
    tags: [{ type: mongoose.Types.ObjectId, ref: 'tag' }],
    author: { type: String, required: false, trim: true },

    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true },
    seoKeywords: { type: String, trim: true },
    seoSchema: { type: String, trim: true },
    seoCanonical: { type: String, required: false },
    seoRedirect: { type: String, required: false },
    seoLang: { type: String, required: false },

    createdBy: { type: mongoose.Types.ObjectId, ref: 'admin' },

    publishedDate: { type: Date, required: false, default: new Date() },
    createdAt: { type: Date, required: false, default: new Date() },
    modifiedAt: { type: Date, required: false, default: new Date() },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
)

newsEventsInfoSchema.index({
  name: 'text',
  description: 'text',
  slug: 'text',
  content: 'text',
})

const NEWS_EVENTS_INFO_MODEL = mongoose.model<NewsEventsInfoDocument>(
  'news_events_info',
  newsEventsInfoSchema,
)

export default NEWS_EVENTS_INFO_MODEL
