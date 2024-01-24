import express from 'express'
import { imageController } from '../../../controllers/cms-api/image.controller'
import { uploadImage } from '../../../middlewares/upload-file'
import { saveImagesToDB } from '../../../middlewares/save-file-to-database'
export const imageRoute = express.Router()

// ---------------------- GET - REQUESTS ---------------------
imageRoute.get('/:id', imageController.getOne)
imageRoute.get('/', imageController.getList)

// ---------------------- POST - REQUESTS --------------------
imageRoute.post(
  '/',
  uploadImage.fields([{ maxCount: 10, name: 'images' }]),
  saveImagesToDB,
  imageController.createImage,
)

imageRoute.post(
  '/ckeditor',
  uploadImage.fields([{ maxCount: 10, name: 'upload' }]),
  saveImagesToDB,
  imageController.createImageCKEditor,
)

imageRoute.post(
  '/ckeditor&responseType=json',
  uploadImage.fields([{ maxCount: 10, name: 'upload' }]),
  saveImagesToDB,
  imageController.createImageCKEditor,
)

// ---------------------- PUT - REQUESTS ---------------------
imageRoute.put('/', uploadImage.none(), imageController.updateImage)

// ---------------------- DELETE REQUESTS --------------------
imageRoute.delete('/:id', imageController.removeOne)
