import {
  ERROR_MESSAGES,
  ERROR_CODES,
  SUCCESS_MESSAGES,
} from '../../constants/response-message.constant'
import ADMIN_MODEL, { AdminDocument } from '../../models/admin.model'
import { BaseService } from '../../shared/base/service.base'
import { ERoles } from '../../shared/enums/roles.enum'
import { hashPassword, parseToken, signingToken } from '../../shared/helpers/auth.helper'
import { CreateAdminPayload } from '../../shared/types/auth.type'
import { IResponseData } from '../../shared/interfaces/base.interface'

export class AdminService extends BaseService<AdminDocument> {
  constructor() {
    super(ADMIN_MODEL)
  }

  /** REGISTER NEW ACCOUNT
   * @param {String} password    Least 6 characters for raw password
   * @param {String} fullname    Least 3 characters for user's fullname
   * @param {String} username    Least 6 characters for user's username
   * @param {ERoles} role         editor - admin - admin
   * @returns {IResponseData}   { error: Boolean, data?: { admin: adminModel, token: String }, message: String }
   */
  async createAdmin({
    password = '',
    fullname = '',
    username = '',
    gender,
    email,
    phone,
    role = ERoles.EDITOR,
  }: CreateAdminPayload): Promise<IResponseData<{ admin: Partial<AdminDocument>; token: string }>> {
    try { 
      if (password.length < 6 || username.length < 6)
        return {
          error: true,
          message: ERROR_MESSAGES[ERROR_CODES.INVALID_PARAMETER],
          error_code: ERROR_CODES.INVALID_PARAMETER,
        }

      // find a same user has the same phone and is active
      const exists = await ADMIN_MODEL.findOne({
        username,
      }).select({ createAt: 0, modifyAt: 0 })

      if (exists)
        return {
          error: true,
          message: ERROR_MESSAGES[ERROR_CODES.ADMIN_ALREADY_EXIST],
          error_code: ERROR_CODES.ADMIN_ALREADY_EXIST,
        }

      const hashedPassword = await hashPassword(password)

      // insert a new user
      const admin = new ADMIN_MODEL({
        password: hashedPassword,
        name: fullname,
        username,
        role,
        gender,
        email,
        phone,
      })
      await admin.save()

      // generate token
      const token = signingToken({ adminId: admin._id })

      return {
        error: false,
        data: { token, admin: admin.getInfo() },
        message: SUCCESS_MESSAGES.CREATED_SUCCEED,
      }
    } catch (error) {
      console.log('Error register admin', error)
      return {
        error: true,
        message: ERROR_MESSAGES[ERROR_CODES.ERROR_REGISTER_ADMIN],
        error_code: ERROR_CODES.ERROR_REGISTER_ADMIN,
      }
    }
  }

  /** REFRESH NON EXPIRED TOKEN
   * @param {String} token      encrypted jwt string that we had sent to frontend before
   * @returns {SignalResponse} {error: Boolean, data: JWT_Token_String, message: String}
   */
  static async refreshToken(token: string): Promise<IResponseData<string>> {
    try {
      const decodedToken = parseToken(token)
      if (!decodedToken)
        return {
          error: true,
          message: ERROR_MESSAGES[ERROR_CODES.INVALID_REFRESH_TOKEN],
          error_code: ERROR_CODES.INVALID_REFRESH_TOKEN,
        }

      const tokenRefreshed = signingToken({ adminId: decodedToken._id })
      return {
        error: false,
        data: tokenRefreshed,
        message: SUCCESS_MESSAGES.TOKEN_REFRESH_SUCCESS,
      }
    } catch (error) {
      console.log('Error refresh token admin', error)
      return {
        error: true,
        message: ERROR_MESSAGES[ERROR_CODES.ERROR_REGISTER_ADMIN],
        error_code: ERROR_CODES.ERROR_REGISTER_ADMIN,
      }
    }
  }
}

export const adminService = new AdminService()
