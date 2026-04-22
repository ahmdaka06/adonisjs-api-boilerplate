import type { HttpContext } from '@adonisjs/core/http'
import { loginValidator } from '#validators/auth/login'
import { registerValidator } from '#validators/auth/register';
import UserTransformer from '#transformers/user_transformer';
import { inject } from '@adonisjs/core'
import AuthService from '#services/auth_services';

@inject()
export default class AuthController {

    constructor(protected authService: AuthService) {}

    async register({request, response, serialize}: HttpContext) {
        const payload = await request.validateUsing(registerValidator)

        const result = await this.authService.register(payload)

        const serializedUser = await serialize(UserTransformer.transform(result.user))

        return response.created({
            message: 'Register successful',
            data: {
                token: result.token,
                user: {
                    ...serializedUser.data,
                    permissions: result.permissions,
                },
            },
        })
    }

    async login({request, response, serialize}: HttpContext) {
        const payload = await request.validateUsing(loginValidator)

        const result = await this.authService.login(payload)
        
        const serializedUser = await serialize(UserTransformer.transform(result.user))

        return response.ok({
            message: 'Login successful.',
            data: {
                token: result.token,
                user: {
                    ...serializedUser.data,
                    permissions: result.permissions,
                },
            },
        })
    }

    async me({ auth, response, serialize }: HttpContext) {
        const result = await this.authService.me(auth.user!.id)

        const serializedUser = await serialize(UserTransformer.transform(result.user))

        return response.ok({
            message: 'Success.',
            data: {
                user: {
                    ...serializedUser.data,
                    permissions: result.permissions,
                },
            }
        })
    }

    async logout({ auth, response }: HttpContext) {
        await auth.use('api').invalidateToken()

        return response.ok({
            message: 'Logout successful.',
        })
    }
}