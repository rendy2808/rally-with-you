<script setup lang="ts">
import { useMatchStore } from '../stores/match'
import type { Match } from '../types'

const props = defineProps<{
  match: Match
  playerA: string
  playerB: string
}>()

const store = useMatchStore()

const fmt = new Intl.DateTimeFormat('id-ID', {
  weekday: 'short',
  day: 'numeric',
  month: 'short'
})

function dateLabel(d: number) {
  return fmt.format(d)
}

const winnerName = () => (props.match.winner === 'a' ? props.playerA : props.playerB)

function setLabel(s: { a: number; b: number }) {
  return `${s.a}–${s.b}`
}
</script>

<template>
  <div
    class="group relative overflow-hidden rounded-2xl border border-ink/5 bg-white/85 p-4 shadow-sm shadow-ink/5 backdrop-blur transition active:scale-[0.99]"
    :style="match.winner === 'a' ? 'border-left: 4px solid #38bdf8' : 'border-left: 4px solid #ff5a5f'"
  >
    <div class="flex items-center gap-3">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <span class="text-sm font-extrabold">{{ winnerName() }}</span>
          <span class="rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide" :style="match.winner === 'a' ? 'background:#e0f2fe;color:#0369a1' : 'background:#ffe4e6;color:#be123c'">
            menang
          </span>
        </div>
        <div class="mt-1 flex items-center gap-1.5 text-xs font-bold text-muted">
          <span>{{ dateLabel(match.date) }}</span>
          <template v-if="match.durationMin">
            <span>·</span><span>⏱ {{ match.durationMin }}m</span>
          </template>
          <template v-if="match.location">
            <span>·</span><span>📍 {{ match.location }}</span>
          </template>
        </div>
      </div>

      <div v-if="match.sets.length" class="flex items-center gap-1.5">
        <div
          v-for="(s, i) in match.sets"
          :key="i"
          class="rounded-lg px-1.5 py-1 font-score text-sm font-bold tabular-nums"
          :style="s.a > s.b ? 'background:#e0f2fe;color:#0369a1' : 'background:#ffe4e6;color:#be123c'"
        >
          {{ setLabel(s) }}
        </div>
      </div>

      <button
        class="ml-1 flex h-8 w-8 items-center justify-center rounded-full text-muted opacity-0 transition group-hover:opacity-100 hover:bg-ink/5 hover:text-coral active:opacity-100"
        aria-label="Hapus match"
        @click="match.id != null && store.remove(match.id)"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
        </svg>
      </button>
    </div>
  </div>
</template>
