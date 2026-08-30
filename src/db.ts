import Dexie, { type Table } from 'dexie'
import type { Match } from './types'

export class CoupleDB extends Dexie {
  matches!: Table<Match, number>

  constructor() {
    super('rally')
    this.version(1).stores({
      matches: '++id, date'
    })
  }
}

export const db = new CoupleDB()
