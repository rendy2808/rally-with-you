import { defineStore } from 'pinia'
import { db } from '../db'
import type { Match, Stats } from '../types'

const A_KEY = 'rally.playerA'
const B_KEY = 'rally.playerB'

export const useMatchStore = defineStore('match', {
  state: () => ({
    matches: [] as Match[],
    playerA: localStorage.getItem(A_KEY) || 'Kamu',
    playerB: localStorage.getItem(B_KEY) || 'Pasangan',
    loaded: false
  }),

  getters: {
    stats(state): Stats {
      const aWins = state.matches.filter((m) => m.winner === 'a').length
      const bWins = state.matches.filter((m) => m.winner === 'b').length
      const sorted = [...state.matches].sort((x, y) => y.date - x.date)

      let streak = 0
      let streakOwner: 'a' | 'b' | null = null
      if (sorted.length) {
        streakOwner = sorted[0].winner
        for (const m of sorted) {
          if (m.winner === streakOwner) streak++
          else break
        }
      }

      return { aWins, bWins, total: state.matches.length, streakOwner, streak }
    }
  },

  actions: {
    async load() {
      this.matches = await db.matches.orderBy('date').reverse().toArray()
      this.loaded = true
    },
    async add(match: Omit<Match, 'id' | 'createdAt'>) {
      const clean = JSON.parse(JSON.stringify(match)) as Omit<Match, 'id' | 'createdAt'>
      const nowTs = Date.now()
      const id = await db.matches.add({ ...clean, createdAt: nowTs })
      this.matches.unshift({ ...clean, id, createdAt: nowTs })
    },
    async remove(id: number) {
      await db.matches.delete(id)
      this.matches = this.matches.filter((m) => m.id !== id)
    },
    setNames(a: string, b: string) {
      this.playerA = a.trim() || 'Kamu'
      this.playerB = b.trim() || 'Pasangan'
      localStorage.setItem(A_KEY, this.playerA)
      localStorage.setItem(B_KEY, this.playerB)
    }
  }
})
