import * as THREE from 'three'
import type { GlassConfig } from '../types'

/** 由车削轮廓生成玻璃杯网格(物理透射材质) */
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
  return mesh
}

export function disposeMesh(mesh: THREE.Mesh): void {
  mesh.geometry.dispose()
  const m = mesh.material
  if (Array.isArray(m)) m.forEach((x) => x.dispose())
  else m.dispose()
}
