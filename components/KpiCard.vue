<script setup lang="ts">
defineProps<{
  label:   string
  value:   string | number
  change?: number  
  color?:  string   
}>()
</script>

<template>
  <div
    class="relative overflow-hidden rounded-xl border border-bline bg-bg2 p-5
           transition-all duration-200 hover:-translate-y-0.5 hover:border-c1"
  >
    <div class="text-xs text-gray-500 tracking-wide">{{ label }}</div>
    <div :class="['font-mono text-2xl font-medium my-1', color ?? 'text-c1']">
      {{ value }}
    </div>
    <div
      v-if="change !== undefined"
      :class="['text-xs flex items-center gap-1', change >= 0 ? 'text-c1' : 'text-c2']"
    >
      <span>{{ change >= 0 ? '▲' : '▼' }}</span>
      <span>{{ Math.abs(change) }}% vs 上月</span>
    </div>
  </div>
</template>