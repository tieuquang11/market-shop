/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const UsersController = () => import('#controllers/users_controller')
import { middleware } from './kernel.js'

router
  .group(() => {
    router.resource('/users', UsersController).apiOnly().except(['store', 'index'])
    router.post('/register', [() => import('#controllers/users_controller'), 'register'])
    router
      .get('/users', [() => import('#controllers/userpaginations_controller'), 'index'])
      .use(middleware.paginations())
    router.post('/login', [() => import('#controllers/users_controller'), 'login'])
    router
      .get('/profile', [() => import('#controllers/users_controller'), 'profile'])
      .use(middleware.auth())
    router
      .get('/home', async (ctx) => {
        return ctx.auth.use('api').user
      })
      .use(middleware.auth())
  })
  .prefix('api/v1')

router
  .group(() => {
    router
      .post('/products', [() => import('#controllers/products_controller'), 'create'])
      .use(middleware.auth())
      .use(middleware.adminAuth())
    router.put('/products/:id', [() => import('#controllers/products_controller'), 'update'])
    router.get('/products', [() => import('#controllers/products_controller'), 'getAll'])
    router.delete('/products/:id', [() => import('#controllers/products_controller'), 'delete'])
    router.get('/products/search', [() => import('#controllers/products_controller'), 'search'])
    router.get('/categories/:id/products', [
      () => import('#controllers/products_controller'),
      'getByCategory',
    ])
  })
  .prefix('api/v1')

router
  .group(() => {
    router.get('/categories', [() => import('#controllers/categories_controller'), 'index'])
    router.post('/categories', [() => import('#controllers/categories_controller'), 'store'])
    router.get('/categories/:id', [() => import('#controllers/categories_controller'), 'show'])
    router.put('/categories/:id', [() => import('#controllers/categories_controller'), 'update'])
    router.delete('/categories/:id', [
      () => import('#controllers/categories_controller'),
      'destroy',
    ])
  })
  .prefix('api/v1')

router
  .group(() => {
    router.get('/orders', [() => import('#controllers/orders_controller'), 'index'])
    router.post('/orders', [() => import('#controllers/orders_controller'), 'store'])
    router.get('/orders/:id', [() => import('#controllers/orders_controller'), 'show'])
    router.put('/orders/:id', [() => import('#controllers/orders_controller'), 'update'])
    router.delete('/orders/:id', [() => import('#controllers/orders_controller'), 'destroy'])
    router.post('/orders/:id/process-payment', [
      () => import('#controllers/orders_controller'),
      'processPayment',
    ])
    router.post('/products/:id/restore', [
      () => import('#controllers/products_controller'),
      'restore',
    ])
  })
  .use(middleware.auth())
  .prefix('api/v1')

router
  .group(() => {
    router.get('/orderItems', [() => import('#controllers/order_items_controller'), 'index'])
    router.post('/orderItems', [() => import('#controllers/order_items_controller'), 'store'])
    router.get('/orderItems/:id', [() => import('#controllers/order_items_controller'), 'show'])
    router.put('/orderItems/:id', [() => import('#controllers/order_items_controller'), 'update'])
    router.delete('/orderItems/:id', [
      () => import('#controllers/order_items_controller'),
      'destroy',
    ])
  })
  .use(middleware.auth())
  .prefix('api/v1')

router
  .group(() => {
    router.get('/user/products', [
      () => import('#controllers/products_controller'),
      'getUserProducts',
    ])
    router.post('/user/products', [
      () => import('#controllers/products_controller'),
      'createUserProduct',
    ])
    router.put('/user/products/:id', [
      () => import('#controllers/products_controller'),
      'updateUserProduct',
    ])
    router.delete('/user/products/:id', [
      () => import('#controllers/products_controller'),
      'deleteUserProduct',
    ])
  })
  .use(middleware.auth())
  .prefix('api/v1')
