import express from 'express'
import { uploadImage } from '../../../middlewares/upload-file'
import { newsCategoryController } from '../../../controllers/cms-api/news-category.controller'

export const newsCategoryRoute = express.Router()

// -------------------- CREATE OR UPDATE ----------------------------
newsCategoryRoute.post('/', uploadImage.none(), newsCategoryController.createID)
newsCategoryRoute.put('/:id', uploadImage.none(), newsCategoryController.createOrUpdate)
newsCategoryRoute.put(
  '/:id/status/:status',
  uploadImage.none(),
  newsCategoryController.updateNewsCategoryStatus,
)

// -------------------- DELETE ----------------------------
newsCategoryRoute.delete('/:id', uploadImage.none(), newsCategoryController.removeOne)
newsCategoryRoute.delete('/:id/:lang', uploadImage.none(), newsCategoryController.removeInfo)
