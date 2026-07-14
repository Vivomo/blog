# 环境贴图

把等距柱状(equirectangular)环境图放到本目录,玻璃与液体的反射会自动使用它。

加载优先级:
1. `environment.hdr` — RGBE HDR(推荐,反射高光更准)
2. `environment.png` / `environment.jpg` — LDR 全景图
3. 都没有时回退到 three.js 内置 RoomEnvironment

当前仓库自带一张卡通风酒吧 `environment.png` 作为默认素材。
