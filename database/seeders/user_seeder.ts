import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        email: 'admin@gmail.com',
        password: await hash.make('11052001'),
        name: 'Admin',
        role: 'admin',
      },
      {
        email: 'user@gmail.com',
        password: await hash.make('11052001'),
        name: 'User',
        role: 'user',
      },
    ])
  }
}
