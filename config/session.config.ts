import dotenv from 'dotenv'

dotenv.config()

export const sessionConfig = {
  name: 'session_id',
  secret: process.env.SESSION_SECRET ?? '',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
}
