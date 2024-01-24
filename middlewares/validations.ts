import { NextFunction, Request, Response } from 'express'
import yup from 'yup'
import { ERROR_CODES } from '../constants/response-message.constant'

export const bodyValidation =
  (yupSchema: yup.AnyObjectSchema) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await yupSchema?.validate(req.body)
      return next()
    } catch (err: any) {
      return res.status(400).json({
        error: true,
        message: err.message,
        error_code: ERROR_CODES.INVALID_PARAMETER,
      })
    }
  }

export const queryValidation =
  (yupSchema: yup.AnyObjectSchema) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await yupSchema?.validate(req.query)
      return next()
    } catch (err: any) {
      return res.status(400).json({
        error: true,
        message: err.message,
        error_code: ERROR_CODES.INVALID_PARAMETER,
      })
    }
  }
