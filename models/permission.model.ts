import mongoose, { Document, Schema } from 'mongoose'

export interface PermissionDocument extends Document {
  name: string
  description: string
  endpoint: string
}

const permissionSchema = new Schema<PermissionDocument>(
  {
    endpoint: { type: String, required: true },
    name: { type: String, required: false },
    description: { type: String, required: false },
  },
  { timestamps: true },
)

permissionSchema.index({
  name: 'text',
  description: 'text',
})

const PERMISSION_MODEL = mongoose.model<PermissionDocument>('permission', permissionSchema)

export default PERMISSION_MODEL
