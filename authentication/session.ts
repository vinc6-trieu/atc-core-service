import session, { Store } from 'express-session'
import { Router } from 'express'
import MongoStore from 'connect-mongo'
import { MONGODB_URI } from '../config/database.config'
import { sessionConfig } from '../config/session.config'

const mongoStore = new MongoStore({
  collectionName: 'sessions',
  mongoUrl: MONGODB_URI,
})

/**
 * @param {*} router Express Routers
 */
export const sessionRegister = async (router: Router) => {
  router.use(
    session({
      name: sessionConfig.name,
      secret: sessionConfig.secret,
      resave: sessionConfig.resave,
      saveUninitialized: sessionConfig.saveUninitialized,
      store: mongoStore as any, // we use memory store
      cookie: sessionConfig.cookie,
    }),
  )
}
