import mongoose, { Document, Schema } from 'mongoose'
import { ImageDocument } from './image.model'
import { NewsCategoryInfoDocument } from './news-category-info.model'

export type NewsCategoryEn = {
  en: mongoose.Types.ObjectId | null | NewsCategoryInfoDocument
  enName: string
  enSlug: string
}

export type NewsCategoryVi = {
  vi: mongoose.Types.ObjectId | null | NewsCategoryInfoDocument
  viName: string
  viSlug: string
}

export type NewsCategoryLanguages = {
  parent: mongoose.Types.ObjectId | null | NewsCategoryDocument
  thumbnail?: mongoose.Types.ObjectId | null | ImageDocument
} & NewsCategoryVi &
  NewsCategoryEn

export type NewsCategory = {
  thumbnail?: mongoose.Types.ObjectId | null | ImageDocument
  parent?: mongoose.Types.ObjectId | null | NewsCategoryDocument
  createdAt: Date
  modifiedAt: Date
} & NewsCategoryVi &
  NewsCategoryEn

export type NewsCategoryDocument = NewsCategory & Document

const newsCategorySchema = new Schema<NewsCategoryDocument>(
  {
    vi: { type: mongoose.Types.ObjectId, ref: 'news_category_info' },
    viName: { type: String },
    viSlug: { type: String },
    thumbnail: { type: mongoose.Types.ObjectId, ref: 'image' },
    en: { type: mongoose.Types.ObjectId, ref: 'news_category_info' },
    parent: { type: mongoose.Types.ObjectId, ref: 'news_category', default: null },
    enName: { type: String },
    enSlug: { type: String },
    createdAt: { type: Date, default: new Date() },
    modifiedAt: { type: Date, default: new Date() },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
)

newsCategorySchema.index({
  viName: 'text',
  viSlug: 'text',
  enName: 'text',
  enSlug: 'text',
})

const NEWS_CATEGORY_MODEL = mongoose.model<NewsCategoryDocument>(
  'news_category',
  newsCategorySchema,
)

export default NEWS_CATEGORY_MODEL
