import express from 'express'
import { cmsV1ApiV1Route } from './v1'
export const cmsApiRoute = express.Router()

cmsApiRoute.use('/v1', cmsV1ApiV1Route)
