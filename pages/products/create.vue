<script setup lang="ts">
definePageMeta({ title: '新增商品' })

const router  = useRouter()
const error   = ref('')
const loading = ref(false)

const form = reactive({
  name: '', sku: '', price: 0, cost: 0,
  stock: 0, category_id: 1
})

const categories = ref<{ id: number; name: string }[]>([])

onMounted(async () => {
  const { apiFetch } = useApi()
  const res = await apiFetch<{ data: any[] }>('/api/categories')
  categories.value = res.data ?? []
})

async function submit() {
  if (!form.name || !form.sku) { error.value = '請填寫名稱和 SKU'; return }
  loading.value = true
  error.value   = ''
  try {
    const { apiFetch } = useApi()
    await apiFetch('/api/products', { method: 'POST', body: form })
    router.push('/products')
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
      <NuxtLink to="/products" class="text-gray-500 hover:text-c1 transition text-sm">
        ← 返回列表
      </NuxtLink>
      <h1 class="mt-2 text-[19px] font-bold">新增商品</h1>
    </div>

    <div class="rounded-xl border border-bline bg-bg2 p-6 space-y-4">
      <div v-if="error" class="rounded-lg border border-c2/30 bg-c2/10 px-3 py-2 text-xs text-c2">
        {{ error }}
      </div>

      <div>
        <label class="mb-1.5 block text-xs text-gray-500">商品名稱</label>
        <input v-model="form.name"
          class="w-full rounded-lg border border-bline bg-bg3 px-3 py-2
                 text-sm text-[#dde3ef] outline-none transition focus:border-c1">
      </div>
      <div>
        <label class="mb-1.5 block text-xs text-gray-500">SKU</label>
        <input v-model="form.sku"
          class="w-full rounded-lg border border-bline bg-bg3 px-3 py-2
                 text-sm text-[#dde3ef] outline-none transition focus:border-c1">
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="mb-1.5 block text-xs text-gray-500">售價</label>
          <input v-model="form.price" type="number"
            class="w-full rounded-lg border border-bline bg-bg3 px-3 py-2
                   text-sm text-[#dde3ef] outline-none transition focus:border-c1">
        </div>
        <div>
          <label class="mb-1.5 block text-xs text-gray-500">成本</label>
          <input v-model="form.cost" type="number"
            class="w-full rounded-lg border border-bline bg-bg3 px-3 py-2
                   text-sm text-[#dde3ef] outline-none transition focus:border-c1">
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="mb-1.5 block text-xs text-gray-500">庫存</label>
          <input v-model="form.stock" type="number"
            class="w-full rounded-lg border border-bline bg-bg3 px-3 py-2
                   text-sm text-[#dde3ef] outline-none transition focus:border-c1">
        </div>
        <div>
          <label class="mb-1.5 block text-xs text-gray-500">分類</label>
          <select v-model="form.category_id"
            class="w-full rounded-lg border border-bline bg-bg3 px-3 py-2
                   text-sm text-[#dde3ef] outline-none transition focus:border-c1">
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
      </div>

      <button :disabled="loading"
        class="w-full rounded-lg bg-c1 py-2.5 text-sm font-bold text-black
               transition hover:brightness-110 disabled:opacity-50"
        @click="submit">
        {{ loading ? '建立中...' : '建立商品' }}
      </button>
    </div>
  </div>
</template>