<script setup lang="ts">
const route     = useRoute()
const router    = useRouter()
const authStore = useAuthStore()

const sidebarOpen = ref(false)

const navItems = [
  { to: '/',          label: '儀表板',   group: '主要' },
  { to: '/charts',    label: '數據報表', group: '主要' },
  { to: '/orders',    label: '訂單管理', group: '主要' },
  { to: '/users',     label: '用戶管理', group: '管理' },
  { to: '/products',  label: '商品管理', group: '管理' },
  { to: '/settings',  label: '系統設定', group: '管理' },
]

const groups = computed(() => [...new Set(navItems.map(n => n.group))])
function itemsOf(group: string) {
  return navItems.filter(n => n.group === group)
}

function navigate(to: string) {
  router.push(to)
  sidebarOpen.value = false
}

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}

function handleAdd() {
  const path = route.path
  if (path.startsWith('/users'))    router.push('/users/create')
  else if (path.startsWith('/orders'))   router.push('/orders/create')
  else if (path.startsWith('/products')) router.push('/products/create')
}

function handleExport() {
  const path = route.path
  if (path.startsWith('/orders'))  window.open('/api/orders/export', '_blank')
  else if (path.startsWith('/users')) window.open('/api/users/export', '_blank')
}
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-bg0 text-[#dde3ef] font-sans">

    <Transition name="fade">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-20 bg-black/60 lg:hidden"
        @click="sidebarOpen = false"
      />
    </Transition>

    <!-- ── Sidebar ────────────────────────────────── -->
    <Transition name="slide">
      <aside
        v-show="sidebarOpen || true"
        class="fixed inset-y-0 left-0 z-30 flex w-[220px] flex-col
               border-r border-bline bg-bg1
               lg:static lg:translate-x-0
               transition-transform duration-300"
        :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
      >
        <!-- Logo -->
        <div class="flex items-center gap-2.5 border-b border-bline px-4 py-5">
          <div class="flex h-8 w-8 shrink-0 items-center justify-center
                      rounded-lg bg-c1 text-base">⚡</div>
          <div>
            <div class="font-mono text-sm font-medium text-[#dde3ef]">DataPulse</div>
            <div class="font-mono text-[10px] text-gray-500">Admin Dashboard</div>
          </div>
          <button
            class="ml-auto lg:hidden text-gray-500 hover:text-c1"
            @click="sidebarOpen = false"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Nav -->
        <nav class="flex-1 overflow-y-auto py-2">
          <template v-for="group in groups" :key="group">
            <div class="px-4 py-3 pb-1 font-mono text-[10px] uppercase
                        tracking-[2px] text-gray-600">
              {{ group }}
            </div>
            <button
              v-for="item in itemsOf(group)"
              :key="item.to"
              class="flex w-full items-center gap-2.5 border-l-2 px-4 py-2
                     text-[13px] text-gray-500 transition-all
                     hover:bg-bg2 hover:text-[#dde3ef]"
              :class="route.path === item.to || route.path.startsWith(item.to + '/')
                ? 'border-c1 bg-c1/5 !text-c1'
                : 'border-transparent'"
              @click="navigate(item.to)"
            >
              {{ item.label }}
            </button>
          </template>
        </nav>

        <!-- User -->
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
          <div class="h-2 w-2 rounded-full bg-c1 shadow-[0_0_6px_#3bffa0]" />
          <button
            class="text-gray-500 hover:text-c2 transition ml-1"
            title="登出"
            @click="handleLogout"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </aside>
    </Transition>

    <!-- ── Main ───────────────────────────────────── -->
    <div class="flex flex-1 flex-col overflow-hidden min-w-0">
      <!-- Topbar -->
      <header class="flex h-[52px] shrink-0 items-center gap-3
                     border-b border-bline bg-bg1 px-4">
        <!-- 漢堡按鈕（手機） -->
        <button
          class="lg:hidden text-gray-500 hover:text-c1 transition"
          @click="sidebarOpen = true"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        <span class="font-mono text-xs text-gray-500 hidden sm:block">
          <b class="text-[#dde3ef]">{{ route.meta.title ?? '頁面' }}</b>
        </span>

        <div class="ml-auto flex items-center gap-2">
          <span class="hidden sm:flex items-center gap-1.5 rounded-md bg-c1/10
                       px-2.5 py-1 font-mono text-[11px] text-c1">
            <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-c1" />
            MySQL
          </span>
          <input
            class="hidden md:block rounded-lg border border-bline bg-bg2
                   px-3 py-1.5 text-xs text-[#dde3ef] outline-none
                   transition focus:border-c1 w-36"
            placeholder="🔍 搜尋..."
          >
          <template v-if="route.path.startsWith('/orders') || route.path.startsWith('/users') || route.path.startsWith('/products')">
            <button
              class="rounded-lg border border-bline bg-transparent px-3 py-1.5
                     text-xs text-gray-500 transition hover:border-c1 hover:text-c1
                     hidden sm:block"
              @click="handleExport"
            >
              匯出
            </button>
            <button
              class="rounded-lg bg-c1 px-3 py-1.5 text-xs font-bold
                     text-black transition hover:brightness-110"
              @click="handleAdd"
            >
              ＋ 新增
            </button>
          </template>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto p-4 lg:p-6">
        <slot />
      </main>
    </div>

  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>