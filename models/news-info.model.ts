import mongoose, { Document, Schema } from 'mongoose'
import { ImageDocument } from './image.model'
import { NewsCategoryDocument } from './news-category.model'
import { ELanguage } from '../shared/enums/locale.enum'
import { ENewsStatus } from '../shared/enums/news.enum'
import { TagDocument } from './tag.model'

export interface NewsInfoDocument extends Document {
  name?: string
  content?: string
  summary?: string
  thumbnail?: mongoose.Types.ObjectId | null | ImageDocument
  gallery?: [mongoose.Types.ObjectId | ImageDocument]
  description?: string
  status?: ENewsStatus
  slug?: string
  lang?: ELanguage
  views?: number
  category?: mongoose.Types.ObjectId | null | NewsCategoryDocument
  news?: mongoose.Types.ObjectId
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

const newsInfoSchema = new Schema<NewsInfoDocument>(
  {
    name: { type: String, required: false, trim: true },
    content: { type: String, required: false, trim: true },
    summary: { type: String, required: false, trim: true },
    thumbnail: { type: mongoose.Types.ObjectId, ref: 'image', required: true },
    gallery: [{ type: mongoose.Types.ObjectId, ref: 'image', required: false }],
    description: { type: String, required: false, trim: true },
    status: { type: String, enum: ENewsStatus, default: ENewsStatus.Draft },
    slug: { type: String, required: false, index: { unique: true } },
    lang: { type: String, enum: ELanguage },

    views: { type: Number, required: false, default: 0 },
    toc: { type: String },
    category: { type: mongoose.Types.ObjectId, ref: 'news_category' },
    news: { type: mongoose.Types.ObjectId, ref: 'news' },
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

newsInfoSchema.index({
  name: 'text',
  description: 'text',
  slug: 'text',
  content: 'text',
})

const NEWS_INFO_MODEL = mongoose.model<NewsInfoDocument>('news_info', newsInfoSchema)

export default NEWS_INFO_MODEL
