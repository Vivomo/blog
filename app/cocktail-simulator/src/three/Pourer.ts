import * as THREE from 'three'
import gsap from 'gsap'
import type { DrinkConfig, GlassConfig } from '../types'
import { soundManager } from '../audio/SoundManager'

/**
 * 倒酒器:一个简化酒瓶在杯口上方倾斜,倒出与饮品同色的液柱。
 */
export class Pourer {
  readonly group = new THREE.Group()
  private bottle: THREE.Group
  private liquidInBottle: THREE.Mesh
  private stream: THREE.Mesh
  private streamMaterial: THREE.MeshPhysicalMaterial
  private config: GlassConfig
  private pouring = false

  constructor(config: GlassConfig) {
    this.config = config
    this.group.name = 'pourer'
    this.group.visible = false

    // —— 酒瓶(车削轮廓) ——
    const profile = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(2.1, 0),
      new THREE.Vector2(2.3, 0.4),
      new THREE.Vector2(2.3, 7.2),
      new THREE.Vector2(1.9, 8.6),
      new THREE.Vector2(0.75, 10.0),
      new THREE.Vector2(0.68, 12.4),
      new THREE.Vector2(0.78, 12.6),
      new THREE.Vector2(0.62, 12.7),
      new THREE.Vector2(0, 12.7),
    ]
    const bottleGlass = new THREE.Mesh(
      new THREE.LatheGeometry(profile, 48),
      new THREE.MeshPhysicalMaterial({
        color: 0xdfe8ea,
        metalness: 0,
        roughness: 0.08,
        transmission: 0.95,
        thickness: 0.4,
        ior: 1.5,
        side: THREE.DoubleSide,
      }),
    )

    // 瓶内液体(颜色随饮品变化)
    this.liquidInBottle = new THREE.Mesh(
      new THREE.CylinderGeometry(1.95, 2.05, 5.4, 32),
      new THREE.MeshPhysicalMaterial({ transparent: true, roughness: 0.3 }),
    )
    this.liquidInBottle.position.y = 3.2

    this.bottle = new THREE.Group()
    this.bottle.add(bottleGlass, this.liquidInBottle)
    // 以瓶口为旋转基点,方便倾斜倒酒
    this.bottle.position.y = -12.7
    const pivot = new THREE.Group()
    pivot.add(this.bottle)
    this.group.add(pivot)

    // —— 液柱 ——
    this.streamMaterial = new THREE.MeshPhysicalMaterial({
      transparent: true,
      roughness: 0.1,
      transmission: 0.35,
      depthWrite: false,
    })
    this.stream = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.2, 1, 16, 1, true), this.streamMaterial)
    this.stream.visible = false
    this.stream.renderOrder = 3
  }

  /** 液柱要加到场景根部(世界坐标) */
  get streamMesh(): THREE.Mesh {
    return this.stream
  }

  get isPouring(): boolean {
    return this.pouring
  }

  /**
   * 播放倒酒动画。
   * @param drink 饮品
   * @param durationSec 倒酒时长
   * @param onProgress 回调 0~1,用于同步升高液面
   */
  pour(drink: DrinkConfig, durationSec: number, onProgress: (t: number) => void): Promise<void> {
    const rimY = this.config.bowl.rimY
    const rimR = this.config.innerRadiusAt(rimY)

    // 起始位置:杯子外侧斜上方(瓶身竖直向下垂 12.7,必须完全避开杯子)
    const restX = rimR + 8
    const restY = rimY + 15
    // 倒酒位置:瓶口在杯口内侧上方(此时瓶身已倾斜,朝外上方翘起,不会碰杯)
    const pourX = rimR * 0.4
    const pourY = rimY + 3.6

    this.group.position.set(restX, restY, 0)
    this.group.visible = true
    this.pouring = true

    const liqMat = this.liquidInBottle.material as THREE.MeshPhysicalMaterial
    liqMat.color.set(drink.color)
    liqMat.opacity = Math.max(drink.opacity, 0.5)
    this.streamMaterial.color.set(drink.color)
    this.streamMaterial.opacity = Math.min(drink.opacity + 0.25, 0.95)

    const pivot = this.bottle.parent as THREE.Group
    pivot.rotation.z = 0
    this.group.rotation.z = 0

    return new Promise((resolve) => {
      const tl = gsap.timeline({
        onComplete: () => {
          this.group.visible = false
          this.stream.visible = false
          this.pouring = false
          resolve()
        },
      })
      // 进场:边向杯口移动边倾斜瓶身 —— 瓶身到达杯口上方时已经翘起,避免与杯子相交
      tl.to(this.group.position, { x: pourX, y: pourY, duration: 0.8, ease: 'power2.inOut' })
      tl.to(pivot.rotation, { z: Math.PI * 0.62, duration: 0.8, ease: 'power2.inOut' }, '<')
      tl.add(() => {
        this.stream.visible = true
        soundManager.startLoop('pour')
      })
      // 倒酒进行中(液面上升由 onProgress 驱动)
      const state = { t: 0 }
      tl.to(state, {
        t: 1,
        duration: durationSec,
        ease: 'none',
        onUpdate: () => onProgress(state.t),
      })
      // 收瓶:同样边撤离边回正,离开杯口后瓶身才转回竖直
      tl.add(() => {
        this.stream.visible = false
        soundManager.stopLoop('pour')
      })
      tl.to(this.group.position, { x: restX, y: restY, duration: 0.75, ease: 'power2.inOut' })
      tl.to(pivot.rotation, { z: 0, duration: 0.75, ease: 'power2.inOut' }, '<')
    })
  }

  /** 每帧更新液柱几何:从瓶口连到当前液面 */
  update(surfaceY: number): void {
    if (!this.stream.visible) return
    // 瓶口世界坐标
    const tip = new THREE.Vector3(0, 0, 0)
    this.bottle.localToWorld(tip.set(0, 12.7, 0))

    const targetY = Math.max(surfaceY, this.config.bowl.bottomY + 0.05)
    const len = Math.max(tip.y - targetY, 0.1)
    this.stream.scale.set(1, len, 1)
    // 液柱落点略向杯心偏移
    this.stream.position.set(tip.x * 0.75, targetY + len / 2, tip.z * 0.75)
  }

  dispose(): void {
    this.group.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose()
        ;(o.material as THREE.Material).dispose()
      }
    })
    this.stream.geometry.dispose()
    this.streamMaterial.dispose()
  }
}
