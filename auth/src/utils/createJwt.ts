import jwt from 'jsonwebtoken'

import { UserDoc } from '../models/User'

export const createJwt = (user: UserDoc) =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_KEY!
  )
