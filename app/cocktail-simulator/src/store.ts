import { create } from 'zustand'
import type { Step } from './types'

interface SimState {
  step: Step
  glassId: string | null
  iceCount: number
  servingsUsed: number
  maxServings: number
  busy: boolean
  /** 杯中是否有 >=2 层液体(可搅拌) */
  canStir: boolean

  selectGlass(id: string, maxServings: number): void
  setIceCount(n: number): void
  goToDrinks(): void
  setPourState(servingsUsed: number, canStir: boolean): void
  setBusy(busy: boolean): void
  reset(): void
  backToGlass(): void
}

export const useSimStore = create<SimState>((set) => ({
  step: 'glass',
  glassId: null,
  iceCount: 0,
  servingsUsed: 0,
  maxServings: 0,
  busy: false,
  canStir: false,

  selectGlass: (id, maxServings) =>
    set({ glassId: id, maxServings, step: 'ice', iceCount: 0, servingsUsed: 0, canStir: false }),
  setIceCount: (n) => set({ iceCount: n }),
  goToDrinks: () => set({ step: 'drink' }),
  setPourState: (servingsUsed, canStir) => set({ servingsUsed, canStir }),
  setBusy: (busy) => set({ busy }),
  reset: () => set({ step: 'ice', iceCount: 0, servingsUsed: 0, busy: false, canStir: false }),
  backToGlass: () =>
    set({ step: 'glass', glassId: null, iceCount: 0, servingsUsed: 0, busy: false, canStir: false }),
}))
