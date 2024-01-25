import express from 'express'
import { adminViewController } from '../../../controllers/cms/v1/admin.controller'

const router = express.Router()

// ---------------------- RENDER VIEW - REQUESTS --------------------
/**
 * @swagger
 * /:
 *   get:
 *     description: Render list admin
 *     responses:
 *       200:
 *         description: Returns a html.
 */
router.get('/list', adminViewController.renderList)

export default router
