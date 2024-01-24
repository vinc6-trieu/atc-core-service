import { NextFunction, Request, Response } from 'express'
import { IResponseData } from '../shared/interfaces/base.interface'
import { API_CMS_URL, CMS_URL } from '../constants/base.constant'

export function formatResponse(
  req: Request,
  res: Response<IResponseData<any>>,
  next: NextFunction,
) {
  const originalJson = res.json
  const originalRender = res.render

  res.json = function (body?: any): Response<IResponseData<any>> {
    if (typeof body === 'object') {
      // If the response body is an object, format it according to IResponseData
      const responseData: IResponseData<any> = {
        error: res.statusCode >= 400,
        data: body.data,
        message: body.message ?? res.statusMessage,
        error_code: body.error_code ?? res.statusCode.toString(),
      }

      return originalJson.call(res, responseData)
    } else {
      // If the response body is not an object, handle it as plain text
      res.setHeader('Content-Type', 'text/plain')
      return originalJson.call(res, {
        error: res.statusCode >= 400,
        data: body,
        message: res.statusCode.toString(),
      })
    }
  }

  res.render = function (
    view: string,
    locals?: any,
    callback?: (err: Error, html: string) => void,
  ): void {
    // Handle view rendering here if needed
    // You can modify locals or do additional processing
    locals = {
      ...locals,
      API_CMS_URL,
      CMS_URL,
    }
    // Continue with the original render method
    originalRender.call(res, view, locals)
  }

  next()
}
