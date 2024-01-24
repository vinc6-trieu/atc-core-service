import express from 'express'
import adminRoute from './admin.route'
import newsCategoryRoute from './news-category.route'
import imageRoute from './image.route'
import roleRoute from './role.route'
import policyRoute from './policy.route'
import newsRoute from './news.route'
import { dashboardViewController } from '../../controllers/cms/dashboard.controller'
import { isAuthenticated } from '../../middlewares/check-authenticated'

export const cmsRoute = express.Router()

// dashboard routes
cmsRoute.get('/dashboard', isAuthenticated, dashboardViewController.renderAdminDashboard)

cmsRoute.use('/admins', isAuthenticated, adminRoute)
cmsRoute.use('/news-categories', isAuthenticated, newsCategoryRoute)
cmsRoute.use('/news', isAuthenticated, newsRoute)
cmsRoute.use('/images', isAuthenticated, imageRoute)
cmsRoute.use('/roles', isAuthenticated, roleRoute)
cmsRoute.use('/policies', isAuthenticated, policyRoute)
