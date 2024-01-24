import { Request, Response, NextFunction } from 'express'

export async function routingDynamicSlug(req: Request, res: Response, next: NextFunction) {
  const { slug } = req.params

  // get typepage by slug

  // get the abstract function to execute

  // execute the fnc

  // handle res

  // return to client

  // otherwise
  return next()
}
