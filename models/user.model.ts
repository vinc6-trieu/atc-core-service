import mongoose, { Document, Schema } from 'mongoose'

export interface UserDocument extends Document {
  facebookID?: string | null
  googleID?: string | null
  email?: string | null
  username?: string
  password?: string
  fullName: string
  avatar?: mongoose.Types.ObjectId | null
  createdAt: Date
  modifiedAt: Date

  setPassword(password: string): void
  comparePassword(password: string): boolean
  getInfo(): Partial<UserDocument>
}

const userSchema = new Schema<UserDocument>(
  {
    facebookID: { type: String, default: null },
    googleID: { type: String, default: null },
    email: { type: String, default: null },
    username: { type: String, minlength: 6 },
    password: { type: String, minlength: 6, required: true },
    fullName: { type: String, required: true },
    avatar: { type: mongoose.Types.ObjectId, ref: 'image' },
    createdAt: { type: Date, default: new Date() },
    modifiedAt: { type: Date, default: new Date() },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
)

userSchema.method('setPassword', async function (password: string) {
  this.password = await Bun.password.hash(password)
})

userSchema.method('comparePassword', async function (password: string): Promise<boolean> {
  if (!password) return false
  return Bun.password.verify(password, this.password ?? '')
})

userSchema.method('getInfo', function (): Partial<UserDocument> {
  const info: Partial<UserDocument> = this.toObject()

  // Check if the 'password' property exists before attempting to delete it
  if (info.password) {
    delete info.password
  }

  return info
})

userSchema.index({
  email: 'text',
  username: 'text',
  fullName: 'text',
})

const USER_MODEL = mongoose.model<UserDocument>('user', userSchema)

export default USER_MODEL
