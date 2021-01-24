import mongoose from 'mongoose'

import { nats } from '@mhunt/voting-common'

import { app } from './app'
import { AllocationsUpdatedListener } from './events/listeners/AllocationsUpdatedListener'

const connectAndStart = async () => {
  if (!process.env.CAUSES_MONGO_URI)
    throw new Error('Please set CAUSES_MONGO_URI')
  if (!process.env.NATS_URI) throw new Error('Please set NATS_URI')
  if (!process.env.NATS_CLIENT_ID) throw new Error('Please set NATS_CLIENT_ID')
  if (!process.env.NATS_CLUSTER_ID)
    throw new Error('Please set NATS_CLUSTER_ID')

  // TODO handle connection errors, disconnect / shutdown?
  // Retry connecting to NATS
  // TODO: Abstract this retry logic over to common
  let connected = false
  while (connected === false) {
    try {
      console.log('trying nats connection')
      await nats.connect(
        process.env.NATS_CLUSTER_ID!,
        process.env.NATS_CLIENT_ID!,
        process.env.NATS_URI!
      )
      connected = true
    } catch (e) {
      console.error(e.message)
    }
  }

  // Connect to database
  await mongoose.connect(process.env.CAUSES_MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  console.log('connected to causes database')

  // Start listeners
  new AllocationsUpdatedListener(nats.client).listen()

  const PORT = process.env.LISTEN_PORT || 3000
  app.listen(PORT, () => console.log(`Causes service listening on ${PORT}`))
}

connectAndStart()
