import express from 'express'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
// This package makes throwing errors in async routes and middlewares work without having to call next when
// throwing the error.
// See https://expressjs.com/en/guide/error-handling.html and https://www.npmjs.com/package/express-async-errors
import 'express-async-errors'

import {
  notFoundHandler,
  healthCheckHandler,
  errorHandler,
  currentUser,
  handleValidationErrors,
  protectedRoute,
  adminRoute,
} from '@mhunt/voting-common'

import { createCause, createCauseValidation } from './routes/createCause'
import { getCauses } from './routes/getCauses'

// init express
const app = express()

// mody parser middleware
app.use(json())

// Set up cookies to contain JWT - using cookies so that the JWT can be passed
// during server side rendering.
app.use(
  cookieSession({
    // Don't encrypt the cookie as it's already protected
    signed: false,
    // TODO: make this environment dependant so we can (only send over https in prod)
    secure: false,
  })
)

// custom middleware adds user from JWT on to request
app.use(currentUser)

// TODO: TESTS!
// Routes
app.post(
  '/causes/create',
  adminRoute,
  createCauseValidation,
  handleValidationErrors,
  createCause
)
app.get('/causes', protectedRoute, getCauses)

// Health check
app.get('/causes/health', healthCheckHandler)

// Catch all 404 route
app.all('*', notFoundHandler)

// Error handler
app.use(errorHandler)

export { app }
