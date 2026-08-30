<script setup lang="ts">
import { computed } from 'vue'
import { useMatchStore } from '../stores/match'

const store = useMatchStore()

const aPct = computed(() => {
  const { total, aWins } = store.stats
  if (!total) return 0
  return Math.round((aWins / total) * 100)
})

const caption = computed(() => {
  const s = store.stats
  if (s.total === 0) return 'Catat match pertama lo'
  if (s.aWins === s.bWins) return 'Imbang — seru!'
  if (s.aWins > s.bWins) return `${store.playerA} unggul ${aPct.value}%`
  return `${store.playerB} unggul ${100 - aPct.value}%`
})

function initial(name: string) {
  return (name.trim()[0] || '?').toUpperCase()
}
</script>

<template>
  <div class="score-card px-6 py-6">
    <div class="grid grid-cols-[1fr_auto_1fr] items-start gap-3">
      <!-- player A -->
      <div class="flex flex-col items-center gap-2">
        <div
          class="flex h-14 w-14 items-center justify-center rounded-full font-display text-xl font-semibold text-white"
          style="background: linear-gradient(135deg, #2dd4bf, #0d9488)"
        >
          {{ initial(store.playerA) }}
        </div>
        <span class="max-w-full truncate text-sm font-extrabold">{{ store.playerA }}</span>
        <span class="font-score text-[2.5rem] font-bold leading-none tabular-nums text-ink">
          {{ store.stats.aWins }}
        </span>
      </div>

      <!-- divider -->
      <div class="flex h-full items-center pt-5">
        <span class="text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted/60">vs</span>
      </div>

      <!-- player B -->
      <div class="flex flex-col items-center gap-2">
        <div
          class="flex h-14 w-14 items-center justify-center rounded-full font-display text-xl font-semibold text-white"
          style="background: linear-gradient(135deg, #ff8a8e, #f43f5e)"
        >
          {{ initial(store.playerB) }}
        </div>
        <span class="max-w-full truncate text-sm font-extrabold">{{ store.playerB }}</span>
        <span class="font-score text-[2.5rem] font-bold leading-none tabular-nums text-ink">
          {{ store.stats.bWins }}
        </span>
      </div>
    </div>

    <!-- win rate bar -->
    <div class="mt-6">
      <div class="flex h-2 w-full overflow-hidden rounded-full bg-ink/5">
        <div
          class="h-full transition-all duration-500"
          style="background: linear-gradient(90deg, #2dd4bf, #0d9488)"
          :style="{ width: (store.stats.total ? aPct : 50) + '%' }"
        ></div>
        <div
          class="h-full flex-1 transition-all duration-500"
          style="background: linear-gradient(90deg, #ff8a8e, #f43f5e)"
        ></div>
      </div>
      <p class="mt-2.5 text-center text-xs font-bold text-muted">{{ caption }}</p>
    </div>
  </div>
</template>
