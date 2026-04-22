import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Role from '#models/role'
import Permission from '#models/permission'

export default class RolePermission extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'role_id' })
  declare roleId: number

  @column({ columnName: 'permission_id' })
  declare permissionId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Role, {
    foreignKey: 'roleId',
  })
  declare role: BelongsTo<typeof Role>

  @belongsTo(() => Permission, {
    foreignKey: 'permissionId',
  })
  declare permission: BelongsTo<typeof Permission>
}