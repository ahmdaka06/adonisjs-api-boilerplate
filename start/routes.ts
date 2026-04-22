/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.get('/', () => {
  return { hello: 'world' }
})

router
  .group(() => {
    router
      .group(() => {
        router.post('/login', [controllers.Auth, 'login'])
        router.post('/register', [controllers.Auth, 'register'])
      })
      .prefix('auth')
      .as('auth')

    router
      .group(() => {
        router.get('/me', [controllers.Auth, 'me']).use(middleware.auth())
        router.post('/logout', [controllers.Auth, 'logout']).use(middleware.auth())
      })
      .prefix('auth')
      .as('auth')
      .use(middleware.auth())
  })
  .prefix('/api/v1')
