import * as THREE from 'three'
import type { GlassConfig, SizeClass } from '../types'

/**
 * 杯子目录 —— 所有杯子都通过"内壁轮廓控制点"描述,
 * 新增杯子只需要调用 buildTumbler / buildGoblet(或自定义 builder)并加入 GLASSES 数组。
 */

interface InnerSample {
  y: number
  r: number
}

/** 用 Catmull-Rom 把稀疏控制点采样成密集的内壁半径表 */
function sampleInnerWall(controls: InnerSample[], samples = 64): InnerSample[] {
  const pts = controls.map((c) => new THREE.Vector3(c.r, c.y, 0))
  const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5)
  return curve.getPoints(samples).map((p) => ({ y: p.y, r: Math.max(p.x, 0.01) }))
}

/**
 * 杯口唇边:用半圆弧把外壁顶端和内壁顶端封起来。
 * 弧线从外壁顶(φ=0)翻过杯口最高点(φ=π/2)落到内壁顶(φ=π),
 * 不含两个端点(端点分别由外壁/内壁的最后一个采样点提供)。
 */
function rimArc(innerR: number, wallT: number, topY: number, segments = 8): { r: number; y: number }[] {
  const rc = innerR + wallT / 2
  const capR = wallT / 2
  const pts: { r: number; y: number }[] = []
  for (let k = 1; k < segments; k++) {
    const phi = (Math.PI * k) / segments
    pts.push({ r: rc + capR * Math.cos(phi), y: topY + capR * Math.sin(phi) })
  }
  return pts
}

function makeInnerRadiusAt(table: InnerSample[]) {
  return (y: number): number => {
    if (y <= table[0].y) return table[0].r
    const last = table[table.length - 1]
    if (y >= last.y) return last.r
    for (let i = 1; i < table.length; i++) {
      if (table[i].y >= y) {
        const a = table[i - 1]
        const b = table[i]
        const t = (y - a.y) / Math.max(b.y - a.y, 1e-6)
        return a.r + (b.r - a.r) * t
      }
    }
    return last.r
  }
}

interface TumblerSpec {
  id: string
  name: string
  description: string
  size: SizeClass
  height: number
  baseInnerR: number
  rimInnerR: number
  wallT?: number
  bottomT?: number
  iceSize: number
  maxIce: number
}

/** 普通玻璃杯:杯口比底部微微大(带一点弧度的锥形) */
export function buildTumbler(spec: TumblerSpec): GlassConfig {
  const wallT = spec.wallT ?? 0.28
  const bottomT = spec.bottomT ?? 0.9
  const H = spec.height
  const bottomY = bottomT
  const midR = (spec.baseInnerR + spec.rimInnerR) / 2 - 0.03

  const inner = sampleInnerWall([
    { y: bottomY, r: spec.baseInnerR },
    { y: bottomY + (H - bottomY) * 0.5, r: midR },
    { y: H, r: spec.rimInnerR },
  ])
  const innerRadiusAt = makeInnerRadiusAt(inner)

  const profile: { r: number; y: number }[] = []
  const baseOuterR = spec.baseInnerR + wallT + 0.12
  // 杯底外沿
  profile.push({ r: 0, y: 0 })
  profile.push({ r: baseOuterR - 0.35, y: 0 })
  profile.push({ r: baseOuterR, y: 0.18 })
  // 外壁(跟随内壁 + 壁厚)
  for (let i = 0; i <= 16; i++) {
    const y = 0.5 + ((H - 0.5) * i) / 16
    profile.push({ r: innerRadiusAt(Math.max(y, bottomY)) + wallT, y })
  }
  // 杯口唇边(半圆弧封边)
  profile.push(...rimArc(innerRadiusAt(H), wallT, H))
  // 内壁向下
  for (let i = 0; i <= 16; i++) {
    const y = H - ((H - bottomY) * i) / 16
    profile.push({ r: innerRadiusAt(y), y })
  }
  // 内底
  profile.push({ r: spec.baseInnerR * 0.5, y: bottomY + 0.08 })
  profile.push({ r: 0, y: bottomY })

  return {
    id: spec.id,
    name: spec.name,
    description: spec.description,
    size: spec.size,
    height: H,
    profile,
    bowl: { bottomY, rimY: H },
    innerRadiusAt,
    iceSize: spec.iceSize,
    maxIce: spec.maxIce,
  }
}

interface GobletSpec {
  id: string
  name: string
  description: string
  size: SizeClass
  footR: number
  stemR: number
  stemTopY: number
  bowlH: number
  /** 碗形内壁控制点,t 为碗内高度比例(0 底 → 1 口),r 为半径 */
  bowlControls: { t: number; r: number }[]
  wallT?: number
  iceSize: number
  maxIce: number
}

