// // Permission class representing a specific action on an endpoint
// class Permission {
//   constructor(public endpoint: string, public operation: string) {}
// }

// // Policy class containing a set of permissions
// class Policy {
//   constructor(public name: string, public permissions: Permission[]) {}
// }

// // Role class associated with a set of policies
// class Role {
//   constructor(public name: string, public policies: Policy[]) {}
// }

// // User class assigned with one or more roles
// class User {
//   constructor(public username: string, public roles: Role[]) {}
// }

// // Example Usage:

// // Define some permissions
// const editContentPermission = new Permission('/cms/edit', 'edit');
// const publishContentPermission = new Permission('/cms/publish', 'publish');

// // Create policies
// const editorPolicy = new Policy('EditorPolicy', [editContentPermission]);
// const adminPolicy = new Policy('AdminPolicy', [editContentPermission, publishContentPermission]);

// // Create roles
// const editorRole = new Role('Editor', [editorPolicy]);
// const adminRole = new Role('Admin', [adminPolicy]);

// // Create users and assign roles
// const user1 = new User('JohnDoe', [editorRole]);
// const user2 = new User('AdminUser', [adminRole]);

// // Print user roles and associated policies
// console.log(`${user1.username}'s Roles and Policies:`);
// user1.roles.forEach(role => {
//   console.log(`- ${role.name}`);
//   role.policies.forEach(policy => {
//     console.log(`  - ${policy.name}`);
//     policy.permissions.forEach(permission => {
//       console.log(`    - ${permission.operation} ${permission.endpoint}`);
//     });
//   });
// });

// console.log(`${user2.username}'s Roles and Policies:`);
// user2.roles.forEach(role => {
//   console.log(`- ${role.name}`);
//   role.policies.forEach(policy => {
//     console.log(`  - ${policy.name}`);
//     policy.permissions.forEach(permission => {
//       console.log(`    - ${permission.operation} ${permission.endpoint}`);
//     });
//   });
// });




// import { Request, Response, NextFunction } from 'express';

// // Define your User, Role, Policy, and Permission classes here (similar to the previous example)

// // Middleware function to check access based on roles and permissions
// const checkAccessMiddleware = (requiredPermission: string) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     // Assuming that you have a user object attached to the request
//     const user = req.user as User;

//     if (!user) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     // Check if any of the user's roles have the required permission
//     const hasPermission = user.roles.some(role =>
//       role.policies.some(policy =>
//         policy.permissions.some(permission =>
//           permission.operation === requiredPermission
//         )
//       )
//     );

//     if (hasPermission) {
//       // User has the required permission, proceed to the next middleware
//       next();
//     } else {
//       // User doesn't have the required permission
//       return res.status(403).json({ error: 'Forbidden' });
//     }
//   };
// };

// // Example usage of the middleware
// const app = express();

// // Attach the middleware to a specific route
// app.get('/cms/edit', checkAccessMiddleware('edit'), (req, res) => {
//   // Only users with the 'edit' permission will reach this endpoint
//   res.json({ message: 'You have permission to edit content' });
// });

// app.get('/cms/publish', checkAccessMiddleware('publish'), (req, res) => {
//   // Only users with the 'publish' permission will reach this endpoint
//   res.json({ message: 'You have permission to publish content' });
// });

// // Error handler for unauthorized access
// app.use((err: any, req: Request, res: Response, next: NextFunction) => {
//   if (err.status === 401) {
//     res.status(401).json({ error: 'Unauthorized' });
//   } else {
//     next(err);
//   }
// });

// // Error handler for forbidden access
// app.use((err: any, req: Request, res: Response, next: NextFunction) => {
//   if (err.status === 403) {
//     res.status(403).json({ error: 'Forbidden' });
//   } else {
//     next(err);
//   }
// });
