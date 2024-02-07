import mongoose, { Document, Schema, connection, model } from 'mongoose'
import { InstructorInfoDocument } from './instructor-info.model'

export type InstructorLanguages = {
  vi: mongoose.Types.ObjectId | null | InstructorInfoDocument
  viName: string
  viSlug: string
  viTitle: string
  viIntroduce: string

  en: mongoose.Types.ObjectId | null | InstructorInfoDocument
  enName: string
  enSlug: string
  enIntroduce: string
  enTitle: string
}

export type InstructorDocument = {
  email?: string
  gender: number
  phone?: string

  createdAt: Date
  modifiedAt: Date
} & InstructorLanguages &
  Document

const instructorSchema = new Schema<InstructorDocument>(
  {
    viName: { type: String, required: true },
    enName: { type: String, required: true },

    enSlug: { type: String, required: true },
    viSlug: { type: String, required: true },

    viTitle: { type: String, required: true },
    enTitle: { type: String, required: true },

    enIntroduce: { type: String, required: true },
    viIntroduce: { type: String, required: true },

    createdAt: { type: Date, default: new Date() },
    modifiedAt: { type: Date, default: new Date() },
    email: { type: String, required: false },
    gender: { type: Number, default: 1 },
    phone: { type: String, default: '' },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
)

const INSTRUCTOR_MODEL = mongoose.model<InstructorDocument>('instructor', instructorSchema)

export default INSTRUCTOR_MODEL
