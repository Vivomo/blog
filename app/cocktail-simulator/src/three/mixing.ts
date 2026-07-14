import * as THREE from 'three'
import type { DrinkConfig } from '../types'

export interface LiquidLayer {
  drink: DrinkConfig
  /** 该层顶面的世界高度 y */
  topY: number
}

/**
 * 计算多种液体搅拌均匀后的颜色。
 *
 * 把每种液体的颜色近似看作"透射率",混合液的透射率是各组分
 * 透射率的加权几何平均(比线性平均更贴近真实染液混合:
 * 红 + 蓝 → 深紫,而不是发灰的粉)。
 */
export function mixLayers(layers: LiquidLayer[], bottomY: number): {
  color: THREE.Color
  opacity: number
  fizz: number
} {
  if (layers.length === 0) {
    return { color: new THREE.Color('#ffffff'), opacity: 0, fizz: 0 }
  }
  const weights: number[] = []
  let prev = bottomY
  let total = 0
  for (const l of layers) {
    const w = Math.max(l.topY - prev, 1e-4)
    weights.push(w)
    total += w
    prev = l.topY
  }

  const logRGB = [0, 0, 0]
  let opacity = 0
  let fizz = 0
  layers.forEach((l, i) => {
    const w = weights[i] / total
    const c = new THREE.Color(l.drink.color)
    logRGB[0] += w * Math.log(Math.max(c.r, 0.015))
    logRGB[1] += w * Math.log(Math.max(c.g, 0.015))
    logRGB[2] += w * Math.log(Math.max(c.b, 0.015))
    opacity += w * l.drink.opacity
    fizz += w * l.drink.fizz
  })
  const color = new THREE.Color(
    Math.exp(logRGB[0]),
    Math.exp(logRGB[1]),
    Math.exp(logRGB[2]),
  )
  // 混合后悬浮微粒增多,整体略变浑浊
  opacity = Math.min(opacity * 1.08 + 0.02, 1)
  return { color, opacity, fizz }
}
