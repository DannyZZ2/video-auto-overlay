# Remotion Style Examples / Remotion 风格参考案例

This is a read-only Remotion reference project for inspecting the bundled overlay styles. Do not copy this whole project into user output; use it to study style, component structure, timing, and motion behavior before creating or adapting a separate user Remotion project.

这是一个只读 Remotion 参考工程，用于查看内置 overlay 风格。不要把整个工程复制到用户输出目录；它只用于研究风格、组件结构、时间设计和动效行为，然后再创建或改造独立的用户 Remotion 工程。

## Preview Reference / 参考预览

Install dependencies:

安装依赖：

```bash
npm install
```

Start Remotion Studio:

启动 Remotion Studio：

```bash
npm run studio
```

Open one of these reference compositions:

打开以下参考 composition 之一：

- `OverlayDemo`: editorial card popup baseline.
- `OverlayDemo`：编辑部卡片弹窗基准版。
- `PrecisionHUD`: technical HUD style with scan lines and system labels.
- `PrecisionHUD`：技术 HUD 风格，包含扫描线和系统标签。
- `FrostedGlass`: translucent glass card style.
- `FrostedGlass`：半透明玻璃质感卡片风格。
- `TerminalAgent`: terminal / coding agent style.
- `TerminalAgent`：终端 / 编程 Agent 风格。
- `DarkDiagnosticHUDTest`: generalized diagnostic HUD style based on the analyzed reference.
- `DarkDiagnosticHUDTest`：按参考视频提炼出的通用暗调诊断 HUD 测试版。

## Script / 文案

```text
本期视频的口播剪辑以及上方的动画效果，全部是ai自动生成的，不知道你觉的效果如何。
在之前的视频中，尝试复刻了一个片段，效果差强人意，经过几天的调整，终于做出了一个完整的方案。
我已经把这一整套方案整理成了一个skill放在了评论区。
```

## Structure / 结构

```text
src/
  Root.tsx
  index.ts
  video-overlay-kit/
    theme.ts
    components/
    examples/OverlayDemoComposition.tsx
    examples/StyleVariantCompositions.tsx
    examples/DarkDiagnosticHUDTest.tsx
```

These examples intentionally use overlay popups instead of full-screen title slides.

这些案例刻意使用视频上方的弹窗 overlay，而不是整屏标题页。

## Compatibility Layer / 兼容层

The reusable compatibility helpers live in:

兼容性组件在这里：

```text
src/video-overlay-kit/components/compat.tsx
```

Use these helpers when applying the style to other videos:

迁移到其他视频项目时优先使用这些组件：

- `AdaptiveBilingualSubtitle`: bottom bilingual subtitles with automatic font-size fallback.
- `AdaptiveBilingualSubtitle`：底部双语字幕，按文本长度自动降字号。
- `AdaptiveText`: title/body text that wraps and scales down for longer copy.
- `AdaptiveText`：标题和正文文本，长文案会自动换行并降字号。
- `safeTextStyle`: shared wrapping rules for chips, labels, and metadata.
- `safeTextStyle`：给标签、chip 和元信息使用的统一换行规则。

Current compositions using the compatibility layer:

已经接入兼容层的 composition：

- `OverlayDemo`
- `PrecisionHUD`
- `FrostedGlass`
- `TerminalAgent`
- `DarkDiagnosticHUDTest`

Recommended subtitle limits:

推荐字幕长度：

- Chinese: keep each subtitle segment under 28 Chinese characters when possible.
- 中文：尽量每段不超过 28 个汉字。
- English: keep each subtitle segment under 72 characters when possible.
- 英文：尽量每段不超过 72 个字符。
- For longer sentences, split by meaning and use multiple `Sequence` blocks.
- 更长句子按语义拆开，用多个 `Sequence` 分段展示。
