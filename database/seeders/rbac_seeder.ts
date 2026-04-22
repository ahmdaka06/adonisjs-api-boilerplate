import db from '@adonisjs/lucid/services/db'
import {BaseSeeder} from '@adonisjs/lucid/seeders'

import Permission from '#models/permission'
import Role from '#models/role'
import User from '#models/user'
import { PermissionEnum } from '../../shared/enums/permission_enum.ts'
import { RoleEnum } from '../../shared/enums/role_enum.ts'

export default class extends BaseSeeder {
  async run() {
    await db.transaction(async (trx) => {
      const permissions = [
        {
          name: 'View Dashboard',
          slug: PermissionEnum.DASHBOARD_VIEW,
          description: 'Can view dashboard',
        },
        {
          name: 'View Users',
          slug: PermissionEnum.USER_VIEW,
          description: 'Can view user list and detail',
        },
        {
          name: 'Create User',
          slug: PermissionEnum.USER_CREATE,
          description: 'Can create user',
        },
        {
          name: 'Update User',
          slug: PermissionEnum.USER_UPDATE,
          description: 'Can update user',
        },
        {
          name: 'Delete User',
          slug: PermissionEnum.USER_DELETE,
          description: 'Can delete user',
        },
        {
          name: 'Assign User Role',
          slug: PermissionEnum.USER_ASSIGN_ROLE,
          description: 'Can assign roles to user',
        },
        {
          name: 'View Roles',
          slug: PermissionEnum.ROLE_VIEW,
          description: 'Can view roles',
        },
        {
          name: 'Create Role',
          slug: PermissionEnum.ROLE_CREATE,
          description: 'Can create role',
        },
        {
          name: 'Update Role',
          slug: PermissionEnum.ROLE_UPDATE,
          description: 'Can update role',
        },
        {
          name: 'Delete Role',
          slug: PermissionEnum.ROLE_DELETE,
          description: 'Can delete role',
        },
        {
          name: 'Assign Role Permission',
          slug: PermissionEnum.ROLE_ASSIGN_PERMISSION,
          description: 'Can assign permissions to role',
        },
        {
          name: 'View Permissions',
          slug: PermissionEnum.PERMISSION_VIEW,
          description: 'Can view permissions',
        },
        {
          name: 'Create Permission',
          slug: PermissionEnum.PERMISSION_CREATE,
          description: 'Can create permission',
        },
        {
          name: 'Update Permission',
          slug: PermissionEnum.PERMISSION_UPDATE,
          description: 'Can update permission',
        },
        {
          name: 'Delete Permission',
          slug: PermissionEnum.PERMISSION_DELETE,
          description: 'Can delete permission',
        },
      ]

      const createdPermissions: Permission[] = []

      for (const permission of permissions) {
        const item = await Permission.firstOrCreate(
          { slug: permission.slug },
          permission,
          { client: trx }
        )

        createdPermissions.push(item)
      }

      const superAdminRole = await Role.firstOrCreate(
        { slug: RoleEnum.SUPER_ADMIN },
        {
          name: 'Super Admin',
          slug: RoleEnum.SUPER_ADMIN,
          description: 'System super administrator',
        },
        { client: trx }
      )

      const memberRole = await Role.firstOrCreate(
        { slug: RoleEnum.MEMBER },
        {
          name: 'Member',
          slug: RoleEnum.MEMBER,
          description: 'Default member role',
        },
        { client: trx }
      )

      superAdminRole.useTransaction(trx)
      memberRole.useTransaction(trx)

      const allPermissionIds = createdPermissions.map((permission) => permission.id)

      const memberPermissionIds = createdPermissions
        .filter((permission) => permission.slug === PermissionEnum.DASHBOARD_VIEW)
        .map((permission) => permission.id)

      await superAdminRole.related('permissions').sync(allPermissionIds)
      await memberRole.related('permissions').sync(memberPermissionIds)

      const adminUser = await User.firstOrCreate(
        { email: 'admin@example.com' },
        {
          fullName: 'Super Admin',
          email: 'admin@example.com',
          password: 'password',
          isActive: true,
        },
        { client: trx }
      )

      const memberUser = await User.firstOrCreate(
        { email: 'member@example.com' },
        {
          fullName: 'Member User',
          email: 'member@example.com',
          password: 'password',
          isActive: true,
        },
        { client: trx }
      )

      adminUser.useTransaction(trx)
      memberUser.useTransaction(trx)

      await adminUser.related('roles').sync([superAdminRole.id])
      await memberUser.related('roles').sync([memberRole.id])
    })
  }
}