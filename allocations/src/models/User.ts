import mongoose from 'mongoose'

// properties required for user creation
interface UserAttrs {
  id: string
  points: number
}

// properties of the returned user document
export interface UserDoc extends mongoose.Document {
  // NOTE: Id is automatically provided by the Document interface we're extending
  points: number
}

// Static properties / methods for the model
interface UserModel extends mongoose.Model<UserDoc> {
  // create our own build method so we can type check params
  build(attrs: UserAttrs): UserDoc
  findPreviousVersion(id: string, version: number): Promise<UserDoc | null>
}

const userSchema = new mongoose.Schema(
  {
    points: {
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

    // TODO: Make sure this gives us everything updte-if-current does and it's working as
    // intended
    optimisticConcurrency: true,
    // Rename __v to version
    versionKey: 'version',
  }
)

// custom build function so we can type check the input parameters
userSchema.statics.build = (attrs: UserAttrs) => {
  const { id, ...rest } = attrs

  return new User({
    // setting the mongoose _id property using the incoming id
    _id: id,
    ...rest,
  })
}

// Static method to find the previous sequential version of a user. Using this so we can reject messages from NATS
// when they arrive out of order.
userSchema.statics.findPreviousVersion = (id: string, version: number) => {
  return User.findOne({
    _id: id,
    version: version - 1,
  })
}

// initialize the model
const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

export { User }
