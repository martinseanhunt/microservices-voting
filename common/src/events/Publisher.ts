import { Stan } from 'node-nats-streaming'

import { Event } from './types/Event'

// Abstract class can't create an instance directly from this. Must extend it
// <T extends Event> - we pass an interface that extends the event giving it the various properties
// a specifc event can have.
export abstract class Publisher<T extends Event> {
  // abstract properties must be set by the extending class
  abstract subject: T['subject']

  private client: Stan

  // Must be passed a client which we can publish to.
  constructor(client: Stan) {
    this.client = client
  }

  // type check the data against the extending classes Event type and publish the event
  // to the nats client
  publish(data: T['data']): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) return reject(err)
        console.log(`Event published to channel ${this.subject}`)
        resolve(true)
      })
    })
  }
}
