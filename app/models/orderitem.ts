import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Product from '#models/product'
import Order from '#models/order'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class OrderItem extends BaseModel {
  deleteOrderItem(id: any) {
    throw new Error('Method not implemented.')
  }
  updateOrderItem: any
  getOrderItemById(id: any) {
    throw new Error('Method not implemented.')
  }
  createOrderItem(arg0: { image: import("@adonisjs/bodyparser").MultipartFile | null; order_id: any; product_id: any; quantity: any; price: any; name: any }) {
    throw new Error('Method not implemented.')
  }
  getAllOrderItems() {
    throw new Error('Method not implemented.')
  }
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare orderId: number

  @column()
  declare productId: number

  @column()
  declare quantity: number

  @column()
  declare price: number

  @column()
  declare name: string

  @column()
  declare image: string

  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>

  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
