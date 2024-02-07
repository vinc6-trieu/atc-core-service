import { Request, Response, NextFunction } from 'express'
import { ERROR_CODES, ERROR_MESSAGES } from '../constants/response-message.constant'

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack ?? err ?? 'Something went wrong!!') // Log the error for debugging purposes

  // Handle other types of errors here

  // Handle error log monitoring here

  if (req.path.startsWith('/api'))
    if (!res.status)
      return res.status(500).json({
        error: true,
        message: ERROR_MESSAGES[ERROR_CODES.INTERNAL_SERVER_ERROR],
        error_code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      })

  if (!res.status) return res.render('404')

  next()
}
