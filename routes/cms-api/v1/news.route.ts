import express from 'express'
import { uploadImage } from '../../../middlewares/upload-file'
import { newsController } from '../../../controllers/cms-api/news.controller'
import { bodyValidation } from '../../../middlewares'
import { NewsInfoValidationSchema } from '../../../schemas/news.schema'

export const newsRoute = express.Router()

// -------------------- CREATE OR UPDATE ----------------------------
newsRoute.post('/', uploadImage.none(), newsController.createID)
newsRoute.put(
  '/:id',
  bodyValidation(NewsInfoValidationSchema),
  uploadImage.none(),
  newsController.createOrUpdate,
)
newsRoute.put('/:id/status/:status', uploadImage.none(), newsController.updateNewsStatus)
newsRoute.post('/quick-update/:id', uploadImage.none(), newsController.quickUpdate)

// -------------------- DELETE ----------------------------
newsRoute.delete('/:id', uploadImage.none(), newsController.removeOne)
newsRoute.delete('/:id/:lang', uploadImage.none(), newsController.removeInfo)
