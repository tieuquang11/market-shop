import OrderItem from '#models/orderitem'

export default class OrderItemsService {
  async getAllOrderItems() {
    const orderItems = await OrderItem.all()
    return orderItems
  }

  async createOrderItem(data: any) {
    const orderItem = await OrderItem.create({
      orderId: data.order_id,
      productId: data.product_id,
      quantity: data.quantity,
      price: data.price,
      name: data.name,
      image: data.image,
    })
    return orderItem
  }

  async getOrderItemById(id: number) {
    const orderItem = await OrderItem.findOrFail(id)
    return orderItem
  }

  async updateOrderItem(id: number, data: any) {
    const orderItem = await OrderItem.findOrFail(id)
    orderItem.merge(data)
    await orderItem.save()
    return orderItem
  }

  async deleteOrderItem(id: number) {
    const orderItem = await OrderItem.findOrFail(id)
    await orderItem.delete()
    return { message: 'Order item deleted successfully' }
  }
}
