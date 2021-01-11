import mongoose from 'mongoose'

import { app } from './app'

const connectAndStart = async () => {
  if (!process.env.ALLOCATIONS_MONGO_URI)
    throw new Error('Please set ALLOCATIONS_MONGO_URI')

  // TODO: connect to database
  await mongoose.connect(process.env.ALLOCATIONS_MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  console.log('connected to allcations database')

  const PORT = process.env.LISTEN_PORT || 3000
  app.listen(PORT, () =>
    console.log(`Allocations service listening on ${PORT}`)
  )
}

connectAndStart()
