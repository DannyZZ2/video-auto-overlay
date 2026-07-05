# Remotion Style Guide / Remotion 风格参考

## Contents / 目录

- Source / 来源
- Style Snapshots / 风格样张
- Five Reference Cases / 五个参考案例
- Choosing a Style / 选择风格
- Timing From Transcript / 基于字幕卡点
- Diagnostic HUD Patterns / 诊断 HUD 模式
- Keyword Effects / 关键词动效
- Placement Rules / 摆放规则
- Remotion + React + GSAP
- Adaptation Rules / 改造规则

## Source / 来源

Use the bundled reference project at `references/remotion-style-examples/` as the visual source of truth. It contains five working Remotion compositions for style inspection only.

使用 `references/remotion-style-examples/` 作为视觉事实来源。里面包含 5 个可运行 Remotion composition，但只用于风格参考。

Use still snapshots at `references/style-snapshots/` for quick visual inspection before drafting packaging plans or implementation prompts.

生成包装方案或实现 prompt 前，使用 `references/style-snapshots/` 里的静态样张快速检查视觉风格。

## Style Snapshots / 风格样张

These images are rendered from the reference Remotion project and are read-only visual anchors. Do not copy them into generated user projects.

这些图片从参考 Remotion 工程渲染得到，是只读视觉锚点。不要复制进用户生成项目。

| Composition / 组合 | Snapshot / 样张 | Use / 用途 |
|---|---|---|
| `OverlayDemo` | `references/style-snapshots/overlay-demo.png` | Standard light popup overlays / 标准浅色弹窗 |
| `PrecisionHUD` | `references/style-snapshots/precision-hud.png` | Structured metrics and process HUD / 结构化指标和流程 HUD |
| `FrostedGlass` | `references/style-snapshots/frosted-glass.png` | Softer translucent explanatory overlays / 柔和半透明解释卡 |
| `TerminalAgent` | `references/style-snapshots/terminal-agent.png` | Terminal, prompt, command, and agent execution overlays / 终端、prompt、命令和 Agent 执行卡 |
| `DarkDiagnosticHUDTest` | `references/style-snapshots/dark-diagnostic-hud.png` | Default dark diagnostic HUD / 默认暗色诊断 HUD |
| All styles / 全部风格 | `references/style-snapshots/contact-sheet.png` | Fast comparison across all five styles / 快速对比 5 个风格 |

## Five Reference Cases / 五个参考案例

### 1. `OverlayDemo` / 标准重点弹窗

Use for general talking-head overlays: key points, process cards, quotes, stats, and skill/file callouts.

用于通用口播包装：重点弹窗、流程卡、引用卡、数据卡、skill/文件提示。

Source files:

源码：

```text
src/video-overlay-kit/examples/OverlayDemoComposition.tsx
src/video-overlay-kit/components/
references/style-snapshots/overlay-demo.png
```

Design behavior:

设计行为：

- Keyword-timed popups.
- Short slide/spring entrances.
- Side or upper-safe placement.
- Avoid covering faces, mouths, hands, and subtitles.

- 按关键词卡点出现。
- 使用短促滑入和弹性落位。
- 优先放在侧边或上方安全区。
- 避免遮挡脸、嘴、手和字幕。

### 2. `PrecisionHUD` / 精密 HUD 卡片

Use for metrics, comparisons, workflow steps, status cards, and engineering-like explanations.

用于指标、对比、流程步骤、状态卡、工程感解释。

Source file:

源码：

```text
src/video-overlay-kit/examples/StyleVariantCompositions.tsx
references/style-snapshots/precision-hud.png
```

Design behavior:

设计行为：

- Compact grids and panels.
- Thin borders, scan lines, metadata labels.
- Numeric/progress reveals where the transcript mentions outcomes.

- 紧凑网格和面板。
- 细描边、扫描线、元信息标签。
- 当字幕提到结果时使用数字或进度揭示。

