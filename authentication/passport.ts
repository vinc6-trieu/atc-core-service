import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import ADMIN_MODEL from '../models/admin.model'
import { ERROR_CODES, ERROR_MESSAGES } from '../constants/response-message.constant'
import { Request } from 'express'
import session from 'express-session'
import { RoleDocument } from '../models/role.model'
import { formatPermissions, getUniquePermissionsForRole } from '../shared/helpers/auth.helper'
import { PermissionDocument } from '../models/permission.model'

export type PermissionInfo = {
  policyName: string
  permissions: PermissionDocument[]
}
export type UniquePermissionsResult = {
  departmentCode: string
  listPermission: PermissionInfo[]
}

interface IUser {
  _id: string
  username: string
  name: string
  email: string
  role: RoleDocument
  listPermission: string[]
}

interface IPassport {
  user?: IUser
}

interface SessionWithPassport extends session.Session {
  passport?: IPassport
}

export interface RequestWithPassport extends Request {
  session: SessionWithPassport
}

async function initialize() {
  passport.serializeUser(function (user, done) {
    const { _id, username, name, role, email, listPermission } = user as IUser
    done(null, { _id, username, name, role, email, listPermission })
  })

  passport.deserializeUser(function (obj: any, done) {
    done(null, obj)
  })

  // for admin
  passport.use(
    'local.admin.login',
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password',
      },
      async function (username, password, done) {
        console.log('Authenticating: ' + username)

        // Find Admin
        const user = await ADMIN_MODEL.findOne({ username }).select('-password -__v')

        if (!user)
          return done(null, false, {
            message: ERROR_MESSAGES[ERROR_CODES.USER_NOT_EXISTS],
          })

        if (!(await user.comparePassword(password)) && user.password)
          return done(null, false, {
            message: ERROR_MESSAGES[ERROR_CODES.AUTHENTICATION_FAILED],
          })

        // handle permissions
        let listPermissionWithDepartment: UniquePermissionsResult[] = []
        if (user.role) {
          try {
            listPermissionWithDepartment = await getUniquePermissionsForRole(user.role as any)
          } catch (error) {
            console.log('Error', error)
            return done(null, false, {
              message: ERROR_MESSAGES[ERROR_CODES.AUTHENTICATION_FAILED],
            })
          }
        }

        return done(null, {
          username: user.username,
          _id: user._id,
          listPermission: formatPermissions(listPermissionWithDepartment),
        })
      },
    ),
  )
}

const PASSPORT_ADMIN_LOGIN_OPTIONS = {
  successRedirect: '/cms/dashboard',
  failureRedirect: '/login?wrong=true',
}

export { initialize as passportInitialize, PASSPORT_ADMIN_LOGIN_OPTIONS }
