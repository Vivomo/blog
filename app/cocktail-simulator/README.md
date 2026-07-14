# 调酒模拟器 Cocktail Simulator

基于 **React + Three.js (WebGL) + cannon-es** 的 3D 调酒模拟器。

## 运行

```bash
pnpm install
pnpm dev      # 开发
pnpm build    # 构建
```

## 玩法流程

1. **选杯** —— 5 款杯子:大小高脚杯、小/中/大玻璃杯(杯口均比底部微微大)。
2. **加冰** —— 冰块从杯口落入,cannon-es 物理模拟碰撞翻滚,撞击玻璃/冰块互撞有音效。
3. **调制** —— 按杯型限制份数(小 3 / 中 4 / 大 5),每份按可用高度等分,加满时留有杯口空间。
   不同饮品倒入后先分层(交界处着色器模糊),可搅拌混匀;有冰时液面升高冰块受浮力上浮。
   含气饮品会有上升气泡与杯壁挂泡。

## 目录结构与扩展

```
src/
├── types.ts               # 全局类型、份数规则
├── store.ts               # zustand UI 状态
├── config/
│   ├── glasses.ts         # 杯子目录(加杯子改这里)
│   └── drinks.ts          # 饮品目录(加饮品改这里)
├── audio/SoundManager.ts  # 音效:优先加载素材文件,缺失时 WebAudio 合成
└── three/
    ├── SimulatorApp.ts    # 场景编排 + 对 React 暴露的交互 API
    ├── GlassMesh.ts       # 车削轮廓 → 玻璃杯网格
    ├── LiquidMesh.ts      # 液体几何 + 分层/模糊/搅拌着色器
    ├── mixing.ts          # 搅拌混色(加权几何平均,贴近真实染液混合)
    ├── Bubbles.ts         # 上升气泡 + 杯壁挂泡
    ├── IceSystem.ts       # 冰块物理(重力/碰撞/浮力)
    ├── Pourer.ts          # 倒酒动画(瓶身 + 液柱)
    ├── StirRod.ts         # 搅拌棒动画
    └── environment.ts     # 环境贴图加载(带回退)
```

- **加一款杯子**:在 `config/glasses.ts` 里调用 `buildTumbler` / `buildGoblet`(或自写 builder,
  只要返回 `GlassConfig`:车削轮廓 + `innerRadiusAt` 内壁半径函数)并推入 `GLASSES`。
- **加一款饮品**:在 `config/drinks.ts` 的 `DRINKS` 里加一条 `{ 颜色, 透明度, 气泡强度 }`。

## 素材占位

- `public/sounds/` —— 放入 `ice-clink.mp3`、`ice-knock.mp3`、`pour.mp3`、`stir.mp3` 可替换合成音效。
- `public/env/` —— 放入 `environment.hdr` 可替换默认的程序化室内环境反射。
