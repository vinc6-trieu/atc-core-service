import mongoose, { Document, Schema } from 'mongoose'
import { ENewsEventType } from '../shared/enums/news-events.enum'
import { ELanguage } from '../shared/enums/locale.enum'
import { ImageDocument } from './image.model'
import { CourseCategoryDocument } from './course-category.model'

export interface CourseCategoryInfoDocument extends Document {
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
  courseCategory?: mongoose.Types.ObjectId | null | CourseCategoryDocument
  createdAt: Date
  modifiedAt: Date
}

const courseCategoryInfoSchema = new Schema<CourseCategoryInfoDocument>(
  {
    name: String,
    status: { type: Number, default: 0, required: true },
    description: String,
    lang: { type: String, enum: ELanguage },
    type: { type: String, enum: ENewsEventType, default: ENewsEventType.News },
    slug: { type: String, required: false, trim: true },
    content: { type: String, required: false, trim: true },
    courseCategory: { type: mongoose.Types.ObjectId, ref: 'course_category' },
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

courseCategoryInfoSchema.index({
  name: 'text',
  description: 'text',
  slug: 'text',
  content: 'text',
})

const COURSE_CATEGORY_INFO_MODEL = mongoose.model<CourseCategoryInfoDocument>(
  'course_category_info',
  courseCategoryInfoSchema,
)

export default COURSE_CATEGORY_INFO_MODEL
