import mongoose, { Schema, Model, model } from 'mongoose'

export type PageComponent = {
  name: string
  page: string

  seoSchema?: string
  seoCanonical?: string
  seoLang?: string

  seoTitle?: string
  seoDescription?: string
  seoKeyword?: string
  seoRedirect?: string
  seoH1?: string

  metadata: Record<string, any>

  lang: 'vi' | 'en'
  createdAt: Date
  modifiedAt: Date
}

const pageComponentSchema = new Schema<PageComponent>({
  name: { type: String, trim: true, required: true },
  page: { type: String, trim: true, required: true },

  seoSchema: { type: String, trim: true },
  seoCanonical: { type: String },
  seoLang: { type: String },

  seoTitle: { type: String, trim: true },
  seoDescription: { type: String, trim: true },
  seoKeyword: { type: String, trim: true },
  seoRedirect: { type: String },
  seoH1: String,

  metadata: { type: mongoose.SchemaTypes.Mixed, default: null },
  lang: { type: String, trim: true, enum: ['vi', 'en'], default: 'vi', required: true },
  createdAt: { type: Date, required: true, default: new Date() },
  modifiedAt: { type: Date, required: true, default: new Date() },
})

const PAGE_COMPONENT_MODEL: Model<PageComponent> = model('page_component', pageComponentSchema)

export default PAGE_COMPONENT_MODEL
