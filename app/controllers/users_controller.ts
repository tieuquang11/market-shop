import UsersService from '#services/user_service'
import { loginValidator, registerValidator } from '#validators/auth'
import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
@inject()
export default class AuthController {
  constructor(private readonly userService: UsersService) {}

  async register({ request }: HttpContext) {
    try {
      const data = request.body()
      const payload = await registerValidator.validate(data)
      console.log('register', data)
      return await this.userService.store(payload)
    } catch (error) {
      console.log(error)

      throw error
    }
  }

  async login({ request }: HttpContext) {
    try {
      const data = request.body()
      const payload = await loginValidator.validate(data)
      console.log('login', data)
      return await this.userService.login(payload)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  async profile({ auth, response }: HttpContext) {
    try {
      const userId = auth.user?.id
      if (!userId) {
        return response.unauthorized('You must be logged in to view this page')
      }

      const user = await this.userService.findById(userId)
      if (!user) {
        return response.notFound('User not found')
      }

      return response.ok({
        id: user.id,
        name: user.name,
        email: user.email,
      })
    } catch (error) {
      return response.internalServerError(error.message)
    }
  }
}
