<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const sidebarOpen = ref(false)
const isMobile = ref(false)
const isTablet = ref(false)

// 監聽視窗大小變化
onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})

function checkScreenSize() {
  const width = window.innerWidth
  isMobile.value = width < 640
  isTablet.value = width >= 640 && width < 1024
  // 在桌機版自動關閉手機版的 sidebar 狀態
  if (width >= 1024) {
    sidebarOpen.value = false
  }
}

const navItems = [
  { label: '儀表板', to: '/', group: '主導航' },
  { label: '數據報表', to: '/charts', group: '主導航' },
  { label: '訂單管理', to: '/orders', group: '主導航' },
  { label: '用戶管理', to: '/users', group: '主導航' },
  { label: '商品管理', to: '/products', group: '主導航' },
  { label: '系統設定', to: '/settings', group: '次導航' },
]

const groups = computed(() => [...new Set(navItems.map(n => n.group))])

function itemsOf(group: string) {
  return navItems.filter(n => n.group === group)
}

function navigate(to: string) {
  router.push(to)
  if (isMobile.value) {
    sidebarOpen.value = false
  }
}

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}

function handleAdd() {
  const path = route.path
  if (path.startsWith('/users')) router.push('/users/create')
  else if (path.startsWith('/orders')) router.push('/orders/create')
  else if (path.startsWith('/products')) router.push('/products/create')
}

function handleExport() {
  const path = route.path
  if (path.startsWith('/orders')) window.open('/api/orders/export', '_blank')
  else if (path.startsWith('/users')) window.open('/api/users/export', '_blank')
}

