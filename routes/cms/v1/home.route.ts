import express from 'express'
import { homeViewController } from '../../../controllers/cms/index'

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
router.get('/:id', homeViewController.renderEdit)

export default router
