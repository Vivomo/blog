import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import type { DrinkConfig, GlassConfig } from '../types'
import { SERVINGS_BY_SIZE } from '../types'
import { createGlassMesh, disposeMesh } from './GlassMesh'
import { LiquidMesh } from './LiquidMesh'
import { Bubbles } from './Bubbles'
import { IceSystem } from './IceSystem'
import { Pourer } from './Pourer'
import { StirRod } from './StirRod'
import { mixLayers, type LiquidLayer } from './mixing'
import { setupEnvironment } from './environment'

/** 加满时距杯口保留的空间(占碗腔高度比例) */
const HEADSPACE_RATIO = 0.12

/**
 * 三维场景编排:持有渲染器与当前杯子的全部子系统。
 * React 侧只通过公开方法交互(选杯 / 加冰 / 倒酒 / 搅拌 / 重置)。
 */
export class SimulatorApp {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera: THREE.PerspectiveCamera
  private controls: OrbitControls
  private clock = new THREE.Clock()
  private raf = 0

  private glassConfig: GlassConfig | null = null
  private glassMesh: THREE.Mesh | null = null
  private liquid: LiquidMesh | null = null
  private bubbles: Bubbles | null = null
  private ice: IceSystem | null = null
  private pourer: Pourer | null = null
  private stirRod: StirRod | null = null

  private layers: LiquidLayer[] = []
  private servingsUsed = 0

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.05
    this.renderer.outputColorSpace = THREE.SRGBColorSpace

    this.scene.background = null

    this.camera = new THREE.PerspectiveCamera(38, 1, 0.1, 500)
    this.camera.position.set(0, 14, 34)

    this.controls = new OrbitControls(this.camera, canvas)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.08
    this.controls.minDistance = 14
    this.controls.maxDistance = 70
    this.controls.maxPolarAngle = Math.PI * 0.55
    this.controls.target.set(0, 6, 0)
    this.controls.enablePan = false

    // 灯光
    const key = new THREE.DirectionalLight(0xffffff, 1.6)
    key.position.set(10, 24, 14)
    const rim = new THREE.DirectionalLight(0xbcd8ff, 0.7)
    rim.position.set(-14, 10, -10)
    const amb = new THREE.AmbientLight(0xffffff, 0.35)
    this.scene.add(key, rim, amb)

    // 桌面
    const table = new THREE.Mesh(
      new THREE.CylinderGeometry(26, 26, 1.2, 64),
      new THREE.MeshStandardMaterial({ color: 0x2b2320, roughness: 0.55, metalness: 0.1 }),
    )
    table.position.y = -0.6
    this.scene.add(table)

    // 环境贴图(占位:public/env/environment.hdr 存在时自动使用)
    void setupEnvironment(this.renderer, this.scene)

