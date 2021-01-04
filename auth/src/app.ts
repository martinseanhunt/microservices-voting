import express from 'express'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
// This package makes throwing errors in async routes and middlewares work without having to call next when
// throwing the error.
// See https://expressjs.com/en/guide/error-handling.html and https://www.npmjs.com/package/express-async-errors
import 'express-async-errors'

import { notFoundHandler } from '@mhunt/voting-common'

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

app.get('/auth/test', (req, res) => {
  res.status(200).send('tets I am alive')
})

// TODO: Health check from common
app.get('/auth/health', (req, res) => {
  res.status(200).send('I am alive')
})

// Catch all 404 route
app.all('*', notFoundHandler)

// TODO: Error Handler from Common
// TODO: test
app.get('/health', (req, res) => {
  res.status(200).send('I am alive')
})

export { app }
