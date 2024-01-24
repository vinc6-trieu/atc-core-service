import yup from 'yup'
import { ELanguage } from '../shared/enums/locale.enum'

/**
 *
  name: string
  status: number
  description: string
  lang?: ELanguage
  slug?: string
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
  seoSchema?: string
  seoCanonical?: string
  seoRedirect?: string
  seoLang?: string
  content?: string
  postCategory?: mongoose.Types.ObjectId | null | PostCategoryDocument
  createdAt: Date
  modifiedAt: Date
 */

// ---------------------- RENDER VIEW - REQUESTS --------------------
export const PostCategoryInfoSchema = yup.object({
  name: yup.string().required('Name is required'),
  status: yup.number(),
  description: yup.string(),
  lang: yup.string().oneOf(Object.values(ELanguage), 'Lang is invalid'),
  slug: yup.string().required('Slug is required'),
  seoTitle: yup.string(),
  seoDescription: yup.string(),
  seoKeywords: yup.string(),
  seoSchema: yup.string(),
  seoCanonical: yup.string(),
  seoRedirect: yup.string(),
  seoLang: yup.string(),
  content: yup.string(),
  postCategory: yup.string().required('Post category id is required'),
})

export type PostCategoryInfoSchemaType = yup.InferType<typeof PostCategoryInfoSchema>
