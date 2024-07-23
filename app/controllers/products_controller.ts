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
    const productService = new ProductService()
    return await productService.getAll(request, response)
  }

  async delete({ params, response }: HttpContext) {
    try {
      const productService = new ProductService()
      return await productService.softDelete(params.id, response)
    } catch (error) {
      console.error(error)
      return response.internalServerError({
        message: 'An error occurred while deleting the product',
      })
    }
  }

  async restore({ params, response }: HttpContext) {
    try {
      const productService = new ProductService()
      return await productService.restore(params.id, response)
    } catch (error) {
      console.error(error)
      return response.internalServerError({
        message: 'An error occurred while restoring the product',
      })
    }
  }

  async search({ request, response }: HttpContext) {
    const query = request.input('query')
    if (!query) {
      return response.status(400).json({ message: 'Query is required' })
    }

    const products = await Product.query()
      .whereNull('deletedAt')
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

    const products = await Product.query()
      .whereNull('deletedAt')
      .where('category_id', categoryId)
      .paginate(1, 10)

    return response.ok(products)
  }

  async getUserProducts({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const productService = new ProductService()
    return await productService.getUserProducts(user.id, request, response)
  }

  async createUserProduct({ auth, request, response }: HttpContext) {
    try {
      const user = auth.user!
      const validatedData = await request.validate({
        schema: createProductValidator,
        messages: validationMessages,
      })
      return await new ProductService().createUserProduct(user.id, validatedData, response)
    } catch (error) {
      console.error(error)
      return response.badRequest(error.messages)
    }
  }

  async updateUserProduct({ auth, params, request, response }: HttpContext) {
    try {
      const user = auth.user!
      const validatedData = await request.validate({
        schema: createProductValidator,
        messages: validationMessages,
      })
      return await new ProductService().updateUserProduct(
        user.id,
        params.id,
        validatedData,
        response
      )
    } catch (error) {
      return response.badRequest(error.messages)
    }
  }

  async deleteUserProduct({ auth, params, response }: HttpContext) {
    try {
      const user = auth.user!
      const productService = new ProductService()
      return await productService.deleteUserProduct(user.id, params.id, response)
    } catch (error) {
      console.error(error)
      return response.internalServerError({
        message: 'An error occurred while deleting the product',
      })
    }
  }
}
