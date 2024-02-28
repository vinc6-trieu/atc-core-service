import { NextFunction, Response } from 'express'
import { RequestWithPassport } from '../../authentication/passport'
import { AdminDocument } from '../../models/admin.model'

exports.roleValue = {
  // 0 : admin
  // 1 : seo
  // 2 : editor

  CREATE_ARTICLE: 2,
  UPDATE_ARTICLE: 2,
  PUBLISH_ARTICLE: 3,
  UPDATE_CATEGORY: 1,
  UPDATE_REDIRECT: 1,

  DELETE_CATEGORY_ARTICLE: 1,

  KICK_EDITOR: 0,
  KICK_SEO: 0,
  KICK_ADMIN: 0,

  CREATE_EDITOR: 0,
  CREATE_SEO: 0,
}

export function checkRole(requiredRole: number) {
  return (req: RequestWithPassport, res: Response, next: NextFunction) => {
    const userRole = req.isAuthenticated() ? (req.user as AdminDocument).role : 0

    // Check if the user has a role less than the required role
    if (userRole < requiredRole) {
      return next()
    } else {
      res.status(403).send('Unauthorized')
    }
  }
}
