import mongoose, { Document, Schema } from 'mongoose'
import { ENewsEventType } from '../shared/enums/news-events.enum'
import { ELanguage } from '../shared/enums/locale.enum'
import { NewsEventsCategoryDocument } from './news-events-category.model'
import { ImageDocument } from './image.model'

export interface NewsEventsCategoryInfoDocument extends Document {
  name: string
  status: number
  description: string
  type?: ENewsEventType
  lang?: ELanguage
  slug?: string
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
  thumbnail?: mongoose.Types.ObjectId | null | ImageDocument
  seoSchema?: string
  seoCanonical?: string
  seoRedirect?: string
  seoLang?: string
  content?: string
  newsEventsCategory?: mongoose.Types.ObjectId | null | NewsEventsCategoryDocument
  createdAt: Date
  modifiedAt: Date
}

const newsCategoryInfoSchema = new Schema<NewsEventsCategoryInfoDocument>(
  {
    name: String,
    status: { type: Number, default: 0, required: true },
    description: String,
    lang: { type: String, enum: ELanguage },
    type: { type: String, enum: ENewsEventType, default: ENewsEventType.News },
    slug: { type: String, required: false, trim: true },
    content: { type: String, required: false, trim: true },
    newsEventsCategory: { type: mongoose.Types.ObjectId, ref: 'news_events_category' },
    thumbnail: { type: mongoose.Types.ObjectId, ref: 'image' },
    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true },
    seoKeywords: { type: String, trim: true },
    seoSchema: { type: String, trim: true },
    seoCanonical: { type: String, required: false },
    seoRedirect: { type: String, required: false },
    seoLang: { type: String, required: false },

    createdAt: { type: Date, default: new Date() },
    modifiedAt: { type: Date, default: new Date() },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
)

newsCategoryInfoSchema.index({
  name: 'text',
  description: 'text',
  slug: 'text',
  content: 'text',
})

const NEWS_CATEGORY_INFO_MODEL = mongoose.model<NewsEventsCategoryInfoDocument>(
  'news_events_category_info',
  newsCategoryInfoSchema,
)

export default NEWS_CATEGORY_INFO_MODEL
