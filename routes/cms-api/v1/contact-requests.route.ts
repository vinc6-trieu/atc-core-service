import express from 'express'
import { uploadImage } from '../../../middlewares/upload-file'
import { contactRequestController } from '../../../controllers/cms-api/index'

export const contactRequestsRoute = express.Router()

// -------------------- CREATE OR UPDATE ----------------------------
contactRequestsRoute.post('/', uploadImage.none(), contactRequestController.createID)
contactRequestsRoute.put('/:id', uploadImage.none(), contactRequestController.createOrUpdate)

// -------------------- DELETE ----------------------------
contactRequestsRoute.delete('/:id', uploadImage.none(), contactRequestController.removeOne)
