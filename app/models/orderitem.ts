import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Product from '#models/product'
import Order from '#models/order'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class OrderItem extends BaseModel {
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
  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>

  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
