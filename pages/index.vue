<script setup lang="ts">
import type { EChartsOption } from 'echarts'

definePageMeta({ title: '儀表板' })

const { apiFetch } = useApi()
const { chartColors: C, defaultTooltip } = useChartHelpers()

const { data, pending } = await useLazyAsyncData('dashboard', () =>
  apiFetch<{ data: DashboardStats }>('/api/dashboard/stats')
)

interface DashboardStats {
  kpi: {
    revenue: number; prevRev: number
    orders: number;  prevOrders: number
    activeUsers: number
    refundRate: number
  }
  revenueByMonth:  { month: string; revenue: number }[]
  ordersByWeekday: { weekday: string; count: number }[]
}

const stats = computed(() => data.value?.data)

const lineOption = computed<EChartsOption>(() => {
  const months  = stats.value?.revenueByMonth.map(r => r.month)  ?? []
  const values  = stats.value?.revenueByMonth.map(r => r.revenue) ?? []

  return {
    backgroundColor: 'transparent',
    grid: { top: 32, right: 12, bottom: 28, left: 52 },
    tooltip: defaultTooltip(),
    xAxis: {
      type: 'category', data: months,
      axisLine: { lineStyle: { color: C.line } },
      axisLabel: { color: C.text2, fontFamily: 'DM Mono' },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: C.text2, formatter: (v: number) => `$${v}K` },
      splitLine: { lineStyle: { color: C.line } },
    },
    series: [{
      type: 'line', data: values, smooth: true,
      symbol: 'circle', symbolSize: 5,
      lineStyle: { color: C.green, width: 2 },
      itemStyle: { color: C.green },
      areaStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(59,255,160,.22)' },
            { offset: 1, color: 'rgba(59,255,160,0)' },
          ],
        },
      },
    }],
  }
})

//  餅圖 Option 
const pieOption = computed<EChartsOption>(() => ({
  backgroundColor: 'transparent',
  tooltip: defaultTooltip('item'),
  legend: {
    orient: 'vertical', right: 8, top: 'center',
    textStyle: { color: C.text2, fontSize: 11 },
  },
  series: [{
    type: 'pie',
    radius: ['38%', '68%'],
    center: ['40%', '50%'],
    label: { formatter: '{b}\n{d}%', color: '#dde3ef', fontSize: 11 },
    data: [
      { value: 35, name: '電子產品', itemStyle: { color: C.blue } },
      { value: 28, name: '服飾',     itemStyle: { color: C.purple } },
      { value: 20, name: '居家',     itemStyle: { color: C.green } },
      { value: 17, name: '其他',     itemStyle: { color: C.yellow } },
    ],
  }],
}))

//  柱狀圖 Option 
const barOption = computed<EChartsOption>(() => {
  const days   = stats.value?.ordersByWeekday.map(r => r.weekday) ?? []
  const counts = stats.value?.ordersByWeekday.map(r => r.count)   ?? []

  return {
    backgroundColor: 'transparent',
    grid: { top: 10, right: 10, bottom: 24, left: 36 },
    tooltip: defaultTooltip(),
    xAxis: {
      type: 'category', data: days,
      axisLine: { lineStyle: { color: C.line } },
      axisLabel: { color: C.text2, fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: C.text2 },
      splitLine: { lineStyle: { color: C.line } },
    },
    series: [{
      type: 'bar', data: counts, barMaxWidth: 28,
      itemStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: C.blue },
            { offset: 1, color: 'rgba(116,185,255,.2)' },
          ],
        },
        borderRadius: [4, 4, 0, 0],
      },
    }],
  }
})

// ── 格式化 ─────────────────────────────────────────────────
function pct(curr: number, prev: number) {
  if (!prev) return 0
  return Math.round((curr - prev) / prev * 100 * 10) / 10
}

