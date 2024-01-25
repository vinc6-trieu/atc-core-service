import express from 'express'
import { uploadImage } from '../../../middlewares/upload-file'
import { pageTypeController } from '../../../controllers/cms-api/v1/page-type.controller'
export const typePageRoute = express.Router()

// -------------------- CREATE OR UPDATE ----------------------------
typePageRoute.post('/', uploadImage.none(), pageTypeController.createID)
typePageRoute.put('/:id', uploadImage.none(), pageTypeController.createOrUpdate)

typePageRoute.post('/create', uploadImage.none(), pageTypeController.create)

// -------------------- DELETE ----------------------------
typePageRoute.delete('/:id', uploadImage.none(), pageTypeController.removeOne)
