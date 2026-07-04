# Signal Desk Overlay Kit / Signal Desk 视频弹窗风格包

This kit is for Remotion video overlays: key-point popups, card popups, quote callouts, process cards, and comment-area prompts.

这套风格包专门用于 Remotion 视频 overlay：关键内容弹窗、卡片弹窗、引用提示、流程卡片和评论区引导。

## Use Case / 使用场景

Use it when the base video already exists and you need short visual emphasis above the footage.

当底层视频已经存在，你只需要在画面上方叠加短暂的重点提示时，使用这套组件。

Good examples:

适合：

- A key sentence appears while the speaker says it.
- 口播说到重点时弹出一句关键结论。
- A small card explains why a previous attempt failed.
- 用小卡片解释之前复刻为什么效果不好。
- A final popup says the workflow has been packaged as a skill.
- 结尾弹窗提示整套方案已经整理成 skill。

Avoid using this kit as a full-screen presentation system. Each popup should carry one idea.

不要把这套组件当成整屏 PPT 系统。每个弹窗只承载一个信息重点。

## Files / 文件

- `theme.ts`: design tokens for colors, typography, spacing, radius, shadows, and motion.
- `theme.ts`：颜色、字体、间距、圆角、阴影和动效 tokens。
- `components/`: reusable overlay components.
- `components/`：可复用 overlay 组件。
- `examples/OverlayDemoComposition.tsx`: demo composition using the supplied script.
- `examples/OverlayDemoComposition.tsx`：基于你提供文案的演示 composition。
- `agent-prompt.md`: prompt for AI agents using this kit.
- `agent-prompt.md`：给 AI Agent 的使用提示词。
- `style-spec.md`: bilingual style rules.
- `style-spec.md`：双语风格说明。

## Basic Usage / 基础用法

```tsx
import {Sequence} from "remotion";
import {KeyPointPopup} from "./video-overlay-kit/components";

export const MyVideo = () => {
  return (
    <>
      <Sequence from={90} durationInFrames={86} layout="none">
        <KeyPointPopup
          label="AI GENERATED"
          title="口播剪辑和上方动画全部由 AI 自动生成"
          body="The popup appears only when the spoken point needs emphasis."
          position="top-right"
        />
      </Sequence>
    </>
  );
};
```

## Remotion Rule / Remotion 规则

Animate with `useCurrentFrame()`, `interpolate()`, `spring()`, and `Sequence`.

使用 `useCurrentFrame()`、`interpolate()`、`spring()` 和 `Sequence` 做动画。

Do not use CSS transitions, CSS animations, CSS keyframes, or Tailwind animation classes.

不要使用 CSS transition、CSS animation、CSS keyframes 或 Tailwind animation class。
