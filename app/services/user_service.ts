import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
import env from '#start/env'
export default class UsersService {
  async index(pagination: any) {
    const { perPage, page } = pagination
    const users = await db.from('users').paginate(page, perPage)
    return users
  }

  async store(user: any): Promise<User> {
    return await User.create({
      name: user.name,
      email: user.email,
      password: user.password,
      address: user.address,
      phone: user.phone,
      role: user.role,
    })
  }

  async findById(id: number): Promise<User | null> {
    return await User.find(id)
  }

  async login(user: any): Promise<Object> {
    const { email, password } = user
    const userdb = await User.verifyCredentials(email, password)
    const accessToken = await User.accessTokens.create(userdb, [], {
      expiresIn: env.get('ACCESS_TOKEN_EXPIRES_IN'),
    })
    return {
      user: {
        id: userdb.id,
        name: userdb.name,
        email: userdb.email,
        role: userdb.role,
        address: userdb.address,
        phone: userdb.phone,
      },
      accessToken,
    }
  }

  /**
   * Show individual record
   */
  async show() {}

  /**
   * Edit individual record
   */
  async edit() {}

  /**
   * Handle form submission for the edit action
   */
  async update() {}

  /**
   * Delete record
   */
  async destroy() {}
}
