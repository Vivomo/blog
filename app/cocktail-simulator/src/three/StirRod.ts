import * as THREE from 'three'
import gsap from 'gsap'
import type { GlassConfig } from '../types'
import { soundManager } from '../audio/SoundManager'

/**
 * 搅拌棒:一根带球头的玻璃棒,插入杯中画圈搅拌。
 */
export class StirRod {
  readonly group = new THREE.Group()
  private config: GlassConfig
  private angle = 0
  private speed = 0
  private radius = 0
  private stirring = false

  constructor(config: GlassConfig) {
    this.config = config
    this.group.name = 'stir-rod'
    this.group.visible = false

    const mat = new THREE.MeshPhysicalMaterial({
      color: 0xd8f0f2,
      metalness: 0,
      roughness: 0.1,
      transmission: 0.9,
      thickness: 0.4,
      ior: 1.5,
    })
    const rodLen = config.height + 6
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, rodLen, 16), mat)
    rod.position.y = rodLen / 2
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.55, 24, 16), mat)
    knob.position.y = 0.3
    this.group.add(rod, knob)
  }

  get isStirring(): boolean {
    return this.stirring
  }

  /**
   * 播放搅拌动画。
   * @param durationSec 搅拌时长
   * @param onProgress 0~1,驱动液体混合进度
   */
  stir(durationSec: number, onProgress: (t: number) => void): Promise<void> {
    const bottom = this.config.bowl.bottomY
    const rimY = this.config.bowl.rimY
    this.radius = Math.max(this.config.innerRadiusAt(bottom + (rimY - bottom) * 0.3) * 0.45, 0.4)
    this.angle = 0
    this.speed = 0
    this.stirring = true
    this.group.visible = true
    this.group.position.set(this.radius, rimY + 8, 0)

    return new Promise((resolve) => {
      const tl = gsap.timeline({
        onComplete: () => {
          this.group.visible = false
          this.stirring = false
          resolve()
        },
      })
      // 插入杯中
      tl.to(this.group.position, { y: bottom + 0.8, duration: 0.55, ease: 'power2.inOut' })
      tl.add(() => soundManager.startLoop('stir'))
      // 加速旋转
      tl.to(this, { speed: 7.5, duration: 0.7, ease: 'power1.in' }, '<')
      const state = { t: 0 }
      tl.to(state, {
        t: 1,
        duration: durationSec,
        ease: 'none',
        onUpdate: () => onProgress(state.t),
      })
      // 减速并抽出
      tl.to(this, { speed: 0, duration: 0.6, ease: 'power2.out' })
      tl.add(() => soundManager.stopLoop('stir'))
      tl.to(this.group.position, { y: rimY + 8, duration: 0.5, ease: 'power2.in' }, '<0.2')
    })
  }

  update(dt: number): void {
    if (!this.group.visible) return
    this.angle += this.speed * dt
    this.group.position.x = Math.cos(this.angle) * this.radius
    this.group.position.z = Math.sin(this.angle) * this.radius
    // 棒身随离心方向微微倾斜
    this.group.rotation.z = Math.cos(this.angle) * 0.08 * Math.min(this.speed / 7, 1)
    this.group.rotation.x = -Math.sin(this.angle) * 0.08 * Math.min(this.speed / 7, 1)
  }

  dispose(): void {
    this.group.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose()
        ;(o.material as THREE.Material).dispose()
      }
    })
  }
}