### 3. `FrostedGlass` / 诊断玻璃卡片

Use for softer explanatory overlays, feature summaries, lightweight prompts, and less technical talking-head content.

用于更柔和的解释型 overlay、功能摘要、轻量提示和非强技术口播内容。

Source file:

源码：

```text
src/video-overlay-kit/examples/StyleVariantCompositions.tsx
references/style-snapshots/frosted-glass.png
```

Design behavior:

设计行为：

- Translucent cards.
- Calm slide/fade motion.
- More breathing room than HUD styles.

- 半透明卡片。
- 平缓滑入和淡入。
- 比 HUD 风格保留更多留白。

### 4. `TerminalAgent` / 终端 Agent HUD

Use when the narration mentions prompts, commands, generation, verification, export, automation, or agent execution.

当口播提到 prompt、命令、生成、验证、导出、自动化或 agent 执行时使用。

Source file:

源码：

```text
src/video-overlay-kit/examples/StyleVariantCompositions.tsx
references/style-snapshots/terminal-agent.png
```

Design behavior:

设计行为：

- Command-card structure.
- Type-in or row-completion rhythm.
- Short status labels and restrained terminal details.

- 命令卡结构。
- 打字输入或行完成节奏。
- 简短状态标签和克制的终端细节。

### 5. `DarkDiagnosticHUDTest` / 暗色诊断 HUD

Use for AI analysis, diagnostic review, scoring, traffic/report metaphors, workflow audits, and high-impact technical packaging.

用于 AI 分析、诊断复盘、评分、流量/报告隐喻、流程体检和强技术包装。

Source file:

源码：

```text
src/video-overlay-kit/examples/DarkDiagnosticHUDTest.tsx
public/assets/traffic-compass-bg.jpg
references/style-snapshots/dark-diagnostic-hud.png
```

Design behavior:

设计行为：

- Dark background treatment.
- Large diagnostic panels and score moments.
- Stronger cinematic HUD energy than the other four cases.

- 暗色背景处理。
- 大型诊断面板和评分节点。
- 比其他 4 个案例更强的电影感 HUD 能量。

## Choosing a Style / 选择风格

Default to `DarkDiagnosticHUDTest` (`dark-diagnostic-hud`) for generated packaging unless the user explicitly asks for another style. Inspect `references/style-snapshots/dark-diagnostic-hud.png` before drafting the packaging plan. Use the other styles only when the user chooses them or the requested tone clearly conflicts with the default.

生成包装动效时，除非用户明确要求其他风格，否则默认使用 `DarkDiagnosticHUDTest`（`dark-diagnostic-hud`）。生成包装方案前先查看 `references/style-snapshots/dark-diagnostic-hud.png`。只有在用户指定，或用户要求的调性明显不适合默认风格时，才切换到其他风格。

When an alternate style is needed, prefer the smallest style that communicates the point:

需要替代风格时，优先选择能表达重点的最小风格：

- Default packaging: `DarkDiagnosticHUDTest`.
- General emphasis: `OverlayDemo`.
- Soft explanation: `FrostedGlass`.
- Metrics or structured process: `PrecisionHUD`.
- Tool execution or AI workflow: `TerminalAgent`.
- Full diagnostic/report sequence: `DarkDiagnosticHUDTest`.

- 默认包装：`DarkDiagnosticHUDTest`。
- 通用强调：`OverlayDemo`。
- 柔和解释：`FrostedGlass`。
- 指标或结构化流程：`PrecisionHUD`。
- 工具执行或 AI 工作流：`TerminalAgent`。
- 完整诊断/报告段落：`DarkDiagnosticHUDTest`。

## Timing From Transcript / 基于字幕卡点

Use `normalized.words` for payoff words and `normalized.segments` for readable cards.

用 `normalized.words` 做关键词落点，用 `normalized.segments` 做可读卡片。

Rules:

规则：

