import express from 'express'
import { PASSPORT_ADMIN_LOGIN_OPTIONS, passportInitialize } from '../../../authentication/passport'
import passport from 'passport'

export const authRoute = express.Router()

passportInitialize()

// -------------------- POST REQUEST -----------------------------
authRoute.post('/', passport.authenticate('local.admin.login', PASSPORT_ADMIN_LOGIN_OPTIONS))
