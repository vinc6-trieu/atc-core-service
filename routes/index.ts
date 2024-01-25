import express from 'express'
import { cmsApiRoute } from './cms-api'
import { cmsRoute } from './cms'
import { apiRoute } from './api'
import { authViewController } from '../controllers/cms/v1/auth.controller'

const router = express.Router()

//CMS auth routes
router.get('/', authViewController.renderLoginPage)
router.get('/login', authViewController.renderLoginPage)
router.get('/logout', authViewController.destroySession)

//CMS routes
router.use('/cms', cmsRoute)

//CMS API routes
router.use('/cms-api', cmsApiRoute)

//API routes
router.use('/api', apiRoute)

export default router
