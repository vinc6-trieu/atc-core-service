import express from 'express'
import { instructorViewController } from '../../../controllers/cms/v1/instructor.controller'

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
router.get('/list', instructorViewController.renderList)
router.get('/:id', instructorViewController.renderEdit)

export default router
