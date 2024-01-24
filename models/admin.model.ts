import mongoose, { Document, Schema, connection, model } from 'mongoose'
import { RoleDocument } from './role.model'
import { DepartmentDocument } from './department.model'
import { ImageDocument } from './image.model'

export interface AdminDocument extends Document {
  username: string
  password?: string
  name: string
  avatar: mongoose.Types.ObjectId | null | ImageDocument

  email?: string
  role: mongoose.Types.ObjectId | null | RoleDocument
  department: mongoose.Types.ObjectId | null | DepartmentDocument
  gender: number
  phone?: string

  createdAt: Date
  modifiedAt: Date

  setPassword(password: string): void
  comparePassword(password: string): Promise<boolean>
  getInfo(): Partial<AdminDocument>
}

const adminSchema = new Schema<AdminDocument>(
  {
    username: { type: String, required: true, minlength: 6 },
    password: { type: String, minlength: 6, required: true },
    name: { type: String, required: true },
    createdAt: { type: Date, default: new Date() },
    modifiedAt: { type: Date, default: new Date() },
    email: String,
    role: { type: mongoose.Types.ObjectId, ref: 'role', required: true },
    avatar: { type: mongoose.Types.ObjectId, ref: 'image', required: false },
    gender: { type: Number, default: 1 },
    phone: { type: String, default: '' },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
)

adminSchema.method('setPassword', async function (password: string) {
  this.password = await Bun.password.hash(password)
})

adminSchema.method('comparePassword', async function (password: string): Promise<boolean> {
  if (!password) return false
  return Bun.password.verify(password, this.password ?? '')
})

adminSchema.method('getInfo', function (): Partial<AdminDocument> {
  const info: Partial<AdminDocument> = this.toObject()

  // Check if the 'password' property exists before attempting to delete it
  if (info.password) {
    delete info.password
  }

  return info
})

const ADMIN_MODEL = mongoose.model<AdminDocument>('admin', adminSchema)

export default ADMIN_MODEL
