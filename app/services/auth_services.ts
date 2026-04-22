import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

import User from '#models/user'
import Role from '#models/role'
import { RoleEnum } from '../../shared/enums/role_enum.ts'
import AppException from '#exceptions/app_exception'

export type RegisterPayload = {
  full_name: string
  email: string
  password: string
}

export type LoginPayload = {
  email: string
  password: string
}

@inject()
export default class AuthService {
    constructor(protected ctx: HttpContext) {}

    async register(payload: RegisterPayload) {
        const existingUser = await User.findBy('email', payload.email)
        if (existingUser) {
            throw new AppException('Email already registered', 400)
        }

        const memberRole = await Role.findBy('slug', RoleEnum.MEMBER)
        if (!memberRole) {
            throw new AppException('Default member has error', 500)
        }

        const user = await User.create({
            fullName: payload.full_name,
            email: payload.email,
            password: payload.password,
            isActive: true,
        })

        await user.related('roles').sync([memberRole.id])

        const freshUser = await this.getAuthenticatedUserById(user.id)
        const token = await this.ctx.auth.use('api').createToken(freshUser)

        return {
            token: token.value!.release(),
            user: freshUser,
            permissions: this.extractPermissions(freshUser),
        }
    }

    async login(payload: LoginPayload) {
        const user = await User.verifyCredentials(payload.email, payload.password)

        if (!user.isActive) {
            throw new AppException('User account is inactive', 400)
        }

        const freshUser = await this.getAuthenticatedUserById(user.id)
        const token = await this.ctx.auth.use('api').createToken(freshUser)

        return {
            token: token.value!.release(),
            user: freshUser,
            permissions: this.extractPermissions(freshUser),
        }
    }

    async me(userId: number) {
        const user = await this.getAuthenticatedUserById(userId)

        return {
            user,
            permissions: this.extractPermissions(user),
        }
    }

    async logout() {
        await this.ctx.auth.use('api').invalidateToken()
    }

    private async getAuthenticatedUserById(userId: number) {
        return User.query()
            .where('id', userId)
            .preload('roles', (roleQuery) => {
                roleQuery.preload('permissions')
            })
            .firstOrFail()
    }

    private extractPermissions(user: any) {
        return [
            ...new Set(
                (user.roles ?? []).flatMap((role: any) =>
                    (role.permissions ?? []).map((permission: any) => permission.slug)
                )
            ),
        ]
    }
}