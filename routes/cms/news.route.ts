import express from 'express'
import { newsViewController } from '../../controllers/cms/news.controller'

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
router.get('/list', newsViewController.renderList)
router.get('/:id', newsViewController.renderEdit)

export default router
