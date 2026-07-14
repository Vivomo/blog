import type { DrinkConfig } from '../types'

/**
 * 饮品目录 —— 新增饮品只需向数组里加一条配置。
 * opacity: 越大越不透明;fizz: 气泡强度(0 无气泡,1 强气泡)。
 */
export const DRINKS: DrinkConfig[] = [
  {
    id: 'grenadine',
    name: '红石榴糖浆',
    description: '深红浓稠,几乎不透光',
    color: '#c0123a',
    opacity: 0.92,
    fizz: 0.05,
  },
  {
    id: 'blue-curacao',
    name: '蓝橙力娇',
    description: '透亮的海洋蓝',
    color: '#1e6ee8',
    opacity: 0.55,
    fizz: 0.15,
  },
  {
    id: 'orange',
    name: '鲜橙汁',
    description: '橙黄色,半透明',
    color: '#f5920b',
    opacity: 0.78,
    fizz: 0.1,
  },
  {
    id: 'lime-soda',
    name: '青柠苏打',
    description: '淡绿透明,气泡充沛',
    color: '#8fd44a',
    opacity: 0.32,
    fizz: 1.0,
  },
  {
    id: 'cola',
    name: '可乐',
    description: '深琥珀色,气泡多',
    color: '#3a1704',
    opacity: 0.85,
    fizz: 0.9,
  },
  {
    id: 'milk-liqueur',
    name: '奶油利口酒',
    description: '乳白色,不透明',
    color: '#f2e8d8',
    opacity: 0.96,
    fizz: 0.02,
  },
]

export function getDrink(id: string): DrinkConfig {
  const d = DRINKS.find((x) => x.id === id)
  if (!d) throw new Error(`unknown drink: ${id}`)
  return d
}
