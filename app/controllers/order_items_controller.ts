import OrderItemsService from '#services/order_item_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class OrderItemsController {
  constructor(protected orderItemsService: OrderItemsService) {}

  async index({}: HttpContext) {
    const orderItems = await this.orderItemsService.getAllOrderItems()
    return orderItems
  }

  async store({ request }: HttpContext) {
    const data = request.only(['order_id', 'product_id', 'quantity', 'price', 'name'])
    const image = request.file('image')

    const orderItem = await this.orderItemsService.createOrderItem({
      ...data,
      image: image,
    })
    return orderItem
  }

  async show({ params }: HttpContext) {
    const orderItem = await this.orderItemsService.getOrderItemById(params.id)
    return orderItem
  }

  async update({ params, request }: HttpContext) {
    const data = request.only(['order_id', 'product_id', 'quantity', 'price', 'name'])
    const image = request.file('image')

    const orderItem = await this.orderItemsService.updateOrderItem(params.id, {
      ...data,
      image: image,
    })
    return orderItem
  }

  async destroy({ params }: HttpContext) {
    const result = await this.orderItemsService.deleteOrderItem(params.id)
    return result
  }
}
