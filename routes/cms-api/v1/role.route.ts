import express from 'express'
import { uploadImage } from '../../../middlewares/upload-file'
import { roleController } from '../../../controllers/cms-api/role.controller'

export const roleRoute = express.Router()

// -------------------- CREATE OR UPDATE ----------------------------
roleRoute.post('/', uploadImage.none(), roleController.createID)
roleRoute.put('/:id', uploadImage.none(), roleController.createOrUpdate)

// -------------------- DELETE ----------------------------
roleRoute.delete('/:id', uploadImage.none(), roleController.removeOne)
