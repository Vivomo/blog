/**
 * 音效管理。
 *
 * 优先加载 /public/sounds/ 下的素材文件(后续你放入同名文件即可自动替换):
 *   - /sounds/ice-clink.mp3   冰块撞击玻璃
 *   - /sounds/ice-knock.mp3   冰块互相碰撞
 *   - /sounds/pour.mp3        倒酒(循环)
 *   - /sounds/stir.mp3        搅拌(循环)
 *
 * 找不到文件时,回退到 WebAudio 实时合成的音效。
 */

type SampleName = 'ice-clink' | 'ice-knock' | 'pour' | 'stir'

const SAMPLE_URLS: Record<SampleName, string> = {
  'ice-clink': '/sounds/ice-clink.mp3',
  'ice-knock': '/sounds/ice-knock.mp3',
  pour: '/sounds/pour.mp3',
  stir: '/sounds/stir.mp3',
}

export class SoundManager {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private buffers = new Map<SampleName, AudioBuffer>()
  private loadTried = new Set<SampleName>()
  private loops = new Map<SampleName, { src: AudioBufferSourceNode | null; gain: GainNode; stop: () => void }>()
  private lastClinkAt = 0

  /** 必须在用户手势后调用(浏览器自动播放策略) */
  resume(): void {
    if (!this.ctx) {
      this.ctx = new AudioContext()
      this.master = this.ctx.createGain()
      this.master.gain.value = 0.8
      this.master.connect(this.ctx.destination)
      for (const name of Object.keys(SAMPLE_URLS) as SampleName[]) void this.tryLoad(name)
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume()
  }

  private async tryLoad(name: SampleName): Promise<void> {
    if (!this.ctx || this.loadTried.has(name)) return
    this.loadTried.add(name)
    try {
      const res = await fetch(SAMPLE_URLS[name])
      if (!res.ok) return
      const type = res.headers.get('content-type') ?? ''
      // 开发服务器对缺失文件常回退返回 index.html,需排除
      if (type.includes('text/html')) return
      const buf = await this.ctx.decodeAudioData(await res.arrayBuffer())
      this.buffers.set(name, buf)
    } catch {
      /* 无素材时使用合成音效 */
    }
  }

  /** 冰块撞击(玻璃或冰块),strength 0~1 */
  playImpact(kind: 'glass' | 'ice', strength: number): void {
    if (!this.ctx || !this.master) return
    const now = this.ctx.currentTime
    // 限流,避免物理引擎连续碰撞导致爆音
    if (now - this.lastClinkAt < 0.05) return
    this.lastClinkAt = now

    const s = Math.min(Math.max(strength, 0.08), 1)
    const sample = this.buffers.get(kind === 'glass' ? 'ice-clink' : 'ice-knock')
    if (sample) {
      const src = this.ctx.createBufferSource()
      src.buffer = sample
      src.playbackRate.value = 0.92 + Math.random() * 0.16
      const g = this.ctx.createGain()
      g.gain.value = s
      src.connect(g).connect(this.master)
      src.start()
      return
    }
    this.synthClink(kind, s)
  }

  /** 合成"叮"的一声:高频正弦 ping + 短噪声脆响 */
  private synthClink(kind: 'glass' | 'ice', s: number): void {
    if (!this.ctx || !this.master) return
    const ctx = this.ctx
    const t = ctx.currentTime

    const baseFreq = kind === 'glass' ? 2100 + Math.random() * 700 : 900 + Math.random() * 350
    const decay = kind === 'glass' ? 0.28 : 0.12

    for (const [mult, amp] of [
      [1, 1],
      [2.32, 0.45],
      [3.76, 0.2],
    ] as const) {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = baseFreq * mult
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.16 * s * amp, t)
      g.gain.exponentialRampToValueAtTime(0.0001, t + decay * (1 + Math.random() * 0.3))
      osc.connect(g).connect(this.master)
      osc.start(t)
      osc.stop(t + decay + 0.1)
    }

    // 撞击瞬间的宽频脆响
    const noiseDur = 0.04
    const noise = ctx.createBufferSource()
    const nb = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * noiseDur), ctx.sampleRate)
    const data = nb.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
    noise.buffer = nb
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = kind === 'glass' ? 4200 : 2200
    bp.Q.value = 1.2
    const ng = ctx.createGain()
    ng.gain.value = 0.3 * s
    noise.connect(bp).connect(ng).connect(this.master)
    noise.start(t)
  }

  /** 开始循环音效(倒酒/搅拌),返回停止函数 */
  startLoop(name: 'pour' | 'stir'): () => void {
    if (!this.ctx || !this.master) return () => {}
    this.stopLoop(name)
    const ctx = this.ctx
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(name === 'pour' ? 0.5 : 0.25, ctx.currentTime + 0.25)
    gain.connect(this.master)

    const sample = this.buffers.get(name)
    let src: AudioBufferSourceNode
    if (sample) {
      src = ctx.createBufferSource()
      src.buffer = sample
      src.loop = true
      src.connect(gain)
    } else {
      // 合成:循环白噪声 + 滤波,近似液体流动声
      const dur = 2
      const nb = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate)
      const data = nb.getChannelData(0)
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
      src = ctx.createBufferSource()
      src.buffer = nb
      src.loop = true
      const lp = ctx.createBiquadFilter()
      lp.type = name === 'pour' ? 'bandpass' : 'lowpass'
      lp.frequency.value = name === 'pour' ? 1200 : 500
      lp.Q.value = name === 'pour' ? 0.6 : 0.9
      // 倒酒声做点频率起伏,更像"咕咚咕咚"
      const lfo = ctx.createOscillator()
      lfo.frequency.value = name === 'pour' ? 5.5 : 2.2
      const lfoGain = ctx.createGain()
      lfoGain.gain.value = name === 'pour' ? 500 : 120
      lfo.connect(lfoGain).connect(lp.frequency)
      lfo.start()
      src.connect(lp).connect(gain)
    }
    src.start()

    const stop = () => {
      const t = ctx.currentTime
      gain.gain.cancelScheduledValues(t)
      gain.gain.setValueAtTime(gain.gain.value, t)
      gain.gain.linearRampToValueAtTime(0.0001, t + 0.3)
      setTimeout(() => {
        try {
          src.stop()
        } catch {
          /* 已停止 */
        }
        gain.disconnect()
      }, 400)
      this.loops.delete(name)
    }
    this.loops.set(name, { src, gain, stop })
    return stop
  }

  stopLoop(name: 'pour' | 'stir'): void {
    this.loops.get(name)?.stop()
  }

  dispose(): void {
    for (const l of this.loops.values()) l.stop()
    void this.ctx?.close()
    this.ctx = null
  }
}

export const soundManager = new SoundManager()
