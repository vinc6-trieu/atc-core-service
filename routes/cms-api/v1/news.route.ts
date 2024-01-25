import express from 'express'
import { uploadImage } from '../../../middlewares/upload-file'
import { newsEventsController } from '../../../controllers/cms-api/v1/news-events.controller'
import { bodyValidation } from '../../../middlewares'
import { NewsInfoValidationSchema } from '../../../schemas/news.schema'

export const newsRoute = express.Router()

// -------------------- CREATE OR UPDATE ----------------------------
newsRoute.post('/', uploadImage.none(), newsEventsController.createID)
newsRoute.put(
  '/:id',
  bodyValidation(NewsInfoValidationSchema),
  uploadImage.none(),
  newsEventsController.createOrUpdate,
)
newsRoute.put('/:id/status/:status', uploadImage.none(), newsEventsController.updatENewsEventsStatus)
newsRoute.post('/quick-update/:id', uploadImage.none(), newsEventsController.quickUpdate)

// -------------------- DELETE ----------------------------
newsRoute.delete('/:id', uploadImage.none(), newsEventsController.removeOne)
newsRoute.delete('/:id/:lang', uploadImage.none(), newsEventsController.removeInfo)
