import express, { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'

import indexRouter from './routes/index'
import { errorHandler } from './middlewares/exception-filter'
import { ERROR_CODES, ERROR_MESSAGES } from './constants/response-message.constant'
import path from 'path'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import useragent from 'express-useragent'
import moment from 'moment-timezone'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import cachegoose from 'recachegoose'
import { MONGODB_URI } from './config/database.config'
import { createUploadDirectories } from './middlewares/public-storage-initialize'
import { RequestWithPassport, passportInitialize } from './authentication/passport'
import passport from 'passport'
import { sessionRegister } from './authentication/session'

const app = express()
const port = process.env.PORT ?? 3000

// view engine setup
app.set('views', path.join(import.meta.dir, 'views'))
app.set('view engine', 'ejs')

app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())
app.use(useragent.express())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(import.meta.dir, 'public')))

// passport initialization
await passportInitialize()

// use session
await sessionRegister(app)
app.use(passport.initialize())
app.use(passport.session())

// Generate Swagger documentation
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API documentation',
      version: '1.0.0',
    },
  },
  apis: [
    './routes/**/*.ts', // all api routes
    './schemas/**/*.ts', // all api definitions
  ],
}

const swaggerDoc = swaggerJSDoc(options)
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(req.method, 'Request -' + req.url)
  next()
})

const timeZone = process.env.LOCAL_TIME_ZONE ? process.env.LOCAL_TIME_ZONE : 'Asia/Ho_Chi_Minh'
moment.tz.setDefault(timeZone)

cachegoose(mongoose, {
  engine: 'redis',
  client: 'redis://localhost:6379',
})

app.use(indexRouter)

app.use(errorHandler)

// 404 Not Found handler (if no route matches)
app.use((req: RequestWithPassport, res: Response, _: NextFunction) => {
  console.log('Request not found')
  if (req.path.startsWith('/api') || req.path.startsWith('/cms-api'))
    return res.status(404).json({
      error: true,
      message: ERROR_MESSAGES[ERROR_CODES.NOT_FOUND],
      error_code: ERROR_CODES.NOT_FOUND,
    })

  if (req.session?.passport) return res.render('cms', { inc: '404' })

  return res.redirect('/login')
})

// Connect to MongoDB database
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Database connected')

    // upload folders initialization
    createUploadDirectories()

    app.listen(port, () => {
      console.log(`Listening on port ${port}...`)
    })
  })
  .catch((error) => {
    console.log('Error connecting to database', error)
  })
