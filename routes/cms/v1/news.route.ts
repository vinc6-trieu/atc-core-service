import express from 'express'
import { newsEventsViewController } from '../../../controllers/cms/v1/news-events.controller'

const router = express.Router()

// ---------------------- RENDER VIEW - REQUESTS --------------------
/**
 * @swagger
 * /:
 *   get:
 *     description: Render list post
 *     responses:
 *       200:
 *         description: Returns a html.
 */
router.get('/list', newsEventsViewController.renderListNews)
router.get('/:id', newsEventsViewController.renderEditNews)

export default router
