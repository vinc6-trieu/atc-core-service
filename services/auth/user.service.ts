import {
  ERROR_MESSAGES,
  ERROR_CODES,
  SUCCESS_MESSAGES,
} from '../../constants/response-message.constant'
import USER_MODEL, { UserDocument } from '../../models/user.model'
import { BaseService } from '../../shared/base/service.base'
import { hashPassword, parseToken, signingToken } from '../../shared/helpers/auth.helper'
import { CreateUserPayload } from '../../shared/types/auth.type'
import { IResponseData } from '../../shared/interfaces/base.interface'

export class UserService extends BaseService<UserDocument> {
  constructor() {
    super(USER_MODEL)
  }

  /** REGISTER NEW ACCOUNT
   * @param {String} password    Least 6 characters for raw password
   * @param {String} fullname    Least 3 characters for user's fullname
   * @param {String} username    Least 6 characters for user's username
   * @returns {IResponseData}   {error: Boolean, data?: {user: userModel, token: String}, message?: String}
   */
  async register({
    password = '',
    fullname = '',
    username = '',
    gender,
    email,
    phone,
  }: CreateUserPayload): Promise<IResponseData<{ user: Partial<UserDocument>; token: string }>> {
    try {
      if (password.length < 6 || username.length < 6)
        return {
          error: true,
          message: ERROR_MESSAGES[ERROR_CODES.INVALID_PARAMETER],
          error_code: ERROR_CODES.INVALID_PARAMETER,
        }

      // find a same user has the same phone and is active
      const exists = await USER_MODEL.findOne({
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
      const user = new USER_MODEL({
        password: hashedPassword,
        name: fullname,
        username,
        gender,
        email,
        phone,
      })
      await user.save()

      // generate token
      const token = signingToken({ userId: user._id })

      return {
        error: false,
        data: { token, user: user.getInfo() },
        message: SUCCESS_MESSAGES.CREATED_SUCCEED,
      }
    } catch (error) {
      console.log('Error register user', error)
      return {
        error: true,
        message: ERROR_MESSAGES[ERROR_CODES.ERROR_REGISTER_USER],
        error_code: ERROR_CODES.ERROR_REGISTER_USER,
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

      const tokenRefreshed = signingToken({ userId: decodedToken._id })
      return {
        error: false,
        data: tokenRefreshed,
        message: SUCCESS_MESSAGES.TOKEN_REFRESH_SUCCESS,
      }
    } catch (error) {
      console.log('Error refresh token user', error)
      return {
        error: true,
        message: ERROR_MESSAGES[ERROR_CODES.ERROR_REGISTER_USER],
        error_code: ERROR_CODES.ERROR_REGISTER_USER,
      }
    }
  }
}

export const userService = new UserService()
