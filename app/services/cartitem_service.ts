import CartItem from '#models/cart_item'

export default class CartItemService {
  async create(data: any) {
    const cartItem = await CartItem.create(data)
    return cartItem
  }

  async update(id: number, data: any) {
    const cartItem = await CartItem.findOrFail(id)
    cartItem.merge(data)
    await cartItem.save()
    return cartItem
  }

  async delete(id: number) {
    const cartItem = await CartItem.findOrFail(id)
    await cartItem.delete()
  }

  async getAll() {
    const cartItems = await CartItem.all()
    return cartItems
  }
}
