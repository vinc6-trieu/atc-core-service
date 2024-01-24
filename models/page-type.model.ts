import mongoose, { Document, Schema } from 'mongoose'
import { EPageTypeStatus, ERenderType } from '../shared/enums/index.enum'

export interface PageTypeDocument extends Document {
  name: string
  slug: string
  renderType: ERenderType
  seo?: Record<string, any>
  status?: EPageTypeStatus
  createdAt: Date
  modifiedAt: Date
}

const pageTypeSchema = new Schema<PageTypeDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    renderType: { type: String, enum: ERenderType, default: ERenderType.Static },
    status: { type: String, enum: EPageTypeStatus, default: EPageTypeStatus.Active },
    seo: { type: mongoose.SchemaTypes.Mixed, default: null },
    createdAt: { type: Date, default: new Date() },
    modifiedAt: { type: Date, default: new Date() },
  },
  { timestamps: true },
)

pageTypeSchema.index({
  name: 1,
  slug: 1,
})

const PAGE_TYPE_MODEL = mongoose.model<PageTypeDocument>('page_type', pageTypeSchema)

export default PAGE_TYPE_MODEL
