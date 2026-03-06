<script setup lang="ts">
const props = defineProps<{ status: string }>()

const map: Record<string, string> = {
  done:       'bg-c1/10 text-c1',
  pending:    'bg-c3/10 text-c3',
  processing: 'bg-c4/10 text-c4',
  shipped:    'bg-c5/10 text-c5',
  refund:     'bg-c2/10 text-c2',
  cancelled:  'bg-gray-500/10 text-gray-500',
}

const labelMap: Record<string, string> = {
  done:       '已完成',
  pending:    '待處理',
  processing: '處理中',
  shipped:    '配送中',
  refund:     '已退款',
  cancelled:  '已取消',
}

const cls   = computed(() => map[props.status]   ?? 'bg-gray-500/10 text-gray-500')
const label = computed(() => labelMap[props.status] ?? props.status)
</script>

<template>
  <span :class="['px-2 py-0.5 rounded-full text-[11px] font-mono font-medium', cls]">
    {{ label }}
  </span>
</template>