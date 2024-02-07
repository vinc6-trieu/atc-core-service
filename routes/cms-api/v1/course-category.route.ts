import express from 'express'
import { uploadImage } from '../../../middlewares/upload-file'
import { courseCategoryController } from '../../../controllers/cms-api/v1/course-category.controller'

export const courseCategoryRoute = express.Router()

// -------------------- CREATE OR UPDATE ----------------------------
courseCategoryRoute.post('/', uploadImage.none(), courseCategoryController.createID)
courseCategoryRoute.put('/:id', uploadImage.none(), courseCategoryController.createOrUpdate)
courseCategoryRoute.put(
  '/:id/status/:status',
  uploadImage.none(),
  courseCategoryController.updateCategoryStatus,
)

// -------------------- DELETE ----------------------------
courseCategoryRoute.delete('/:id', uploadImage.none(), courseCategoryController.removeOne)
courseCategoryRoute.delete('/:id/:lang', uploadImage.none(), courseCategoryController.removeInfo)
