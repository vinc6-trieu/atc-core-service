import mongoose, { Document, Schema } from 'mongoose'
import { AdminDocument } from './admin.model'
import { CourseDocument } from './course.model'

export interface CourseRegisterDocument extends Document {
  fullName: string
  phone: string
  email: string
  note?: string
  course?: mongoose.Types.ObjectId | CourseDocument | null
  noteAdmin?: string
  type: number
  processUser: AdminDocument
  status: number
  message: string

  modifiedAt: Date
  createdAt: Date
}

const courseRegisterSchema = new Schema<CourseRegisterDocument>(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    note: { type: String }, // thông tin thêm từ khách hàng
    noteAdmin: { type: String }, // ghi chú từ admin
    processUser: { type: mongoose.Types.ObjectId, ref: 'admin', default: null },
    course: { type: mongoose.Types.ObjectId, ref: 'course' },
    /*** STATUS
     *  2 - Đăng kí thành công
     *  1 - Đã xác nhận đang chờ xác nhận từ khách
     *  0 - Chờ xác nhận
     *  -1 - Khách hàng hủy
     ***/
    status: { type: Number, require: false, default: 0 },
    type: { type: Number, require: false, default: 1 },

    createdAt: { type: Date, default: new Date() },
    modifiedAt: { type: Date, default: new Date() },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
)

courseRegisterSchema.index({
  fullName: 'text',
  phone: 'text',
  email: 'text',
})

const COURSE_REGISTER_MODEL = mongoose.model<CourseRegisterDocument>(
  'course_register',
  courseRegisterSchema,
)

export default COURSE_REGISTER_MODEL
