export const PermissionEnum = {
  DASHBOARD_VIEW: 'dashboard.view',

  USER_VIEW: 'user.view',
  USER_CREATE: 'user.create',
  USER_UPDATE: 'user.update',
  USER_DELETE: 'user.delete',
  USER_ASSIGN_ROLE: 'user.assign-role',

  ROLE_VIEW: 'role.view',
  ROLE_CREATE: 'role.create',
  ROLE_UPDATE: 'role.update',
  ROLE_DELETE: 'role.delete',
  ROLE_ASSIGN_PERMISSION: 'role.assign-permission',

  PERMISSION_VIEW: 'permission.view',
  PERMISSION_CREATE: 'permission.create',
  PERMISSION_UPDATE: 'permission.update',
  PERMISSION_DELETE: 'permission.delete',
} as const

export type PermissionEnumType =
  (typeof PermissionEnum)[keyof typeof PermissionEnum]