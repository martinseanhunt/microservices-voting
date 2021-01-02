import express from 'express'

// This package makes throwing errors in async routes and middlewares work without having to call next when
// throwing the error.
// See https://expressjs.com/en/guide/error-handling.html and https://www.npmjs.com/package/express-async-errors
import 'express-async-errors'

// init express
const app = express()

app.get('/auth/test', (req, res) => {
  res.status(200).send('tets I am alive')
})

// temp route
app.get('/auth', (req, res) => {
  res.status(200).send('I am alive')
})

export { app }
