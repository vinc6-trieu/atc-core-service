import express from 'express'
import { courseRegisterViewController } from '../../../controllers/cms/v1/course-register.controller'

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
router.get('/list', courseRegisterViewController.renderList)
router.get('/:id', courseRegisterViewController.renderEdit)

export default router
