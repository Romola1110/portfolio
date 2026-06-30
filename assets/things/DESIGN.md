# 匣中签 · 物有灵犀 · Demo v4 设计说明

> **仅 `demo_things.html` 预览，未接入主站。** 确认满意后再替换 `#things`。

---

## v4 体验结构

```
标题（居中一行）
  └─ 匣中签 · 物有灵犀
引语（居中、同一古典字体、打字机出场）
  └─ 背景有漂浮小签（墨迹 / 纸痕 / 袖珍…）
信封（无签筒）
  └─ 点击信封 → 随机抽一纸信笺 → 信笺抽出 → 点击放大阅全文
展匣（点击展开）
  └─ 放大古树 + 飘落树叶 + 书签吊牌（保留 v3 签样式）
```

---

## 可选精致素材（有了会更美，没有也能跑）

### 1. 信封 / 信纸（推荐 PNG 或 SVG）

| 文件建议名 | 用途 | 规格 |
|-----------|------|------|
| `envelope-closed.png` | 替换 CSS 绘制的闭合信封 | 透明底，宽约 560px |
| `envelope-open.png` | 启封状态（可选，做更细腻翻盖） | 同上 |
| `letter-paper.png` | 信笺底纹（宣纸纹、毛边） | 竖版，宽约 400px |
| `wax-seal.png` | 火漆印（可选） | 小图 ~80px |

放入 `assets/things/ui/`，在 JS 里给 `.envelope-art` 加 `background-image` 或替换 `<svg>` 为 `<img>`。

### 2. 古树（强烈推荐）

| 文件 | 用途 | 规格 |
|------|------|------|
| `wish-tree.svg` 或 `wish-tree.png` | 替换现用线描 SVG | 竖版 **800×1100px** 左右，线稿或淡彩，枝繁叶茂、右侧主干的构图 |

参考你发的 David Wiseman 线描：细枝垂挂、留白多。  
放入 `assets/things/ui/wish-tree.svg`，在 `demo_things.html` 把 `.tree-svg` 换成：

```html
<img class="tree-art" src="assets/things/ui/wish-tree.svg" alt="">
```

书签吊牌仍叠在树上，位置在 `TREE_SLOTS` 里微调。

### 3. 手作实拍（书签吊牌 + 信笺缩略图）

每件竖版书签式照片，见下表。路径填进 `THINGS_DATA` 的 `image` 字段即可自动显示。

```
assets/things/bookmark-ginkgo.png
assets/things/calligraphy-rain.jpg
…
```

### 4. 漂浮背景小签（可选）

6–8 张极小 PNG（墨迹、纸痕等二字），可替换 CSS 里的 `.ft` 文字标签。

---

## 每件手作需提供

```
文件名：bookmark-ginkgo.png
中文名：银杏叶签
签意 signLabel：叶脉签
物记 note：夹在书页之间，替思绪留住页码。
赠言 verse：翻页时，请轻一点。
故事 story：2–3 句（点击弹层）
```

在 `assets/things-section.js` → `THINGS_DATA` 填入 `image: 'assets/things/xxx.png'`。

---

## 预览

https://romola1110.github.io/portfolio/demo_things.html?v=5

合并后请 **Ctrl+Shift+R** 强刷。

---

## 文件

```
demo_things.html          # v4 独立预览
assets/things-section.css # 含 #things-demo.things-v4 样式
assets/things-section.js  # v4 / v3 分支逻辑
assets/things/            # 你的图片
assets/things/ui/         # 信封、古树等 UI 素材（可选）
```
