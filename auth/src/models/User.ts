import mongoose from 'mongoose'

// properties required for user creation
interface UserAttrs {
  email: string
  password: string
}

// properties of the returned user document
interface UserDoc extends mongoose.Document {
  email: string
  password: string
}

// Static properties / methods for the model
interface UserModel extends mongoose.Model<UserDoc> {
  // create our own build method so we can type check params
  build(attrs: UserAttrs): UserDoc
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  }
  // TODO: add the transform funciton to define what is returned as JSON
)

// TODO: presave hook to hash the password

// initialize the model
const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

// custom build function so we can type check the input parameters
userSchema.statics.build = (attrs: UserAttrs) => new User(attrs)

export { User }
