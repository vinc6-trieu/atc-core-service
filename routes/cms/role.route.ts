import express from 'express'
import { roleViewController } from '../../controllers/cms/role.controller'

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
router.get('/list', roleViewController.renderList)

router.get('/:id', roleViewController.renderEdit)

export default router
