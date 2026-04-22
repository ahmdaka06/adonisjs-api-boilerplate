import { BaseTransformer } from '@adonisjs/core/transformers'
import type User from '#models/user'
import RoleTransformer from '#transformers/role_transformer'

export default class UserTransformer extends BaseTransformer<User> {
  toObject() {
    return {
      id: this.resource.id,
      full_name: this.resource.fullName,
      email: this.resource.email,
      is_active: this.resource.isActive,
      created_at: this.resource.createdAt,
      updated_at: this.resource.updatedAt,
      roles: RoleTransformer.transform(this.whenLoaded(this.resource.roles)),
    }
  }
}