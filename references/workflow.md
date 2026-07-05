# Workflow Contract / 工作流契约

## Contents / 目录

- Purpose / 目的
- User Branch / 用户分支
- Normalize / 归一化
- Normalized JSON / 归一化 JSON
- Remotion Style / Remotion 风格
- Diagnostic HUD Packaging Patterns / 诊断 HUD 包装模式
- Keyword Animation Effects / 关键词动效库
- Asset Manifest / 素材清单
- Packaging Plan / 包装方案
- Implementation Prompt / 实现 Prompt
- Remotion Project / Remotion 工程
- Pre-Studio Keyframe QA / Studio 前关键帧 QA
- Completion Prompt / 完成提示
- Failure Handling / 失败处理

## Purpose / 目的

This skill keeps upstream `video-use` untouched. It treats `video-use` as the source of editing, transcription, EDL, subtitles, and preview/final video artifacts, then converts those artifacts into a stable JSON contract for Remotion generation.

本 skill 不修改上游 `video-use`。它把 `video-use` 作为剪辑、转写、EDL、字幕、预览/成片产物来源，然后把这些产物转换成稳定 JSON，供 Remotion 生成使用。

## User Branch / 用户分支

Ask once:

只问一次：

```text
是否需要我先帮你剪辑视频？如果需要，请提供原始视频；如果不需要，请提供已经剪好的视频。
```

If the user needs editing:

如果用户需要剪辑：

1. Use upstream `$video-use`.
2. Read `references/fine-cut-rules.md`.
3. Ask for raw footage.
4. Pass the fine-cut brief to `$video-use`.
5. Follow `video-use` confirmation rules before cutting.
6. Let `video-use` produce `<videos_dir>/edit/final.mp4` or `preview.mp4`, `edl.json`, transcripts, and subtitles.

1. 使用上游 `$video-use`。
2. 读取 `references/fine-cut-rules.md`。
3. 让用户提供原始素材。
4. 把精剪 brief 交给 `$video-use`。
5. 按 `video-use` 的规则先确认剪辑策略，再执行剪辑。
6. 让 `video-use` 生成 `<videos_dir>/edit/final.mp4` 或 `preview.mp4`、`edl.json`、转写和字幕。

If the user does not need editing:

如果用户不需要剪辑：

1. Use upstream `$video-use` only for word-level transcription.
2. Ask for the prepared video.
3. Ensure `<videos_dir>/edit/transcripts/*.json` and `<videos_dir>/edit/subtitles/*.srt` exist.
4. Do not create fake EDL unless a real edit was performed.

1. 只使用上游 `$video-use` 做词级转写。
2. 让用户提供已经剪好的视频。
3. 确认 `<videos_dir>/edit/transcripts/*.json` 和 `<videos_dir>/edit/subtitles/*.srt` 存在。
4. 如果没有真实剪辑，不要伪造 EDL。

## Normalize / 归一化

Run:

运行：

```bash
python3 <skill-dir>/scripts/normalize-video-use-output.py --edit-dir <videos_dir>/edit
```

Optional prepared/final video override:

可选地指定成片路径：

```bash
python3 <skill-dir>/scripts/normalize-video-use-output.py --edit-dir <videos_dir>/edit --video /abs/path/final.mp4
```

Default output:

默认输出：

```text
<videos_dir>/edit/video-auto-overlay/normalized.json
```

## Normalized JSON / 归一化 JSON

The Remotion step must depend on this contract, not on `video-use` internals.

Remotion 步骤必须依赖这个契约，而不是依赖 `video-use` 内部实现。

```json
{
  "version": 1,
  "producer": "video-auto-overlay",
  "sourceSystem": "video-use",
  "editDir": "/abs/path/edit",
  "videoPath": "/abs/path/final.mp4",
  "timeline": "output",
  "duration": 42.3,
  "words": [
    {
      "text": "示例",
      "start": 1.2,
      "end": 1.46,
      "timeline": "output",
      "source": "C0103"
    }
  ],
  "segments": [
    {
      "text": "这是一段字幕",
      "start": 1.2,
      "end": 3.4,
      "timeline": "output"
    }
  ],
  "edl": {}
}
```

