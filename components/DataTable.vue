<script setup lang="ts" generic="T extends Record<string, unknown>">
defineProps<{
  columns: { key: string; label: string; width?: string }[]
  rows:    T[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'row-click', row: T): void
}>()
</script>

<template>
  <div class="overflow-x-auto rounded-xl border border-bline bg-bg2">
    <div v-if="loading" class="p-8 text-center text-gray-500 font-mono text-sm">
      載入中...
    </div>

    <table v-else class="w-full border-collapse text-sm">
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            :style="col.width ? { width: col.width } : {}"
            class="px-4 py-2.5 text-left text-[10px] uppercase tracking-widest
                   text-gray-500 font-mono bg-bg3 border-b border-bline"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, i) in rows"
          :key="i"
          class="border-b border-bline last:border-0 cursor-pointer
                 transition-colors hover:bg-bg3"
          @click="emit('row-click', row)"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            class="px-4 py-2.5"
          >
            <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>

        <tr v-if="!rows.length">
          <td
            :colspan="columns.length"
            class="px-4 py-8 text-center text-gray-500"
          >
            無資料
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>