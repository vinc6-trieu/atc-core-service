import express from 'express'
import { uploadImage } from '../../../middlewares/upload-file'
import { newsEventsController } from '../../../controllers/cms-api/index'
import { bodyValidation } from '../../../middlewares'
import { NewsInfoValidationSchema } from '../../../schemas/news.schema'

export const eventsRoute = express.Router()

// -------------------- CREATE OR UPDATE ----------------------------
eventsRoute.post('/', uploadImage.none(), newsEventsController.createID)
eventsRoute.put(
  '/:id',
  bodyValidation(NewsInfoValidationSchema),
  uploadImage.none(),
  newsEventsController.createOrUpdate,
)
eventsRoute.put('/:id/status/:status', uploadImage.none(), newsEventsController.updatENewsEventsStatus)
eventsRoute.post('/quick-update/:id', uploadImage.none(), newsEventsController.quickUpdate)

// -------------------- DELETE ----------------------------
eventsRoute.delete('/:id', uploadImage.none(), newsEventsController.removeOne)
eventsRoute.delete('/:id/:lang', uploadImage.none(), newsEventsController.removeInfo)
