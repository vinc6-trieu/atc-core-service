import express from 'express'
import { uploadImage } from '../../../middlewares/upload-file'
import { courseRegisterController } from '../../../controllers/cms-api/v1/course-register.controller'

export const courseRegisterRoute = express.Router()

// -------------------- CREATE OR UPDATE ----------------------------
courseRegisterRoute.post('/', uploadImage.none(), courseRegisterController.createID)
courseRegisterRoute.put('/:id', uploadImage.none(), courseRegisterController.createOrUpdate)

// -------------------- DELETE ----------------------------
courseRegisterRoute.delete('/:id', uploadImage.none(), courseRegisterController.removeOne)
