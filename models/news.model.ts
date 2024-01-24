import mongoose, { Document, Schema } from 'mongoose'
import { ImageDocument } from './image.model'
import { NewsInfoDocument } from './news-info.model'

export type NewsEn = {
  en: mongoose.Types.ObjectId | null | NewsInfoDocument
  enName: string
  enSlug: string
}

export type NewsVi = {
  vi: mongoose.Types.ObjectId | null | NewsInfoDocument
  viName: string
  viSlug: string
}

export type NewsLanguages = {
  parent?: mongoose.Types.ObjectId | null | NewsDocument
  thumbnail?: mongoose.Types.ObjectId | null | ImageDocument
} & NewsVi &
  NewsEn

export type News = {
  thumbnail?: mongoose.Types.ObjectId | null | ImageDocument
  parent?: mongoose.Types.ObjectId | null | NewsDocument
  category?: mongoose.Types.ObjectId | null | NewsDocument
  oldCategories?: string[]
  id?: string
  createdAt: Date
  modifiedAt: Date
} & NewsVi &
  NewsEn

export type NewsDocument = News & Document

const newsSchema = new Schema<NewsDocument>(
  {
    vi: { type: mongoose.Types.ObjectId, ref: 'news_info' },
    viName: { type: String },
    viSlug: { type: String },
    thumbnail: { type: mongoose.Types.ObjectId, ref: 'image' },
    en: { type: mongoose.Types.ObjectId, ref: 'news_info' },
    parent: { type: mongoose.Types.ObjectId, ref: 'news_category', default: null },
    enName: { type: String },
    enSlug: { type: String },
    createdAt: { type: Date, default: new Date() },
    modifiedAt: { type: Date, default: new Date() },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
)

newsSchema.index({
  viName: 'text',
  viSlug: 'text',
  enName: 'text',
  enSlug: 'text',
})

const NEWS_MODEL = mongoose.model<NewsDocument>('news', newsSchema)

export default NEWS_MODEL
