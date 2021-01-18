import express from 'express'
// This package makes throwing errors in async routes and middlewares work without having to call next when
// throwing the error.
// See https://expressjs.com/en/guide/error-handling.html and https://www.npmjs.com/package/express-async-errors
import 'express-async-errors'

import {
  notFoundHandler,
  healthCheckHandler,
  errorHandler,
} from '@mhunt/voting-common'

import { updateUserPoints } from './routes/updateUserPoints'

// init express
const app = express()

// TODO: TESTS!
// Routes
app.get('/update-user-points', updateUserPoints)

// Health check
app.get('/health', healthCheckHandler)

// Catch all 404 route
app.all('*', notFoundHandler)

// Error handler
app.use(errorHandler)

export { app }
