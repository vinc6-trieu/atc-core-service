import mongoose, { Document, Schema } from 'mongoose'

export interface TagDocument extends Document {
  name: string
  url: string
  createdAt: Date
  modifiedAt: Date
}

const tagSchema = new Schema<TagDocument>(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    createdAt: { type: Date, default: new Date() },
    modifiedAt: { type: Date, default: new Date() },
  },
  { timestamps: true },
)

tagSchema.index({
  name: 1,
  url: 1,
})

const TAG_MODEL = mongoose.model<TagDocument>('tag', tagSchema)

export default TAG_MODEL
