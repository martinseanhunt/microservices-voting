import mongoose from 'mongoose'

// properties required for creation
interface CauseAttrs {
  title: string
  image: string
  description: string
  url: string
}

// properties of the returned document
export interface CauseDoc extends mongoose.Document {
  title: string
  image: string
  decription: string
  url: string
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
  },
  {
    // Transform the object which is returned when serializing the
    // document as JSON, i.e. when we return the document in a response
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
      },
    },
  }
)

// custom build function so we can type check the input parameters
causeSchema.statics.build = (attrs: CauseAttrs) => {
  return new Cause(attrs)
}

// initialize the model
const Cause = mongoose.model<CauseDoc, CauseModel>('Cause', causeSchema)

export { Cause }
