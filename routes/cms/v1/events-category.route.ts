import express from 'express'
import { newsEventsCategoryViewController } from '../../../controllers/cms/index'

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
router.get('/list', newsEventsCategoryViewController.renderListEvents)
router.get('/:id', newsEventsCategoryViewController.renderEditEvents)

export default router
