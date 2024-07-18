import { HttpContext } from '@adonisjs/core/http'
import ProductService from '#services/product_service'
import { createProductValidator, validationMessages } from '#validators/product'
import Product from '#models/product'

export default class ProductsController {
  async create({ request, response }: HttpContext) {
    try {
      const validatedData = await request.validate({
        schema: createProductValidator,
        messages: validationMessages,
      })
      return await new ProductService().create(validatedData, response)
    } catch (error) {
      console.error(error)
      return response.badRequest(error.messages)
    }
  }

  async update({ request, response, params }: HttpContext) {
    try {
      const validatedData = await request.validate({
        schema: createProductValidator,
        messages: validationMessages,
      })
      return await new ProductService().update(params.id, validatedData, response)
    } catch (error) {
      return response.badRequest(error.messages)
    }
  }

  async getAll({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const products = await Product.query().paginate(page, limit)
    return response.ok(products)
  }

  async delete({ params, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    await product.delete()
    return response.ok({ message: 'Product deleted successfully' })
  }

  async search({ request, response }: HttpContext) {
    const query = request.input('query')
    if (!query) {
      return response.status(400).json({ message: 'Query is required' })
    }

    const products = await Product.query()
      .where('name', 'LIKE', `%${query}%`)
      .orWhere('description', 'LIKE', `%${query}%`)
      .paginate(1, 10)

    return response.ok(products)
  }

  async getByCategory({ params, response }: HttpContext) {
    const categoryId = params.id
    if (!categoryId) {
      return response.badRequest({ message: 'Category ID is required' })
    }

    const products = await Product.query().where('category_id', categoryId).paginate(1, 10)

    return response.ok(products)
  }
}
