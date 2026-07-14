import { useEffect, useRef } from 'react'
import { SimulatorApp } from './three/SimulatorApp'
import { GLASSES, getGlass } from './config/glasses'
import { DRINKS } from './config/drinks'
import type { DrinkConfig } from './types'
import { useSimStore } from './store'
import { soundManager } from './audio/SoundManager'
import './App.css'

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const simRef = useRef<SimulatorApp | null>(null)

  const step = useSimStore((s) => s.step)
  const glassId = useSimStore((s) => s.glassId)
  const iceCount = useSimStore((s) => s.iceCount)
  const servingsUsed = useSimStore((s) => s.servingsUsed)
  const maxServings = useSimStore((s) => s.maxServings)
  const busy = useSimStore((s) => s.busy)
  const canStir = useSimStore((s) => s.canStir)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const sim = new SimulatorApp(canvas)
    simRef.current = sim
    const onResize = () => sim.resize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      sim.dispose()
      simRef.current = null
    }
  }, [])

  const selectGlass = (id: string) => {
    soundManager.resume()
    const sim = simRef.current
    if (!sim) return
    sim.setGlass(getGlass(id))
    useSimStore.getState().selectGlass(id, sim.maxServings)
  }

  const dropIce = () => {
    soundManager.resume()
    const sim = simRef.current
    if (!sim) return
    sim.dropIce()
    useSimStore.getState().setIceCount(sim.iceCount)
  }

  const pour = async (drink: DrinkConfig) => {
    soundManager.resume()
    const sim = simRef.current
    if (!sim || sim.busy) return
    useSimStore.getState().setBusy(true)
    await sim.pourDrink(drink)
    useSimStore.getState().setPourState(sim.usedServings, sim.canStir)
    useSimStore.getState().setBusy(false)
  }

  const stir = async () => {
    soundManager.resume()
    const sim = simRef.current
    if (!sim || sim.busy) return
    useSimStore.getState().setBusy(true)
    await sim.stir()
    useSimStore.getState().setPourState(sim.usedServings, sim.canStir)
    useSimStore.getState().setBusy(false)
  }

  const reset = () => {
    const sim = simRef.current
    if (!sim || sim.busy) return
    sim.reset()
    useSimStore.getState().reset()
  }

  const backToGlass = () => {
    if (simRef.current?.busy) return
    useSimStore.getState().backToGlass()
  }

  const glass = glassId ? getGlass(glassId) : null
  const full = servingsUsed >= maxServings

  return (
    <div className="app">
      <canvas ref={canvasRef} className="stage" />

      <header className="header">
        <h1>调酒模拟器</h1>
        <div className="steps">
          <span className={step === 'glass' ? 'on' : 'done'}>1 选杯</span>
          <span className={step === 'ice' ? 'on' : step === 'drink' ? 'done' : ''}>2 加冰</span>
          <span className={step === 'drink' ? 'on' : ''}>3 调制</span>
        </div>
      </header>

      <aside className="panel">
        {step === 'glass' && (
          <section>
            <h2>选择一只杯子</h2>
            <div className="cards">
              {GLASSES.map((g) => (
                <button key={g.id} className="card" onClick={() => selectGlass(g.id)}>
                  <strong>{g.name}</strong>
                  <small>{g.description}</small>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 'ice' && glass && (
          <section>
            <h2>要加冰块吗?</h2>
            <p className="hint">
              已加 {iceCount} / {glass.maxIce} 块
            </p>
            <div className="actions">
              <button
                className="primary"
                onClick={dropIce}
                disabled={iceCount >= glass.maxIce}
              >
                {iceCount === 0 ? '加一块冰' : '再加一块'}
              </button>
              <button onClick={() => useSimStore.getState().goToDrinks()}>
                {iceCount === 0 ? '不加冰,下一步' : '够了,下一步'}
              </button>
            </div>
            <button className="link" onClick={backToGlass}>
              ← 重新选杯
            </button>
          </section>
        )}

        {step === 'drink' && glass && (
          <section>
            <h2>添加饮品</h2>
            <p className="hint">
              {full ? '已加满(留有杯口空间)' : `已倒 ${servingsUsed} / ${maxServings} 份`}
            </p>
            <div className="drinks">
              {DRINKS.map((d) => (
                <button
                  key={d.id}
                  className="drink"
                  onClick={() => void pour(d)}
                  disabled={busy || full}
                  title={d.description}
                >
                  <i style={{ background: d.color, opacity: 0.35 + d.opacity * 0.65 }} />
                  <span>{d.name}</span>
                </button>
              ))}
            </div>
            <div className="actions">
              <button className="primary" onClick={() => void stir()} disabled={busy || !canStir}>
                搅拌
              </button>
              <button onClick={reset} disabled={busy}>
                倒掉重来
              </button>
            </div>
            <button className="link" onClick={backToGlass}>
              ← 重新选杯
            </button>
          </section>
        )}
      </aside>

      <footer className="footer">拖动旋转视角 · 滚轮缩放</footer>
    </div>
  )
}
