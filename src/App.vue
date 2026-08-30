<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useMatchStore } from './stores/match'
import ScoreboardCard from './components/ScoreboardCard.vue'
import MatchCard from './components/MatchCard.vue'
import LogSheet from './components/LogSheet.vue'

const store = useMatchStore()
const showSheet = ref(false)
const showNames = ref(false)

onMounted(() => store.load())
</script>

<template>
  <div class="relative min-h-full">
    <!-- ambient particles -->
    <span class="particle" style="top:18%; left:8%; background:#38bdf8"></span>
    <span class="particle p2" style="top:34%; right:6%; background:#c8f031"></span>
    <span class="particle p3" style="top:62%; left:5%; background:#ffb020"></span>
    <span class="particle p4" style="top:80%; right:12%; background:#0fb5a6"></span>

    <div class="relative z-10 mx-auto max-w-md px-5 pb-32 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <!-- header -->
      <header class="mb-5 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-2xl text-xl"
            style="background: linear-gradient(135deg, #ff7a7e, #ff4f55); box-shadow: 0 8px 20px -8px rgba(255,90,95,.5)"
          >
            🎾
          </div>
          <div>
            <h1 class="font-display text-xl font-semibold leading-none">Rally</h1>
            <p class="mt-0.5 text-xs font-bold text-muted">
              {{ store.playerA }} vs {{ store.playerB }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div
            v-if="store.stats.streak > 0"
            class="flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-extrabold"
            style="background: #fff6e6; color: #b26a00"
          >
            <span class="flame">🔥</span>{{ store.stats.streak }}
          </div>
          <button
            class="flex h-9 w-9 items-center justify-center rounded-xl border border-ink/10 bg-white text-sm text-muted transition active:scale-95"
            aria-label="Edit nama pemain"
            @click="showNames = !showNames"
          >
            ✎
          </button>
        </div>
      </header>

      <!-- name editor -->
      <Transition name="pop">
        <div
          v-if="showNames"
          class="mb-5 rounded-2xl border border-ink/5 bg-white/80 p-4 shadow-lg shadow-ink/5 backdrop-blur"
        >
          <p class="mb-3 text-xs font-bold uppercase tracking-wide text-muted">Nama pemain</p>
          <div class="flex gap-3">
            <input
              v-model="store.playerA"
              class="w-full rounded-xl border border-ink/10 px-3 py-2.5 text-sm font-bold outline-none focus:border-sky"
              placeholder="Kamu"
            />
            <input
              v-model="store.playerB"
              class="w-full rounded-xl border border-ink/10 px-3 py-2.5 text-sm font-bold outline-none focus:border-coral"
              placeholder="Pasangan"
            />
          </div>
          <button
            class="mt-3 w-full rounded-xl bg-ink py-2.5 text-sm font-extrabold text-white"
            @click="store.setNames(store.playerA, store.playerB); showNames = false"
          >
            Simpan
          </button>
        </div>
      </Transition>

      <!-- scoreboard -->
      <ScoreboardCard />

      <!-- log CTA -->
      <button
        class="mt-6 w-full rounded-2xl py-4 font-display text-lg font-semibold text-white transition active:scale-[0.97]"
        style="background: linear-gradient(135deg, #ff7a7e, #ff4f55); box-shadow: 0 14px 30px -12px rgba(255,90,95,.7)"
        @click="showSheet = true"
      >
        + Log Match
      </button>

      <!-- history -->
      <div class="mt-8">
        <div class="mb-3 flex items-center justify-between">
          <h2 class="font-display text-base font-semibold">Riwayat</h2>
          <span class="text-xs font-bold text-muted">{{ store.matches.length }} match</span>
        </div>

        <TransitionGroup name="pop" tag="div" class="space-y-3">
          <MatchCard
            v-for="m in store.matches"
            :key="m.id"
            :match="m"
            :player-a="store.playerA"
            :player-b="store.playerB"
          />
        </TransitionGroup>

        <div
          v-if="store.loaded && store.matches.length === 0"
          class="rounded-2xl border-2 border-dashed border-ink/10 bg-white/50 px-6 py-10 text-center"
        >
          <div class="mb-2 text-4xl">🎾</div>
          <p class="font-display text-base font-semibold text-ink">Belum ada match</p>
          <p class="mt-1 text-sm text-muted">Tekan tombol di atas buat catat match pertama lo.</p>
        </div>
      </div>
    </div>

    <!-- log sheet -->
    <LogSheet v-model="showSheet" />
  </div>
</template>
