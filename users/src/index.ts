import mongoose from 'mongoose'

import { nats } from '@mhunt/voting-common'

import { app } from './app'

const connectAndStart = async () => {
  // Check env variables are set
  if (!process.env.USERS_MONGO_URI) throw new Error('Please set MONGO_URI')
  if (!process.env.JWT_KEY) throw new Error('Please set JWT_KEY')
  if (!process.env.NATS_URI) throw new Error('Please set NATS_URI')
  if (!process.env.NATS_CLIENT_ID) throw new Error('Please set NATS_CLIENT_ID')
  if (!process.env.NATS_CLUSTER_ID)
    throw new Error('Please set NATS_CLUSTER_ID')

  // TODO: handle shutdown / disconnect ?
  // connect to nats
  await nats.connect(
    process.env.NATS_CLUSTER_ID,
    process.env.NATS_CLIENT_ID,
    process.env.NATS_URI
  )

  // connect to database
  await mongoose.connect(process.env.USERS_MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  console.log('connected to users database')

  const PORT = process.env.LISTEN_PORT || 3000
  app.listen(PORT, () => console.log(`Users service listening on ${PORT}`))
}

connectAndStart()
