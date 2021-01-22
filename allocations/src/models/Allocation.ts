import mongoose from 'mongoose'

// properties required for creation
interface AllocationAttrs {
  userId: string
  causeId: string
  points: number
  // TODO: Add epoch
}

// properties of the returned document
export interface AllocationDoc extends mongoose.Document {
  userId: string
  causeId: string
  points: number
  version: number
}

// Static properties / methods for the model
interface AllocationModel extends mongoose.Model<AllocationDoc> {
  // create our own build method so we can type check params
  build(attrs: AllocationAttrs): AllocationDoc
}

const allocationSchema = new mongoose.Schema(
  {
    points: {
      type: Number,
      required: true,
    },
    // Create references to other collections within this services database
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    causeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cause',
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
allocationSchema.statics.build = (attrs: AllocationAttrs) => {
  return new Allocation(attrs)
}

// Static method to find the previous sequential version of a user. Using this so we can reject messages from NATS
// when they arrive out of order.

// TODO: Refactor to util function
allocationSchema.statics.findPreviousVersion = (
  id: string,
  version: number
) => {
  return Allocation.findOne({
    _id: id,
    version: version - 1,
  })
}

// initialize the model
const Allocation = mongoose.model<AllocationDoc, AllocationModel>(
  'Allocation',
  allocationSchema
)

export { Allocation }
