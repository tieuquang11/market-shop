import { schema, rules } from '@adonisjs/validator'

export const createProductValidator = schema.create({
  name: schema.string({}, [rules.required(), rules.minLength(3)]),
  description: schema.string({}, [rules.maxLength(500)]),
  price: schema.number([rules.range(0, 100000000)]),
  stock: schema.number([rules.range(0, 10000)]),
  category_id: schema.number([rules.range(0, 10000)]),
  image: schema.file.optional({
    size: '10mb',
    extnames: ['jpg', 'png', 'jpeg', 'jfif', 'gif'],
  }),
})

export const validationMessages = {
  'name.required': 'Product name is required',
  'category_id': 'category_id is required',
  'name.unique': 'Product name must be unique',
  'description.required': 'Product description is required',
  'price.required': 'Product price is required',
  'price.range': 'Product price must be between 0.01 and 100000',
  'stock.required': 'Product stock is required',
  'stock.range': 'Product stock must be between 0 and 10000',
  'image.required': 'Product image is required',
  'image.file.size': 'Image size must be under 10MB',
  'image.file.extname': 'Image must be jpg, png, jfif, gif, or jpeg',
}
