import { nats } from '@mhunt/voting-common'

import { app } from './app'

const connectAndStart = async () => {
  // Check env variables are set
  if (!process.env.NATS_URI) throw new Error('Please set NATS_URI')
  if (!process.env.NATS_CLIENT_ID) throw new Error('Please set NATS_CLIENT_ID')
  if (!process.env.NATS_CLUSTER_ID)
    throw new Error('Please set NATS_CLUSTER_ID')

  // TODO: handle shutdown / disconnect ?
  // connect to nats

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

  const PORT = process.env.LISTEN_PORT || 3000
  app.listen(PORT, () => console.log(`Jobs service listening on ${PORT}`))
}

connectAndStart()
