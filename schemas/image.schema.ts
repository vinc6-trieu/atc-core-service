import yup from 'yup'

export const CreateImageSchema = yup.object({
  name: yup.string().required('Name is required'),
  src: yup.string().required('Source is required'),
  alt: yup.string(),
})

export type RegisterAdminSchemaType = yup.InferType<typeof CreateImageSchema>
