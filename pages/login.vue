<script setup lang="ts">
definePageMeta({ layout: false, title: '登入' })

const authStore = useAuthStore()
const router = useRouter()
const showPassword = ref(false)
const form = reactive({ email: '', password: '' })
const error = ref('')
const loading = ref(false)
const isMobile = ref(false)

// 監聽視窗大小
onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})

function checkScreenSize() {
  isMobile.value = window.innerWidth < 640
}

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await authStore.login(form.email, form.password)
    router.push('/')
  } catch (e: any) {
    error.value = e?.data?.message ?? '登入失敗'
  } finally {
    loading.value = false
  }
}

// 快速填入測試帳號（開發用）
function fillTestAccount() {
  form.email = 'admin@example.com'
  form.password = '11111111'
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-bg0 p-4 sm:p-0">
    <!-- 背景裝飾  -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-c1/5 blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-c2/5 blur-3xl"></div>
    </div>

    <div class="w-full max-w-sm px-0 sm:px-4">
      <!-- Logo 區域  -->
      <div class="mb-6 sm:mb-8 text-center">
        <div class="mx-auto mb-2 sm:mb-3 flex h-10 w-10 sm:h-12 sm:w-12 
                    items-center justify-center rounded-xl bg-c1 
                    text-xl sm:text-2xl shadow-lg shadow-c1/20">
          ⚡
        </div>
        <h1 class="font-mono text-lg sm:text-xl font-bold text-[#dde3ef]">
          DataPulse
        </h1>
        <p class="mt-1 text-xs text-gray-500 sm:hidden">管理後台</p>
      </div>

      <!-- 登入卡片 -->
      <div class="rounded-xl sm:rounded-2xl border border-bline 
                  bg-bg2/95 backdrop-blur-sm p-5 sm:p-8
                  shadow-xl transition-all">
        


        <!-- 錯誤訊息 -->
        <Transition name="shake">
          <div v-if="error" 
               class="mb-4 rounded-lg border border-c2/30 bg-c2/10
                      px-3 py-2.5 text-xs text-c2 flex items-center gap-2">
            <span class="flex-1">{{ error }}</span>
          </div>
        </Transition>

        <!-- 表單 -->
        <div class="space-y-4 sm:space-y-5">
          <!-- Email 輸入框 -->
          <div>
            <label class="mb-1.5 block text-[10px] sm:text-xs font-medium text-gray-500">
              <span class="flex items-center ">
                <span>電子郵件</span>
              </span>
            </label>
            <input 
              v-model="form.email" 
              type="email" 
              class="w-full rounded-lg border border-bline bg-bg3 
                     px-3 sm:px-4 py-2.5 sm:py-3
                     text-xs sm:text-sm text-[#dde3ef] 
                     outline-none transition-all
                     focus:border-c1 focus:ring-1 focus:ring-c1/20
                     placeholder:text-gray-700"
              placeholder="admin@example.com"
              :class="{ 'opacity-50': loading }"
              :disabled="loading"
            >
          </div>

          <!-- 密碼輸入框 -->
          <div>
            <label class="mb-1.5 block text-[10px] sm:text-xs font-medium text-gray-500">
              <span class="flex items-center ">
                <span>密碼</span>
              </span>
            </label>
            <div class="relative">
              <input 
                v-model="form.password" 
                :type="showPassword ? 'text' : 'password'" 
                class="w-full rounded-lg border border-bline bg-bg3 
                       px-3 sm:px-4 py-2.5 sm:py-3 pr-10
                       text-xs sm:text-sm text-[#dde3ef] 
                       outline-none transition-all
                       focus:border-c1 focus:ring-1 focus:ring-c1/20
                       placeholder:text-gray-700"
                placeholder="········"
                :class="{ 'opacity-50': loading }"
                :disabled="loading"
                @keyup.enter="submit"
              >
              <button 
                type="button"
                class="absolute right-2.5 top-1/2 -translate-y-1/2 
                       p-1.5 text-gray-500 hover:text-c1 
                       transition-colors rounded-lg
                       hover:bg-white/5"
                :class="{ 'opacity-50': loading }"
                :disabled="loading"
                @click="showPassword = !showPassword"
              >
                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          </div>

        </div>

        <!-- 登入 -->
        <button 
          :disabled="loading" 
          class="mt-5 sm:mt-6 w-full rounded-lg bg-c1 
                 py-3 sm:py-3.5 text-sm font-bold text-black
                 transition-all hover:brightness-110 
                 disabled:opacity-50 disabled:cursor-not-allowed
                 active:scale-[0.98] sm:active:scale-100
                 shadow-lg shadow-c1/20"
          @click="submit"
        >
          <span class="flex items-center justify-center gap-2">
            <span>登入</span>
          </span>
        </button>

        <!-- 測試帳號提示 - 手機版可點擊快速填入 -->
        <div class="mt-4 sm:mt-5 text-center">
          <div class="inline-flex items-center gap-1 sm:gap-2 
                      bg-bg3/50 rounded-full px-2 sm:px-3 py-1">
            <span class="text-[9px] sm:text-[11px] text-gray-600">
              {{ isMobile ? '測試' : '預設帳號：' }}
            </span>
            <button 
              class="text-[9px] sm:text-[11px] text-c1 hover:underline"
              @click="fillTestAccount"
            >
              admin@example.com
            </button>
            <span class="text-[9px] sm:text-[11px] text-gray-600">/</span>
            <span class="text-[9px] sm:text-[11px] text-gray-500">11111111</span>
          </div>
        </div>

      
      </div>

      <!-- 版權資訊 - 手機版精簡 -->
      <p class="mt-4 sm:mt-6 text-center text-[8px] sm:text-[10px] text-gray-700">
        © {{ new Date().getFullYear() }} DataPulse 
        <span class="hidden sm:inline">• 管理後台系統</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* 錯誤訊息抖動動畫 */
.shake-enter-active {
  animation: shake 0.3s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* 載入動畫 */
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}

/* 手機版點擊回饋 */
@media (max-width: 640px) {
  button:active {
    transform: scale(0.98);
  }
  
  /* 改善輸入框體驗 */
  input {
    font-size: 16px !important; /* 防止 iOS 放大 */
  }
}
</style>