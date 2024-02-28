import express from 'express'
import { uploadImage } from '../../../middlewares/upload-file'
import { newsEventsController } from '../../../controllers/cms-api/index'
import { bodyValidation } from '../../../middlewares'
import { NewsInfoValidationSchema } from '../../../schemas/news.schema'
import { canPublish } from '../../../middlewares/can-publish'
import { newsEventsService } from '../../../services/news-events.service'
import { checkRole } from '../../../middlewares/check-role'
import { ERoles } from '../../../shared/enums/roles.enum'

export const eventsRoute = express.Router()

// -------------------- CREATE OR UPDATE ----------------------------
eventsRoute.post('/', uploadImage.none(), newsEventsController.createID)
eventsRoute.put(
  '/:id',
  bodyValidation(NewsInfoValidationSchema),
  uploadImage.none(),
  canPublish(newsEventsService, true),
  newsEventsController.createOrUpdate,
)
eventsRoute.put(
  '/:id/status/:status',
  uploadImage.none(),
  canPublish(newsEventsService, true),
  newsEventsController.updatENewsEventsStatus,
)
eventsRoute.post(
  '/quick-update/:id',
  uploadImage.none(),
  newsEventsController.quickUpdate,
)

// -------------------- DELETE ----------------------------
eventsRoute.delete(
  '/:id',
  uploadImage.none(),
  checkRole(ERoles.MANAGER),
  newsEventsController.removeOne,
)
eventsRoute.delete(
  '/:id/:lang',
  checkRole(ERoles.MANAGER),
  uploadImage.none(),
  newsEventsController.removeInfo,
)
