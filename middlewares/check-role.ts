import { NextFunction, Response } from 'express'
import { RequestWithPassport } from '../authentication/passport'
import { STATUS_CODE } from '../constants/base.constant'
import { ERROR_CODES, ERROR_MESSAGES } from '../constants/response-message.constant'

export function checkRole(requiredRole: number) {
  return (req: RequestWithPassport, res: Response, next: NextFunction) => {
    const userRole = req.session?.passport?.user?.role

    // Check if the user has a role less than the required role
    if (userRole != undefined && userRole <= requiredRole) {
      return next()
    } else {
      res.status(STATUS_CODE.UNAUTHORIZED).json({
        error: true,
        data: null,
        message: ERROR_MESSAGES[ERROR_CODES.UNAUTHORIZED],
      })
    }
  }
}
