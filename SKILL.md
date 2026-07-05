---
name: video-auto-overlay
description: Orchestrate raw or prepared video into word-timed Remotion overlay animations by using the upstream video-use skill for optional fine-cut editing, word-level transcription, packaging-plan drafting from video/subtitles/assets/keyword-effect references, normalizing video-use outputs, collecting current-project assets by filename-only subtitle keyword matching, rewriting the confirmed plan into a Remotion/React/GSAP implementation prompt, and using five bundled Remotion examples as read-only style references. Use when the user asks for AI video packaging, Remotion overlay animation, keyword animation effects, subtitle-timed motion graphics, talking-head enhancement, fine-cut talking-head cleanup, project-asset-aware video packaging, or a repeatable workflow from video-use transcript/EDL to Remotion Studio preview with pre-Studio keyframe QA.
---

# Video Auto Overlay / 视频自动包装动效

## Core Contract / 核心契约

Use upstream `video-use` as an external dependency. Do not patch, fork, or edit it during this workflow.

把上游 `video-use` 当作外部依赖使用。执行本流程时不要修改、fork 或本地改写它。

This skill owns only six layers:

本 skill 只负责六层：

1. Conversation orchestration: ask whether the user needs editing.
2. Normalization: convert `video-use` artifacts into one stable JSON contract.
3. Asset manifest: collect current-project assets and match them to subtitle keywords by filename only.
4. Packaging plan: after style confirmation, read the keyword-effect library and use upstream `$video-use` to draft a video/subtitle/asset-aware packaging plan.
5. Implementation prompt: rewrite the user-confirmed packaging plan into an executable Remotion/React/GSAP prompt.
6. Remotion packaging and QA: use the bundled five-example Remotion project as a read-only style reference, create or adapt a separate user Remotion project with only the user's composition(s), extract keyframes, and pass QA before Studio preview.

1. 对话编排：询问用户是否需要剪辑。
2. 归一化：把 `video-use` 产物转换成稳定 JSON 契约。
3. 素材清单：收集当前项目素材，并只用文件名匹配字幕关键词。
4. 包装方案：确认风格后，读取关键词动效库，并使用上游 `$video-use` 基于视频、字幕和素材生成包装方案。
5. 实现 prompt：把用户确认后的包装方案改写成 Remotion/React/GSAP 可执行 prompt。
6. Remotion 包装与 QA：把内置 5 个案例工程作为只读风格参考，创建或改造只包含用户 composition 的独立 Remotion 工程，抽关键帧并通过 QA 后再开 Studio 预览。

## Workflow / 工作流

1. Ask the user whether editing is needed unless they already made it clear.
   - If editing is needed, read `references/fine-cut-rules.md`, request the raw video files, and use upstream `$video-use` for fine-cut editing and word-level transcription.
   - If editing is not needed, request the prepared video file and use upstream `$video-use` only for word-level transcription.
2. After `video-use` finishes, locate `<videos_dir>/edit/`.
3. Run `scripts/normalize-video-use-output.py --edit-dir <edit-dir>`.
4. Read `references/asset-matching-rules.md`, then run `scripts/collect-project-assets.py` against the current Codex project/workspace.
5. Read `references/workflow.md` before designing the Remotion output.
6. Read `references/remotion-style-guide.md`, confirm the visual style, and default to `DarkDiagnosticHUDTest` (`dark-diagnostic-hud`) unless the user explicitly asks for another style.
7. Read `references/keyword-animation-effects.md` before drafting the packaging plan; use it as the allowed/default keyword-effect library for spoken payoff words and local interaction beats.
8. Use upstream `$video-use` to draft a packaging plan from the video, subtitles, normalized timings, EDL, selected style, keyword-effect library, and `asset-manifest.json`.
9. Rewrite that plan into a Remotion/React/GSAP implementation prompt and ask the user to confirm it before generating any composition code.
10. Use `references/remotion-style-examples/` only as a read-only reference, then create or adapt the user's Remotion project to the confirmed implementation prompt. Do not register or include the five reference compositions in the user project.
11. Extract keyframes and verify face/mouth/subtitle safety, element overlap, blank frames, and placement before opening Studio.
12. Start Remotion Studio for preview only after QA passes. Do not render a final video by default.
13. Every completion message must include the next-step prompt: ask whether the user wants to review/adjust the cut, continue into packaging animation, or export/finalize.

1. 除非用户已经明确说明，否则先问用户是否需要剪辑。
   - 如果需要剪辑，先读 `references/fine-cut-rules.md`，让用户提供原始视频，并使用上游 `$video-use` 完成精剪和词级转写。
   - 如果不需要剪辑，让用户提供剪辑好的视频，并仅使用上游 `$video-use` 完成词级转写。
2. `video-use` 完成后，定位 `<videos_dir>/edit/`。
3. 运行 `scripts/normalize-video-use-output.py --edit-dir <edit-dir>`。
4. 读取 `references/asset-matching-rules.md`，然后对当前 Codex 项目/工作区运行 `scripts/collect-project-assets.py`。
5. 设计 Remotion 输出前读取 `references/workflow.md`。
6. 读取 `references/remotion-style-guide.md`，先确认视觉风格；除非用户明确指定其他风格，否则默认使用 `DarkDiagnosticHUDTest`（`dark-diagnostic-hud`）。
7. 生成包装方案前读取 `references/keyword-animation-effects.md`；把它作为口播重点词和局部交互节点的默认/允许关键词动效库。
8. 使用上游 `$video-use` 基于视频、字幕、归一化时间、EDL、已选风格、关键词动效库和 `asset-manifest.json` 生成包装方案。
9. 把包装方案改写成 Remotion/React/GSAP 可执行 prompt，并在生成任何 composition 代码前请用户确认。
10. 只把 `references/remotion-style-examples/` 当作只读参考，然后基于已确认的实现 prompt 创建或改造用户自己的 Remotion 工程。不要在用户工程里注册或包含 5 个参考 composition。
11. 打开 Studio 前先抽关键帧，检查遮脸/遮嘴/遮字幕、元素重叠、空白帧和错位。
12. QA 通过后再启动 Remotion Studio 让用户预览。默认不要渲染最终视频。
13. 每次完成阶段性产物后，回复里必须给下一步提示：询问用户要预览/调整剪辑、继续包装动效，还是导出/定稿。

