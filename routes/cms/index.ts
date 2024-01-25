import express from 'express'
import { cmsV1Route } from './v1'
export const cmsRoute = express.Router()

cmsRoute.use(cmsV1Route)
