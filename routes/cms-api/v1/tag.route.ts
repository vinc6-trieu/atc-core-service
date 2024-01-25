import express from 'express'
import { uploadImage } from '../../../middlewares/upload-file'
import { tagController } from '../../../controllers/cms-api/v1/tag.controller'
export const tagRoute = express.Router()

// -------------------- CREATE OR UPDATE ----------------------------
tagRoute.post('/', uploadImage.none(), tagController.createID)
tagRoute.put('/:id', uploadImage.none(), tagController.createOrUpdate)

tagRoute.post('/create', uploadImage.none(), tagController.create)

// -------------------- DELETE ----------------------------
tagRoute.delete('/:id', uploadImage.none(), tagController.removeOne)