## Resource Map / 资源地图

- `scripts/normalize-video-use-output.py`: read-only normalizer for upstream `video-use` outputs.
- `scripts/collect-project-assets.py`: filename-only current-project asset manifest builder.
- `references/workflow.md`: output contract, expected directories, and failure handling.
- `references/fine-cut-rules.md`: default talking-head fine-cut brief to pass into upstream `$video-use`.
- `references/asset-matching-rules.md`: project asset collection and subtitle keyword matching rules.
- `references/remotion-style-guide.md`: the five bundled Remotion examples and when to use each style.
- `references/keyword-animation-effects.md`: keyword and local interaction effect library to pass into `$video-use` packaging-plan drafting.
- `references/remotion-style-examples/`: read-only Remotion reference project containing the five current style cases.

- `scripts/normalize-video-use-output.py`：只读取上游 `video-use` 产物的归一化脚本。
- `scripts/collect-project-assets.py`：只基于文件名的当前项目素材清单生成脚本。
- `references/workflow.md`：输出契约、目录约定和失败处理。
- `references/fine-cut-rules.md`：传给上游 `$video-use` 的默认口播精剪 brief。
- `references/asset-matching-rules.md`：项目素材收集和字幕关键词匹配规则。
- `references/remotion-style-guide.md`：5 个内置 Remotion 案例及适用场景。
- `references/keyword-animation-effects.md`：传给 `$video-use` 生成包装方案时使用的关键词和局部交互动效库。
- `references/remotion-style-examples/`：只读 Remotion 参考工程，包含当前 5 个风格案例。

## Guardrails / 约束

- Do not modify upstream `video-use`; if a needed field is missing, adapt the normalizer or ask the user for the missing artifact.
- Do not depend on local-only changes under `~/.codex/skills/video-use`.
- Do not write secrets, API keys, or `.env` files into generated Remotion projects.
- Do not copy the bundled reference project as the user's output. Create or adapt a separate Remotion project and use the reference project only for style, component, timing, and layout guidance.
- Do not register, expose, or copy bundled reference compositions into the user's Remotion project. The Studio list for a generated project should show only user-facing composition(s).
- By default, keep the underlying video visually unchanged. Add popup overlays only; do not add global progress bars, background treatments, scan grids, dark scrims, backdrop images, color filters, or brightness changes unless the user explicitly asks for them.
- Treat `references/keyword-animation-effects.md` as an effect-choice library, not a mandate to animate every keyword. Use only a few payoff words, keep effects local, and never use keyword effects to justify changing the underlying video.
- Do not inspect image content, run OCR, classify image subjects, or infer semantics from pixels for asset matching.
- Do not generate Remotion composition code until the user confirms the packaging plan and implementation prompt.
- Prefer left, right, or upper-screen placements for cards and keywords; avoid faces, mouths, and subtitle safe zones.
- If visual inspection detects pointing, dragging, or underlining gestures, place related animation or matched assets near the gesture target when it remains safe.
- Do not open Remotion Studio until pre-Studio keyframe QA passes or unresolved issues are explicitly reported.
- Do not end after producing a preview without a next-step prompt.
- Use Chinese comments for adjustable Remotion parameters that users are likely to tune.

- 不要修改上游 `video-use`；如果缺字段，改 normalizer 或请用户提供缺失产物。
- 不要依赖 `~/.codex/skills/video-use` 里的本地私改。
- 不要把密钥、API Key 或 `.env` 写进生成的 Remotion 工程。
- 不要把内置参考工程复制成用户产物。应创建或改造独立 Remotion 工程，只把参考工程用于风格、组件、时间和布局参考。
- 不要把内置参考 composition 注册、暴露或复制进用户 Remotion 工程。生成项目的 Studio 列表默认只出现用户要看的 composition。
- 默认保持底色视频画面不变。只叠加弹出卡片；除非用户明确要求，不添加全局进度条、背景处理、扫描网格、压暗蒙层、背景图、视频滤镜或亮度变化。
- 把 `references/keyword-animation-effects.md` 当作动效选择库，而不是每个关键词都必须动。只强调少数重点词，动效保持局部，不要借关键词动效改动底色视频画面。
- 素材匹配时不要理解图片内容、不要 OCR、不要对图片主体分类、不要从像素推断语义。
- 用户确认包装方案和实现 prompt 前，不要生成 Remotion composition 代码。
- 卡片和关键词优先放左侧、右侧或上半区；避开脸、嘴和字幕安全区。
- 如果视觉检查发现指、拖、划线等手势，且安全区允许，相关动画或匹配素材优先放在手势指向位置附近。
- 打开 Remotion Studio 前必须通过关键帧 QA；如果仍有问题，先明确报告残留问题。
- 生成预览后不要直接结束，必须给出下一步提示。
- 对用户可能调整的 Remotion 参数添加中文注释。
