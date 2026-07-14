/**
 * 全局类型定义。
 * 尺寸单位统一为厘米(cm),世界坐标 y=0 为桌面。
 */

export type SizeClass = 'small' | 'medium' | 'large'

/** 不同尺寸的杯子可容纳的"份数"(按液体可用高度等分) */
export const SERVINGS_BY_SIZE: Record<SizeClass, number> = {
  small: 3,
  medium: 4,
  large: 5,
}

export interface GlassConfig {
  id: string
  name: string
  description: string
  size: SizeClass
  /** 杯子总高度 */
  height: number
  /** 车削(Lathe)轮廓:从杯底中心出发,沿外壁到杯口,再沿内壁回到内底,r 为半径 */
  profile: { r: number; y: number }[]
  /** 盛液腔体范围(内底 y 与杯口 y) */
  bowl: { bottomY: number; rimY: number }
  /** 给定高度处的内壁半径 */
  innerRadiusAt(y: number): number
  /** 建议冰块边长 */
  iceSize: number
  /** 最多可加的冰块数 */
  maxIce: number
}

export interface DrinkConfig {
  id: string
  name: string
  description: string
  /** 液体颜色(hex) */
  color: string
  /** 透明度 0~1,越大越不透明 */
  opacity: number
  /** 气泡强度 0~1(苏打类接近 1,糖浆类接近 0) */
  fizz: number
}

export type Step = 'glass' | 'ice' | 'drink'
