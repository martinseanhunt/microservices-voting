import mongoose from 'mongoose'

import { app } from './app'

const connectAndStart = async () => {
  if (!process.env.USERS_MONGO_URI) throw new Error('Please set MONGO_URI')
  if (!process.env.JWT_KEY) throw new Error('Please set JWT_KEY')

  // TODO: connect to database
  await mongoose.connect(process.env.USERS_MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  console.log('connected to auth database')

  const PORT = process.env.LISTEN_PORT || 3000
  app.listen(PORT, () => console.log(`Auth service listening on ${PORT}`))
}

connectAndStart()
