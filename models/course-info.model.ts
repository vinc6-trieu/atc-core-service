import mongoose, { Document, Schema } from 'mongoose'
import { ImageDocument } from './image.model'
import { ELanguage } from '../shared/enums/locale.enum'
import { TagDocument } from './tag.model'
import { CourseCategoryDocument } from './course-category.model'
import { CourseDocument } from './course.model'
import { ECourseForm, ECourseStatus } from '../shared/enums/course.enum'
import { InstructorDocument } from './instructor.model'

export interface Review {
  reviewer: string // Assuming the name of the reviewer
  rating: number // Rating given by the reviewer
  comment: string // Review comment
  date: Date // Date of the review
}

export interface CourseInfoDocument extends Document {
  name?: string
  content?: string
  outcome?: string
  summary?: string
  targetObject?: string
  form?: ECourseForm
  thumbnail?: mongoose.Types.ObjectId | null | ImageDocument
  gallery?: [mongoose.Types.ObjectId | ImageDocument]
  description?: string
  status?: ECourseStatus
  slug?: string
  lang?: ELanguage
  category?: mongoose.Types.ObjectId | null | CourseCategoryDocument
  course: mongoose.Types.ObjectId | CourseDocument
  tags?: [mongoose.Types.ObjectId | null | TagDocument]
  author?: string
  toc?: string
  price: number
  originalPrice: number
  instructor1?: mongoose.Types.ObjectId | null | InstructorDocument
  instructor2?: mongoose.Types.ObjectId | null | InstructorDocument
  instructor3?: mongoose.Types.ObjectId | null | InstructorDocument
  duration: string

  reviews?: Review[]

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

const courseInfoSchema = new Schema<CourseInfoDocument>(
  {
    name: { type: String, required: false, trim: true },
    content: { type: String, required: false, trim: true },
    outcome: { type: String, required: false, trim: true },
    targetObject: { type: String, required: false, trim: true },
    summary: { type: String, required: false, trim: true },
    thumbnail: { type: mongoose.Types.ObjectId, ref: 'image', required: true },
    instructor1: {
      type: mongoose.Types.ObjectId,
      ref: 'instructor',
      required: false,
      default: null,
    },
    instructor2: {
      type: mongoose.Types.ObjectId,
      ref: 'instructor',
      required: false,
      default: null,
    },
    instructor3: {
      type: mongoose.Types.ObjectId,
      ref: 'instructor',
      required: false,
      default: null,
    },
    gallery: [{ type: mongoose.Types.ObjectId, ref: 'image', required: false }],
    description: { type: String, required: false, trim: true },
    status: { type: String, enum: ECourseStatus, default: ECourseStatus.Draft },
    form: { type: String, enum: ECourseForm, default: ECourseForm.OnlineAndOffline },
    slug: { type: String, required: false, index: { unique: true } },
    lang: { type: String, enum: ELanguage },

    price: { type: Number, required: true },
    originalPrice: { type: Number, required: false },
    toc: { type: String },
    duration: { type: String },
    category: { type: mongoose.Types.ObjectId, ref: 'course_category' },
    course: { type: mongoose.Types.ObjectId, ref: 'course' },
    tags: [{ type: mongoose.Types.ObjectId, ref: 'tag' }],
    author: { type: String, required: false, trim: true },

    reviews: [
      {
        reviewer: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        date: { type: Date, default: new Date() },
      },
    ],

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

courseInfoSchema.index({
  name: 'text',
  description: 'text',
  slug: 'text',
  content: 'text',
})

const MODEL = mongoose.model<CourseInfoDocument>('course_info', courseInfoSchema)

export default MODEL
