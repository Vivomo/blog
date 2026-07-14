import * as THREE from 'three'
import type { GlassConfig } from '../types'

const RISING_COUNT = 160
const CLING_COUNT = 90

const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  varying float vAlpha;
  void main() {
    vAlpha = aAlpha;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (140.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`

const fragmentShader = /* glsl */ `
  varying float vAlpha;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    // 圆形亮环 + 高光点,模拟小气泡
    float ring = smoothstep(0.5, 0.32, d) - smoothstep(0.3, 0.05, d) * 0.6;
    float spec = smoothstep(0.14, 0.0, length(uv - vec2(-0.12, 0.12)));
    float a = clamp(ring * 0.75 + spec * 0.9, 0.0, 1.0) * vAlpha;
    gl_FragColor = vec4(vec3(1.0), a);
  }
`

interface RisingBubble {
  r: number
  angle: number
  y: number
  speed: number
  wobblePhase: number
  size: number
}

/**
 * 气泡系统:
 *  - rising:液体内部持续上升的小气泡(到液面后重生于底部)
 *  - cling:吸附在杯子内壁上的小气泡(缓慢闪烁,偶尔脱离上升)
 */
export class Bubbles {
  readonly group = new THREE.Group()
  private rising: THREE.Points
  private cling: THREE.Points
  private risingData: RisingBubble[] = []
  private config: GlassConfig
  private surfaceY: number
  private intensity = 0

  constructor(config: GlassConfig) {
    this.config = config
    this.surfaceY = config.bowl.bottomY
    this.group.name = 'bubbles'
    this.group.renderOrder = 2

    this.rising = this.makePoints(RISING_COUNT)
    this.cling = this.makePoints(CLING_COUNT)
    this.group.add(this.rising, this.cling)

    for (let i = 0; i < RISING_COUNT; i++) {
      this.risingData.push(this.spawnRising(true))
    }
    this.seedCling()
  }

  private makePoints(count: number): THREE.Points {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(count), 1))
    geo.setAttribute('aAlpha', new THREE.BufferAttribute(new Float32Array(count), 1))
    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
    })
    const pts = new THREE.Points(geo, mat)
    pts.frustumCulled = false
    return pts
  }

  private spawnRising(randomY: boolean): RisingBubble {
    const bottom = this.config.bowl.bottomY
    const y = randomY
      ? bottom + Math.random() * Math.max(this.surfaceY - bottom, 0.1)
      : bottom + 0.1 + Math.random() * 0.35
    const maxR = Math.max(this.config.innerRadiusAt(y) - 0.35, 0.05)
    return {
      r: Math.sqrt(Math.random()) * maxR,
      angle: Math.random() * Math.PI * 2,
      y,
      speed: 0.9 + Math.random() * 1.8,
      wobblePhase: Math.random() * Math.PI * 2,
      size: 0.5 + Math.random() * 1.1,
    }
  }

  /** 杯壁挂泡:随机分布在内壁上 */
  private seedCling(): void {
    const pos = this.cling.geometry.attributes.position as THREE.BufferAttribute
    const size = this.cling.geometry.attributes.aSize as THREE.BufferAttribute
    const bottom = this.config.bowl.bottomY
    const rim = this.config.bowl.rimY
    for (let i = 0; i < CLING_COUNT; i++) {
      const y = bottom + Math.random() * (rim - bottom) * 0.92
      const angle = Math.random() * Math.PI * 2
      const r = this.config.innerRadiusAt(y) - 0.12
      pos.setXYZ(i, Math.cos(angle) * r, y, Math.sin(angle) * r)
      size.setX(i, 0.35 + Math.random() * 0.75)
    }
    pos.needsUpdate = true
    size.needsUpdate = true
  }

  setSurfaceY(y: number): void {
    this.surfaceY = y
  }

  /** intensity 0~1,由饮品 fizz 决定 */
  setIntensity(v: number): void {
    this.intensity = THREE.MathUtils.clamp(v, 0, 1)
  }

  update(time: number, dt: number): void {
    const bottom = this.config.bowl.bottomY
    const hasLiquid = this.surfaceY > bottom + 0.15
    this.group.visible = hasLiquid && this.intensity > 0.01

    if (!this.group.visible) return

    // —— 上升气泡 ——
    const pos = this.rising.geometry.attributes.position as THREE.BufferAttribute
    const sizeAttr = this.rising.geometry.attributes.aSize as THREE.BufferAttribute
    const alpha = this.rising.geometry.attributes.aAlpha as THREE.BufferAttribute
    const activeCount = Math.floor(RISING_COUNT * this.intensity)

    for (let i = 0; i < RISING_COUNT; i++) {
      const b = this.risingData[i]
      if (i >= activeCount) {
        alpha.setX(i, 0)
        continue
      }
      b.y += b.speed * dt
      if (b.y >= this.surfaceY - 0.08) {
        this.risingData[i] = this.spawnRising(false)
        continue
      }
      // 上升时略微螺旋摆动
      const wob = Math.sin(time * 3 + b.wobblePhase) * 0.08
      const maxR = Math.max(this.config.innerRadiusAt(b.y) - 0.3, 0.03)
      const r = Math.min(b.r + wob, maxR)
      pos.setXYZ(i, Math.cos(b.angle) * r, b.y, Math.sin(b.angle) * r)
      sizeAttr.setX(i, b.size)
      // 靠近液面渐隐
      const fade = THREE.MathUtils.clamp((this.surfaceY - b.y) / 0.6, 0.25, 1)
      alpha.setX(i, 0.85 * fade)
    }
    pos.needsUpdate = true
    sizeAttr.needsUpdate = true
    alpha.needsUpdate = true

    // —— 杯壁挂泡:只显示液面以下的,缓慢闪烁 ——
    const cPos = this.cling.geometry.attributes.position as THREE.BufferAttribute
    const cAlpha = this.cling.geometry.attributes.aAlpha as THREE.BufferAttribute
    const clingActive = Math.floor(CLING_COUNT * Math.min(this.intensity * 1.4, 1))
    for (let i = 0; i < CLING_COUNT; i++) {
      const y = cPos.getY(i)
      if (i >= clingActive || y > this.surfaceY - 0.1) {
        cAlpha.setX(i, 0)
        continue
      }
      const tw = 0.55 + 0.3 * Math.sin(time * 0.8 + i * 2.31)
      cAlpha.setX(i, tw)
    }
    cAlpha.needsUpdate = true
  }

  dispose(): void {
    for (const p of [this.rising, this.cling]) {
      p.geometry.dispose()
      ;(p.material as THREE.Material).dispose()
    }
  }
}
