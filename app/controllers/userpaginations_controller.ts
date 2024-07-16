import HttpExceptionHandler from '#exceptions/handler'
import UsersService from '#services/user_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class UserpaginationsController {
  constructor(private readonly userService: UsersService) {}

  async index({ pagination }: HttpContext) {
    try {
      return await this.userService.index(pagination)
    } catch (error) {
      throw new HttpExceptionHandler()
    }
  }
}
