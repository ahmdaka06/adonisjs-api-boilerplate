/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    auth: {
      login: typeof routes['auth.auth.login']
      register: typeof routes['auth.auth.register']
      me: typeof routes['auth.auth.me']
      logout: typeof routes['auth.auth.logout']
    }
  }
}
