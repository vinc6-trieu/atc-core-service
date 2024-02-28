import express from 'express'
import { uploadImage } from '../../../middlewares/upload-file'
import { newsEventsCategoryController } from '../../../controllers/cms-api/index'
import { checkRole } from '../../../middlewares/check-role'
import { ERoles } from '../../../shared/enums/roles.enum'
import { newsEventsCategoryService } from '../../../services/news-events-category.service'
import { canPublish } from '../../../middlewares/can-publish'

export const eventsCategoryRoute = express.Router()

// -------------------- CREATE OR UPDATE ----------------------------
eventsCategoryRoute.post(
  '/',
  uploadImage.none(),
  canPublish(newsEventsCategoryService, true),
  newsEventsCategoryController.createID,
)
eventsCategoryRoute.put(
  '/:id',
  uploadImage.none(),
  canPublish(newsEventsCategoryService, true),
  newsEventsCategoryController.createOrUpdate,
)
eventsCategoryRoute.put(
  '/:id/status/:status',
  uploadImage.none(),
  canPublish(newsEventsCategoryService, true),
  newsEventsCategoryController.updateCategoryStatus,
)

// -------------------- DELETE ----------------------------
eventsCategoryRoute.delete(
  '/:id',
  uploadImage.none(),
  checkRole(ERoles.MANAGER),
  newsEventsCategoryController.removeOne,
)
eventsCategoryRoute.delete(
  '/:id/:lang',
  uploadImage.none(),
  checkRole(ERoles.MANAGER),
  newsEventsCategoryController.removeInfo,
)
