import * as THREE from 'three'
import type { GlassConfig } from '../types'

/** 从轮廓估计杯口内/外半径与壁厚 */
function rimRadii(config: GlassConfig): { innerR: number; outerR: number; wallT: number } {
  const rimY = config.bowl.rimY
  const innerR = config.innerRadiusAt(rimY)
  let outerR = innerR
  // 只取紧贴杯口高度的点,避免碗肚更宽处误判为外壁
  for (const p of config.profile) {
    if (Math.abs(p.y - rimY) <= 0.08 && p.r > outerR) outerR = p.r
  }
  if (outerR <= innerR + 0.05) outerR = innerR + 0.28
  return { innerR, outerR, wallT: outerR - innerR }
}

/**
 * 杯口金属封边:U 形截面车削成一圈金边,
 * 包住杯口外沿、顶端与内沿(与参考图类似的包边效果)。
 */
function createMetalRim(config: GlassConfig): THREE.Mesh {
  const rimY = config.bowl.rimY
  const { innerR, outerR, wallT } = rimRadii(config)
  const capR = wallT / 2
  const rc = innerR + wallT / 2

  // 金属边向下延伸的长度、金属层厚度
  const bandH = Math.min(0.42, Math.max(0.32, wallT * 1.4))
  const metalT = Math.min(0.065, Math.max(0.045, wallT * 0.22))

  const pts: THREE.Vector2[] = []
  const arcSeg = 10

  // 外壁底端 → 外壁向上 → 外侧包过杯口
  pts.push(new THREE.Vector2(outerR, rimY - bandH))
  pts.push(new THREE.Vector2(outerR + metalT, rimY - bandH))
  for (let k = 0; k <= arcSeg; k++) {
    const phi = (Math.PI * k) / arcSeg
    pts.push(
      new THREE.Vector2(
        rc + (capR + metalT) * Math.cos(phi),
        rimY + (capR + metalT) * Math.sin(phi),
      ),
    )
  }

  // 内壁向下 → 折回贴合玻璃内壁 → 沿唇边弧回到外壁闭合
  pts.push(new THREE.Vector2(innerR - metalT, rimY - bandH))
  pts.push(new THREE.Vector2(innerR, rimY - bandH))
  for (let k = arcSeg; k >= 0; k--) {
    const phi = (Math.PI * k) / arcSeg
    pts.push(new THREE.Vector2(rc + capR * Math.cos(phi), rimY + capR * Math.sin(phi)))
  }
  pts.push(new THREE.Vector2(outerR, rimY - bandH))

  const geometry = new THREE.LatheGeometry(pts, 96)
  const material = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 1,
    roughness: 0.16,
    envMapIntensity: 1.7,
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.name = `metal-rim-${config.id}`
  mesh.renderOrder = 11
  return mesh
}

/** 由车削轮廓生成玻璃杯网格(物理透射材质),并附带杯口金属封边 */
export function createGlassMesh(config: GlassConfig): THREE.Mesh {
  // LatheGeometry 自带按轮廓切线计算的法线(含接缝处理),不要再重算平均法线
  const pts = config.profile.map((p) => new THREE.Vector2(p.r, p.y))
  const geometry = new THREE.LatheGeometry(pts, 72)

  // 注意:不能用 transmission(透射)材质 —— three.js 的透射通道
  // 不会渲染 transparent 物体,隔着杯壁将完全看不到液体/气泡。
  // 因此玻璃采用普通 alpha 混合 + 强环境反射来表现质感。
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0.04,
    transparent: true,
    opacity: 0.18,
    ior: 1.5,
    reflectivity: 1,
    specularIntensity: 1,
    envMapIntensity: 1.35,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    side: THREE.DoubleSide,
    depthWrite: false,
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.name = `glass-${config.id}`
  // 最后绘制,叠加在液体、冰块、气泡之上
  mesh.renderOrder = 10
  mesh.add(createMetalRim(config))
  return mesh
}

export function disposeMesh(mesh: THREE.Mesh): void {
  mesh.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return
    obj.geometry.dispose()
    const m = obj.material
    if (Array.isArray(m)) m.forEach((x) => x.dispose())
    else m.dispose()
  })
}
