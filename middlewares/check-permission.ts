// import { NextFunction, Response, Request } from 'express'
// import { RequestWithPassport } from '../authentication/passport'

// // Middleware function to check access based on roles and permissions
// const checkAccessMiddleware = (requiredPermission: string) => {
//   return (req: RequestWithPassport, res: Response, next: NextFunction) => {
//     // Assuming that you have a user object attached to the request
//     const user = req.session.passport?.user

//     if (!user) {
//       return res.status(401).json({ error: 'Unauthorized' })
//     }

//     // Check if any of the user's roles have the required permission
//     const hasPermission = user.role.policies.some((policy) =>
//         policy.permissions.some((permission) => permission.operation === requiredPermission),
//       ),
//     )

//     if (hasPermission) {
//       // User has the required permission, proceed to the next middleware
//       next()
//     } else {
//       // User doesn't have the required permission
//       return res.status(403).json({ error: 'Forbidden' })
//     }
//   }
// }
