<script setup lang="ts">
const route = useRoute()
const authStore = useAuthStore()
const router = useRouter()

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}

function handleAdd() {
  const path = route.path
  if (path.startsWith('/orders')) router.push('/orders/create')
  else if (path.startsWith('/products')) router.push('/products/create')
}

function handleExport() {
  const path = route.path
  if (path.startsWith('/orders')) {
    window.open('/api/orders/export', '_blank')
  } else if (path.startsWith('/users')) {
    window.open('/api/users/export', '_blank')
  }
}
const navItems = [
  { to: '/', label: '儀表板', group: '主要' },
  { to: '/charts', label: '數據報表', group: '主要' },
  { to: '/orders', label: '訂單管理', group: '主要' },
  { to: '/users', label: '用戶管理', group: '管理' },
  { to: '/products', label: '商品管理', group: '管理' },
  { to: '/settings', label: '系統設定', group: '管理' },
]

const groups = computed(() =>
  [...new Set(navItems.map(n => n.group))]
)

function itemsOf(group: string) {
  return navItems.filter(n => n.group === group)
}
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-bg0 text-[#dde3ef] font-sans">

    <aside class="flex w-[220px] min-w-[220px] flex-col border-r border-bline bg-bg1">
      <div class="flex items-center gap-2.5 border-b border-bline px-4 py-5">
        <div class="flex h-8 w-8 shrink-0 items-center justify-center
                    rounded-lg bg-c1 text-base">⚡</div>
        <div>
          <div class="font-mono text-sm font-medium text-[#dde3ef]">DataPulse</div>
        </div>
      </div>

      <nav class="flex-1 overflow-y-auto py-2">
        <template v-for="group in groups" :key="group">
          <div class="px-4 py-3 pb-1 font-mono text-[10px] uppercase
                      tracking-[2px] text-gray-600">
            {{ group }}
          </div>
          <NuxtLink v-for="item in itemsOf(group)" :key="item.to" :to="item.to" class="flex items-center gap-2.5 border-l-2 px-4 py-2 text-[13px]
                   text-gray-500 transition-all hover:bg-bg2 hover:text-[#dde3ef]" :class="route.path === item.to
                    ? 'border-c1 bg-c1/5 !text-c1'
                    : 'border-transparent'">
            {{ item.label }}
          </NuxtLink>
        </template>
      </nav>

      <div class="flex items-center gap-2.5 border-t border-bline px-4 py-3">
        <div class="flex h-8 w-8 shrink-0 items-center justify-center
              rounded-full bg-gradient-to-br from-c5 to-c4
              text-xs font-bold text-white">
          {{ authStore.user?.name?.[0]?.toUpperCase() ?? 'A' }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="truncate text-[13px] font-medium">
            {{ authStore.user?.name ?? 'Admin' }}
          </div>
          <div class="text-[11px] text-gray-500">
            {{ authStore.user?.role ?? '' }}
          </div>
        </div>
        <button class="text-gray-500 hover:text-c2 transition text-xs" title="登出" @click="handleLogout">
          ⏻
        </button>
      </div>
    </aside>

    <div class="flex flex-1 flex-col overflow-hidden">
      <header class="flex h-[52px] shrink-0 items-center gap-3
                     border-b border-bline bg-bg1 px-6">
        <span class="font-mono text-xs text-gray-500">
          <b class="text-[#dde3ef]">{{ route.meta.title ?? '頁面' }}</b>
        </span>

        <div class="ml-auto flex items-center gap-2">

          <input class="rounded-lg border border-bline bg-bg2 px-3 py-1.5 text-xs
                   text-[#dde3ef] outline-none transition focus:border-c1 w-40" placeholder="搜尋...">
          <template v-if="route.path.startsWith('/orders') ">
            <button class="rounded-lg border border-bline bg-transparent px-3 py-1.5
             text-xs text-gray-500 transition hover:border-c1 hover:text-c1" @click="handleExport">
              匯出
            </button>
            <button class="rounded-lg bg-c1 px-3 py-1.5 text-xs font-bold
             text-black transition hover:brightness-110" @click="handleAdd">
              ＋ 新增
            </button>
          </template>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>
    </div>

  </div>
</template>