function fmtMoney(n: number) {
  return n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(2)}M`
    : `$${(n / 1_000).toFixed(1)}K`
}
</script>

<template>
  <div>
    <div class="mb-5">
      <h1 class="text-[19px] font-bold">總覽儀表板</h1>
      <p class="mt-0.5 text-xs text-gray-500">即時數據 · 最後更新 2 分鐘前</p>
    </div>

    <div class="mb-4 grid grid-cols-4 gap-3">
      <KpiCard
         label="本月營收"
        :value="stats ? fmtMoney(stats.kpi.revenue) : '—'"
        :change="stats ? pct(stats.kpi.revenue, stats.kpi.prevRev) : undefined"
      />
      <KpiCard
         label="訂單數" color="text-c4"
        :value="stats?.kpi.orders.toLocaleString() ?? '—'"
        :change="stats ? pct(stats.kpi.orders, stats.kpi.prevOrders) : undefined"
      />
      <KpiCard
        label="活躍用戶" color="text-c5"
        :value="stats?.kpi.activeUsers.toLocaleString() ?? '—'"
      />
      <KpiCard
        label="退貨率" color="text-c2"
        :value="stats ? `${stats.kpi.refundRate}%` : '—'"
      />
    </div>

    <div class="mb-3 grid grid-cols-[2fr_1fr] gap-3">
      <div class="rounded-xl border border-bline bg-bg2 p-4">
        <div class="text-[13px] font-semibold">月營收趨勢</div>
        <div class="mb-3 text-[11px] text-gray-500">折線圖 · 近12個月</div>
        <EChart :option="lineOption" height="255px" />
      </div>
      <div class="rounded-xl border border-bline bg-bg2 p-4">
        <div class="text-[13px] font-semibold">品類佔比</div>
        <div class="mb-3 text-[11px] text-gray-500">餅圖 · 本月</div>
        <EChart :option="pieOption" height="255px" />
      </div>
    </div>

    <div class="mb-3 grid grid-cols-3 gap-3">
      <div class="rounded-xl border border-bline bg-bg2 p-4">
        <div class="text-[13px] font-semibold">週訂單量</div>
        <div class="mb-3 text-[11px] text-gray-500">柱狀圖 · 本週</div>
        <EChart :option="barOption" height="190px" />
      </div>

      <div class="col-span-2 rounded-xl border border-bline bg-bg2">
        <div class="flex items-center justify-between border-b border-bline px-4 py-3">
          <span class="text-[13px] font-semibold">最新訂單</span>
          <NuxtLink to="/orders"
            class="text-xs text-gray-500 hover:text-c1 transition">
            查看全部
          </NuxtLink>
        </div>
        <table class="w-full text-xs border-collapse">
          <thead>
            <tr>
              <th class="px-4 py-2 text-left font-mono text-[10px] uppercase
                         tracking-widest text-gray-500 bg-bg3 border-b border-bline">
                訂單編號
              </th>
              <th class="px-4 py-2 text-left font-mono text-[10px] uppercase
                         tracking-widest text-gray-500 bg-bg3 border-b border-bline">
                客戶
              </th>
              <th class="px-4 py-2 text-left font-mono text-[10px] uppercase
                         tracking-widest text-gray-500 bg-bg3 border-b border-bline">
                金額
              </th>
              <th class="px-4 py-2 text-left font-mono text-[10px] uppercase
                         tracking-widest text-gray-500 bg-bg3 border-b border-bline">
                狀態
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in 4" :key="i"
                class="border-b border-bline last:border-0 hover:bg-bg3 transition">
              <td class="px-4 py-2.5 font-mono">#ORD-0042{{ i }}</td>
              <td class="px-4 py-2.5">示範用戶 {{ i }}</td>
              <td class="px-4 py-2.5 font-mono text-c3">${{ (i * 12900).toLocaleString() }}</td>
              <td class="px-4 py-2.5">
                <StatusBadge :status="['done','pending','shipped','processing'][i-1]" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
function useChartHelpers() {
  return {
    chartColors: {
      green: '#3bffa0', red: '#ff6b6b', yellow: '#ffd166',
      blue: '#74b9ff', purple: '#a29bfe',
      bg2: '#121620', bg3: '#181d2a', line: '#1e2536', text2: '#6b7a99',
    },
    defaultTooltip(trigger: 'axis' | 'item' = 'axis') {
      return {
        trigger,
        backgroundColor: '#181d2a',
        borderColor: '#1e2536',
        textStyle: { color: '#dde3ef', fontFamily: 'DM Mono', fontSize: 12 },
      }
    },
  }
}
</script>