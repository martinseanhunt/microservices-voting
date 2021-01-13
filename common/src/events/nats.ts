import _nats, { Stan } from 'node-nats-streaming'

// Class that has the instance of Stan client and a connect method to initialize it
class Nats {
  // Holds the connected stan client (can be undefined before connect is called)
  private _client?: Stan

  // Getter so we can return an error if we haven't yet connected to Nats
  // TODO: investigate whether using the getter here is causing incorrect connection errors
  get client() {
    if (!this._client)
      throw new Error(
        'attempting to get client before conection has been established'
      )
    return this._client
  }

  // Return a promise which we resolve on sucessful connection so we can await it
  connect(clusterID: string, clientID: string, url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._client = _nats.connect(clusterID, clientID, { url })

      // Resolve the promise once connection is established
      this.client.on('connect', () => {
        console.log('connected to nats')
        resolve()
      })

      this.client.on('error', (err) => {
        reject(err)
      })
    })
  }
}

// export an instance of our Nats class which Node will cache meaning that when we import
// the class in to other fiels after we've connected the client will have been initialized
// and we don't have to wait for a connection everywhere we're importing.
export const nats = new Nats()
