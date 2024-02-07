import express from 'express'
import { uploadImage } from '../../../middlewares/upload-file'
import { courseController } from '../../../controllers/cms-api/index'

export const courseRoute = express.Router()

// -------------------- CREATE OR UPDATE ----------------------------
courseRoute.post('/', uploadImage.none(), courseController.createID)
courseRoute.put('/:id', uploadImage.none(), courseController.createOrUpdate)
courseRoute.put('/:id/status/:status', uploadImage.none(), courseController.updateStatus)

// -------------------- DELETE ----------------------------
courseRoute.delete('/:id', uploadImage.none(), courseController.removeOne)
courseRoute.delete('/:id/:lang', uploadImage.none(), courseController.removeInfo)
