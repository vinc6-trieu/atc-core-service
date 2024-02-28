import express from 'express'
import { uploadImage } from '../../../middlewares/upload-file'
import { newsEventsController } from '../../../controllers/cms-api/v1/news-events.controller'
import { bodyValidation } from '../../../middlewares'
import { NewsInfoValidationSchema } from '../../../schemas/news.schema'
import { checkRole } from '../../../middlewares/check-role'
import { ERoles } from '../../../shared/enums/roles.enum'
import { canPublish } from '../../../middlewares/can-publish'
import { newsEventsService } from '../../../services/news-events.service'

export const newsRoute = express.Router()

// -------------------- CREATE OR UPDATE ----------------------------
newsRoute.post('/', uploadImage.none(), newsEventsController.createID)
newsRoute.put(
  '/:id',
  bodyValidation(NewsInfoValidationSchema),
  uploadImage.none(),
  canPublish(newsEventsService, true),
  newsEventsController.createOrUpdate,
)
newsRoute.put(
  '/:id/status/:status',
  uploadImage.none(),
  canPublish(newsEventsService, true),
  newsEventsController.updatENewsEventsStatus,
)
newsRoute.post(
  '/quick-update/:id',
  uploadImage.none(),
  newsEventsController.quickUpdate,
)

// -------------------- DELETE ----------------------------
newsRoute.delete(
  '/:id',
  uploadImage.none(),
  checkRole(ERoles.MANAGER),
  newsEventsController.removeOne,
)
newsRoute.delete(
  '/:id/:lang',
  uploadImage.none(),
  checkRole(ERoles.MANAGER),
  newsEventsController.removeInfo,
)
