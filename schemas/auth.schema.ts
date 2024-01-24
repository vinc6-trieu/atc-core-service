import yup from 'yup'
import { ERoles } from '../shared/enums/roles.enum'

// ---------------------- RENDER VIEW - REQUESTS --------------------
/** swagger
 * @swagger
 * components:
 *   schemas:
 *     RegisterAdminSchema:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *         email:
 *           type: string
 *         fullname:
 *           type: string
 *         role:
 *           type: string
 *       required:
 *         - username
 *         - email
 *         - password
 *         - fullname
 *         - role
 */
export const RegisterAdminSchema = yup.object({
  username: yup
    .string()
    .min(6, 'Username should has more than 6 chars')
    .max(32, 'Username should has limit to 32 chars')
    .required('Username is required'),
  email: yup.string().required('Password is required'),
  password: yup
    .string()
    .min(6, 'Password should has more than 6 chars')
    .required('Password is required'),
  fullname: yup
    .string()
    .min(3, 'Fullname should has more than 6 chars')
    .required('Fullname is required'),
  role: yup.string().oneOf(Object.values(ERoles)).required('Role is required'),
})

export type RegisterAdminSchemaType = yup.InferType<typeof RegisterAdminSchema>
