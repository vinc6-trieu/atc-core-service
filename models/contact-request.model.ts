import mongoose, { Document, Schema } from 'mongoose'
import { AdminDocument } from './admin.model'

export interface ContactRequestDocument extends Document {
  fullName: string
  phone: string
  email: string
  note: string
  noteAdmin: string
  processUser: AdminDocument
  status: number
  message: string

  modifiedAt: Date
  createdAt: Date
}

const contactRequestSchema = new Schema<ContactRequestDocument>(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    note: { type: String }, // thông tin thêm từ khách hàng
    noteAdmin: { type: String }, // ghi chú từ admin
    processUser: { type: mongoose.Types.ObjectId, ref: 'admin', default: null },

    /*** STATUS
     *  3 - Tư vấn thành công
     *  2 - Đã tư vấn đang chờ xác nhận từ khách
     *  1 - Đã chuyển Calling Center CSKH
     *  0 - Chờ tư vấn
     *  -1 - Khách hàng hủy
     ***/
    status: { type: Number, require: false, default: 0 },

    createdAt: { type: Date, default: new Date() },
    modifiedAt: { type: Date, default: new Date() },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
)

contactRequestSchema.index({
  fullName: 'text',
  phone: 'text',
  email: 'text',
})

const CONTACT_REQUEST_MODEL = mongoose.model<ContactRequestDocument>(
  'contact_request',
  contactRequestSchema,
)

export default CONTACT_REQUEST_MODEL
