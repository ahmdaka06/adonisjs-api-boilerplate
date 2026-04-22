import Role from '#models/role'
import Permission from '#models/permission'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await db.transaction(async (trx) => {
      const permissions = [
        {
          name: 'View Dashboard',
          slug: 'dashboard.view',
          description: 'Can view dashboard',
        },
        {
          name: 'View Users',
          slug: 'user.view',
          description: 'Can view user list and detail',
        },
        {
          name: 'Create User',
          slug: 'user.create',
          description: 'Can create user',
        },
        {
          name: 'Update User',
          slug: 'user.update',
          description: 'Can update user',
        },
        {
          name: 'Delete User',
          slug: 'user.delete',
          description: 'Can delete user',
        },
        {
          name: 'Assign User Role',
          slug: 'user.assign-role',
          description: 'Can assign roles to user',
        },
        {
          name: 'View Roles',
          slug: 'role.view',
          description: 'Can view roles',
        },
        {
          name: 'Create Role',
          slug: 'role.create',
          description: 'Can create role',
        },
        {
          name: 'Update Role',
          slug: 'role.update',
          description: 'Can update role',
        },
        {
          name: 'Delete Role',
          slug: 'role.delete',
          description: 'Can delete role',
        },
        {
          name: 'Assign Role Permission',
          slug: 'role.assign-permission',
          description: 'Can assign permissions to role',
        },
        {
          name: 'View Permissions',
          slug: 'permission.view',
          description: 'Can view permissions',
        },
        {
          name: 'Create Permission',
          slug: 'permission.create',
          description: 'Can create permission',
        },
        {
          name: 'Update Permission',
          slug: 'permission.update',
          description: 'Can update permission',
        },
        {
          name: 'Delete Permission',
          slug: 'permission.delete',
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
        { slug: 'super-admin' },
        {
          name: 'Super Admin',
          slug: 'super-admin',
          description: 'System super administrator',
        },
        { client: trx }
      )

      const memberRole = await Role.firstOrCreate(
        { slug: 'member' },
        {
          name: 'Member',
          slug: 'member',
          description: 'Default member role',
        },
        { client: trx }
      )

      superAdminRole.useTransaction(trx)
      memberRole.useTransaction(trx)

      const allPermissionIds = createdPermissions.map((permission) => permission.id)
      const memberPermissionIds = createdPermissions
        .filter((permission) => permission.slug === 'dashboard.view')
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

      adminUser.useTransaction(trx)
      await adminUser.related('roles').sync([superAdminRole.id])
    })
  }
}