import mongoose, { Document, Schema } from 'mongoose'
import { ImageDocument } from './image.model'
import { ENewsEventType } from '../shared/enums/news-events.enum'
import { CourseCategoryInfoDocument } from './course-category-info.model'

export type CourseCategoryEn = {
  en: mongoose.Types.ObjectId | null | CourseCategoryInfoDocument
  enName: string
  enSlug: string
}

export type CourseCategoryVi = {
  vi: mongoose.Types.ObjectId | null | CourseCategoryInfoDocument
  viName: string
  viSlug: string
}

export type CourseCategoryLanguages = {
  parent: mongoose.Types.ObjectId | null | CourseCategoryDocument
  thumbnail?: mongoose.Types.ObjectId | null | ImageDocument
} & CourseCategoryVi &
  CourseCategoryEn

export type CourseCategory = {
  thumbnail?: mongoose.Types.ObjectId | null | ImageDocument
  parent?: mongoose.Types.ObjectId | null | CourseCategoryDocument
  createdAt: Date
  type?: ENewsEventType
  modifiedAt: Date
} & CourseCategoryVi &
  CourseCategoryEn

export type CourseCategoryDocument = CourseCategory & Document

const courseCategorySchema = new Schema<CourseCategoryDocument>(
  {
    viName: { type: String },
    viSlug: { type: String },
    type: { type: String, enum: ENewsEventType, default: ENewsEventType.News },
    thumbnail: { type: mongoose.Types.ObjectId, ref: 'image' },
    parent: { type: mongoose.Types.ObjectId, ref: 'course_category', default: null },
    vi: { type: mongoose.Types.ObjectId, ref: 'course_category_info', default: null },
    en: { type: mongoose.Types.ObjectId, ref: 'course_category_info', default: null },
    enName: { type: String },
    enSlug: { type: String },
    createdAt: { type: Date, default: new Date() },
    modifiedAt: { type: Date, default: new Date() },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
)

courseCategorySchema.index({
  viName: 'text',
  viSlug: 'text',
  enName: 'text',
  enSlug: 'text',
})

const COURSE_CATEGORY_MODEL = mongoose.model<CourseCategoryDocument>(
  'course_category',
  courseCategorySchema,
)

export default COURSE_CATEGORY_MODEL
