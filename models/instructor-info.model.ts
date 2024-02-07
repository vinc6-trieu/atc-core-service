import mongoose, { Document, Schema } from 'mongoose'
import { ELanguage } from '../shared/enums/locale.enum'
import { ImageDocument } from './image.model'
import { InstructorDocument } from './instructor.model'

export interface InstructorInfoDocument extends Document {
  name: string
  title: string
  lang?: ELanguage
  slug?: string
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
  instructor: mongoose.Types.ObjectId | null | InstructorDocument
  avatar: mongoose.Types.ObjectId | null | ImageDocument
  seoSchema?: string
  seoCanonical?: string
  seoRedirect?: string
  seoLang?: string
  introduce?: string
  createdAt: Date
  modifiedAt: Date
}

const instructorInfoSchema = new Schema<InstructorInfoDocument>(
  {
    lang: { type: String, enum: ELanguage },
    slug: { type: String, required: false, trim: true },
    title: { type: String, required: false, trim: true },
    name: { type: String, required: false, trim: true },
    introduce: { type: String, required: false, trim: true },
    instructor: { type: mongoose.Types.ObjectId, ref: 'instructor' },
    avatar: { type: mongoose.Types.ObjectId, ref: 'image' },
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

instructorInfoSchema.index({
  name: 'text',
  description: 'text',
  slug: 'text',
  content: 'text',
})

const INSTRUCTOR_INFO_MODEL = mongoose.model<InstructorInfoDocument>(
  'instructor_info',
  instructorInfoSchema,
)

export default INSTRUCTOR_INFO_MODEL
