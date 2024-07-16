import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from '#models/user'
import Product from '#models/product'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class CartItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare userId: number

  @column()
  declare productId: number

  @column()
  declare quantity: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
