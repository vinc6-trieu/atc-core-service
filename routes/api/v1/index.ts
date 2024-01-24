import express from 'express'
import { categoryRoute } from './category.route'
import { homeController } from '../../../controllers/api/home.controller'
import { pageTypeRoute } from './page-type.route'
import { publicController } from '../../../controllers/api/public.controller'

export const apiV1Route = express.Router()

apiV1Route.use('/categories', categoryRoute)
apiV1Route.use('/page-types', pageTypeRoute)

// dashboard routes
apiV1Route.get('/menu', homeController.getJSONMenu)

apiV1Route.get('/home-page', homeController.getJSONHome)

apiV1Route.get('/:slug', publicController.getBySlug)
