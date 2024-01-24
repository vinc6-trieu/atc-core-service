import express from 'express'
import { uploadImage } from '../../../middlewares/upload-file'
import { permissionController } from '../../../controllers/cms-api/permission.controller'

export const permissionRoute = express.Router()

// -------------------- DELETE ----------------------------
permissionRoute.get('/paginate', permissionController.paginate)
permissionRoute.get('/info/:id', permissionController.getOne)

// -------------------- CREATE OR UPDATE ----------------------------
permissionRoute.post('/', uploadImage.none(), permissionController.createID)
permissionRoute.put('/:id', uploadImage.none(), permissionController.createOrUpdate)

// -------------------- DELETE ----------------------------
permissionRoute.delete('/:id', uploadImage.none(), permissionController.removeOne)
