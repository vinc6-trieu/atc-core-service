import express from 'express'
import { bodyValidation } from '../../../middlewares'
import { RegisterAdminSchema } from '../../../schemas/auth.schema'
import { adminController } from '../../../controllers/cms-api/v1/admin.controller'
import { uploadImage } from '../../../middlewares/upload-file'
import { checkRole } from '../../../middlewares/check-role'
import { ERoles } from '../../../shared/enums/roles.enum'
import { isAuthenticated } from '../../../middlewares/check-authenticated'
export const adminRoute = express.Router()

// ---------------------- GET - REQUESTS --------------------
adminRoute.get('/:adminId', adminController.getInfoById)

// ---------------------- POST - REQUESTS --------------------
adminRoute.post(
  '/',
  checkRole(ERoles.SUPER_ADMIN),
  isAuthenticated,
  uploadImage.none(),
  bodyValidation(RegisterAdminSchema),
  adminController.create,
)

adminRoute.patch(
  '/password',
  isAuthenticated,
  uploadImage.none(),
  adminController.updatePassword,
)

adminRoute.delete('/:id', isAuthenticated, adminController.removeOne)
