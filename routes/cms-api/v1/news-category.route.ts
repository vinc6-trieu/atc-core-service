import express from 'express'
import { uploadImage } from '../../../middlewares/upload-file'
import { newsEventsCategoryController } from '../../../controllers/cms-api/v1/news-events-category.controller'

export const newsCategoryRoute = express.Router()

// -------------------- CREATE OR UPDATE ----------------------------
newsCategoryRoute.post('/', uploadImage.none(), newsEventsCategoryController.createID)
newsCategoryRoute.put('/:id', uploadImage.none(), newsEventsCategoryController.createOrUpdate)
newsCategoryRoute.put(
  '/:id/status/:status',
  uploadImage.none(),
  newsEventsCategoryController.updateCategoryStatus,
)

// -------------------- DELETE ----------------------------
newsCategoryRoute.delete('/:id', uploadImage.none(), newsEventsCategoryController.removeOne)
newsCategoryRoute.delete('/:id/:lang', uploadImage.none(), newsEventsCategoryController.removeInfo)