`timeline` meanings:

`timeline` 含义：

- `output`: times are mapped onto the final edited video.
- `output`：时间已经映射到最终剪辑成片。
- `source`: times are still on the source/prepared video timeline.
- `source`：时间仍在源视频或已剪好视频的时间线上。

## Remotion Style / Remotion 风格

Confirm the visual style before designing the Remotion output. Default to `DarkDiagnosticHUDTest` (`dark-diagnostic-hud`) unless the user explicitly chooses another bundled style.

设计 Remotion 输出前，先确认视觉风格。除非用户明确选择其他内置风格，否则默认使用 `DarkDiagnosticHUDTest`（`dark-diagnostic-hud`）。

Do not draft the packaging plan until the style is known.

风格未确定前，不要生成包装方案。

## Diagnostic HUD Packaging Patterns / 诊断 HUD 包装模式

Before asking `$video-use` to draft the packaging plan, read `references/diagnostic-hud-packaging-patterns.md`.

让 `$video-use` 生成包装方案前，读取 `references/diagnostic-hud-packaging-patterns.md`。

Use this file as the default card/text/evidence generation library for `DarkDiagnosticHUDTest` / `dark-diagnostic-hud`.

把这个文件作为 `DarkDiagnosticHUDTest` / `dark-diagnostic-hud` 的默认卡片、文字和证据生成库。

Pattern rules:

模式规则：

1. Build packaging as evidence-and-diagnosis overlays, not animated subtitles.
2. Choose a `patternType` for each packaging beat: `sectionHeader`, `diagnosticChecklist`, `evidenceCard`, `stateComparison`, `workflowChain`, `identitySourceCard`, `repoCommandCard`, or `verdictChip`.
3. Generate short packaging text using the hierarchy: `sectionLabel`, `mainText`, `supportText`, `evidenceHighlight`, normal bottom subtitle.
4. Use `evidenceCard` only when a real source exists: provided asset, matched project asset, real video frame, or user-provided screenshot/document. If no evidence source exists, use `generated-diagnostic-card` and label it as a generated summary, not proof.
5. Do not fabricate screenshots, chat messages, repository names, filenames, scores, or source evidence.

1. 把包装做成“证据 + 诊断” overlay，不要做成字幕动画。
2. 每个包装节点选择一个 `patternType`：`sectionHeader`、`diagnosticChecklist`、`evidenceCard`、`stateComparison`、`workflowChain`、`identitySourceCard`、`repoCommandCard` 或 `verdictChip`。
3. 按 `sectionLabel`、`mainText`、`supportText`、`evidenceHighlight`、底部普通字幕的层级生成短包装文字。
4. 只有存在真实来源时才使用 `evidenceCard`：用户提供素材、匹配到的项目素材、真实视频帧，或用户提供的截图/文档。没有证据来源时，使用 `generated-diagnostic-card`，并标成生成摘要，不要伪装成证据。
5. 不要伪造截图、聊天记录、仓库名、文件名、分数或来源证据。

## Keyword Animation Effects / 关键词动效库

Before asking `$video-use` to draft the packaging plan, read `references/keyword-animation-effects.md`.

让 `$video-use` 生成包装方案前，读取 `references/keyword-animation-effects.md`。

Use this file as the default effect-choice library for spoken payoff words, short keyword cards, and local interaction beats. It is not a mandate to animate every keyword.

把这个文件作为口播重点词、短关键词卡片和局部交互节点的默认动效选择库。它不是“每个关键词都必须动”的强制规则。

Effect selection rules:

动效选择规则：

