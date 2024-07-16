import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Category from '#models/category'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare price: number

  @column()
  declare stock: number

  @column()
  declare image: string | null

  @column()
  declare category_id: number

  @belongsTo(() => Category, { foreignKey: 'category_id' })
  declare category: BelongsTo<typeof Category>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