// 頁面標題
const pageTitle = computed(() => {
  const path = route.path
  if (path === '/') return '儀表板'
  if (path.startsWith('/charts')) return '數據報表'
  if (path.startsWith('/orders')) return '訂單管理'
  if (path.startsWith('/users')) return '用戶管理'
  if (path.startsWith('/products')) return '商品管理'
  if (path.startsWith('/settings')) return '系統設定'
  return route.meta.title || '頁面'
})
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-bg0 text-[#dde3ef] font-sans">
    <!-- 手機版遮罩 -->
    <Transition name="fade">
      <div v-if="sidebarOpen && isMobile" class="fixed inset-0 z-20 bg-black/60 lg:hidden"
        @click="sidebarOpen = false" />
    </Transition>

    <!-- Sidebar -->
    <Transition :name="isMobile ? 'slide-mobile' : 'slide'">
      <aside v-show="sidebarOpen || !isMobile" class="fixed inset-y-0 left-0 z-30 flex w-[240px] flex-col
               border-r border-bline bg-bg1 shadow-xl
               lg:static lg:shadow-none
               transition-transform duration-300" :class="[
                isMobile ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0',
                'lg:translate-x-0'
              ]">
        <!-- Logo 區域 - 手機版高度降低 -->
        <div class="flex items-center gap-2.5 border-b border-bline px-3 py-3 lg:px-4 lg:py-5">
          <div class="flex h-7 w-7 lg:h-8 lg:w-8 shrink-0 items-center justify-center
                      rounded-lg bg-c1 text-sm lg:text-base">
            ⚡
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-mono text-xs lg:text-sm font-medium text-[#dde3ef] truncate">
              DataPulse
            </div>
            <div class="font-mono text-[9px] lg:text-[10px] text-gray-500 truncate">
              {{ isMobile ? 'Admin' : 'Admin Dashboard' }}
            </div>
          </div>
          <!-- 手機版關閉按鈕 -->
          <button v-if="isMobile" class="lg:hidden text-gray-500 hover:text-c1 p-1" @click="sidebarOpen = false">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <!-- Nav - 手機版滾動區域 -->
        <nav class="flex-1 overflow-y-auto py-1 lg:py-2">
          <template v-for="group in groups" :key="group">
            <!-- 群組標題 - 手機版隱藏或簡化 -->
            <div class="px-3 lg:px-4 py-2 lg:py-3 pb-1 font-mono 
                        text-[9px] lg:text-[10px] uppercase tracking-[2px] text-gray-600">
              {{ group }}
            </div>
            <button v-for="item in itemsOf(group)" :key="item.to" class="flex w-full items-center gap-2 lg:gap-2.5 border-l-2 
                     px-3 lg:px-4 py-2 text-xs lg:text-[13px] 
                     text-gray-500 transition-all
                     hover:bg-bg2 hover:text-[#dde3ef]" :class="route.path === item.to || route.path.startsWith(item.to + '/')
                      ? 'border-c1 bg-c1/5 !text-c1'
                      : 'border-transparent'" @click="navigate(item.to)">
              <!-- 手機版顯示圖示＋文字，平板以上只顯示文字 -->
              <span class="truncate">{{ item.label }}</span>
              <!-- 當前頁面指示器（手機版） -->
              <span v-if="route.path === item.to && isMobile" class="ml-auto text-c1 text-xs">●</span>
            </button>
          </template>
        </nav>

        <!-- User 區域 - 手機版精簡 -->
        <div class="flex items-center gap-2 border-t border-bline px-2 lg:px-4 py-2 lg:py-3">
          <div class="flex h-7 w-7 lg:h-8 lg:w-8 shrink-0 items-center justify-center
                      rounded-full bg-gradient-to-br from-c5 to-c4
                      text-xs font-bold text-white">
            {{ authStore.user?.name?.[0]?.toUpperCase() ?? 'A' }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="truncate text-xs lg:text-[13px] font-medium">
              {{ authStore.user?.name ?? 'Admin' }}
            </div>
            <div class="text-[10px] lg:text-[11px] text-gray-500 truncate">
              {{ authStore.user?.role ?? '' }}
            </div>
          </div>
          <!-- 在線狀態指示燈 - 手機版隱藏 -->
          <div class="hidden lg:block h-2 w-2 rounded-full bg-c1 shadow-[0_0_6px_#3bffa0]" />
          <button class="text-gray-500 hover:text-c2 transition ml-1 p-1" :title="isMobile ? '' : '登出'"
            @click="handleLogout">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </aside>
    </Transition>

    <!-- Main Content -->
    <div class="flex flex-1 flex-col overflow-hidden min-w-0">
      <!-- Topbar - -->
      <header class="flex h-[48px] lg:h-[52px] shrink-0 items-center gap-2 lg:gap-3
                     border-b border-bline bg-bg1/95 backdrop-blur-sm px-3 lg:px-4
                     sticky top-0 z-10">

        <!-- 漢堡選單按鈕（手機/平板） -->
        <button v-if="isMobile || isTablet" class="text-gray-500 hover:text-c1 transition p-1"
          @click="sidebarOpen = true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <!-- 頁面標題手機版只顯示圖示 -->
        <div class="flex items-center gap-2">
          <span class="font-mono text-xs lg:text-sm text-gray-500">
            <span class="hidden lg:inline text-[#dde3ef] font-medium">{{ pageTitle }}</span>
            <span class="lg:hidden text-[#dde3ef]">{{ pageTitle }}</span>
          </span>
        </div>

        <!-- 右側工具列 -->
        <div class="ml-auto flex items-center gap-1 lg:gap-2">
          <!-- 搜尋框 - 手機版隱藏，平板以上顯示 -->
          <div class="relative hidden md:block">
            <input class="rounded-lg border border-bline bg-bg2
                     pl-3 pr-8 py-1.5 text-xs text-[#dde3ef] outline-none
                     transition focus:border-c1 w-32 lg:w-36" placeholder="搜尋...">
          </div>

          <!-- 操作按鈕 -->
          <template
            v-if="route.path.startsWith('/orders') || route.path.startsWith('/users') || route.path.startsWith('/products')">
            <!-- 匯出按鈕 -->
            <button class="rounded-lg  bg-transparent 
         h-8 w-8 sm:w-auto sm:px-3 sm:h-auto sm:py-1.5
         flex items-center justify-center
         text-gray-500 transition hover:border-c1 hover:text-c1" @click="handleExport">
              <span class="hidden sm:inline text-xs">匯出</span>
              <svg class="sm:hidden" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>

            <!-- 新增按鈕 -->
            <button class="rounded-lg bg-c1 
         h-8 w-8 sm:w-auto sm:px-3 sm:h-auto sm:py-1.5
         flex items-center justify-center
         text-xs font-bold text-black transition hover:brightness-110" @click="handleAdd">
              <span class="hidden sm:inline">新增</span>
              <svg class="sm:hidden" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </template>

          <!-- 手機版通知圖示 -->
          <button class="lg:hidden text-gray-500 hover:text-c1 transition
               h-8 w-8 flex items-center justify-center
               rounded-lg ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
        </div>
      </header>

      <!-- 主要內容區域 - 手機版增加安全區域 -->
      <main class="flex-1 overflow-y-auto p-3 lg:p-6 ">
        <slot />
      </main>


    </div>
  </div>
</template>

<style scoped>
/* 淡入淡出動畫 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 側邊欄滑入動畫 - 手機版 */
.slide-mobile-enter-active,
.slide-mobile-leave-active {
  transition: transform 0.25s ease;
}

.slide-mobile-enter-from,
.slide-mobile-leave-to {
  transform: translateX(-100%);
}

/* 一般滑入動畫 */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 0);
}

@media (max-width: 640px) {
  button {
    min-height: 40px;
    min-width: 40px;
  }

  .overflow-y-auto {
    -webkit-overflow-scrolling: touch;
  }
}
</style>