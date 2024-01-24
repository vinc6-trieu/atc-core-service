import mongoose, { Document, Schema } from 'mongoose'
import { ELanguage } from '../shared/enums/locale.enum'

export interface DepartmentDocument extends Document {
  title: string
  description: string
  content: string
  lang: ELanguage
  awards: Array<Record<string, any>>
  highlights: Array<Record<string, any>>
  partnerships: Array<Record<string, any>>
  messages: Array<Record<string, any>>
  parent: mongoose.Types.ObjectId | null | DepartmentDocument
  modifiedAt: Date
  createdAt: Date
}

const departmentSchema = new Schema<DepartmentDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    lang: { type: String, enum: ELanguage, required: true },
    awards: [{ type: mongoose.SchemaTypes.Mixed, default: null }],
    highlights: [{ type: mongoose.SchemaTypes.Mixed, default: null }],
    partnerships: [{ type: mongoose.SchemaTypes.Mixed, default: null }],
    messages: [{ type: mongoose.SchemaTypes.Mixed, default: null }],
    parent: { type: mongoose.Types.ObjectId, ref: 'department', default: null },
    createdAt: { type: Date, default: new Date() },
    modifiedAt: { type: Date, default: new Date() },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
)

departmentSchema.index({
  name: 'text',
  code: 'text',
})

const DEPARTMENT_MODEL = mongoose.model<DepartmentDocument>('department', departmentSchema)

export default DEPARTMENT_MODEL
