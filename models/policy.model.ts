import mongoose, { Document, Schema } from 'mongoose'
import { PermissionDocument } from './permission.model'
import { EPermissionOperation } from '../shared/enums/roles.enum'

export interface PolicyDocument extends Document {
  name: string
  description: string
  departmentCode: string
  permissions: mongoose.Types.ObjectId[] | PermissionDocument[]
}

const policySchema = new Schema<PolicyDocument>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    permissions: [
      {
        permission: { type: mongoose.Types.ObjectId, ref: 'permission', required: true },
        rights: [{ type: String, enum: EPermissionOperation, required: true }],
      },
    ],
  },
  { timestamps: true },
)

policySchema.index({
  name: 'text',
  description: 'text',
})

const POLICY_MODEL = mongoose.model<PolicyDocument>('policy', policySchema)

export default POLICY_MODEL
