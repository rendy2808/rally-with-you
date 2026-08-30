<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useMatchStore } from '../stores/match'
import type { MatchSet } from '../types'

const store = useMatchStore()
const show = defineModel<boolean>({ default: false })

const now = () => new Date().toISOString().slice(0, 10)
const today = now()

const form = reactive({
  winner: '' as 'a' | 'b' | '',
  date: today,
  durationMin: undefined as number | undefined,
  location: '',
  sets: [] as MatchSet[]
})

function addSet() {
  if (form.sets.length < 3) form.sets.push({ a: 0, b: 0 })
}
function bump(set: MatchSet, side: 'a' | 'b', delta: number) {
  set[side] = Math.max(0, set[side] + delta)
}

const setsA = computed(() => form.sets.filter((s) => s.a > s.b).length)
const setsB = computed(() => form.sets.filter((s) => s.b > s.a).length)

const derivedWinner = computed<'a' | 'b' | ''>(() => {
  if (!form.sets.length) return ''
  if (setsA.value === setsB.value) return ''
  return setsA.value > setsB.value ? 'a' : 'b'
})

const canSave = computed(() => !!form.winner)

function save() {
  if (!canSave.value) return
  const winner = form.winner as 'a' | 'b'
  void store.add({
    date: new Date(form.date + 'T12:00:00').getTime(),
    location: form.location.trim() || undefined,
    durationMin: form.durationMin || undefined,
    sets: form.sets.map((s) => ({ a: s.a, b: s.b })),
    winner
  })
  reset()
  show.value = false
}

function reset() {
  form.winner = ''
  form.date = today
  form.durationMin = undefined
  form.location = ''
  form.sets = []
}

watch(show, (v) => {
  if (v) {
    form.date = now()
    form.winner = ''
    form.durationMin = undefined
    form.location = ''
    form.sets = []
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="show" class="fixed inset-0 z-50 flex flex-col justify-end">
        <div class="absolute inset-0 bg-ink/40 backdrop-blur-sm" @click="show = false"></div>

        <div
          class="relative z-10 max-h-[90vh] overflow-y-auto rounded-t-3xl bg-white shadow-2xl safe-bottom"
        >
          <div class="sticky top-0 flex justify-center bg-white pt-3 pb-1">
            <span class="h-1.5 w-10 rounded-full bg-ink/10"></span>
          </div>

          <div class="px-6 pb-8">
            <h2 class="font-display text-xl font-semibold">Log Match</h2>

            <!-- winner -->
            <p class="mt-5 mb-2 text-xs font-bold uppercase tracking-wide text-muted">Siapa menang?</p>
            <div class="grid grid-cols-2 gap-3">
              <button
                class="rounded-2xl border-2 px-4 py-4 font-display font-semibold transition active:scale-95"
                :class="form.winner === 'a' ? 'border-sky bg-sky/10 text-sky' : 'border-ink/10 text-ink hover:border-sky/50'"
                @click="form.winner = 'a'"
              >
                {{ store.playerA }} 🏆
              </button>
              <button
                class="rounded-2xl border-2 px-4 py-4 font-display font-semibold transition active:scale-95"
                :class="form.winner === 'b' ? 'border-coral bg-coral/10 text-coral' : 'border-ink/10 text-ink hover:border-coral/50'"
                @click="form.winner = 'b'"
              >
                {{ store.playerB }} 🏆
              </button>
            </div>

            <!-- sets -->
            <div class="mt-5 flex items-center justify-between">
              <p class="text-xs font-bold uppercase tracking-wide text-muted">Skor set (opsional)</p>
              <button
                v-if="form.sets.length < 3"
                class="rounded-full bg-ink/5 px-3 py-1 text-xs font-extrabold text-ink"
                @click="addSet"
              >
                + set
              </button>
            </div>

            <div v-if="form.sets.length" class="mt-2 space-y-2">
              <div
                v-for="(s, i) in form.sets"
                :key="i"
                class="flex items-center justify-between rounded-2xl border border-ink/5 bg-ink/[0.03] px-4 py-3"
              >
                <span class="text-[10px] font-extrabold uppercase text-muted">Set {{ i + 1 }}</span>
                <div class="flex items-center gap-3">
                  <div class="flex items-center gap-2">
                    <button class="stepper" @click="bump(s, 'a', -1)">−</button>
                    <span class="font-score w-6 text-center text-lg font-bold tabular-nums">{{ s.a }}</span>
                    <button class="stepper" @click="bump(s, 'a', 1)">+</button>
                  </div>
                  <span class="text-muted">:</span>
                  <div class="flex items-center gap-2">
                    <button class="stepper" @click="bump(s, 'b', -1)">−</button>
                    <span class="font-score w-6 text-center text-lg font-bold tabular-nums">{{ s.b }}</span>
                    <button class="stepper" @click="bump(s, 'b', 1)">+</button>
                  </div>
                  <button class="ml-1 text-muted hover:text-coral" @click="form.sets.splice(i, 1)">✕</button>
                </div>
              </div>
              <p v-if="derivedWinner && derivedWinner !== form.winner" class="text-xs font-bold text-gold">
                ⚠️ Skor menunjuk {{ derivedWinner === 'a' ? store.playerA : store.playerB }} menang
              </p>
            </div>

            <!-- meta -->
            <div class="mt-5 grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs font-bold uppercase tracking-wide text-muted">Tanggal</label>
                <input
                  v-model="form.date"
                  type="date"
                  class="mt-1.5 w-full rounded-xl border border-ink/10 px-3 py-2.5 text-sm font-bold outline-none focus:border-teal"
                />
              </div>
              <div>
                <label class="text-xs font-bold uppercase tracking-wide text-muted">Durasi (menit)</label>
                <input
                  v-model.number="form.durationMin"
                  type="number"
                  min="0"
                  placeholder="60"
                  class="mt-1.5 w-full rounded-xl border border-ink/10 px-3 py-2.5 text-sm font-bold outline-none focus:border-teal"
                />
              </div>
            </div>

            <div class="mt-3">
              <label class="text-xs font-bold uppercase tracking-wide text-muted">Lokasi</label>
              <input
                v-model="form.location"
                type="text"
                placeholder="Lapangan mana?"
                class="mt-1.5 w-full rounded-xl border border-ink/10 px-3 py-2.5 text-sm font-bold outline-none focus:border-teal"
              />
            </div>

            <!-- save -->
            <button
              class="mt-6 w-full rounded-2xl py-4 font-display text-lg font-semibold transition active:scale-[0.97] disabled:opacity-40"
              style="background: linear-gradient(135deg, #ff7a7e, #ff4f55); box-shadow: 0 14px 30px -12px rgba(255,90,95,.7)"
              :class="canSave ? 'text-white' : 'text-white'"
              :disabled="!canSave"
              @click="save"
            >
              Simpan Match
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.stepper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  width: 30px;
  border-radius: 10px;
  background: #fff;
  border: 1px solid rgba(22, 40, 58, 0.1);
  font-weight: 800;
  font-size: 16px;
  color: #16283a;
  transition: all 0.12s ease;
}
.stepper:active {
  transform: scale(0.88);
  background: #eef2f6;
}
</style>
