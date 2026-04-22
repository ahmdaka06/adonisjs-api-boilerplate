export const RoleEnum = {
  SUPER_ADMIN: 'super-admin',
  MEMBER: 'member',
} as const

export type RoleEnumType = (typeof RoleEnum)[keyof typeof RoleEnum]