1. Land the visual payoff on the spoken payoff word.
2. Start simple reveals 8-14 frames before the payoff word at 30fps.
3. Give readable cards at least 72 frames when possible.
4. Hold final state for at least 24 frames.
5. Keep one new visual idea at a time.

1. 视觉落点要对齐口播关键词。
2. 30fps 下，简单揭示动画提前 8-14 帧开始。
3. 可读卡片尽量至少停留 72 帧。
4. 最终状态至少保留 24 帧。
5. 同一时间只引入一个新的视觉重点。

## Diagnostic HUD Patterns / 诊断 HUD 模式

Read `references/diagnostic-hud-packaging-patterns.md` when the selected style is `DarkDiagnosticHUDTest` / `dark-diagnostic-hud`. The style reference controls the look; the diagnostic pattern library controls what card type to generate and what fields the plan must contain.

当已选风格是 `DarkDiagnosticHUDTest` / `dark-diagnostic-hud` 时，读取 `references/diagnostic-hud-packaging-patterns.md`。风格参考决定外观；诊断模式库决定生成什么卡片类型，以及方案必须包含哪些字段。

Rules:

规则：

1. Prefer evidence-and-diagnosis patterns over generic subtitle emphasis.
2. Use `sectionHeader`, `diagnosticChecklist`, `evidenceCard`, `stateComparison`, `workflowChain`, `identitySourceCard`, `repoCommandCard`, and `verdictChip` as the default pattern vocabulary.
3. Do not fabricate evidence. If there is no real screenshot, document, repo, chat, video frame, or matched asset, use a generated diagnostic summary card.
4. Keep all diagnostic styling local to overlays. Do not recreate the reference video's background treatment unless the user explicitly requests it.

1. 优先使用“证据 + 诊断”模式，而不是泛泛的字幕强调。
2. 默认模式词汇使用 `sectionHeader`、`diagnosticChecklist`、`evidenceCard`、`stateComparison`、`workflowChain`、`identitySourceCard`、`repoCommandCard` 和 `verdictChip`。
3. 不要伪造证据。如果没有真实截图、文档、仓库、聊天记录、视频帧或匹配素材，使用生成诊断摘要卡。
4. 诊断风格只作用于局部 overlay。除非用户明确要求，不复刻参考视频里的背景处理。

## Keyword Effects / 关键词动效

Read `references/keyword-animation-effects.md` when selecting concrete keyword animations. The chosen Remotion style controls geometry, typography, borders, color discipline, and motion character; the keyword-effect library controls the local emphasis type and optional `effectId`.

选择具体关键词动效时读取 `references/keyword-animation-effects.md`。已选 Remotion 风格决定几何、字号、描边、色彩克制和动效性格；关键词动效库决定局部强调类型和可选 `effectId`。

Rules:

规则：

1. Keep keyword effects consistent with the selected style; for the default `dark-diagnostic-hud`, prefer restrained modular cards, kinetic type cards, mouse-click callouts, short terminal tags, comparison swaps, and orbit-flow connectors.
2. Use keyword effects on a few payoff words only, not as continuous subtitle animation.
3. Keep effects local to overlays and matched assets. Do not change the user's video layer or add background treatment unless the user explicitly asks.

1. 关键词动效必须贴合已选风格；默认 `dark-diagnostic-hud` 优先使用克制的模块卡片、动态关键词卡、鼠标点击标注、短终端标签、前后替换卡和环绕连线。
2. 关键词动效只用于少数重点词，不要把整条字幕连续动画化。
3. 动效只作用于 overlay 和匹配素材。除非用户明确要求，不要改动用户视频层或添加背景处理。

## Placement Rules / 摆放规则

Cards, keyword labels, and matched assets should prefer left side, right side, or upper-screen placement. Avoid the face, mouth, and subtitle safe zone before considering style polish.

卡片、关键词标签和匹配素材优先放左侧、右侧或上半区。先避开脸、嘴和字幕安全区，再考虑风格细节。

