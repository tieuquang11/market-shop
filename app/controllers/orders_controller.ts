import type { HttpContext } from '@adonisjs/core/http'
import Order from '#models/order'
import OrderItem from '#models/orderitem'
import PaymentService from '#services/payment_service'

export default class OrdersController {
  async index({}: HttpContext) {
    const orders = await Order.query().preload('orderItems')
    return orders
  }

  async store({ request, auth, response }: HttpContext) {
    if (!auth.user) {
      return response.unauthorized('Bạn cần đăng nhập để tạo đơn hàng')
    }

    const { items, totalAmount, paymentMethod, shippingAddress } = request.only([
      'items',
      'totalAmount',
      'paymentMethod',
      'shippingAddress',
    ])
    const userId = auth.user.id

    if (!items || !totalAmount || !paymentMethod || !shippingAddress) {
      return response.badRequest('Thiếu thông tin đơn hàng')
    }

    try {
      const order = await Order.create({
        userId,
        totalAmount,
        status: 'pending',
        paymentMethod,
        shippingAddress,
      })

      for (const item of items) {
        await OrderItem.create({
          orderId: order.id,
          productId: item.product_id,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          image: item.image,
        })
      }

      await order.load('orderItems')

      return order
    } catch (error) {
      console.error('Lỗi khi tạo đơn hàng:', error)
      return response.internalServerError('Đã xảy ra lỗi khi tạo đơn hàng')
    }
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

  async processPayment({ params, request, response }: HttpContext) {
    const { paymentMethod } = request.only(['paymentMethod'])
    const orderId = params.id
    const paymentService = new PaymentService()

    try {
      const order = await Order.findOrFail(orderId)
      const paymentResult = await paymentService.processPayment(
        orderId,
        paymentMethod,
        order.totalAmount
      )

      if (paymentResult.success) {
        order.status = 'paid'
        order.paymentMethod = paymentMethod
        await order.save()
        return response.ok({
          message: 'Thanh toán thành công',
          transactionId: paymentResult.transactionId,
        })
      } else {
        return response.badRequest({ message: 'Thanh toán thất bại' })
      }
    } catch (error) {
      console.error('Lỗi xử lý thanh toán:', error)
      return response.internalServerError({ message: 'Lỗi server nội bộ' })
    }
  }
}