/** 高脚杯:底座 + 杯梗 + 碗形杯体 */
export function buildGoblet(spec: GobletSpec): GlassConfig {
  const wallT = spec.wallT ?? 0.24
  const bowlBottomY = spec.stemTopY + 0.35
  const rimY = spec.stemTopY + spec.bowlH
  const H = rimY

  const inner = sampleInnerWall(
    spec.bowlControls.map((c) => ({
      y: bowlBottomY + (rimY - bowlBottomY) * c.t,
      r: c.r,
    })),
  )
  const innerRadiusAt = makeInnerRadiusAt(inner)

  const profile: { r: number; y: number }[] = []
  // 底座
  profile.push({ r: 0, y: 0 })
  profile.push({ r: spec.footR - 0.3, y: 0 })
  profile.push({ r: spec.footR, y: 0.14 })
  profile.push({ r: spec.footR * 0.55, y: 0.45 })
  // 杯梗
  profile.push({ r: spec.stemR, y: 0.9 })
  profile.push({ r: spec.stemR * 0.85, y: spec.stemTopY * 0.55 })
  profile.push({ r: spec.stemR, y: spec.stemTopY - 0.4 })
  // 碗外壁
  for (let i = 0; i <= 20; i++) {
    const y = spec.stemTopY + ((rimY - spec.stemTopY) * i) / 20
    const rIn = innerRadiusAt(Math.max(y, bowlBottomY))
    profile.push({ r: rIn + wallT, y })
  }
  // 杯口唇边(半圆弧封边)
  profile.push(...rimArc(innerRadiusAt(rimY), wallT, rimY))
  // 内壁向下
  for (let i = 0; i <= 20; i++) {
    const y = rimY - ((rimY - bowlBottomY) * i) / 20
    profile.push({ r: innerRadiusAt(y), y })
  }
  profile.push({ r: 0, y: bowlBottomY })

  return {
    id: spec.id,
    name: spec.name,
    description: spec.description,
    size: spec.size,
    height: H,
    profile,
    bowl: { bottomY: bowlBottomY, rimY },
    innerRadiusAt,
    iceSize: spec.iceSize,
    maxIce: spec.maxIce,
  }
}

export const GLASSES: GlassConfig[] = [
  buildGoblet({
    id: 'goblet-small',
    name: '小高脚杯',
    description: '精致的鸡尾酒高脚杯 · 3 份',
    size: 'small',
    footR: 3.0,
    stemR: 0.34,
    stemTopY: 6.5,
    bowlH: 7.5,
    bowlControls: [
      { t: 0, r: 1.1 },
      { t: 0.3, r: 2.9 },
      { t: 0.7, r: 3.35 },
      { t: 1, r: 3.15 },
    ],
    iceSize: 1.7,
    maxIce: 3,
  }),
  buildGoblet({
    id: 'goblet-large',
    name: '大高脚杯',
    description: '饱满的大肚高脚杯 · 5 份',
    size: 'large',
    footR: 3.6,
    stemR: 0.4,
    stemTopY: 7.0,
    bowlH: 10.5,
    bowlControls: [
      { t: 0, r: 1.4 },
      { t: 0.32, r: 4.0 },
      { t: 0.7, r: 4.5 },
      { t: 1, r: 4.1 },
    ],
    iceSize: 2.1,
    maxIce: 5,
  }),
  buildTumbler({
    id: 'tumbler-small',
    name: '小玻璃杯',
    description: '矮款威士忌杯,杯口微张 · 3 份',
    size: 'small',
    height: 9,
    baseInnerR: 2.7,
    rimInnerR: 3.2,
    iceSize: 1.9,
    maxIce: 3,
  }),
  buildTumbler({
    id: 'tumbler-medium',
    name: '中玻璃杯',
    description: '经典中款水杯,杯口微张 · 4 份',
    size: 'medium',
    height: 11.5,
    baseInnerR: 3.0,
    rimInnerR: 3.65,
    iceSize: 2.0,
    maxIce: 4,
  }),
  buildTumbler({
    id: 'tumbler-large',
    name: '大玻璃杯',
    description: '高款柯林斯杯,杯口微张 · 5 份',
    size: 'large',
    height: 14.5,
    baseInnerR: 3.2,
    rimInnerR: 3.95,
    iceSize: 2.2,
    maxIce: 5,
  }),
]

export function getGlass(id: string): GlassConfig {
  const g = GLASSES.find((x) => x.id === id)
  if (!g) throw new Error(`unknown glass: ${id}`)
  return g
}
