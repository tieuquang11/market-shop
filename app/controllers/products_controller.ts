import { HttpContext } from '@adonisjs/core/http'
import ProductService from '#services/product_service'
import { createProductValidator, validationMessages } from '#validators/product'
import Product from '#models/product'

type ValidatedData = {
  name: string
  description: string
  price: number
  stock: number
  category_id: number
  image?: any // Thêm thuộc tính image
}

export default class ProductsController {
  async create({ request, response }: HttpContext) {
    try {
      const validatedData: ValidatedData = await request.validate({
        schema: createProductValidator,
        messages: validationMessages,
      })

      // Ensure that the image is present in the request
      if (!request.file('image')) {
        return response.badRequest({ message: 'Product image is required' })
      }

      validatedData.image = request.file('image')
      return await new ProductService().create(validatedData, response)
    } catch (error) {
      console.error(error)
      return response.badRequest(
        error.messages || { message: 'An error occurred while creating the product' }
      )
    }
  }

  async update({ request, response, params }: HttpContext) {
    try {
      const validatedData: ValidatedData = await request.validate({
        schema: createProductValidator,
        messages: validationMessages,
      })

      if (request.file('image')) {
        validatedData.image = request.file('image')
      }

      return await new ProductService().update(params.id, validatedData, response)
    } catch (error) {
      console.error(error)
      return response.badRequest(
        error.messages || { message: 'An error occurred while updating the product' }
      )
    }
  }

  async getAll({ request, response }: HttpContext) {
    try {
      const productService = new ProductService()
      return await productService.getAll(request, response)
    } catch (error) {
      console.error(error)
      return response.internalServerError({ message: 'An error occurred while fetching products' })
    }
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
    try {
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
    } catch (error) {
      console.error(error)
      return response.internalServerError({ message: 'An error occurred while searching products' })
    }
  }

  async getByCategory({ params, request, response }: HttpContext) {
    try {
      const categoryId = params.id
      if (!categoryId) {
        return response.badRequest({ message: 'Category ID is required' })
      }

      const productService = new ProductService()
      return await productService.getByCategory(categoryId, request, response)
    } catch (error) {
      console.error(error)
      return response.internalServerError({
        message: 'An error occurred while fetching products by category',
      })
    }
  }

  async getUserProducts({ auth, request, response }: HttpContext) {
    try {
      const user = auth.user!
      const productService = new ProductService()
      return await productService.getUserProducts(user.id, request, response)
    } catch (error) {
      console.error(error)
      return response.internalServerError({
        message: 'An error occurred while fetching user products',
      })
    }
  }

  async createUserProduct({ auth, request, response }: HttpContext) {
    try {
      const user = auth.user!
      const validatedData: ValidatedData = await request.validate({
        schema: createProductValidator,
        messages: validationMessages,
      })

      // Ensure that the image is present in the request
      if (!request.file('image')) {
        return response.badRequest({ message: 'Product image is required' })
      }

      validatedData.image = request.file('image')
      return await new ProductService().createUserProduct(user.id, validatedData, response)
    } catch (error) {
      console.error(error)
      return response.badRequest(
        error.messages || { message: 'An error occurred while creating the user product' }
      )
    }
  }

  async updateUserProduct({ auth, params, request, response }: HttpContext) {
    try {
      const user = auth.user!
      const validatedData: ValidatedData = await request.validate({
        schema: createProductValidator,
        messages: validationMessages,
      })

      // If an image is provided, add it to the validatedData
      if (request.file('image')) {
        validatedData.image = request.file('image')
      }

      return await new ProductService().updateUserProduct(
        user.id,
        params.id,
        validatedData,
        response
      )
    } catch (error) {
      console.error(error)
      return response.badRequest(
        error.messages || { message: 'An error occurred while updating the user product' }
      )
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
        message: 'An error occurred while deleting the user product',
      })
    }
  }
}
