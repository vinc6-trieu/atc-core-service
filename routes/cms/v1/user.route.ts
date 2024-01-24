import express, { Request, Response } from 'express'

const router = express.Router()

// ---------------------- GET - REQUESTS --------------------
router.get('/info', (req: Request, res: Response) => {
  const user = {}

  res.json(user)
})

export default router
