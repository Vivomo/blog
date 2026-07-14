import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import type { GlassConfig } from '../types'
import { soundManager } from '../audio/SoundManager'

interface IceCube {
  mesh: THREE.Mesh
  body: CANNON.Body
  size: number
}

/** 通透湿润的冰块材质(折射 + 清漆高光,避免雾面塑料感) */
function createIceMaterial(): THREE.MeshPhysicalMaterial {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  // 中性灰底 → 法线默认朝外
  ctx.fillStyle = '#8080ff'
  ctx.fillRect(0, 0, size, size)
  // 稀疏裂纹/晶面微起伏
  for (let i = 0; i < 28; i++) {
    const x0 = Math.random() * size
    const y0 = Math.random() * size
    ctx.strokeStyle = `rgba(${110 + Math.random() * 40},${110 + Math.random() * 40},${200 + Math.random() * 40},${0.35})`
    ctx.lineWidth = 1 + Math.random()
    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.lineTo(x0 + (Math.random() - 0.5) * 50, y0 + (Math.random() - 0.5) * 50)
    ctx.stroke()
  }
  const normalMap = new THREE.CanvasTexture(canvas)
  normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping

  return new THREE.MeshPhysicalMaterial({
    color: 0xf7fcff,
    metalness: 0,
    roughness: 0.06,
    transmission: 0.97,
    thickness: 1.6,
    ior: 1.31,
    reflectivity: 0.9,
    specularIntensity: 1,
    envMapIntensity: 1.45,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    attenuationColor: new THREE.Color(0xeaf6ff),
    attenuationDistance: 18,
    normalMap,
    normalScale: new THREE.Vector2(0.22, 0.22),
    transparent: true,
    opacity: 1,
    depthWrite: true,
  })
}

/**
 * 冰块系统:
 *  - cannon-es 负责重力与冰块间碰撞;
 *  - 杯壁/杯底用"径向约束"实现(杯子是旋转体,按 innerRadiusAt(y) 限制半径),
 *    撞击时依据径向速度触发玻璃碰撞音效;
 *  - 有液体时施加浮力与阻尼,冰块密度小于饮品 → 上浮。
 */
export class IceSystem {
  readonly group = new THREE.Group()
  private world: CANNON.World
  private cubes: IceCube[] = []
  private config: GlassConfig
  private surfaceY: number
  private geometry: THREE.BufferGeometry
  private material: THREE.MeshPhysicalMaterial
  private iceCannonMaterial: CANNON.Material

  constructor(config: GlassConfig) {
    this.config = config
    this.surfaceY = config.bowl.bottomY
    this.group.name = 'ice'

    // 场景单位是厘米,地球重力 g ≈ 980 cm/s²
    this.world = new CANNON.World({ gravity: new CANNON.Vec3(0, -980, 0) })
    this.world.broadphase = new CANNON.SAPBroadphase(this.world)
    this.world.allowSleep = true
    this.iceCannonMaterial = new CANNON.Material('ice')
    this.world.addContactMaterial(
      new CANNON.ContactMaterial(this.iceCannonMaterial, this.iceCannonMaterial, {
        friction: 0.05,
        restitution: 0.35,
      }),
    )

    this.geometry = new RoundedBoxGeometry(1, 1, 1, 4, 0.18)
    this.material = createIceMaterial()
  }

  get count(): number {
    return this.cubes.length
  }

  setSurfaceY(y: number): void {
    if (y > this.surfaceY + 1e-4) {
      // 液面上升要唤醒休眠的冰块,让浮力生效
      for (const c of this.cubes) c.body.wakeUp()
    }
    this.surfaceY = y
  }

