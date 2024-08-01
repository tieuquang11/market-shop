import cloudinary from '#config/cloudinary'
import Product from '#models/product'
import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class ProductService {
  roundPrice(value: number) {
    return Math.round(value)
  }

  async uploadToCloudinary(file: any) {
    const result = await cloudinary.uploader.upload(file.tmpPath, {
      folder: 'products',
    })
    return result.secure_url
  }

  async create(data: any, response: HttpContext['response']) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { name, description, price, stock, image, category_id } = data

    const existingProduct = await Product.query().where('name', name).first()
    if (existingProduct) {
      return response.badRequest({ message: 'Product name must be unique' })
    }

    if (!image) {
      return response.badRequest({ message: 'Product image is required' })
    }

    try {
      const imageUrl = await this.uploadToCloudinary(image)

      const product = new Product()
      product.name = name
      product.description = description
      product.price = this.roundPrice(price)
      product.stock = stock
      product.image = imageUrl
      product.category_id = category_id

      await product.save()
      return response.created({ message: 'Product created successfully', product })
    } catch (error) {
      console.error(error)
      return response.badRequest({ message: 'Failed to upload image' })
    }
  }

  async update(id: number, data: any, response: HttpContext['response']) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { name, description, price, stock, image, category_id } = data

    const existingProduct = await Product.query()
      .where('name', name)
      .andWhere('id', '<>', id)
      .first()
    if (existingProduct) {
      return response.badRequest({ message: 'Product name must be unique' })
    }

    const product = await Product.findOrFail(id)

    if (image) {
      try {
        const imageUrl = await this.uploadToCloudinary(image)
        product.image = imageUrl
      } catch (error) {
        return response.badRequest({ message: 'Failed to upload image' })
      }
    }

    product.merge({
      name,
      description,
      price: this.roundPrice(price),
      stock,
      category_id,
    })

    await product.save()
    return response.ok({ message: 'Product updated successfully', product })
  }

  async getAll(request: HttpContext['request'], response: HttpContext['response']) {
    const page = Number.parseInt(request.input('page', '1'))
    const limit = Number.parseInt(request.input('limit', '10'))

    const products = await Product.query()
      .whereNull('deletedAt')
      .preload('category')
      .paginate(page, limit)

    const paginatedData = products.toJSON()

    return response.ok({
      data: paginatedData.data,
      meta: {
        ...paginatedData.meta,
        current_page: page,
        last_page: Math.ceil(paginatedData.meta.total / limit),
      },
    })
  }

  async delete(id: number, response: HttpContext['response']) {
    const product = await Product.findOrFail(id)
    await product.delete()
    return response.ok({ message: 'Product deleted successfully' })
  }

  async softDelete(id: number, response: HttpContext['response']) {
    const product = await Product.findOrFail(id)
    product.deletedAt = DateTime.local()
    await product.save()
    return response.ok({ message: 'Product soft deleted successfully' })
  }

  async restore(id: number, response: HttpContext['response']) {
    const product = await Product.findOrFail(id)
    product.deletedAt = null
    await product.save()
    return response.ok({ message: 'Product restored successfully' })
  }

  async getByCategory(
    categoryId: number,
    request: HttpContext['request'],
    response: HttpContext['response']
  ) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 5)

    const products = await Product.query()
      .where('category_id', categoryId)
      .preload('category')
      .paginate(page, limit)

    return response.ok({ products })
  }

  async getUserProducts(
    userId: number,
    request: HttpContext['request'],
    response: HttpContext['response']
  ) {
    const page = Number.parseInt(request.input('page', '1'))
    const limit = Number.parseInt(request.input('limit', '10'))

    const products = await Product.query()
      .where('user_id', userId)
      .whereNull('deletedAt')
      .preload('category')
      .paginate(page, limit)

    const paginatedData = products.toJSON()

    return response.ok({
      data: paginatedData.data,
      meta: {
        ...paginatedData.meta,
        current_page: page,
        last_page: Math.ceil(paginatedData.meta.total / limit),
      },
    })
  }

  async createUserProduct(userId: number, data: any, response: HttpContext['response']) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { name, description, price, stock, image, category_id } = data

    const existingProduct = await Product.query()
      .where('name', name)
      .where('user_id', userId)
      .first()
    if (existingProduct) {
      return response.badRequest({ message: 'Product name must be unique for this user' })
    }

    if (!image) {
      return response.badRequest({ message: 'Product image is required' })
    }

    try {
      const imageUrl = await this.uploadToCloudinary(image)

      const product = new Product()
      product.name = name
      product.description = description
      product.price = this.roundPrice(price)
      product.stock = stock
      product.image = imageUrl
      product.category_id = category_id
      product.user_id = userId

      await product.save()
      return response.created({ message: 'Product created successfully', product })
    } catch (error) {
      console.error(error)
      return response.badRequest({ message: 'Failed to upload image' })
    }
  }

  async updateUserProduct(
    userId: number,
    productId: number,
    data: any,
    response: HttpContext['response']
  ) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { name, description, price, stock, image, category_id } = data

    const product = await Product.query().where('id', productId).where('user_id', userId).first()

    if (!product) {
      return response.notFound({
        message: 'Product not found or you do not have permission to update it',
      })
    }

    const existingProduct = await Product.query()
      .where('name', name)
      .where('user_id', userId)
      .whereNot('id', productId)
      .first()

    if (existingProduct) {
      return response.badRequest({ message: 'Product name must be unique for this user' })
    }

    if (image) {
      try {
        const imageUrl = await this.uploadToCloudinary(image)
        product.image = imageUrl
      } catch (error) {
        return response.badRequest({ message: 'Failed to upload image' })
      }
    }

    product.merge({
      name,
      description,
      price: this.roundPrice(price),
      stock,
      category_id,
    })

    await product.save()
    return response.ok({ message: 'Product updated successfully', product })
  }

  async deleteUserProduct(userId: number, productId: number, response: HttpContext['response']) {
    const product = await Product.query().where('id', productId).where('user_id', userId).first()

    if (!product) {
      return response.notFound({
        message: 'Product not found or you do not have permission to delete it',
      })
    }

    product.deletedAt = DateTime.local()
    await product.save()
    return response.ok({ message: 'Product soft deleted successfully' })
  }
}
