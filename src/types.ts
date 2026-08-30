export interface MatchSet {
  a: number
  b: number
}

export interface Match {
  id?: number
  date: number // epoch ms
  location?: string
  durationMin?: number
  sets: MatchSet[]
  winner: 'a' | 'b'
  createdAt: number
}

export interface Stats {
  aWins: number
  bWins: number
  total: number
  streakOwner: 'a' | 'b' | null
  streak: number
}