1. Choose effects from the library by subtitle semantics, selected Remotion style, and safe placement.
2. Prefer the `effectId` specs in the library when a Remotion-native effect fits.
3. Bind each effect to `normalized.words` payoff timing; use `normalized.segments` only for readable card lifetimes.
4. Keep effects local to cards, keywords, connectors, or matched assets. Do not add global progress bars, background treatments, scan grids, dark scrims, backdrop images, or video filters by default.
5. If a line/path/arrow/connector effect is used, include the moving glow point rule from the library in the plan and implementation prompt.

1. 按字幕语义、已选 Remotion 风格和安全摆放位置，从库里选择动效。
2. 如果 Remotion 原生效果适配，优先使用库中的 `effectId` 规范。
3. 每个动效绑定到 `normalized.words` 的重点词时间；`normalized.segments` 只用于可读卡片生命周期。
4. 动效只作用于卡片、关键词、连线或匹配素材。默认不要添加全局进度条、背景处理、扫描网格、压暗蒙层、背景图或视频滤镜。
5. 如果使用线条、路径、箭头或连线类动效，包装方案和实现 prompt 必须包含库里的移动发光点规则。

## Asset Manifest / 素材清单

Before asking `$video-use` to draft the packaging plan, build the project asset manifest:

让 `$video-use` 生成包装方案前，先生成项目素材清单：

```bash
python3 <skill-dir>/scripts/collect-project-assets.py \
  --workspace-root <current-codex-project-root> \
  --normalized-json <videos_dir>/edit/video-auto-overlay/normalized.json \
  -o <videos_dir>/edit/video-auto-overlay/asset-manifest.json
```

Use `references/asset-matching-rules.md` as the contract. The default asset root is the current Codex project/workspace, not the uploaded video's folder. Only add `--extra-root` when the user explicitly provides an extra asset path.

以 `references/asset-matching-rules.md` 作为契约。默认素材根目录是当前 Codex 项目/工作区，不是上传视频所在文件夹。只有用户明确提供额外素材路径时，才添加 `--extra-root`。

## Packaging Plan / 包装方案

After the style is confirmed and `asset-manifest.json` exists, use upstream `$video-use` to draft a packaging plan from:

风格确认且 `asset-manifest.json` 已存在后，使用上游 `$video-use` 基于以下输入生成包装方案：

- `normalized.videoPath`
- `normalized.words`
- `normalized.segments`
- `normalized.edl`
- `asset-manifest.json`
- selected style, defaulting to `DarkDiagnosticHUDTest` / `dark-diagnostic-hud`
- selected packaging patterns from `references/diagnostic-hud-packaging-patterns.md`
- selected keyword effects from `references/keyword-animation-effects.md`
- on-demand visual checks from the video for face, mouth, subtitle safe zone, and gestures

- `normalized.videoPath`
- `normalized.words`
- `normalized.segments`
- `normalized.edl`
- `asset-manifest.json`
- 已选风格，默认 `DarkDiagnosticHUDTest` / `dark-diagnostic-hud`
- 来自 `references/diagnostic-hud-packaging-patterns.md` 的已选包装模式
- 来自 `references/keyword-animation-effects.md` 的已选关键词动效
- 针对脸、嘴、字幕安全区和手势的按需画面检查

The `$video-use` output must be a plain packaging plan, not implementation code. It must include:

`$video-use` 的输出必须是普通包装方案，不是实现代码。方案必须包含：

- chosen style and why it fits
- key beats with start/end times
- chosen `patternType`, text hierarchy, and evidence source for every packaging beat
- card/keyword/image moments tied to `normalized.words` or `normalized.segments`
- chosen keyword effect name or `effectId`, with entry/hold/emphasis/exit behavior
- matched asset usage or reason for skipping each relevant match
- placement plan with safe-zone reasoning
- gesture-aware placements when pointing, dragging, or underlining is visible
- keyframes that must be checked before Studio preview

- 已选风格和选择理由
- 带 start/end 时间的关键节奏点
- 每个包装节点选择的 `patternType`、文字层级和证据来源
- 绑定到 `normalized.words` 或 `normalized.segments` 的卡片、关键词、图片节点
- 选择的关键词动效名称或 `effectId`，并说明入场、停留、强调和退场行为
- 匹配素材的使用方式，或跳过相关匹配的理由
- 带安全区理由的摆放方案
- 当画面中出现指、拖、划线等手势时的手势感知摆放
- Studio 预览前必须检查的关键帧

