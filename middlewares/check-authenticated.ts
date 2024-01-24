import { NextFunction, Request, Response } from 'express'

// Custom middleware to check if the user is authenticated
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    console.log("Authenticate failed")
    res.redirect('/login') // Redirect to the login page if not authenticated
  }
}