Rules:

规则：

1. Prefer `left`, `right`, `top-left`, `top-right`, or `upper-center` placements.
2. Keep bottom-center clear for subtitles unless subtitles are not present.
3. Do not cover the speaker's mouth during spoken payoff words.
4. Do not cover the speaker's face during high-emotion or eye-contact moments.
5. Do not place two new visual ideas in the same area at the same time.
6. If the video shows pointing, dragging, or underlining gestures, place the related animation or image near the gesture target when it remains safe.
7. If the gesture target conflicts with face, mouth, subtitle, or overlap safety, move to the nearest safe side or upper placement and keep the motion direction connected to the gesture.

1. 优先使用 `left`、`right`、`top-left`、`top-right` 或 `upper-center`。
2. 除非没有字幕，否则底部居中区域要留给字幕。
3. 口播关键词落点时不要遮住说话人的嘴。
4. 高情绪或看镜头的时刻不要遮住说话人的脸。
5. 同一区域同一时间不要出现两个新的视觉重点。
6. 如果画面出现指、拖、划线等手势，且安全区允许，相关动画或图片放在手势指向位置附近。
7. 如果手势指向位置和脸、嘴、字幕或重叠安全冲突，移到最近的安全侧边或上半区，并让动效方向保持和手势有关联。

## Remotion + React + GSAP / Remotion + React + GSAP

Use GSAP as a deterministic timeline helper inside Remotion. Build timelines from props/data and seek them from Remotion frame time; do not rely on real-time playback.

在 Remotion 里把 GSAP 当作确定性时间线工具使用。根据 props/data 构建 timeline，并用 Remotion frame time 去 seek；不要依赖实时播放。

Rules:

规则：

1. React owns composition structure and data mapping.
2. Remotion owns frame time, duration, fps, and render lifecycle.
3. GSAP owns local interpolation timelines only when they are scrubbed by Remotion frames.
4. Do not use CSS transitions, CSS animations, or CSS keyframes for render-critical motion.
5. Add Chinese comments for adjustable timing, placement, color, and text parameters.

1. React 负责 composition 结构和数据映射。
2. Remotion 负责帧时间、时长、fps 和渲染生命周期。
3. GSAP 只负责局部插值时间线，而且必须由 Remotion 帧驱动。
4. 不要用 CSS transition、CSS animation 或 CSS keyframes 承担关键渲染动效。
5. 对可调时间、位置、颜色和文案参数添加中文注释。

## Adaptation Rules / 改造规则

- Treat the reference project as read-only.
- Do not copy the whole reference project into the user's output.
- Do not register or expose reference compositions in the user's generated Remotion project.
- Keep the user's video layer visually unchanged by default; only add popup overlays unless the user explicitly approves background treatment.
- Do not add global progress bars, scan grids, dark scrims, backdrop images, or video filters by default.
- Create or adapt a separate user Remotion project.
- Add user-specific compositions in that separate user project.
- Preserve the chosen style's geometry, typography scale, border style, and motion character.
- Change text, timing, placement, and composition structure to fit the user's transcript.
- Add Chinese comments for adjustable timing, layout, color, and text parameters.

- 把参考工程当作只读资料。
- 不要把整个参考工程复制到用户输出目录。
- 不要在用户生成的 Remotion 工程里注册或暴露参考 composition。
- 默认保持用户视频层视觉不变；除非用户明确同意背景处理，否则只添加弹出卡片。
- 默认不要添加全局进度条、扫描网格、压暗蒙层、背景图或视频滤镜。
- 创建或改造独立的用户 Remotion 工程。
- 在独立用户工程里新增用户专属 composition。
- 保留所选风格的几何、字号层级、描边方式和动效性格。
- 根据用户字幕调整文案、时间、位置和组件组合。
- 对可调时间、布局、颜色、文案参数添加中文注释。