Placement rules are mandatory:

摆放规则是强约束：

- Prefer left side, right side, or upper-screen placements for cards and keywords.
- Avoid covering faces, mouths, and subtitle safe zones.
- Keep subtitles readable even when a card has high priority.
- If pointing, dragging, or underlining gestures are detected, place the related animation or image near the gesture target when it does not violate safe zones.
- If the gesture target conflicts with face, mouth, subtitle, or overlap safety, choose the nearest safe side/upper placement and explain the compromise.

- 卡片和关键词优先放左侧、右侧或上半区。
- 避免遮挡脸、嘴和字幕安全区。
- 即使卡片优先级高，也必须保证字幕可读。
- 如果检测到指、拖、划线等手势，且不违反安全区，相关动画或图片优先放在手势指向位置附近。
- 如果手势指向位置和脸、嘴、字幕或重叠安全冲突，选择最近的安全侧边/上半区，并说明取舍。

## Implementation Prompt / 实现 Prompt

Rewrite the packaging plan into a Remotion-executable implementation prompt before writing code. Ask the user to confirm this prompt. Do not create or edit the Remotion composition until the user confirms.

写代码前，先把包装方案改写成 Remotion 可执行的实现 prompt，并让用户确认。用户确认前，不要创建或编辑 Remotion composition。

The implementation prompt must specify:

实现 prompt 必须说明：

- target Remotion project path
- composition id, duration, fps, width, and height
- selected style reference file(s) under `references/remotion-style-examples/`
- selected packaging pattern entries and `patternType` values from `references/diagnostic-hud-packaging-patterns.md`
- selected keyword-effect library entries and `effectId` values from `references/keyword-animation-effects.md`
- data inputs: `normalized.json`, `asset-manifest.json`, video path, subtitle source
- timeline events with frame ranges
- placement rectangles or placement presets
- gesture-aware placement notes
- React component structure
- GSAP timeline behavior
- QA keyframes to extract

- 目标 Remotion 工程路径
- composition id、时长、fps、宽高
- `references/remotion-style-examples/` 下的已选风格参考文件
- `references/diagnostic-hud-packaging-patterns.md` 中已选包装模式条目和 `patternType`
- `references/keyword-animation-effects.md` 中已选关键词动效条目和 `effectId`
- 数据输入：`normalized.json`、`asset-manifest.json`、视频路径、字幕来源
- 带 frame 范围的时间线事件
- 摆放矩形或摆放预设
- 手势感知摆放说明
- React 组件结构
- GSAP 时间线行为
- 需要抽取的 QA 关键帧

Use Remotion + React + GSAP after user confirmation. Keep GSAP deterministic: build timelines from data and seek/scrub them from Remotion frame time. Do not rely on real-time playback, CSS transitions, CSS animations, or CSS keyframes for render-critical motion.

用户确认后，使用 Remotion + React + GSAP 生成包装合成。GSAP 必须是确定性的：根据数据构建 timeline，并用 Remotion frame time 去 seek/scrub。不要依赖实时播放、CSS transition、CSS animation 或 CSS keyframes 实现影响渲染的动效。

## Remotion Project / Remotion 工程

Read-only style reference:

只读风格参考：

```text
<skill-dir>/references/remotion-style-examples/
```

Do not copy this directory into the user's output. It exists to inspect the five working styles, including geometry, typography scale, color treatment, component structure, timing, and motion character.

不要把这个目录复制到用户输出目录。它只用于查看 5 个可运行风格案例，包括几何结构、字号层级、色彩处理、组件结构、时间设计和动效性格。

Create or adapt the user's Remotion project in:

在这里创建或改造用户自己的 Remotion 工程：

```text
<videos_dir>/edit/video-auto-overlay/remotion/
```

Then build the user project:

然后构建用户工程：

