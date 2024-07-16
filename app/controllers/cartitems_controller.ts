import { HttpContext } from '@adonisjs/core/http'
import { CartItemValidator, validationMessages } from '#validators/cart_item'
import CartItem from '#models/cart_item'

export default class CartItemsController {
  async create({ request, response }: HttpContext) {
    try {
      const validatedData = await request.validate({
        schema: CartItemValidator,
        messages: validationMessages,
      })

      const cartItem = await CartItem.create(validatedData)

      return response.created({ message: 'Mục giỏ hàng được tạo thành công', cartItem })
    } catch (error) {
      console.error('Lỗi khi tạo mục giỏ hàng:', error)
      return response.badRequest(error.messages)
    }
  }

  async update({ request, response, params }: HttpContext) {
    try {
      const cartItem = await CartItem.findOrFail(params.id)

      const validatedData = await request.validate({
        schema: CartItemValidator,
        messages: validationMessages,
      })

      cartItem.merge(validatedData)
      await cartItem.save()

      return response.ok({ message: 'Mục giỏ hàng đã được cập nhật', cartItem })
    } catch (error) {
      console.error('Lỗi khi cập nhật mục giỏ hàng:', error)
      return response.badRequest(error.messages)
    }
  }

  async delete({ params, response }: HttpContext) {
    try {
      const cartItem = await CartItem.findOrFail(params.id)
      await cartItem.delete()

      return response.ok({ message: 'Mục giỏ hàng đã được xóa thành công' })
    } catch (error) {
      console.error('Lỗi khi xóa mục giỏ hàng:', error)
      return response.badRequest(error.message)
    }
  }

  async getAll({ response }: HttpContext) {
    try {
      const cartItems = await CartItem.all()

      return response.ok({ cartItems })
    } catch (error) {
      console.error('Lỗi khi lấy danh sách mục giỏ hàng:', error)
      return response.badRequest(error.message)
    }
  }
}
