import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  hasMany,
  manyToMany,
} from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Permission from '#models/permission'
import User from '#models/user'
import RolePermission from '#models/role_permission'
import UserRole from '#models/user_role'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare description: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => UserRole, {
    foreignKey: 'roleId',
  })
  declare userRoles: HasMany<typeof UserRole>

  @hasMany(() => RolePermission, {
    foreignKey: 'roleId',
  })
  declare rolePermissions: HasMany<typeof RolePermission>

  @manyToMany(() => User, {
    pivotTable: 'user_roles',
    localKey: 'id',
    pivotForeignKey: 'role_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id',
  })
  declare users: ManyToMany<typeof User>

  @manyToMany(() => Permission, {
    pivotTable: 'role_permissions',
    localKey: 'id',
    pivotForeignKey: 'role_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'permission_id',
  })
  declare permissions: ManyToMany<typeof Permission>
}