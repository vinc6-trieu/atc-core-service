import express from 'express'
import { newsEventsCategoryViewController } from '../../../controllers/cms/v1/news-events-category.controller'

const router = express.Router()

// ---------------------- RENDER VIEW - REQUESTS --------------------
/**
 * @swagger
 * /:
 *   get:
 *     description: Render list post category
 *     responses:
 *       200:
 *         description: Returns a html.
 */
router.get('/list', newsEventsCategoryViewController.renderListNews)
router.get('/:id', newsEventsCategoryViewController.renderEditNews)

export default router
