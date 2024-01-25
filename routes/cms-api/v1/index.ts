import express from 'express'

import { adminRoute } from './admin.route'
import { imageRoute } from './image.route'
import { newsCategoryRoute } from './news-category.route'
import { newsRoute } from './news.route'
import { authRoute } from './auth.route'
import { policyRoute } from './policy.route'
import { roleRoute } from './role.route'
import { isAuthenticated } from '../../../middlewares/check-authenticated'
import { typePageRoute } from './type-page.route'
import { tagRoute } from './tag.route'
import { permissionRoute } from './permission.route'
import { eventsCategoryRoute } from './events-category.route'
import { eventsRoute } from './events.route'

export const cmsV1ApiV1Route = express.Router()

cmsV1ApiV1Route.use('/auth', authRoute)
cmsV1ApiV1Route.use('/admins', isAuthenticated, adminRoute)
cmsV1ApiV1Route.use('/images', imageRoute)
cmsV1ApiV1Route.use('/news-categories', isAuthenticated, newsCategoryRoute)
cmsV1ApiV1Route.use('/news', isAuthenticated, newsRoute)
cmsV1ApiV1Route.use('/events-categories', isAuthenticated, eventsCategoryRoute)
cmsV1ApiV1Route.use('/events', isAuthenticated, eventsRoute)
cmsV1ApiV1Route.use('/policies', policyRoute)
cmsV1ApiV1Route.use('/permissions', permissionRoute)
cmsV1ApiV1Route.use('/roles', isAuthenticated, roleRoute)
cmsV1ApiV1Route.use('/tags', tagRoute)
cmsV1ApiV1Route.use('/page-types', typePageRoute)
