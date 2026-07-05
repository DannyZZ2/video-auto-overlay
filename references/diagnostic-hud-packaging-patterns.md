# Diagnostic HUD Packaging Patterns / 诊断 HUD 包装生成规律

## Contents / 目录

- Purpose / 目的
- Core Principle / 核心原则
- Text Hierarchy / 文字层级
- Component Patterns / 组件模式
- Timing Rules / 时间规则
- Layout Rules / 布局规则
- Style Rules / 风格规则
- Plan Contract / 方案字段
- Selection Matrix / 选择矩阵
- Guardrails / 约束

## Purpose / 目的

Use these rules when the selected style is `DarkDiagnosticHUDTest` / `dark-diagnostic-hud`, or when the user asks for technical, diagnostic, evidence-driven, workflow, audit, report, or AI-agent packaging.

当已选风格是 `DarkDiagnosticHUDTest` / `dark-diagnostic-hud`，或用户需要技术感、诊断感、证据感、工作流、审计、报告、AI Agent 包装时，使用这些规则。

This file turns reference-video observations into reusable packaging logic. It is not an asset pack and does not require copying any source video frame.

本文件把参考视频里的观察结果转成可复用包装逻辑。它不是素材包，也不要求复制任何源视频画面。

## Core Principle / 核心原则

Do not animate subtitles. Build a small evidence-and-diagnosis system around the spoken idea:

不要把字幕做成动画。应围绕口播观点生成一个小型“证据 + 诊断”系统：

```text
spoken cue -> section label -> evidence or generated diagnostic card -> short verdict -> local keyword effect
口播 cue -> 栏目标签 -> 证据或生成诊断卡 -> 短判断 -> 局部关键词动效
```

The packaging text must extract meaning from the transcript. It must not restate the whole subtitle line.

包装文字必须从字幕里提炼含义，不要复述整句字幕。

## Text Hierarchy / 文字层级

Use this hierarchy for every packaging beat:

每个包装节点使用以下文字层级：

1. `sectionLabel`: English uppercase system label plus short Chinese title, such as `COMPLIANCE CHECK / 违规自查`.
2. `mainText`: 2-8 Chinese characters or 1-3 English words. This is the visual payoff.
3. `supportText`: 1-3 short facts, statuses, tags, filenames, scores, or fixes.
4. `evidenceHighlight`: only the important phrase, row, command, or result from a real source.
5. `subtitle`: keep the normal spoken subtitle separate at the bottom.

1. `sectionLabel`：英文大写系统标签 + 简短中文标题，例如 `COMPLIANCE CHECK / 违规自查`。
2. `mainText`：2-8 个中文字或 1-3 个英文词，是视觉落点。
3. `supportText`：1-3 条短事实、状态、标签、文件名、分数或修改建议。
4. `evidenceHighlight`：只标出真实来源里的关键短语、行、命令或结果。
5. `subtitle`：底部保留正常口播字幕，不和包装文字混在一起。

## Component Patterns / 组件模式

| patternType | Use When / 适用场景 | Visual Form / 画面形式 | Default Placement / 默认位置 |
|---|---|---|---|
| `sectionHeader` | New segment, new method, new phase / 新段落、新方法、新阶段 | Top-left English label + Chinese title + thin vertical accent / 左上英文标签 + 中文标题 + 细竖线 | `top-left` |
| `diagnosticChecklist` | Audit, risk, score, review, quality check / 审计、风险、评分、复盘、质检 | 3-5 rows: category, severity, fix / 3-5 行：类别、严重度、怎么改 | left side or side of evidence |
| `evidenceCard` | Real screenshot, document, chat, webpage, repo, terminal output exists / 有真实截图、文档、聊天、网页、仓库、终端输出 | Large rounded card with 1-2 highlighted areas / 大圆角证据卡 + 1-2 个局部高亮 | center-right or right |
| `stateComparison` | Before/after, wrong/right, risk/fix / 前后对比、错误到正确、风险到修正 | Red old state -> arrow -> green new state / 红色旧状态 -> 箭头 -> 绿色新状态 | left, upper, or beside evidence |
| `workflowChain` | Steps, agent flow, automation, pipeline / 步骤、Agent 流程、自动化、链路 | 3-5 vertical or horizontal nodes with moving glow point / 3-5 个节点 + 移动发光点 | left or right side |
| `identitySourceCard` | Source, author, repo, license, account, credit / 来源、作者、仓库、协议、账号、致谢 | Avatar/icon + name + role + trust tags / 头像或图标 + 名称 + 身份 + 可信标签 | side safe area |
| `repoCommandCard` | Code, command, prompt, install, API key, model call / 代码、命令、prompt、安装、API key、模型调用 | Compact terminal/repo card, one-line command or status / 紧凑终端或仓库卡，单行命令或状态 | side or upper safe area |
| `verdictChip` | Quick conclusion, pass/fail, score, warning / 快速结论、通过失败、分数、提醒 | Small pill or badge with semantic color / 语义色小胶囊或徽章 | near the related card |

## Timing Rules / 时间规则

1. Add one new packaging idea every 3-6 seconds at most.
2. Hold large `evidenceCard` panels for 6-12 seconds when the audience needs to read.
3. Hold small chips, verdicts, and keyword cards for 45-90 frames at 30fps.
4. Start simple reveals 8-14 frames before the spoken payoff word.
5. Let related cards coexist until the semantic group ends: sentence end, pause, list end, comparison completion, or workflow completion.
6. Do not clear a related card just because the next related card appears.

