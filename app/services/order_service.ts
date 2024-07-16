import Order from '#models/order'

export default class OrdersService {
  async getAllOrders() {
    const orders = await Order.query().preload('orderItems')
    return orders
  }

  async createOrder(data: any) {
    const order = await Order.create(data)
    return order
  }

  async getOrderById(id: number) {
    const order = await Order.query().where('id', id).preload('orderItems').firstOrFail()
    return order
  }

  async updateOrder(id: number, data: any) {
    const order = await Order.findOrFail(id)
    order.merge(data)
    await order.save()
    return order
  }

  async deleteOrder(id: number) {
    const order = await Order.findOrFail(id)
    await order.delete()
    return { message: 'Order deleted successfully' }
  }
}
