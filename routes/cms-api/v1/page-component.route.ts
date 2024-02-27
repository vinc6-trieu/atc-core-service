import express from 'express'
import { uploadImage } from '../../../middlewares/upload-file'
import { pageComponentController } from '../../../controllers/cms-api/v1/page-component.controller'

export const pageComponentRoute = express.Router()

// -------------------- CREATE OR UPDATE ----------------------------
pageComponentRoute.post('/', uploadImage.none(), pageComponentController.createID)
pageComponentRoute.put('/:id', uploadImage.none(), pageComponentController.createOrUpdate)

// -------------------- DELETE ----------------------------
pageComponentRoute.delete('/:id', uploadImage.none(), pageComponentController.removeOne)