1. 最多每 3-6 秒引入一个新的包装点。
2. 大型 `evidenceCard` 如果需要观众阅读，保留 6-12 秒。
3. 小胶囊、判断标签、关键词卡在 30fps 下保留 45-90 帧。
4. 简单揭示动画提前口播关键词 8-14 帧开始。
5. 相关卡片共存到语义组结束：句尾、停顿、清单结束、对比完成或工作流完成。
6. 不要因为后一张相关卡片出现，就立刻清掉前一张相关卡片。

## Layout Rules / 布局规则

1. Keep `sectionHeader` fixed at top-left unless that area is unsafe.
2. Keep bottom-center clear for subtitles.
3. Put large `evidenceCard` panels on the right or center-right when the speaker is on the left/center.
4. Put `diagnosticChecklist` beside or partially overlapping the evidence card, but never over the face, mouth, or subtitle.
5. Prefer side and upper placements for speaking-head footage.
6. If the speaker points, drags, or underlines, place the related card near the gesture target only when safe.

1. 除非左上不安全，否则 `sectionHeader` 固定左上。
2. 底部中间留给字幕。
3. 人物在左侧或中间时，大型 `evidenceCard` 放右侧或中右。
4. `diagnosticChecklist` 放在证据卡旁边或轻微叠在证据卡边缘，但不能遮脸、嘴或字幕。
5. 口播画面优先使用侧边和上半区。
6. 如果人物有指、拖、划线等手势，且安全区允许，把相关卡片放到手势目标附近。

## Style Rules / 风格规则

Use local overlay styling only. Do not modify the underlying video unless the user explicitly asks.

只使用局部 overlay 样式。除非用户明确要求，不修改底色视频画面。

- Neutral/system: blue or cyan.
- Success/output/compliant: green.
- Risk/error/non-compliant: red.
- Credit/source/warning: yellow.
- Use dark translucent panels, 1px semantic borders, soft glow, small uppercase English labels, and bold Chinese payoff text.
- Keep one dominant accent plus one semantic exception color in the same beat.

- 中性/系统：蓝色或青色。
- 成功/输出/合规：绿色。
- 风险/错误/不合规：红色。
- 致谢/来源/提醒：黄色。
- 使用深色半透明面板、1px 语义描边、柔和发光、小号英文大写标签和中文粗体落点文字。
- 同一个包装节点里只使用一个主强调色，加一个必要的语义例外色。

## Plan Contract / 方案字段

Every `$video-use` packaging beat that uses these patterns must include:

每个使用这些模式的 `$video-use` 包装节点必须包含：

```json
{
  "patternType": "diagnosticChecklist | evidenceCard | stateComparison | workflowChain | identitySourceCard | repoCommandCard | verdictChip | sectionHeader",
  "timeRange": "00:00.00-00:00.00",
  "transcriptCue": "spoken keyword or segment",
  "sectionLabel": "ENGLISH LABEL / 中文栏目",
  "mainText": "short visual payoff",
  "supportText": ["short item 1", "short item 2"],
  "evidenceSource": "real asset/video frame/user-provided source, or generated-diagnostic-card",
  "effectId": "optional keyword-animation effectId",
  "placement": "left | right | top-left | top-right | center-right | upper-center",
  "animation": "entry, hold, emphasis, exit",
  "safety": "face/mouth/subtitle/overlap reasoning",
  "qaFrames": ["start", "landing", "midHold", "exit"]
}
```

## Selection Matrix / 选择矩阵

| Transcript Semantics / 字幕语义 | Prefer / 优先使用 |
|---|---|
| audit, check, score, review / 自查、评分、复盘、体检 | `diagnosticChecklist`, `verdictChip`, `evidenceCard` |
| wrong to right, replace, fix / 错误到正确、替换、修正 | `stateComparison`, `native.comparisonSwap` |
| workflow, automation, agent, pipeline / 工作流、自动化、Agent、链路 | `workflowChain`, `native.orbitFlow` |
| repo, open source, license, code / 仓库、开源、协议、代码 | `repoCommandCard`, `identitySourceCard` |
| prompt, command, install, execute / prompt、命令、安装、执行 | `repoCommandCard`, `native.miniTerminalTag`, `native.mouseClickCallout` |
| source, credit, case, user proof / 来源、致谢、案例、用户证据 | `identitySourceCard`, `evidenceCard` |

## Guardrails / 约束

- Do not fabricate screenshots, chat messages, repository names, filenames, scores, or user evidence.
- If no real evidence asset exists, use `generated-diagnostic-card` and label it as a generated summary, not proof.
- Do not inspect asset image content for matching; use filename/subtitle matching from `asset-manifest.json`.
- Do not use a large evidence card when it would cover the speaker's face, mouth, or subtitles.
- Do not create whole-sentence hero text. Extract short labels.
- Do not add global progress bars, full-screen scan grids, dark scrims, backdrop images, video filters, or brightness changes by default.
- Do not let a diagnostic overlay become denser than the viewer can read in the planned hold time.

- 不要伪造截图、聊天记录、仓库名、文件名、分数或用户证据。
- 如果没有真实证据素材，使用 `generated-diagnostic-card`，并标成生成摘要，不要伪装成证据。
- 素材匹配时不要检查图片内容；沿用 `asset-manifest.json` 的文件名/字幕匹配。
- 如果大型证据卡会遮住脸、嘴或字幕，就不要使用。
- 不要做整句大字标题，只提炼短标签。
- 默认不要添加全局进度条、全屏扫描网格、压暗蒙层、背景图、视频滤镜或亮度变化。
- 诊断 overlay 的信息密度不能超过计划停留时间内观众能读完的范围。
