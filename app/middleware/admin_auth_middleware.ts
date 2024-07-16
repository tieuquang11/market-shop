import { HttpContext } from '@adonisjs/core/http'

export default class AdminAuth {
  async handle({ auth, response }: HttpContext, next: () => Promise<void>) {
    try {
      await auth.use('api').authenticate()

      if (auth.user && auth.user.role !== 'admin') {
        return response.unauthorized({ message: 'You are not authorized to access this resource' })
      }

      await next()
    } catch {
      return response.unauthorized({ message: 'Please login first' })
    }
  }
}
