/* eslint-disable unicorn/prefer-number-properties */
import Product from '#models/product'
import { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import _ from 'lodash'

export default class ProductService {
  roundPrice(value: number) {
    return Math.round(value)
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
      await image.move(app.publicPath('images'), {
        name: `${new Date().getTime()}.${image.extname}`,
      })
    } catch (error) {
      return response.badRequest({ message: 'Failed to upload image' })
    }

    const imageName = image.fileName

    const product = new Product()
    product.name = name
    product.description = description
    product.price = this.roundPrice(price)
    product.stock = stock
    product.image = imageName
    product.category_id = category_id

    await product.save()
    return response.created({ message: 'Product created successfully', product })
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
        await image.move(app.publicPath('images'), {
          name: `${new Date().getTime()}.${image.extname}`,
        })
        product.image = image.fileName
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
    const page = parseInt(request.input('page', '1'))
    const limit = parseInt(request.input('limit', '10'))

    console.log(`Fetching products for page ${page} with limit ${limit}`)

    const products = await Product.query().preload('category').paginate(page, limit)

    const paginatedData = products.toJSON()

    console.log(`Found ${paginatedData.data.length} products for page ${page}`)

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
}
