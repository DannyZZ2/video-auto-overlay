# Signal Desk Overlay Style Specification / Signal Desk 弹窗风格说明

## 1. Core Intent / 核心意图

Signal Desk Overlay is a compact card-popup system for videos. It is designed to sit above screen recordings, talking-head footage, tutorials, and AI workflow demos.

Signal Desk Overlay 是一套紧凑的视频弹窗系统，用于叠加在屏幕录制、真人口播、教程和 AI 工作流演示画面上。

The root problem is emphasis: the viewer hears a sentence, and the overlay makes the key point visible for 2 to 4 seconds.

它解决的根本问题是强调：观众听到一句话时，overlay 把其中最重要的信息视觉化停留 2 到 4 秒。

## 2. Visual Personality / 视觉性格

- Precise / 精确
- Editorial / 有编辑感
- Compact / 紧凑
- Calm but noticeable / 冷静但能被注意到
- Reusable / 可重复生产

Avoid: full-screen slide layouts, heavy gradients, neon sci-fi, glassmorphism overload, stickers, particles, and card stacks.

避免：整屏幻灯片、大面积渐变、霓虹科幻、过量玻璃拟态、贴纸、粒子、卡片堆叠。

## 3. Overlay Rules / 弹窗规则

- One popup should communicate one idea.
- 一个弹窗只表达一个重点。
- Most popups should stay between 2 and 4 seconds.
- 大多数弹窗停留 2 到 4 秒。
- Put popups near the spoken subject, but keep a safe margin from subtitles and faces.
- 弹窗靠近口播主题，但要避开字幕和人脸。
- Use no more than two popups on screen at once.
- 同一画面最多出现两个弹窗。
- Use position presets instead of arbitrary coordinates when possible.
- 优先使用预设位置，不要随意写坐标。

## 4. Card Style / 卡片样式

Cards use white or warm-white surfaces, graphite text, thin borders, and soft shadows. The accent color appears as a small rail, label, index marker, or status chip.

卡片使用白色或暖白色底、石墨黑文字、细描边和柔和阴影。强调色只出现在侧边线、标签、序号或状态 chip 上。

Default values:

默认值：

- Radius: `8px`
- Border: `1px solid #D9DEE7`
- Shadow: `0 20px 56px rgba(20, 22, 26, 0.18)`
- Padding: `28px` to `36px`
- Width: `520px` to `760px`

## 5. Typography / 字体

Use system-first fonts so the kit stays portable.

优先使用系统字体，保证可迁移。

- Title: 36 to 44px, bold
- 标题：36 到 44px，加粗
- Body: 24 to 30px, medium
- 正文：24 到 30px，中等字重
- Label: 16 to 18px, mono or strong sans
- 标签：16 到 18px，等宽或强 sans

Chinese text must stay readable. Do not use negative letter spacing.

中文优先保证可读性。不要使用负字距。

## 6. Motion / 动效

The default motion is a quick editorial pop:

默认动效是快速、编辑化的弹出：

- Enter: 10 to 14 frames
- 进入：10 到 14 帧
- Hold: controlled by `Sequence`
- 停留：由 `Sequence` 控制
- Exit: 8 to 10 frames
- 退出：8 到 10 帧
- Stagger between rows: 4 frames
- 行之间错开：4 帧

Use Remotion frame-driven animation only. No CSS transitions or CSS keyframes.

只使用 Remotion 帧驱动动画。不要使用 CSS transition 或 CSS keyframes。

## 7. Component Set / 组件集合

- `KeyPointPopup`: the default one-sentence emphasis card.
- `KeyPointPopup`：默认关键句强调卡。
- `StatPopup`: one number or result with a short explanation.
- `StatPopup`：一个数字或结果加一句解释。
- `QuotePopup`: a short quoted or spoken sentence.
- `QuotePopup`：短引用或口播原句。
- `ProcessPopup`: 2 to 4 steps, used for before/after or process changes.
- `ProcessPopup`：2 到 4 个步骤，用于前后变化或流程。
- `SkillDropPopup`: final callout for "packaged as a skill" or "link in comments".
- `SkillDropPopup`：结尾提示“已整理成 skill / 放在评论区”。
- `CalloutLabel`: tiny label for pointing at UI areas.
- `CalloutLabel`：指向界面区域的小标签。

## 8. Failure Points / 易翻车点

Before delivery, check:

交付前检查：

- Popups do not cover captions, faces, or important UI.
- 弹窗没有遮挡字幕、人脸或关键 UI。
- Text does not overflow the card.
- 文字没有溢出卡片。
- The animation remains readable at phone size.
- 手机尺寸下仍然可读。
- Accent color is used sparingly.
- 强调色使用克制。
- Components import from `theme.ts`.
- 组件从 `theme.ts` 读取 tokens。
