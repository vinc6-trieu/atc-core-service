import express from 'express'
import { bodyValidation } from '../../../middlewares'
import { RegisterAdminSchema } from '../../../schemas/auth.schema'
import { adminController } from '../../../controllers/cms-api/v1/admin.controller'
export const adminRoute = express.Router()

// ---------------------- GET - REQUESTS --------------------
adminRoute.get('/:adminId', adminController.getInfoById)

// ---------------------- POST - REQUESTS --------------------
adminRoute.post('', bodyValidation(RegisterAdminSchema), adminController.create)
