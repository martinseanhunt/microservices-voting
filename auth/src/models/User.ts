import mongoose from 'mongoose'

import { Role } from '@mhunt/voting-common'

import { toHash } from '../utils/password'

// properties required for user creation
interface UserAttrs {
  email: string
  password: string
}

// properties of the returned user document
export interface UserDoc extends mongoose.Document {
  email: string
  password: string
  role: string
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
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.User,
    },
  },
  {
    // Transform the object which is returned when serializing the
    // document as JSON, i.e. when we return the document in a response
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password
        ret.id = ret._id
        delete ret._id
        delete ret.__v
      },
    },
  }
)

// Presave hook to hash the password
userSchema.pre('save', async function (done) {
  // Only hash the password if it's been changed. isModified also returns true
  // when a new user is being created.
  if (this.isModified('password')) {
    const hashed = await toHash(this.get('password'))
    this.set('password', hashed)
  }

  // mongo doesn't know how to handle async. Have to call done manually
  done()
})

// custom build function so we can type check the input parameters
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs)
}

// initialize the model
const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

export { User }
