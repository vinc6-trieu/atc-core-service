import express from 'express'

import { adminRoute } from './admin.route'
import { imageRoute } from './image.route'
import { newsCategoryRoute } from './news-category.route'
import { newsRoute } from './news.route'
import { authRoute } from './auth.route'
import { isAuthenticated } from '../../../middlewares/check-authenticated'
import { typePageRoute } from './type-page.route'
import { tagRoute } from './tag.route'
import { eventsCategoryRoute } from './events-category.route'
import { eventsRoute } from './events.route'
import { courseRoute } from './course.route'
import { courseCategoryRoute } from './course-category.route'
import { contactRequestsRoute } from './contact-requests.route'

export const cmsV1ApiV1Route = express.Router()

cmsV1ApiV1Route.use('/auth', authRoute)
cmsV1ApiV1Route.use('/admins', isAuthenticated, adminRoute)
cmsV1ApiV1Route.use('/images', imageRoute)
cmsV1ApiV1Route.use('/news-categories', isAuthenticated, newsCategoryRoute)
cmsV1ApiV1Route.use('/news', isAuthenticated, newsRoute)
cmsV1ApiV1Route.use('/contact-requests', isAuthenticated, contactRequestsRoute)
cmsV1ApiV1Route.use('/events-categories', isAuthenticated, eventsCategoryRoute)
cmsV1ApiV1Route.use('/course-categories', isAuthenticated, courseCategoryRoute)
cmsV1ApiV1Route.use('/events', isAuthenticated, eventsRoute)
cmsV1ApiV1Route.use('/courses', isAuthenticated, courseRoute)
cmsV1ApiV1Route.use('/tags', tagRoute)
cmsV1ApiV1Route.use('/page-types', typePageRoute)
