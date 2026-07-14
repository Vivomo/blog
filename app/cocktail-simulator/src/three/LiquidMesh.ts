import * as THREE from 'three'
import type { GlassConfig } from '../types'
import type { LiquidLayer } from './mixing'

const MAX_LAYERS = 6

/** 液面比内壁略缩,避免与玻璃 z-fighting */
const WALL_GAP = 0.06

const vertexShader = /* glsl */ `
  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

const fragmentShader = /* glsl */ `
  #define MAX_LAYERS ${MAX_LAYERS}

  uniform int uLayerCount;
  uniform float uTopY[MAX_LAYERS];
  uniform vec3 uColor[MAX_LAYERS];
  uniform float uOpacity[MAX_LAYERS];
  uniform float uBottomY;
  uniform float uSurfaceY;
  uniform float uBlur;      // 分层交界模糊宽度
  uniform float uSwirl;     // 搅拌漩涡强度
  uniform vec3 uMixColor;   // 搅拌均匀后的颜色
  uniform float uMixOpacity;
  uniform float uMixT;      // 0 分层 -> 1 完全混合
  uniform float uTime;

  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    float angle = atan(vWorldPos.z, vWorldPos.x);
    float r = length(vWorldPos.xz);

    // 搅拌时对采样高度做旋转扰动,层界被"搅出"波纹直至消失
    float wob = sin(angle * 3.0 + uTime * 5.0) * 0.6
              + sin(angle * 5.0 - uTime * 7.3) * 0.35;
    float y = vWorldPos.y - uSwirl * wob * (0.4 + r * 0.15);

    // 逐层混合,交界处用 smoothstep 模糊
    vec3 col = uColor[0];
    float op = uOpacity[0];
    for (int i = 1; i < MAX_LAYERS; i++) {
      if (i >= uLayerCount) break;
      float t = smoothstep(uTopY[i - 1] - uBlur, uTopY[i - 1] + uBlur, y);
      col = mix(col, uColor[i], t);
      op = mix(op, uOpacity[i], t);
    }

    // 搅拌进度:向均匀混合色过渡
    col = mix(col, uMixColor, uMixT);
    op = mix(op, uMixOpacity, uMixT);

    // 底部略深、上部略亮,模拟光衰减
    float hNorm = clamp((y - uBottomY) / max(uSurfaceY - uBottomY, 0.001), 0.0, 1.0);
    col *= 0.72 + 0.3 * hNorm;

    // 菲涅尔边缘亮化
    float fresnel = pow(1.0 - abs(dot(normalize(vNormal), normalize(vViewDir))), 3.0);
    col += fresnel * 0.22;

    float alpha = clamp(op + fresnel * 0.12, 0.0, 1.0);

    // 液面(法线朝上)微微高光
    if (vNormal.y > 0.8) {
      col = col * 1.05 + vec3(0.05);
      alpha = min(alpha + 0.06, 1.0);
    }

    gl_FragColor = vec4(col, alpha);
  }
`

/**
 * 杯中液体:几何随液面高度重建,颜色分层由着色器完成。
 */
export class LiquidMesh {
  readonly mesh: THREE.Mesh
  private material: THREE.ShaderMaterial
  private config: GlassConfig
  private surfaceY: number

  constructor(config: GlassConfig) {
    this.config = config
    this.surfaceY = config.bowl.bottomY

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      side: THREE.FrontSide,
      uniforms: {
        uLayerCount: { value: 0 },
        uTopY: { value: new Array(MAX_LAYERS).fill(0) },
        uColor: { value: Array.from({ length: MAX_LAYERS }, () => new THREE.Color()) },
        uOpacity: { value: new Array(MAX_LAYERS).fill(0) },
        uBottomY: { value: config.bowl.bottomY },
        uSurfaceY: { value: this.surfaceY },
        uBlur: { value: 0.22 },
        uSwirl: { value: 0 },
        uMixColor: { value: new THREE.Color('#ffffff') },
        uMixOpacity: { value: 0.5 },
        uMixT: { value: 0 },
        uTime: { value: 0 },
      },
    })

    this.mesh = new THREE.Mesh(new THREE.BufferGeometry(), this.material)
    this.mesh.name = 'liquid'
    this.mesh.renderOrder = 1
    this.mesh.visible = false
  }

  get level(): number {
    return this.surfaceY
  }

  /** 设置液面高度并重建几何 */
  setSurfaceY(y: number): void {
    this.surfaceY = y
    this.material.uniforms.uSurfaceY.value = y
    const bottom = this.config.bowl.bottomY
    if (y <= bottom + 0.02) {
      this.mesh.visible = false
      return
    }
    this.mesh.visible = true

    const pts: THREE.Vector2[] = []
    // 底部中心 → 沿内壁上升
    pts.push(new THREE.Vector2(0.01, bottom + 0.03))
    const steps = 36
    for (let i = 0; i <= steps; i++) {
      const yy = bottom + ((y - bottom) * i) / steps
      pts.push(new THREE.Vector2(Math.max(this.config.innerRadiusAt(yy) - WALL_GAP, 0.02), yy))
    }
    // 液面(顶部圆盘,带一点点向上的弯月面弧度)
    const topR = Math.max(this.config.innerRadiusAt(y) - WALL_GAP, 0.02)
    for (let i = 1; i <= 6; i++) {
      const t = i / 6
      const rr = topR * (1 - t)
      pts.push(new THREE.Vector2(Math.max(rr, 0.01), y - 0.05 * Math.sin(t * Math.PI * 0.5)))
    }

    const old = this.mesh.geometry
    this.mesh.geometry = new THREE.LatheGeometry(pts, 64)
    old.dispose()
  }

  /** 更新分层信息 */
  setLayers(layers: LiquidLayer[]): void {
    const u = this.material.uniforms
    u.uLayerCount.value = Math.min(layers.length, MAX_LAYERS)
    layers.slice(0, MAX_LAYERS).forEach((l, i) => {
      ;(u.uTopY.value as number[])[i] = l.topY
      ;(u.uColor.value as THREE.Color[])[i].set(l.drink.color)
      ;(u.uOpacity.value as number[])[i] = l.drink.opacity
    })
  }

  setMixTarget(color: THREE.Color, opacity: number): void {
    ;(this.material.uniforms.uMixColor.value as THREE.Color).copy(color)
    this.material.uniforms.uMixOpacity.value = opacity
  }

  set mixT(v: number) {
    this.material.uniforms.uMixT.value = v
  }
  get mixT(): number {
    return this.material.uniforms.uMixT.value as number
  }

  set swirl(v: number) {
    this.material.uniforms.uSwirl.value = v
  }
  get swirl(): number {
    return this.material.uniforms.uSwirl.value as number
  }

  set blur(v: number) {
    this.material.uniforms.uBlur.value = v
  }

  update(time: number): void {
    this.material.uniforms.uTime.value = time
  }

  dispose(): void {
    this.mesh.geometry.dispose()
    this.material.dispose()
  }
}
