import Category from '#models/category'

export default class CategoriesService {
  async getAllCategories() {
    const categories = await Category.all()
    return categories
  }

  async createCategory(data: any) {
    const category = await Category.create(data)
    return category
  }

  async getCategoryById(id: number) {
    const category = await Category.findOrFail(id)
    return category
  }

  async updateCategory(id: number, data: any) {
    const category = await Category.findOrFail(id)
    category.merge(data)
    await category.save()
    return category
  }

  async deleteCategory(id: number) {
    const category = await Category.findOrFail(id)
    await category.delete()
    return { message: 'Category deleted successfully' }
  }
}