  /** 从杯口上方投下一块冰 */
  drop(): void {
    const size = this.config.iceSize
    const rimY = this.config.bowl.rimY
    const rimR = this.config.innerRadiusAt(rimY)

    const mesh = new THREE.Mesh(this.geometry, this.material)
    mesh.scale.setScalar(size)

    const half = size / 2
    const body = new CANNON.Body({
      mass: size * size * size * 0.92, // 冰密度 ~0.92 g/cm³
      shape: new CANNON.Box(new CANNON.Vec3(half, half, half)),
      material: this.iceCannonMaterial,
      linearDamping: 0.02,
      angularDamping: 0.1,
    })
    // 静止后休眠,避免微小抖动和"悠悠漂移"
    body.allowSleep = true
    body.sleepSpeedLimit = 4 // cm/s
    body.sleepTimeLimit = 0.4
    const angle = Math.random() * Math.PI * 2
    const r = Math.random() * Math.max(rimR - size, 0.1) * 0.5
    body.position.set(Math.cos(angle) * r, rimY + 5 + Math.random() * 2, Math.sin(angle) * r)
    body.quaternion.setFromEuler(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI,
    )
    body.angularVelocity.set(
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 4,
    )

    // 冰块互撞音效
    body.addEventListener('collide', (e: { contact: CANNON.ContactEquation }) => {
      const impact = Math.abs(e.contact.getImpactVelocityAlongNormal())
      if (impact > 25) {
        soundManager.playImpact('ice', THREE.MathUtils.clamp(impact / 200, 0, 1))
      }
    })

    this.world.addBody(body)
    this.group.add(mesh)
    this.cubes.push({ mesh, body, size })
  }

  clear(): void {
    for (const c of this.cubes) {
      this.world.removeBody(c.body)
      this.group.remove(c.mesh)
    }
    this.cubes = []
  }

  /** 给所有冰块一个随机切向推力(搅拌时调用) */
  agitate(strength: number): void {
    for (const c of this.cubes) {
      const p = c.body.position
      const r = Math.max(Math.hypot(p.x, p.z), 0.2)
      // 切向 + 少量随机
      const tx = -p.z / r
      const tz = p.x / r
      c.body.applyImpulse(
        new CANNON.Vec3(
          tx * strength * c.body.mass + (Math.random() - 0.5) * strength * 0.4,
          0,
          tz * strength * c.body.mass + (Math.random() - 0.5) * strength * 0.4,
        ),
      )
      c.body.wakeUp()
    }
  }

  update(dt: number): void {
    const bottom = this.config.bowl.bottomY
    const hasLiquid = this.surfaceY > bottom + 0.15

    for (const c of this.cubes) {
      const b = c.body
      const half = c.size / 2
      // 休眠体不做重力积分,浮力也必须跳过,否则速度会在休眠期间悄悄累积
      if (b.sleepState === CANNON.Body.SLEEPING) continue

      if (hasLiquid) {
        // 浸没比例(0 完全在液面上 → 1 完全浸没)
        const depth = THREE.MathUtils.clamp(
          (this.surfaceY - (b.position.y - half)) / c.size,
          0,
          1,
        )
        if (depth > 0) {
          // 饮品密度取 1.04(默认大于冰的 0.92)→ 净浮力向上。
          // 注意:不能用 applyForce —— step 走多个子步时力只作用于第一个子步,
          // 浮力会被稀释导致冰块浮不起来;这里直接按 dt 积分到速度上。
          const buoyAccel = ((1.04 * depth) / 0.92) * 980
          b.velocity.y += buoyAccel * dt
          // 液体阻尼
          b.velocity.scale(1 - Math.min(3.2 * depth * dt, 0.5), b.velocity)
          b.angularVelocity.scale(1 - Math.min(2.5 * depth * dt, 0.5), b.angularVelocity)
        }
      }
    }

    // 真实重力下速度更快,用更小的固定步长保证稳定
    this.world.step(1 / 120, dt, 6)

    // 杯壁 / 杯底约束(旋转体):逐角点检测,避免立方体旋转后角部穿模。
    // 迭代两次,让底部收窄处(高脚杯)也能收敛。
    for (let pass = 0; pass < 2; pass++) {
      for (const c of this.cubes) {
        this.constrainCube(c, dt, pass === 0)
      }
    }

    for (const c of this.cubes) {
      c.mesh.position.copy(c.body.position as unknown as THREE.Vector3)
      c.mesh.quaternion.copy(c.body.quaternion as unknown as THREE.Quaternion)
    }
  }

