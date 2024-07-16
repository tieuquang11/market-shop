import type { HttpContext } from '@adonisjs/core/http'
import OrderItem from '#models/orderitem'

export default class OrderItemsController {
  async index({}: HttpContext) {
    const orderItems = await OrderItem.all()
    return orderItems
  }

  async store({ request }: HttpContext) {
    const data = request.only(['order_id', 'product_id', 'quantity', 'price'])
    const orderItem = await OrderItem.create(data)
    return orderItem
  }

  async show({ params }: HttpContext) {
    const orderItem = await OrderItem.findOrFail(params.id)
    return orderItem
  }

  async update({ params, request }: HttpContext) {
    const data = request.only(['order_id', 'product_id', 'quantity', 'price'])
    const orderItem = await OrderItem.findOrFail(params.id)
    orderItem.merge(data)
    await orderItem.save()
    return orderItem
  }

  async destroy({ params }: HttpContext) {
    const orderItem = await OrderItem.findOrFail(params.id)
    await orderItem.delete()
    return { message: 'Order item deleted successfully' }
  }
}
