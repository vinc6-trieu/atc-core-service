import mongoose, { Document, Schema } from 'mongoose'
import { ELanguage } from '../shared/enums/locale.enum'
import { NewsCategoryDocument } from './news-category.model'
import { ImageDocument } from './image.model'

export interface NewsCategoryInfoDocument extends Document {
  name: string
  status: number
  description: string
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
  newsCategory?: mongoose.Types.ObjectId | null | NewsCategoryDocument
  createdAt: Date
  modifiedAt: Date
}

const newsCategoryInfoSchema = new Schema<NewsCategoryInfoDocument>(
  {
    name: String,
    status: { type: Number, default: 0, required: true },
    description: String,
    lang: { type: String, enum: ELanguage },
    slug: { type: String, required: false, trim: true },
    content: { type: String, required: false, trim: true },
    newsCategory: { type: mongoose.Types.ObjectId, ref: 'news_category' },
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

const NEWS_CATEGORY_INFO_MODEL = mongoose.model<NewsCategoryInfoDocument>(
  'news_category_info',
  newsCategoryInfoSchema,
)

export default NEWS_CATEGORY_INFO_MODEL
