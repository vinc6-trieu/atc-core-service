import express from 'express'
import { dashboardViewController } from '../../../controllers/cms/v1/dashboard.controller'
import { isAuthenticated } from '../../../middlewares/check-authenticated'
import adminRoute from './admin.route'
import imageRoute from './image.route'
import newsCategoryRoute from './news-category.route'
import newsRoute from './news.route'
import eventsCategoryRoute from './events-category.route'
import eventsRoute from './events.route'
import courseRouter from './course.route'
import contactRequests from './contact-requests.route'
import courseCategoryRoute from './course-category.route'

export const cmsV1Route = express.Router()

// dashboard routes
cmsV1Route.get('/dashboard', isAuthenticated, dashboardViewController.renderAdminDashboard)

cmsV1Route.use('/admins', isAuthenticated, adminRoute)
cmsV1Route.use('/news-categories', isAuthenticated, newsCategoryRoute)
cmsV1Route.use('/news', isAuthenticated, newsRoute)
cmsV1Route.use('/courses', isAuthenticated, courseRouter)
cmsV1Route.use('/contact-requests', isAuthenticated, contactRequests)
cmsV1Route.use('/events-categories', isAuthenticated, eventsCategoryRoute)
cmsV1Route.use('/course-categories', isAuthenticated, courseCategoryRoute)
cmsV1Route.use('/events', isAuthenticated, eventsRoute)
cmsV1Route.use('/images', isAuthenticated, imageRoute)
