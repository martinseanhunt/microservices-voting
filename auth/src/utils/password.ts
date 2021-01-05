import { scrypt as _scrypt, randomBytes } from 'crypto'
import { promisify } from 'util'

const scrypt = promisify(_scrypt)

export const toHash = async (password: string): Promise<string> => {
  // Generate salt
  const salt = randomBytes(8).toString('hex')

  // Need to tell TS that scrypt is returning a Buffer
  const hashedPasswordBuffer = (await scrypt(password, salt, 64)) as Buffer

  // Return "hashedpasword.salt"
  return `${hashedPasswordBuffer.toString('hex')}.${salt}`
}
