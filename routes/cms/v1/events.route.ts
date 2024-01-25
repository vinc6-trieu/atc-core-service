import express from 'express'
import { newsEventsViewController } from '../../../controllers/cms/index'

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
router.get('/list', newsEventsViewController.renderListEvents)
router.get('/:id', newsEventsViewController.renderEditEvents)

export default router
