import mongoose from 'mongoose'

import { nats } from '@mhunt/voting-common'

import { app } from './app'
import { UserCreatedListener } from './events/listeners/UserCreatedListener'

const connectAndStart = async () => {
  if (!process.env.ALLOCATIONS_MONGO_URI)
    throw new Error('Please set ALLOCATIONS_MONGO_URI')
  if (!process.env.NATS_URI) throw new Error('Please set NATS_URI')
  if (!process.env.NATS_CLIENT_ID) throw new Error('Please set NATS_CLIENT_ID')
  if (!process.env.NATS_CLUSTER_ID)
    throw new Error('Please set NATS_CLUSTER_ID')

  // TODO handle connection errors, disconnect / shutdown?
  // Connect to NATS
  await nats.connect(
    process.env.NATS_CLUSTER_ID,
    process.env.NATS_CLIENT_ID,
    process.env.NATS_URI
  )

  // TODO: connect to database
  await mongoose.connect(process.env.ALLOCATIONS_MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  console.log('connected to allcations database')

  // Initialise listeners
  new UserCreatedListener(nats.client).listen()

  // TODO: USER UPDATED Listener

  const PORT = process.env.LISTEN_PORT || 3000
  app.listen(PORT, () =>
    console.log(`Allocations service listening on ${PORT}`)
  )
}

connectAndStart()
