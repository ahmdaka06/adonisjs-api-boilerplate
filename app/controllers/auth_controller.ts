import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator } from '#validators/auth/login'
import { registerValidator } from '#validators/auth/register';
import Role from '#models/role';

export default class AuthController {

    async register({request, response, auth}: HttpContext) {
        const payload = await request.validateUsing(registerValidator)

        const existingUser = await User.findBy('email', payload.email)
        if (existingUser) {
            return response.conflict({
                message: 'Email already registered'
            })
        }

        const memberRole = await Role.findBy('slug', 'member')
        if (!memberRole) {
            return response.internalServerError({
                message: 'Default member has error'
            })
        }

        const user = await User.create({
            fullName: payload.full_name,
            email: payload.email,
            password: payload.password,
            isActive: true
        })

        await user.related('roles').sync([memberRole.id])

        const freshUser = await User.query()
            .where('id', user.id)
            .preload('roles', (roleQuery) => {
                roleQuery.preload('permissions')
            })
            .firstOrFail()

        const token = await auth.use('api').createToken(freshUser)

        const permissions = [
            ...new Set(
                freshUser.roles.flatMap((role) =>
                    role.permissions.map((permission) => permission.slug)
                )
            ),
        ]

        return response.created({
            message: 'Register successful',
            data: {
                token: token.value!.release(),
                user: {
                    id: freshUser.id,
                    full_name: freshUser.fullName,
                    email: freshUser.email,
                    is_active: freshUser.isActive,
                    roles: freshUser.roles.map((role) => ({
                        id: role.id,
                        name: role.name,
                        slug: role.slug,
                    })),
                    permissions,
                },
            },
        })
    }

    async login({request, response}: HttpContext) {
        const payload = await request.validateUsing(loginValidator)

        const user = await User.verifyCredentials(payload.email, payload.password)

        if (!user.isActive) {
            return response.status(403).json({
                message: 'User account is inactive'
            })
        }

        await user.load('roles', (roleQuery) => {
            roleQuery.preload('permissions')
        })

        const token = await User.accessTokens.create(user, ['*'], {
            name: 'api-login'
        })

        const permissions = [
            ... new Set(
                user.roles.flatMap((role) =>
                    role.permissions.map((permission) => permission.slug)
                )
            )
        ]

        return response.ok({
            message: 'Login successful',
            data: {
                token: token.value!.release(),
                user: {
                    id: user.id,
                    full_name: user.fullName,
                    email: user.email,
                    is_active: user.isActive,
                    roles: user.roles.map((role) => ({
                        id: role.id,
                        name: role.name,
                        slug: role.slug,
                    })),
                    permissions,
                },
            },
        })
    }

    async me({ auth, response }: HttpContext) {
        const authUser = auth.user!

        const user = await User.query()
            .where('id', authUser.id)
            .preload('roles', (roleQuery) => {
                roleQuery.preload('permissions')
            })
            .firstOrFail()

        const permissions = [
            ...new Set(
                user.roles.flatMap((role) =>
                    role.permissions.map((permission) => permission.slug)
                )
            ),
        ]


        return response.ok({
            message: 'Profile fetched successfully',
            data: {
                user: {
                    id: user.id,
                    full_name: user.fullName,
                    email: user.email,
                    is_active: user.isActive,
                    roles: user.roles.map((role) => ({
                        id: role.id,
                        name: role.name,
                        slug: role.slug,
                    })),
                    permissions,
                },
            },
        })
    }

    async logout({ auth, response }: HttpContext) {
        await auth.use('api').invalidateToken()

        return response.ok({
            message: 'Logout successful',
        })
    }
}