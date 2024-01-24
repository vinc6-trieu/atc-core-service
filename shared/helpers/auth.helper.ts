import * as jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { UniquePermissionsResult } from '../../authentication/passport'
import ROLE_MODEL from '../../models/role.model'
import PERMISSION_MODEL from '../../models/permission.model'

const SECRET_JWT = 'appfake@app.com'
const DATE_EXPIRED = process.env.DATE_EXPIRED ?? '30'
const JWT_SIGNING_ALGORITHM = 'HS256'

interface TokenResponse {
  _id: string
  iat: number
  exp: number
}

interface SigningPayload {
  userId?: string
  adminId?: string
}

/**
 * Description: hash a string password with bcrypt's salt
 * @param {string} password
 * @returns {string?} hashed password
 */
function hashPassword(password: string = ''): Promise<string> {
  return Bun.password.hash(password)
}

/**
 * Description: comparison between raw password & encrypted password
 * @param {string} raw        raw password
 * @param {string} encrypted  hashed password
 * @returns {boolean} true if equal, false if not
 */
function comparePassword(raw: string, encrypted: string): Promise<boolean> {
  return Bun.password.verify(raw, encrypted)
}

/**
 * Description: return a jwt string encrypted with jwt secret with the payload
 * @param {ObjectId} authId  auth identify
 * @param {ObjectId} userId  user identify
 * @param {ObjectId} adminId  admin identify
 * @returns {string?} encrypted information
 */
function signingToken({ userId = '', adminId = '' }: SigningPayload): string {
  return jwt.sign({ userId, adminId }, SECRET_JWT, {
    algorithm: JWT_SIGNING_ALGORITHM,
    expiresIn: `${Number(DATE_EXPIRED) * 24 * 60 * 60}s`,
  })
}

/**
 * Description: this function will return null if the input is an invalid token or token has been expired
 * @param {string} token JWT Token string
 * @returns {TokenResponse?} {_id: string, iat: number, exp: number}
 */
function parseToken(token: string = ''): TokenResponse | null {
  try {
    const decoded = jwt.verify(token, SECRET_JWT) as TokenResponse
    return decoded
  } catch (error) {
    return null
  }
}

async function getUniquePermissionsForRole(
  roleId: mongoose.Types.ObjectId | string,
): Promise<UniquePermissionsResult[]> {
  try {
    const asd = await PERMISSION_MODEL.findOne({})
    const result = await ROLE_MODEL.aggregate([
      {
        $match: {
          _id: roleId,
        },
      },
      {
        $lookup: {
          from: 'policies',
          localField: 'policies',
          foreignField: '_id',
          as: 'policies',
        },
      },
      {
        $unwind: '$policies',
      },
      {
        $lookup: {
          from: 'permissions',
          localField: 'policies.permissions',
          foreignField: '_id',
          as: 'permissions',
        },
      },
      {
        $unwind: '$permissions',
      },
      {
        $group: {
          _id: {
            departmentCode: '$policies.departmentCode',
            policyName: '$policies.name',
          },
          permissions: {
            $addToSet: {
              name: '$permissions.name',
              description: '$permissions.description',
              operation: '$permissions.operation',
              endpoint: '$permissions.endpoint',
            },
          },
        },
      },
      {
        $group: {
          _id: '$_id.departmentCode',
          listPermission: {
            $addToSet: {
              policyName: '$_id.policyName',
              permissions: '$permissions',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          departmentCode: '$_id',
          listPermission: 1,
        },
      },
    ])
    return result
  } catch (error) {
    console.error('Error fetching unique permissions:', error)
    throw error
  }
}

const formatPermissions = (uniquePermissionsResults: UniquePermissionsResult[]): string[] => {
  const listPermission: string[] = uniquePermissionsResults.flatMap((uniquePermissionsResult) => {
    if (!uniquePermissionsResult) return []
    if (uniquePermissionsResult.listPermission[0]?.permissions?.length > 0) {
      const departmentCode = uniquePermissionsResult.departmentCode.trim()

      return uniquePermissionsResult.listPermission[0].permissions.map((permissions) => {
        return `${departmentCode ?? 'all'}:${permissions.endpoint}:${permissions.operation}`
      })
    }

    return []
  })

  return listPermission ?? []
}

export {
  hashPassword,
  comparePassword,
  parseToken,
  signingToken,
  getUniquePermissionsForRole,
  formatPermissions,
}
