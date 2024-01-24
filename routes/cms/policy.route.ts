import express from 'express'
import { policyViewController } from '../../controllers/cms/policy.controller'

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
router.get('/list', policyViewController.renderList)

router.get('/:id', policyViewController.renderEdit)

export default router