  /**
   * 26 个表面采样点(8 角 + 12 棱中点 + 6 面心)。
   * 圆角立方体 = 内缩立方体(±h)与半径 cornerR 的球做闵可夫斯基和,
   * 因此这些点配上球半径检测能准确覆盖角、棱、面,
   * 斜壁(高脚杯下部)上面心/棱不会再从角点之间戳出去。
   */
  private static readonly SAMPLE_OFFSETS: readonly (readonly [number, number, number])[] = (() => {
    const pts: [number, number, number][] = []
    for (const x of [-1, 0, 1]) {
      for (const y of [-1, 0, 1]) {
        for (const z of [-1, 0, 1]) {
          if (x !== 0 || y !== 0 || z !== 0) pts.push([x, y, z])
        }
      }
    }
    return pts
  })()

  /** 对单块冰做角点级的杯底/杯壁约束,firstPass 时才触发音效与摩擦 */
  private constrainCube(c: IceCube, dt: number, firstPass: boolean): void {
    const b = c.body
    if (b.sleepState === CANNON.Body.SLEEPING) return
    const bottom = this.config.bowl.bottomY
    const rimY = this.config.bowl.rimY
    const half = c.size / 2
    // RoundedBoxGeometry 圆角半径为 0.16 * size:角点位于内缩的立方体上,外加圆角球半径
    const cornerR = 0.16 * c.size
    const h = half - cornerR

    const local = new CANNON.Vec3()
    const world = new CANNON.Vec3()
    let floorImpact = 0
    let wallImpact = 0
    let onFloor = false
    let onWall = false

    for (const [sx, sy, sz] of IceSystem.SAMPLE_OFFSETS) {
      local.set(sx * h, sy * h, sz * h)
      b.quaternion.vmult(local, world)
      world.vadd(b.position, world)

      // —— 杯底 ——
      const floorPen = bottom + cornerR - world.y
      if (floorPen > 0) {
        onFloor = true
        b.position.y += floorPen
        world.y += floorPen
        if (b.velocity.y < 0) {
          floorImpact = Math.max(floorImpact, -b.velocity.y)
          // 慢速触底直接停住(静置),只有足够快才弹起,且反弹很弱
          b.velocity.y = b.velocity.y < -30 ? -b.velocity.y * 0.22 : 0
        }
      }

      // —— 杯壁(角点在杯口以下才约束) ——
      if (world.y < rimY) {
        const r = Math.hypot(world.x, world.z)
        if (r < 1e-4) continue
        const wallR =
          this.config.innerRadiusAt(THREE.MathUtils.clamp(world.y, bottom, rimY)) - 0.04
        const pen = r + cornerR - wallR
        if (pen > 0) {
          onWall = true
          const nx = world.x / r
          const nz = world.z / r
          b.position.x -= nx * pen
          b.position.z -= nz * pen
          const vRad = b.velocity.x * nx + b.velocity.z * nz
          if (vRad > 0) {
            wallImpact = Math.max(wallImpact, vRad)
            // 慢速贴壁不反弹,快速撞壁弱反弹
            const restitution = vRad > 30 ? 1.2 : 1.0
            b.velocity.x -= vRad * nx * restitution
            b.velocity.z -= vRad * nz * restitution
          }
        }
      }
    }

    // 接触摩擦:让平移和旋转快速收敛,不再"真空漂浮式"打转
    if (firstPass) {
      if (onFloor) {
        const fr = 1 - Math.min(9 * dt, 0.5)
        b.velocity.x *= fr
        b.velocity.z *= fr
        b.angularVelocity.scale(1 - Math.min(10 * dt, 0.6), b.angularVelocity)
      } else if (onWall) {
        b.angularVelocity.scale(1 - Math.min(4 * dt, 0.3), b.angularVelocity)
      }

      if (floorImpact > 30) {
        soundManager.playImpact('glass', THREE.MathUtils.clamp(floorImpact / 250, 0, 1))
      } else if (wallImpact > 25) {
        soundManager.playImpact('glass', THREE.MathUtils.clamp(wallImpact / 200, 0, 1))
      }
    }
  }

  dispose(): void {
    this.clear()
    this.geometry.dispose()
    this.material.normalMap?.dispose()
    this.material.dispose()
  }
}
