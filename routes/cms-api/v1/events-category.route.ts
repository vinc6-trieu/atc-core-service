import express from 'express'
import { uploadImage } from '../../../middlewares/upload-file'
import { newsEventsCategoryController } from '../../../controllers/cms-api/index'

export const eventsCategoryRoute = express.Router()

// -------------------- CREATE OR UPDATE ----------------------------
eventsCategoryRoute.post('/', uploadImage.none(), newsEventsCategoryController.createID)
eventsCategoryRoute.put('/:id', uploadImage.none(), newsEventsCategoryController.createOrUpdate)
eventsCategoryRoute.put(
  '/:id/status/:status',
  uploadImage.none(),
  newsEventsCategoryController.updateCategoryStatus,
)

// -------------------- DELETE ----------------------------
eventsCategoryRoute.delete('/:id', uploadImage.none(), newsEventsCategoryController.removeOne)
eventsCategoryRoute.delete(
  '/:id/:lang',
  uploadImage.none(),
  newsEventsCategoryController.removeInfo,
)
