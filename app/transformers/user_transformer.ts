import { BaseTransformer } from '@adonisjs/core/transformers'
import type User from '#models/user'
import type Role from '#models/role'
import type Permission from '#models/permission'
import RoleTransformer from '#transformers/role_transformer'

type RoleWithPermissions = Role & {
  permissions?: Permission[]
}

export default class UserTransformer extends BaseTransformer<User> {
  toObject() {
    const roles = this.whenLoaded(this.resource.roles)

    const roleItems = roles as unknown as RoleWithPermissions[] | undefined

    const permissions = roleItems
      ? [
          ...new Set(
            roleItems.flatMap((role) =>
              (role.permissions ?? []).map((permission) => permission.slug)
            )
          ),
        ]
      : undefined

    return {
      id: this.resource.id,
      full_name: this.resource.fullName,
      email: this.resource.email,
      is_active: this.resource.isActive,
      created_at: this.resource.createdAt,
      updated_at: this.resource.updatedAt,
      roles: RoleTransformer.transform(roles),
      permissions,
    }
  }
}