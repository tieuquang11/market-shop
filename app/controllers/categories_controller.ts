import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'
export default class CategoriesController {
  async index({}: HttpContext) {
    const categories = await Category.all()
    return categories
  }

  async store({ request }: HttpContext) {
    const data = request.only(['name', 'description'])
    const category = await Category.create(data)
    return category
  }

  async show({ params }: HttpContext) {
    const category = await Category.findOrFail(params.id)
    return category
  }

  async update({ params, request }: HttpContext) {
    const data = request.only(['name', 'description'])
    const category = await Category.findOrFail(params.id)
    category.merge(data)
    await category.save()
    return category
  }

  async destroy({ params }: HttpContext) {
    const category = await Category.findOrFail(params.id)
    await category.delete()
    return { message: 'Category deleted successfully' }
  }
}
