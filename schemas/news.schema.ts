import yup from 'yup'
import { ELanguage } from '../shared/enums/locale.enum'

export const NewsInfoValidationSchema = yup.object().shape({
  name: yup.string(),
  content: yup.string(),
  summary: yup.string(),
  thumbnail: yup.string(),
  gallery: yup.array().of(yup.string()),
  description: yup.string(),
  status: yup.string(),
  slug: yup.string().trim(),
  lang: yup.string().oneOf(Object.values(ELanguage), 'Lang is invalid'),
  views: yup.number().default(0),
  toc: yup.string(),
  category: yup.string().nullable(),
  news: yup.string(),
  tags: yup.array().of(yup.string()),
  author: yup.string().nullable(),
  seoTitle: yup.string().trim(),
  seoDescription: yup.string().trim(),
  seoKeywords: yup.string().trim(),
  seoSchema: yup.string().trim(),
  seoCanonical: yup.string(),
  seoRedirect: yup.string(),
  seoLang: yup.string(),
})

export type NewsInfoSchemaType = yup.InferType<typeof NewsInfoValidationSchema>
