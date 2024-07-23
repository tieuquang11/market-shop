import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import parseDuration from 'parse-duration'
import { JwtAccessTokenProvider, JwtSecret } from '#providers/jwt_access_token_provider'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  generateToken() {
    throw new Error('Method not implemented.')
  }
  verifyPassword(_password: string) {
    throw new Error('Method not implemented.')
  }
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare name: string

  @column()
  declare address: string

  @column()
  declare phone: number

  @column()
  declare role: string

  @column()
  declare rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = JwtAccessTokenProvider.forModel(User, {
    expiresInMillis: parseDuration('7 day')!,
    key: new JwtSecret('BjBZ-s9JFJTBwUsOo1Ml-fzkCqja_byX'),
    primaryKey: 'id',
    algorithm: 'HS256',
    audience: 'https://client.example.com',
    issuer: 'https://server.example.com',
  })
}
