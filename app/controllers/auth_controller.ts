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

        return response.created({
            message: 'Register successful',
            data: {
                token: result.token,
                user: serialize(UserTransformer.transform(result.user)),
            },
        })
    }

    async login({request, response, auth, serialize}: HttpContext) {
        const payload = await request.validateUsing(loginValidator)

        const result = await this.authService.login(payload)

        return response.ok({
            message: 'Login successful.',
            data: {
                token: result.token,
                user: serialize(UserTransformer.transform(result.user)),
            },
        })
    }

    async me({ auth, response, serialize }: HttpContext) {
        const user = await this.authService.me(auth.user!.id)

        return response.ok({
            message: 'Success.',
            data: serialize(UserTransformer.transform(user)),
        })
    }

    async logout({ auth, response }: HttpContext) {
        await auth.use('api').invalidateToken()

        return response.ok({
            message: 'Logout successful.',
        })
    }
}