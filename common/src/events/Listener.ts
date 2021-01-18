import { Message, Stan } from 'node-nats-streaming'

import { Event } from './types/Event'

// Abstract class to be extended by listeners for specific events. Pass the class an event types
export abstract class Listener<T extends Event> {
  // abstract properties must be set by extending class

  // Subject set by the extending class should match the subject in the event type passed
  abstract subject: T['subject']

  // Group name unique to the service, but not each instance of the service, used for durable name and queuegroup name
  abstract queueGroupName: string

  // Function that will be called to proceess the incoming message
  abstract onMessage(parsedData: T['data'], msg: Message): void

  // Stan client - using protected class over private so sub classes can access the client
  protected client: Stan

  // Time to allow procesing a message before timing out - can be set by the sub class if desired
  protected ackWait: number = 5000

  // Pass the stan client when initialising and instance of the sub class
  constructor(client: Stan) {
    this.client = client
  }

  // Set options for nats streaming server listeners
  subscriptionOptions() {
    return (
      this.client
        .subscriptionOptions()
        // Don't automatically ack messages. We tell NATS when a message has been sucessfully processed
        .setManualAckMode(true)
        // Set tiemout
        .setAckWait(this.ackWait)
        // Tells NATS to deliver the entire event history of a channel when we join it
        // Useful for starting new services etc so we know the new service has all the data it needs. As well as
        // The service recieving any events it may have missed if it were offline for a period of time.
        .setDeliverAllAvailable()
        // That said, we don't want to process messages if they have already been processed by this service
        // or another replica of it as that would lead to duplicate data in the database. Use the queue group name
        // which is unique to the service, but not each instance of the service, as a durable name which means that we
        // only sent messages which haven't been processed by this service.

        // This option must be used in conjunction with a queue group. Otherwise if the service goes offline NATS assumes
        // it's gone for good and gets rid of the durable group. So we'd get all results when coming back online. If we
        // use a queue group the durable name (and the history of events that has been processed by this service) is
        // persisted and used by any service that joins or rejoins the group.

        // This doesn't have to be the quegroup name but it makes sense to reuse it.
        .setDurableName(this.queueGroupName)
    )
  }

  listen() {
    // Within each channel we can create and subscribe to queuegroups. Multiple clients (instances of a single service)
    // will join the group and NATS will then only ever send an event to a SINGLE instance of a service so that we don't
    // have multiple replicas of a service processing the same event and duplicting data.
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    )

    // Listen for incoming messages on the channel
    subscription.on('message', (msg: Message) => {
      const sequence = msg.getSequence()

      console.log(
        `Message recieved from service: ${this.queueGroupName} on channel: ${this.subject} - sequence: ${sequence}`
      )

      // Get the data from the message
      const data = msg.getData()

      // Data can either be a simple string or a complex object. If object turn to string so we can parse it.
      const parsed =
        typeof data === 'string'
          ? JSON.parse(data)
          : JSON.parse(data.toString('utf8'))

      // Process the message using the function defined by the sub class. send the msg as well so we can call ack when
      // processing is complete and any other properties on the message can be accessed.
      this.onMessage(parsed, msg)
    })
  }
}
