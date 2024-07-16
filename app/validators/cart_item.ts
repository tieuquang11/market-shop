import { schema, rules } from '@adonisjs/validator'

export const CartItemValidator = schema.create({
  user_id: schema.number([rules.range(0.01, 100000)]),
  product_id: schema.number([rules.range(0.01, 100000)]),
  quantity: schema.number([rules.range(0.01, 100000)]),
})

export const validationMessages = {
  'user_id.required': 'User ID is required.',
  'user_id.exists': 'User does not exist.',
  'product_id.required': 'Product ID is required.',
  'product_id.exists': 'Product does not exist.',
  'quantity.required': 'Quantity is required.',
  'quantity.integer': 'Quantity must be an integer.',
  'quantity.min': 'Quantity must be greater than or equal to 1.',
}
