import express from 'express'
import { newsCategoryViewController } from '../../controllers/cms/news-category.controller'

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
router.get('/list', newsCategoryViewController.renderList)
router.get('/:id', newsCategoryViewController.renderEdit)

export default router
