import mongoose, { Document, Schema } from 'mongoose'

export interface ImageDocument extends Document {
  name: string
  src: string
  smallSrc: string
  mediumSrc: string
  largeSrc: string
  alt?: string
  createdAt: Date
  modifiedAt: Date
}

const imageSchema = new Schema<ImageDocument>(
  {
    name: { type: String, required: true },
    src: { type: String, required: true },
    smallSrc: { type: String, required: true },
    mediumSrc: { type: String, required: true },
    largeSrc: { type: String, required: true },
    alt: { type: String },
    createdAt: { type: Date, default: new Date() },
    modifiedAt: { type: Date, default: new Date() },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
)

imageSchema.index({
  name: 'text',
  alt: 'text',
})

const IMAGE_MODEL = mongoose.model<ImageDocument>('image', imageSchema)

export default IMAGE_MODEL
