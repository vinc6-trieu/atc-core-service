import mongoose, { Document, Schema } from 'mongoose'
import { ImageDocument } from './image.model'
import { ECourseType } from '../shared/enums/course.enum'
import { CourseInfoDocument } from './course-info.model'

export type CourseEn = {
  en: mongoose.Types.ObjectId | null | CourseInfoDocument
  enName: string
  enSlug: string
}

export type CourseVi = {
  vi: mongoose.Types.ObjectId | null | CourseInfoDocument
  viName: string
  viSlug: string
}

export type CourseLanguages = {
  parent?: mongoose.Types.ObjectId | null | CourseDocument
  thumbnail?: mongoose.Types.ObjectId | null | ImageDocument
} & CourseVi &
  CourseEn

export type Course = {
  thumbnail?: mongoose.Types.ObjectId | null | ImageDocument
  category?: mongoose.Types.ObjectId | null | CourseDocument
  type?: ECourseType

  // course props
  openingDate?: Date
  closingDate?: Date
  viInstructor?: string
  enInstructor?: string
  seat: number
  lectures?: number
  quizzes?: number
  views?: number

  viDuration?: string
  enDuration?: string

  enPrice: number
  enOriginalPrice: number

  viPrice: number
  viOriginalPrice: number

  // rating
  ratingStars?: number
  ratingCount?: number
  ratingSingleCounts: number[]

  createdAt: Date
  modifiedAt: Date
} & CourseVi &
  CourseEn

export type CourseDocument = Course & Document

const courseSchema = new Schema<CourseDocument>(
  {
    vi: { type: mongoose.Types.ObjectId, ref: 'course_info' },
    viName: { type: String },
    viSlug: { type: String },
    type: { type: String, enum: ECourseType, default: ECourseType.ShortTerm },
    en: { type: mongoose.Types.ObjectId, ref: 'course_info' },
    category: { type: mongoose.Types.ObjectId, ref: 'course_category', default: null },
    enName: { type: String },
    enSlug: { type: String },

    views: { type: Number, required: false, default: 0 },

    // course props
    openingDate: { type: Date },
    closingDate: { type: Date },
    seat: { type: Number },
    lectures: { type: Number },
    quizzes: { type: Number },
    viInstructor: { type: String },
    enInstructor: { type: String },

    viDuration: { type: String },
    enDuration: { type: String },

    viPrice: { type: Number, default: 0 },
    enPrice: { type: Number, default: 0 },

    viOriginalPrice: { type: Number, default: 0 },
    enOriginalPrice: { type: Number, default: 0 },

    // rating
    ratingStars: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    ratingSingleCounts: { type: [Number], default: [0, 0, 0, 0, 0] },

    createdAt: { type: Date, default: new Date() },
    modifiedAt: { type: Date, default: new Date() },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
)

courseSchema.index({
  viName: 'text',
  viSlug: 'text',
  enName: 'text',
  enSlug: 'text',
})

const MODEL = mongoose.model<CourseDocument>('course', courseSchema)

export default MODEL
