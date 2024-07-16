import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class PaginationMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const { request } = ctx
    const perPage = request.input('perPage', 10)
    const page = request.input('page', 1)

    ctx.pagination = { perPage, page }
    const output = await next()
    return output
  }
}
