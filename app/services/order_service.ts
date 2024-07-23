import Order from '#models/order'
import OrderItem from '#models/orderitem'
export default class OrdersService {
  async getAllOrders() {
    const orders = await Order.query().preload('orderItems')
    return orders
  }

  async createOrder(data: any) {
    const order = await Order.create({
      totalAmount: data.totalAmount,
      paymentMethod: data.paymentMethod,
      shippingAddress: data.shippingAddress,
      status: 'pending',
    })

    if (data.items && Array.isArray(data.items)) {
      for (const item of data.items) {
        await OrderItem.create({
          orderId: order.id,
          productId: item.product_id,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          image: item.image,
        })
      }
    }

    return this.getOrderById(order.id)
  }

  async getOrderById(id: number) {
    const order = await Order.query()
      .where('id', id)
      .preload('orderItems')
      .preload('user')
      .firstOrFail()
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
