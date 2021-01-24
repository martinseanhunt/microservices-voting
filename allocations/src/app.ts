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
} from '@mhunt/voting-common'

import {
  allocatePoints,
  allocatePointsValidation,
} from './routes/allocatePoints'
import { aggregateAllocations } from './routes/aggregateAllocations'

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
  '/allocations/allocate-points',
  protectedRoute,
  allocatePointsValidation,
  handleValidationErrors,
  allocatePoints
)
app.get('/allocations/aggregate-alloctions', aggregateAllocations)

// Health check
app.get('/allocations/health', healthCheckHandler)

// Catch all 404 route
app.all('*', notFoundHandler)

// TODO: Work out why some errors aren't being handled and are killing the server

// Error handler
app.use(errorHandler)

export { app }
