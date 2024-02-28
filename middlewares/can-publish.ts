import { NextFunction, Response } from 'express'
import { RequestWithPassport } from '../authentication/passport'
import { STATUS_CODE } from '../constants/base.constant'
import { ERROR_CODES, ERROR_MESSAGES } from '../constants/response-message.constant'
import { ERoles } from '../shared/enums/roles.enum'
import { tuple } from 'yup'

enum Status {
  Draft = 'draft',
  Private = 'private_noindex',
  Redirect = 'redirect_noindex',
  PublicNoIndex = 'public',
  PublicIndex = 'public_index',
  Deleted = 'deleted',
}

export function canPublish(service: any, flag: boolean) {
  return async (req: RequestWithPassport, res: Response, next: NextFunction) => {
    const { id } = req.params

    const userRole = req.session?.passport?.user?.role

    let { status, lang } = req.body

    status = status ?? req.params.status

    const object = await service.getOne({
      queryConditions: { _id: id },
      ...(flag ? { populates: [`${lang}`] } : {}),
    })

    const currentStatus = flag ? object.data?.[`${lang}`]?.status : object.data?.status

    if (status !== currentStatus) {
      switch (userRole) {
        case ERoles.SUPER_ADMIN:
          return next() // Admin has full access to all statuses
        case ERoles.MANAGER:
          // Manager can access and publish all statuses except 'deleted'
          if (status === Status.Deleted) {
            return res.status(403).json({ error: true, data: null, message: 'Unauthorized: Access limit' })
          }
        case ERoles.EDITOR:
          // Editor can access all statuses except 'deleted' and 'public_index' and 'publish'
          if (
            status === Status.Deleted ||
            status === Status.PublicIndex ||
            status === Status.PublicNoIndex
          ) {
            return res.status(403).json({ error: true, data: null, message: 'Unauthorized: Access limit' })
          }
        default:
          return res.status(403).json({ error: true, data: null, message: 'Unauthorized: Access limit' })
      }
    }

    return next()
  }
}
