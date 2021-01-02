import { app } from './app'

const connectAndStart = async () => {
  // TODO: connect to database

  const PORT = process.env.LISTEN_PORT || 3000
  app.listen(PORT, () => console.log(`Auth service listening on ${PORT}`))
}

connectAndStart()
