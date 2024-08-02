import cloudinary from '#config/cloudinary'
import OrderItem from '#models/orderitem'

export default class OrderItemsService {
  async getAllOrderItems() {
    const orderItems = await OrderItem.all()
    return orderItems
  }

  async createOrderItem(data: any) {
    let imageUrl = data.image

    if (data.image && typeof data.image !== 'string') {
      try {
        const result = await cloudinary.uploader.upload(data.image.tmpPath, {
          folder: 'order_items',
        })
        imageUrl = result.secure_url
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', error)
        throw new Error('Failed to upload image')
      }
    }

    const orderItem = await OrderItem.create({
      orderId: data.order_id,
      productId: data.product_id,
      quantity: data.quantity,
      price: data.price,
      name: data.name,
      image: imageUrl,
    })
    return orderItem
  }

  async getOrderItemById(id: number) {
    const orderItem = await OrderItem.findOrFail(id)
    return orderItem
  }

  async updateOrderItem(id: number, data: any) {
    const orderItem = await OrderItem.findOrFail(id)

    if (data.image && typeof data.image !== 'string') {
      try {
        const result = await cloudinary.uploader.upload(data.image.tmpPath, {
          folder: 'order_items',
        })
        data.image = result.secure_url

        // //xóa ảnh cũ cloubirany
        // if (orderItem.image) {
        //   const publicId = this.getPublicIdFromUrl(orderItem.image)
        //   await cloudinary.uploader.destroy(publicId)
        // }
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', error)
        throw new Error('Failed to upload image')
      }
    }

    orderItem.merge(data)
    await orderItem.save()
    return orderItem
  }

  async deleteOrderItem(id: number) {
    const orderItem = await OrderItem.findOrFail(id)

    if (orderItem.image) {
      const publicId = this.getPublicIdFromUrl(orderItem.image)
      await cloudinary.uploader.destroy(publicId)
    }

    await orderItem.delete()
    return { message: 'Order item deleted successfully' }
  }

  private getPublicIdFromUrl(url: string): string {
    const parts = url.split('/')
    const filename = parts[parts.length - 1]
    return `order_items/${filename.split('.')[0]}`
  }
}
