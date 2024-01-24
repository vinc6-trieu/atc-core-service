import express from 'express'
import { pageTypeController } from '../../../controllers/api/page-type.controller'
export const pageTypeRoute = express.Router()

pageTypeRoute.get('/info', pageTypeController.getInfo)
pageTypeRoute.get('/static-rendering', pageTypeController.getListByStaticRendering)
