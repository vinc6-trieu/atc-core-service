import express from 'express'
import { contactRequestsViewController } from '../../../controllers/cms/v1/contact-requests.controller'

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
router.get('/list', contactRequestsViewController.renderList)
router.get('/:id', contactRequestsViewController.renderEdit)

export default router
