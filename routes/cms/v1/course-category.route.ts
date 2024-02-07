import express from 'express'
import { courseCategoryViewController } from '../../../controllers/cms/v1/course-category.controller'

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
router.get('/list', courseCategoryViewController.renderList)
router.get('/:id', courseCategoryViewController.renderEdit)

export default router