    this.resize()
    this.loop()
  }

  // ———————————————————— 场景循环 ————————————————————

  private loop = (): void => {
    this.raf = requestAnimationFrame(this.loop)
    const dt = Math.min(this.clock.getDelta(), 0.05)
    const t = this.clock.elapsedTime

    this.controls.update()
    this.ice?.update(dt)
    this.liquid?.update(t)
    this.bubbles?.update(t, dt)
    this.stirRod?.update(dt)
    if (this.pourer?.isPouring) this.pourer.update(this.liquid?.level ?? 0)

    this.renderer.render(this.scene, this.camera)
  }

  resize(): void {
    const canvas = this.renderer.domElement
    const w = canvas.clientWidth || 1
    const h = canvas.clientHeight || 1
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  // ———————————————————— 状态查询 ————————————————————

  get maxServings(): number {
    return this.glassConfig ? SERVINGS_BY_SIZE[this.glassConfig.size] : 0
  }

  get usedServings(): number {
    return this.servingsUsed
  }

  get iceCount(): number {
    return this.ice?.count ?? 0
  }

  get maxIce(): number {
    return this.glassConfig?.maxIce ?? 0
  }

  get busy(): boolean {
    return (this.pourer?.isPouring ?? false) || (this.stirRod?.isStirring ?? false)
  }

  /** 当前杯中液体是否至少有两层(可搅拌) */
  get canStir(): boolean {
    return this.layers.length >= 2
  }

  // ———————————————————— 交互 API ————————————————————

  /** 选择杯子:清空旧场景并重建全部子系统 */
  setGlass(config: GlassConfig): void {
    this.clearGlass()
    this.glassConfig = config

    this.glassMesh = createGlassMesh(config)
    this.liquid = new LiquidMesh(config)
    this.bubbles = new Bubbles(config)
    this.ice = new IceSystem(config)
    this.pourer = new Pourer(config)
    this.stirRod = new StirRod(config)

    this.scene.add(
      this.glassMesh,
      this.liquid.mesh,
      this.bubbles.group,
      this.ice.group,
      this.pourer.group,
      this.pourer.streamMesh,
      this.stirRod.group,
    )

    // 相机对准杯子中部
    const focusY = config.height * 0.45
    this.controls.target.set(0, focusY, 0)
    this.camera.position.set(0, focusY + 8, config.height * 2.4 + 12)
  }

  private clearGlass(): void {
    if (this.glassMesh) {
      this.scene.remove(this.glassMesh)
      disposeMesh(this.glassMesh)
    }
    if (this.liquid) {
      this.scene.remove(this.liquid.mesh)
      this.liquid.dispose()
    }
    if (this.bubbles) {
      this.scene.remove(this.bubbles.group)
      this.bubbles.dispose()
    }
    if (this.ice) {
      this.scene.remove(this.ice.group)
      this.ice.dispose()
    }
    if (this.pourer) {
      this.scene.remove(this.pourer.group, this.pourer.streamMesh)
      this.pourer.dispose()
    }
    if (this.stirRod) {
      this.scene.remove(this.stirRod.group)
      this.stirRod.dispose()
    }
    this.glassMesh = null
    this.liquid = null
    this.bubbles = null
    this.ice = null
    this.pourer = null
    this.stirRod = null
    this.layers = []
    this.servingsUsed = 0
  }

  /** 投入一块冰 */
  dropIce(): void {
    if (!this.ice || !this.glassConfig) return
    if (this.ice.count >= this.glassConfig.maxIce) return
    this.ice.drop()
  }

  /** 倒入一份饮品(带动画),完成后 resolve */
  async pourDrink(drink: DrinkConfig): Promise<void> {
    if (!this.glassConfig || !this.liquid || !this.pourer) return
    if (this.busy || this.servingsUsed >= this.maxServings) return

    const { bottomY, rimY } = this.glassConfig.bowl
    const usable = (rimY - bottomY) * (1 - HEADSPACE_RATIO)
    const servingH = usable / this.maxServings
    const fromY = this.liquid.level <= bottomY ? bottomY : this.liquid.level
    const toY = bottomY + servingH * (this.servingsUsed + 1)

    // 新的一层(顶面高度随倒入动画增长)
    const layer: LiquidLayer = { drink, topY: fromY }
    this.layers.push(layer)
    this.servingsUsed += 1
    this.refreshMixTarget()

    const duration = 1.6 + 0.5 * (toY - fromY)
    await this.pourer.pour(drink, duration, (t) => {
      const y = fromY + (toY - fromY) * t
      layer.topY = y
      this.liquid!.setSurfaceY(y)
      this.liquid!.setLayers(this.layers)
      this.ice?.setSurfaceY(y)
      this.bubbles?.setSurfaceY(y)
    })

    layer.topY = toY
    this.liquid.setSurfaceY(toY)
    this.liquid.setLayers(this.layers)
    this.refreshFizz()
  }

  /** 搅拌:层界波动 → 颜色融合为混合色 */
  async stir(): Promise<void> {
    if (!this.glassConfig || !this.liquid || !this.stirRod) return
    if (this.busy || this.layers.length === 0) return

    this.refreshMixTarget()
    const liquid = this.liquid

    await this.stirRod.stir(3.2, (t) => {
      // 漩涡强度呈钟形:先增强再平息
      liquid.swirl = Math.sin(Math.min(t * 1.15, 1) * Math.PI) * 1.0
      liquid.mixT = t
      // 周期性推动冰块旋转
      if (Math.random() < 0.12) this.ice?.agitate(18)
    })

    liquid.swirl = 0
    liquid.mixT = 0

    // 混合完成:所有层合并为一层均匀液体
    const mixed = mixLayers(this.layers, this.glassConfig.bowl.bottomY)
    const surface = liquid.level
    this.layers = [
      {
        drink: {
          id: 'mixed',
          name: '混合液',
          description: '',
          color: `#${mixed.color.getHexString()}`,
          opacity: mixed.opacity,
          fizz: mixed.fizz,
        },
        topY: surface,
      },
    ]
    liquid.setLayers(this.layers)
    this.refreshFizz()
  }

  /** 重新开始(保留当前杯子) */
  reset(): void {
    if (this.glassConfig) this.setGlass(this.glassConfig)
  }

  private refreshMixTarget(): void {
    if (!this.glassConfig || !this.liquid) return
    const mixed = mixLayers(this.layers, this.glassConfig.bowl.bottomY)
    this.liquid.setMixTarget(mixed.color, mixed.opacity)
  }

  private refreshFizz(): void {
    if (!this.glassConfig || !this.bubbles) return
    const mixed = mixLayers(this.layers, this.glassConfig.bowl.bottomY)
    this.bubbles.setIntensity(mixed.fizz)
  }

  dispose(): void {
    cancelAnimationFrame(this.raf)
    this.clearGlass()
    this.controls.dispose()
    this.renderer.dispose()
  }
}
