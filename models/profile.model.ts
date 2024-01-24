import mongoose, { Document, Schema } from 'mongoose'
import { DepartmentDocument } from './department.model'
import { ELanguage } from '../shared/enums/locale.enum'
import { ImageDocument } from './image.model'

export interface ProfileDocument extends Document {
  title: string
  fullname: string
  lang: ELanguage
  position: string
  avatar: mongoose.Types.ObjectId | null | ImageDocument
  department: mongoose.Types.ObjectId | null | DepartmentDocument
  thumbnail?: mongoose.Types.ObjectId | null | ImageDocument
  metadata: Record<string, any>
  description: string
  modifiedAt: Date
  createdAt: Date
}

const profileSchema = new Schema<ProfileDocument>(
  {
    title: { type: String, required: true },
    fullname: { type: String, required: true },
    department: { type: String, required: true },
    avatar: { type: mongoose.Types.ObjectId, ref: 'image' },
    metadata: { type: mongoose.SchemaTypes.Mixed, default: null },
    description: { type: String, required: true },
    createdAt: { type: Date, default: new Date() },
    modifiedAt: { type: Date, default: new Date() },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
)

profileSchema.index({
  name: 'text',
  code: 'text',
})

const PROFILE_MODEL = mongoose.model<ProfileDocument>('page', profileSchema)

export default PROFILE_MODEL