1. Create a fresh Remotion project or adapt an existing user-provided Remotion project.
2. Add `normalized.json` as a local data file or importable JSON.
3. Add `asset-manifest.json` as a local data file or importable JSON.
4. Add a new composition for the user's video from the confirmed implementation prompt.
5. Use `DarkDiagnosticHUDTest` (`dark-diagnostic-hud`) as the default style, unless another style was explicitly selected.
6. Recreate only the needed visual language from the selected reference example; do not wholesale-copy the reference project.
7. Do not register, expose, or copy the five reference compositions into the user's project. The generated project should include only user-facing composition(s).
8. Keep the video layer visually unchanged by default: no global progress bar, background treatment, scan grid, dark scrim, backdrop image, video filter, or brightness/saturation/contrast change unless the user explicitly requests it.
9. Set composition duration from `normalized.duration`.
10. Use `normalized.words` for word-accurate payoff timing and `normalized.segments` for readable popup cards.
11. Implement selected packaging patterns from `references/diagnostic-hud-packaging-patterns.md` only where the confirmed prompt calls for them.
12. Implement selected keyword effects from `references/keyword-animation-effects.md` only where the confirmed prompt calls for them.
13. Use matched assets at their matching keyword cue only when they do not block the face, mouth, subtitles, or approved style.
14. Extract QA keyframes and fix issues before Studio preview.
15. Start Studio with `npm run studio`; do not render final video by default.

1. 新建一个干净的 Remotion 工程，或改造用户明确提供的已有 Remotion 工程。
2. 把 `normalized.json` 加成本地数据文件或可 import 的 JSON。
3. 把 `asset-manifest.json` 加成本地数据文件或可 import 的 JSON。
4. 根据用户已确认的实现 prompt 新增用户视频 composition。
5. 除非已明确选择其他风格，否则默认用 `DarkDiagnosticHUDTest`（`dark-diagnostic-hud`）作为风格。
6. 只复刻已选参考案例中必要的视觉语言；不要整包复制参考工程。
7. 不要把 5 个参考 composition 注册、暴露或复制进用户项目。生成项目里只包含用户要看的 composition。
8. 默认保持视频层视觉不变：除非用户明确要求，不添加全局进度条、背景处理、扫描网格、压暗蒙层、背景图、视频滤镜或亮度/饱和度/对比度变化。
9. 根据 `normalized.duration` 设置 composition 时长。
10. 用 `normalized.words` 做词级卡点，用 `normalized.segments` 做可读弹出卡片。
11. 只实现已确认 prompt 中调用的 `references/diagnostic-hud-packaging-patterns.md` 包装模式。
12. 只实现已确认 prompt 中调用的 `references/keyword-animation-effects.md` 关键词动效。
13. 只在不挡脸、不挡嘴、不挡字幕且不破坏已确认风格时，在匹配关键词 cue 使用匹配素材。
14. 抽取 QA 关键帧并修复问题后再打开 Studio。
15. 用 `npm run studio` 启动 Studio；默认不要渲染最终视频。

## Pre-Studio Keyframe QA / Studio 前关键帧 QA

Before opening Remotion Studio, extract still frames from the generated composition. At minimum, extract:

打开 Remotion Studio 前，先从生成的 composition 抽取静帧。至少抽取：

- first frame and last frame
- every overlay/card/image start frame
- every overlay/card/image landing frame
- every evidence card and diagnostic checklist readable frame
- every keyword effect trigger frame and visual payoff frame
- a mid-hold frame for every readable card
- every exit frame when an element leaves
- gesture cue frames when gesture-aware placement is used

- 第一帧和最后一帧
- 每个 overlay/卡片/图片的开始帧
- 每个 overlay/卡片/图片的落位帧
- 每个证据卡和诊断清单的可读帧
- 每个关键词动效的触发帧和视觉落点帧
- 每个可读卡片的中段停留帧
- 每个元素离场帧
- 使用手势感知摆放时的手势 cue 帧

Inspect the frames before opening Studio:

