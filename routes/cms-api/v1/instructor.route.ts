import express from 'express'
import { uploadImage } from '../../../middlewares/upload-file'
import { instructorController } from '../../../controllers/cms-api/v1/instructor.controller'

export const instructorRoute = express.Router()

// -------------------- CREATE OR UPDATE ----------------------------
instructorRoute.post('/', uploadImage.none(), instructorController.createID)
instructorRoute.put('/:id', uploadImage.none(), instructorController.createOrUpdate)

// -------------------- DELETE ----------------------------
instructorRoute.delete('/:id', uploadImage.none(), instructorController.removeOne)
instructorRoute.delete('/:id/:lang', uploadImage.none(), instructorController.removeInfo)
