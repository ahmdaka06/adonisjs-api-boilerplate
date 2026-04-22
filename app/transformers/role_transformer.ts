import { BaseTransformer } from '@adonisjs/core/transformers'
import type Role from '#models/role'
import PermissionTransformer from '#transformers/permission_transformer'

export default class RoleTransformer extends BaseTransformer<Role> {
  toObject() {
    return {
      ...this.pick(
        this.resource, [
          'id', 
          'name', 
          'slug', 
          'description'
        ]
      ),
      permissions: PermissionTransformer.transform(
        this.whenLoaded(this.resource.permissions)
      ),
    }
  }
}