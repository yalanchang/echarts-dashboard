<script setup lang="ts">
definePageMeta({ title: '新增訂單' })

const router = useRouter()
const form = reactive({
  user_id: '',
  note: '',
  status: 'pending'
})
const error = ref('')
const loading = ref(false)
const users = ref<any[]>([])

onMounted(async () => {
  try {
    const { apiFetch } = useApi()
    const res = await apiFetch<{ data: any[] }>('/api/users?limit=100')
    users.value = res.data ?? []
  } catch (e) {
    console.error(e)
  }
})

async function submit() {
  if (!form.user_id) {
    error.value = '請選擇用戶'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const { apiFetch } = useApi()
    await apiFetch('/api/orders', {
      method: 'POST',
      body: form
    })
    router.push('/orders')
  } catch (e: any) {
    error.value = e?.data?.message ?? '建立失敗'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-lg">
    <div class="mb-5">
      <NuxtLink to="/orders" class="text-gray-500 hover:text-c1 transition text-sm">
        返回列表
      </NuxtLink>
      <h1 class="mt-2 text-[19px] font-bold">新增訂單</h1>
    </div>

    <div class="rounded-xl border border-bline bg-bg2 p-6">
      <div v-if="error" class="mb-4 rounded-lg border border-c2/30 bg-c2/10 px-3 py-2 text-xs text-c2">
        {{ error }}
      </div>

      <div class="mb-4">
        <label class="mb-1.5 block text-xs text-gray-500">客戶</label>
        <select v-model="form.user_id"
          class="w-full rounded-lg border border-bline bg-bg3 px-3 py-2
                 text-sm text-[#dde3ef] outline-none transition focus:border-c1">
          <option value="">請選擇客戶</option>
          <option v-for="u in users" :key="u.id" :value="u.id">
            {{ u.name }} ({{ u.email }})
          </option>
        </select>
      </div>

      <div class="mb-4">
        <label class="mb-1.5 block text-xs text-gray-500">狀態</label>
        <select v-model="form.status"
          class="w-full rounded-lg border border-bline bg-bg3 px-3 py-2
                 text-sm text-[#dde3ef] outline-none transition focus:border-c1">
          <option value="pending">待處理</option>
          <option value="processing">處理中</option>
          <option value="shipped">配送中</option>
          <option value="done">已完成</option>
        </select>
      </div>

      <div class="mb-6">
        <label class="mb-1.5 block text-xs text-gray-500">備註</label>
        <textarea v-model="form.note" rows="3"
          class="w-full rounded-lg border border-bline bg-bg3 px-3 py-2
                 text-sm text-[#dde3ef] outline-none transition focus:border-c1 resize-none">
        </textarea>
      </div>

      <button
        :disabled="loading"
        class="w-full rounded-lg bg-c1 py-2.5 text-sm font-bold text-black
               transition hover:brightness-110 disabled:opacity-50"
        @click="submit"
      >
        {{ loading ? '建立中...' : '建立訂單' }}
      </button>
    </div>
  </div>
</template>