import type { HttpContext } from '@adonisjs/core/http'
import Order from '#models/order'
export default class OrdersController {
  async index({}: HttpContext) {
    const orders = await Order.query().preload('orderItems')
    return orders
  }

  async store({ request }: HttpContext) {
    const data = request.only(['user_id', 'total_amount', 'status'])
    const order = await Order.create(data)
    return order
  }

  async show({ params }: HttpContext) {
    const order = await Order.query().where('id', params.id).preload('orderItems').firstOrFail()
    return order
  }

  async update({ params, request }: HttpContext) {
    const data = request.only(['user_id', 'total_amount', 'status'])
    const order = await Order.findOrFail(params.id)
    order.merge(data)
    await order.save()
    return order
  }

  async destroy({ params }: HttpContext) {
    const order = await Order.findOrFail(params.id)
    await order.delete()
    return { message: 'Order deleted successfully' }
  }
}
