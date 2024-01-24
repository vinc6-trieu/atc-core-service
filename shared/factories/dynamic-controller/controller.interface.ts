import { NextFunction, Request, Response } from 'express'

interface DynamicController {
  handleGetBySlugRequest(req: Request, res: Response, next: NextFunction): Promise<any>
}

export default DynamicController