打开 Studio 前检查这些帧：

- no face occlusion
- no mouth occlusion
- no subtitle occlusion
- no incoherent element overlap
- no blank frame
- no off-canvas or misplaced element
- evidence cards are backed by real sources or clearly labeled as generated summaries
- matched assets appear only at intended keyword cues
- keyword effects appear only at confirmed payoff words and do not animate unrelated words
- gesture-aware elements sit near the intended gesture target without violating safe zones

- 不遮脸
- 不遮嘴
- 不遮字幕
- 元素之间没有不合理重叠
- 没有空白帧
- 没有元素出画或错位
- 证据卡有真实来源，或明确标成生成摘要
- 匹配素材只在预期关键词 cue 出现
- 关键词动效只在已确认的重点词出现，不要带动无关词
- 手势感知元素靠近预期手势目标，且不违反安全区

If any check fails, fix the Remotion code, extract keyframes again, and repeat. Cap at three QA passes; if issues remain, report the exact residual problems before showing Studio.

如果检查失败，先修复 Remotion 代码，再重新抽关键帧。最多进行三轮 QA；如果仍有问题，打开 Studio 前先明确报告残留问题。

## Completion Prompt / 完成提示

Never end a successful stage with only file paths and verification. Always include a concise next-step prompt.

不要只给文件路径和验证结果就结束一个成功阶段。每次都要给出简洁的下一步提示。

After a fine-cut preview, ask:

精剪预览完成后，询问：

```text
下一步你要我继续做哪一项：1. 你先预览，我根据反馈调整剪辑；2. 继续生成 dark-diagnostic-hud 包装动效方案；3. 导出/定稿当前剪辑版本。
```

After a packaging plan, ask the user to confirm or revise the Remotion/React/GSAP implementation prompt before writing code.

包装方案完成后，要求用户确认或修改 Remotion/React/GSAP 实现 prompt，再写代码。

After Studio opens, ask whether to adjust the animation plan, revise placement/timing, or proceed to final render.

Studio 打开后，询问是否调整动效方案、修改位置/时间，或进入最终渲染。

## Failure Handling / 失败处理

- If `transcripts/*.json` is missing, return to upstream `$video-use` and run word-level transcription.
- If `edl.json` is missing, treat the prepared video as a single source timeline.
- If `master.srt` is missing after editing, use mapped word timings to build overlay beats.
- If the source video path is unknown, ask the user for the prepared or final video path before building Remotion.
- If `asset-manifest.json` has no matches, continue with generated cards and do not infer image meaning.
- If an evidence source is missing, use a generated diagnostic card and do not fake screenshots, scores, chat records, or repository data.
- If `$video-use` cannot provide safe-zone or gesture confidence, sample more keyframes manually and keep placements on the left, right, or upper safe areas.
- If the user rejects the implementation prompt, revise the prompt first; do not start Remotion code generation.
- If keyframe QA fails three times, stop and report the remaining occlusion, overlap, blank-frame, or placement issue.

- 如果缺少 `transcripts/*.json`，回到上游 `$video-use` 执行词级转写。
- 如果缺少 `edl.json`，把已剪好的视频当作单一源时间线处理。
- 如果剪辑后缺少 `master.srt`，使用映射后的词级时间生成 overlay 节奏。
- 如果无法确定视频路径，先让用户提供已剪好或最终视频路径，再生成 Remotion。
- 如果 `asset-manifest.json` 没有匹配素材，继续使用生成卡片，不要推断图片含义。
- 如果缺少证据来源，使用生成诊断卡，不要伪造截图、分数、聊天记录或仓库数据。
- 如果 `$video-use` 无法给出安全区或手势置信度，就手动多抽关键帧，并把元素放在左侧、右侧或上半区安全位置。
- 如果用户不认可实现 prompt，先修订 prompt；不要开始生成 Remotion 代码。
- 如果关键帧 QA 三轮后仍失败，停止并报告剩余的遮挡、重叠、空白帧或错位问题。
