import { ERoles } from '../enums/roles.enum'

export type CreateAdminPayload = {
  password: string
  email: string
  fullname: string
  username: string
  phone?: string
  role: ERoles
  gender: number
}

export type CreateUserPayload = {
  password: string
  email: string
  fullname: string
  username: string
  phone?: string
  gender?: number
  address?: string
}
