import mongoose from 'mongoose'

// properties required for creation
interface CauseAttrs {
  id: string
  title: string
  image: string
  description: string
  url: string
  totalPointsAllocated: number
}

// properties of the returned document
export interface CauseDoc extends mongoose.Document {
  title: string
  image: string
  description: string
  url: string
  totalPointsAllocated: number
}

// Static properties / methods for the model
interface CauseModel extends mongoose.Model<CauseDoc> {
  // create our own build method so we can type check params
  build(attrs: CauseAttrs): CauseDoc
}

const causeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    totalPointsAllocated: {
      type: Number,
      required: true,
    },
  },
  {
    // Transform the object which is returned when serializing the
    // document as JSON, i.e. when we return the document in a response
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id
        delete ret._id
        delete ret.version
      },
    },
    // Makes sure that the version is updated on every save
    // and that we can't save a doc if the version is not sequential
    // This makes sure that any nats events are processed in the correct order
    optimisticConcurrency: true,
    // Rename __v to version
    versionKey: 'version',
  }
)

// custom build function so we can type check the input parameters
causeSchema.statics.build = (attrs: CauseAttrs) => {
  const { id, ...rest } = attrs

  return new Cause({
    _id: id,
    ...rest,
  })
}

// Static method to find the previous sequential version of a user. Using this so we can reject messages from NATS
// when they arrive out of order.

// TODO: Refactor to util function
causeSchema.statics.findPreviousVersion = (id: string, version: number) => {
  return Cause.findOne({
    _id: id,
    version: version - 1,
  })
}

// initialize the model
const Cause = mongoose.model<CauseDoc, CauseModel>('Cause', causeSchema)

export { Cause }
