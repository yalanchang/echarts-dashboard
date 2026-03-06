<script setup lang="ts">
definePageMeta({ title: '商品管理' })

const router  = useRouter()
const search  = ref('')
const page    = ref(1)
const loading = ref(false)

interface Product {
  id: number; name: string; sku: string
  price: number; cost: number; stock: number
  category: string; is_active: number
}

const products   = ref<Product[]>([])
const total      = ref(0)
const totalPages = computed(() => Math.ceil(total.value / 20))

const columns = [
  { key: 'name',      label: '商品名稱' },
  { key: 'sku',       label: 'SKU',      width: '120px' },
  { key: 'category',  label: '分類',     width: '100px' },
  { key: 'price',     label: '售價',     width: '100px' },
  { key: 'stock',     label: '庫存',     width: '80px' },
  { key: 'is_active', label: '狀態',     width: '80px' },
  { key: 'actions',   label: '操作',     width: '100px' },
]

async function fetchProducts() {
  loading.value = true
  try {
    let url = `/api/products?page=${page.value}&limit=20`
    if (search.value) url += `&search=${encodeURIComponent(search.value)}`
    const { apiFetch } = useApi()
    const res = await apiFetch<{ data: Product[]; pagination: { total: number } }>(url)
    products.value = res.data ?? []
    total.value    = res.pagination?.total ?? 0
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function toggleActive(product: Product) {
  const { apiFetch } = useApi()
  await apiFetch(`/api/products/${product.id}`, {
    method: 'PATCH',
    body: { is_active: product.is_active ? 0 : 1 }
  })
  fetchProducts()
}

onMounted(() => fetchProducts())
watch([page, search], () => { if (import.meta.client) fetchProducts() })
</script>

<template>
  <div>
    <div class="mb-5 flex items-end justify-between">
      <div>
        <h1 class="text-[19px] font-bold">商品管理</h1>
        <p class="mt-0.5 text-xs text-gray-500">共 {{ total }} 件商品</p>
      </div>
      <button
        class="rounded-lg bg-c1 px-3 py-1.5 text-xs font-bold
               text-black transition hover:brightness-110"
        @click="router.push('/products/create')"
      >
        ＋ 新增商品
      </button>
    </div>

    <div class="mb-3">
      <input
        v-model="search"
        class="rounded-lg border border-bline bg-bg2 px-3 py-1.5 text-xs
               text-[#dde3ef] outline-none transition focus:border-c1 w-52"
        placeholder="搜尋商品名稱 / SKU..."
      >
    </div>

    <DataTable :columns="columns" :rows="products" :loading="loading">
      <template #cell-price="{ value }">
        <span class="font-mono text-c3">${{ Number(value).toLocaleString() }}</span>
      </template>
      <template #cell-stock="{ value }">
        <span :class="Number(value) <= 10 ? 'text-c2' : 'text-c1'" class="font-mono">
          {{ value }}
        </span>
      </template>
      <template #cell-is_active="{ value }">
        <span :class="value ? 'text-c1' : 'text-c2'">
          {{ value ? '● 上架' : '○ 下架' }}
        </span>
      </template>
      <template #cell-actions="{ row }">
        <div class="flex gap-2">
          <button
            class="text-xs text-c4 hover:brightness-125 transition"
            @click.stop="router.push('/products/' + row.id)"
          >
            編輯
          </button>
          <button
            class="text-xs hover:brightness-125 transition"
            :class="row.is_active ? 'text-c2' : 'text-c1'"
            @click.stop="toggleActive(row as any)"
          >
            {{ row.is_active ? '下架' : '上架' }}
          </button>
        </div>
      </template>
    </DataTable>

    <div class="mt-3 flex items-center justify-between text-xs text-gray-500">
      <span>第 {{ page }} / {{ totalPages }} 頁</span>
      <div class="flex gap-1.5">
        <button :disabled="page <= 1"
          class="rounded-lg border border-bline px-3 py-1.5 transition
                 hover:border-c1 hover:text-c1 disabled:opacity-30"
          @click="page--">← 上一頁</button>
        <button :disabled="page >= totalPages"
          class="rounded-lg border border-bline px-3 py-1.5 transition
                 hover:border-c1 hover:text-c1 disabled:opacity-30"
          @click="page++">下一頁 →</button>
      </div>
    </div>
  </div>
</template>