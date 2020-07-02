import Vue from 'vue'

import { hasPermission, hasNoPermission, hasAnyPermission, hasRole, hasMenu } from 'utils/permissionDirect'

const Plugins = [
  hasPermission,
  hasNoPermission,
  hasAnyPermission,
  hasRole,
  hasMenu
]

Plugins.map((plugin) => {
  Vue.use(plugin)
})

export default Vue
