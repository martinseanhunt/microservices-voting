import mongoose from 'mongoose'

import { app } from './app'

const connectAndStart = async () => {
  if (!process.env.CAUSES_MONGO_URI)
    throw new Error('Please set CAUSES_MONGO_URI')

  // TODO: connect to database
  await mongoose.connect(process.env.CAUSES_MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  console.log('connected to causes database')

  const PORT = process.env.LISTEN_PORT || 3000
  app.listen(PORT, () => console.log(`Causes service listening on ${PORT}`))
}

connectAndStart()
