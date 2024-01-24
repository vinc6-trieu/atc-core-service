import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

const HASH_SALT = 7
const SECRET_JWT = 'appfake@app.com'
const DATE_EXPIRED = process.env.DATE_EXPIRED || '30'
const JWT_SIGNING_ALGORITHM = 'HS256'

interface TokenResponse {
  _id: string
  iat: number
  exp: number
}

interface SigningPayload {
  authId: string
  userId: string
  adminId: string
}

/**
 * Description: hash a string password with bcrypt's salt
 * @param {string} password
 * @returns {string?} hashed password
 */
function hashPassword(password: string = ''): string {
  return bcrypt.hashSync(password, HASH_SALT)
}

/**
 * Description: comparison between raw password & encrypted password
 * @param {string} raw        raw password
 * @param {string} encrypted  hashed password
 * @returns {boolean} true if equal, false if not
 */
function comparePassword(raw: string, encrypted: string): boolean {
  return bcrypt.compareSync(raw, encrypted)
}

/**
 * Description: return a jwt string encrypted with jwt secret with the payload
 * @param {ObjectId} authId  auth identify
 * @param {ObjectId} userId  user identify
 * @param {ObjectId} adminId  admin identify
 * @returns {string?} encrypted information
 */
function signingToken({
  authId = '',
  userId = '',
  adminId = '',
}: SigningPayload): string {
  return jwt.sign({ authId, userId, adminId }, SECRET_JWT, {
    algorithm: JWT_SIGNING_ALGORITHM,
    expiresIn: `${Number(DATE_EXPIRED) * 24 * 60 * 60}s`,
  })
}

/**
 * Description: this function will return null if the input is an invalid token or token has been expired
 * @param {string} token JWT Token string
 * @returns {TokenResponse?} {_id: string, iat: number, exp: number}
 */
function parseToken(token: string = ''): TokenResponse | null {
  try {
    const decoded = jwt.verify(token, SECRET_JWT) as TokenResponse
    return decoded
  } catch (error) {
    return null
  }
}

export { hashPassword, comparePassword, parseToken, signingToken }
