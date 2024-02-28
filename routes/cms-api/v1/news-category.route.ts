import express from 'express'
import { uploadImage } from '../../../middlewares/upload-file'
import { newsEventsCategoryController } from '../../../controllers/cms-api/v1/news-events-category.controller'
import { ERoles } from '../../../shared/enums/roles.enum'
import { canPublish } from '../../../middlewares/can-publish'
import { checkRole } from '../../../middlewares/check-role'
import { newsEventsCategoryService } from '../../../services/news-events-category.service'

export const newsCategoryRoute = express.Router()

// -------------------- CREATE OR UPDATE ----------------------------
newsCategoryRoute.post('/', uploadImage.none(), newsEventsCategoryController.createID)
newsCategoryRoute.put(
  '/:id',
  uploadImage.none(),
  canPublish(newsEventsCategoryService, true),
  newsEventsCategoryController.createOrUpdate,
)
newsCategoryRoute.put(
  '/:id/status/:status',
  uploadImage.none(),
  canPublish(newsEventsCategoryService, true),
  newsEventsCategoryController.updateCategoryStatus,
)

// -------------------- DELETE ----------------------------
newsCategoryRoute.delete(
  '/:id',
  uploadImage.none(),
  checkRole(ERoles.MANAGER),
  newsEventsCategoryController.removeOne,
)
newsCategoryRoute.delete(
  '/:id/:lang',
  uploadImage.none(),
  checkRole(ERoles.MANAGER),
  newsEventsCategoryController.removeInfo,
)
