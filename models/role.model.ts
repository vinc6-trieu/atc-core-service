import mongoose, { Document, Schema } from 'mongoose'
import { PolicyDocument } from './policy.model'
import { ERoleStatus } from '../shared/enums/roles.enum'

export interface RoleDocument extends Document {
  name: string
  description: string
  policies: mongoose.Types.ObjectId[] | PolicyDocument[]
  status: ERoleStatus
  expiredTime: Date
}

const roleSchema = new Schema<RoleDocument>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ERoleStatus },
    policies: [{ type: mongoose.Types.ObjectId, ref: 'policy', required: true }],
    expiredTime: { type: Date, default: new Date() },
  },
  { timestamps: true },
)

const ROLE_MODEL = mongoose.model<RoleDocument>('role', roleSchema)

export default ROLE_MODEL
