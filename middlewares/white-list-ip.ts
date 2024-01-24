import { Request, Response, NextFunction } from 'express'
import { STATUS_CODE } from '../constants/base.constant'
import { WhiteListAccess } from '../config/white-list-ip'

async function whiteListIp(req: Request, res: Response, next: NextFunction) {
  const ipClient = req.ip
  if (ipClient == '' || !WhiteListAccess['list_ip'].includes(ipClient)) {
    return res.status(STATUS_CODE.FORBIDDEN).send('Forbidden: Access is Denied')
  }

  return next()
}

export { whiteListIp }
