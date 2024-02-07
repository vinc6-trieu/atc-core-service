import express from 'express'
import { courseViewController } from '../../../controllers/cms/v1/course.controller'

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
router.get('/list', courseViewController.renderList)
router.get('/:id', courseViewController.renderEdit)

export default router
