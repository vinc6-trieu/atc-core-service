import express from 'express'
import { imageViewController } from '../../../controllers/cms/v1/image.controller'

const router = express.Router()

// ---------------------- RENDER VIEW - REQUESTS --------------------
router.get('/gallery', imageViewController.renderGallery)
router.get("/upload-ckeditor", imageViewController.renderGalleryCkeditor);

export default router
