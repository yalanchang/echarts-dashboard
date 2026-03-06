<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({ title: '編輯商品' })

const router  = useRouter()
const route   = useRoute()
const id      = route.params.id
const error   = ref('')
const success = ref('')
const loading = ref(false)

const form = reactive({
  name: '', sku: '', price: 0, cost: 0, stock: 0, is_active: 1
})

onMounted(async () => {
  try {
    const { apiFetch } = useApi()
    const res = await apiFetch<{ data: any }>('/api/products/' + id)
    const data = res.data
    form.name      = data.name
    form.sku       = data.sku
    form.price     = Number(data.price)
    form.cost      = Number(data.cost)
    form.stock     = Number(data.stock)
    form.is_active = data.is_active
  } catch (e) {
    console.error(e)
  }
})

async function submit() {
  loading.value = true
  error.value   = ''
  success.value = ''
  try {
    const { apiFetch } = useApi()
    await apiFetch('/api/products/' + id, {
      method: 'PATCH',
      body: form
    })
    success.value = '更新成功'
  } catch (e: any) {
    error.value = e?.data?.message ?? '更新失敗'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-lg">
    <div class="mb-5">
      <NuxtLink to="/products" class="text-gray-500 hover:text-c1 transition text-sm">
        返回列表
      </NuxtLink>
      <h1 class="mt-2 text-[19px] font-bold">編輯商品</h1>
    </div>

    <div class="rounded-xl border border-bline bg-bg2 p-6 space-y-4">
      <div v-if="error"
        class="rounded-lg border border-c2/30 bg-c2/10 px-3 py-2 text-xs text-c2">
        {{ error }}
      </div>
      <div v-if="success"
        class="rounded-lg border border-c1/30 bg-c1/10 px-3 py-2 text-xs text-c1">
        {{ success }}
      </div>

      <div>
        <label class="mb-1.5 block text-xs text-gray-500">商品名稱</label>
        <input v-model="form.name"
          class="w-full rounded-lg border border-bline bg-bg3 px-3 py-2
                 text-sm text-[#dde3ef] outline-none transition focus:border-c1">
      </div>
      <div>
        <label class="mb-1.5 block text-xs text-gray-500">SKU</label>
        <input v-model="form.sku" disabled
          class="w-full rounded-lg border border-bline bg-bg3/50 px-3 py-2
                 text-sm text-gray-500 outline-none cursor-not-allowed">
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
          <label class="mb-1.5 block text-xs text-gray-500">狀態</label>
          <select v-model="form.is_active"
            class="w-full rounded-lg border border-bline bg-bg3 px-3 py-2
                   text-sm text-[#dde3ef] outline-none transition focus:border-c1">
            <option :value="1">上架</option>
            <option :value="0">下架</option>
          </select>
        </div>
      </div>

      <div class="flex gap-3">
        <button :disabled="loading"
          class="flex-1 rounded-lg bg-c1 py-2.5 text-sm font-bold text-black
                 transition hover:brightness-110 disabled:opacity-50"
          @click="submit">
          {{ loading ? '更新中...' : '儲存變更' }}
        </button>
        <button
          class="rounded-lg border border-bline px-4 py-2.5 text-sm
                 text-gray-500 transition hover:border-c1 hover:text-c1"
          @click="router.push('/products')">
          取消
        </button>
      </div>
    </div>
  </div>
</template>