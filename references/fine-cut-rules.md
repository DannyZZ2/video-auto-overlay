# Fine-Cut Rules / 精剪规则

## Source / 来源

This reference is distilled from the public `DannyZZ2/video-auto-edit` workflow, `SKILL.md` on `main` at commit `405c341d216334ad9154602b2f35fb8b9c48df21`.

本参考提炼自公开仓库 `DannyZZ2/video-auto-edit` 的 `SKILL.md`，`main` 分支 commit `405c341d216334ad9154602b2f35fb8b9c48df21`。

Source URL / 来源链接:

```text
https://github.com/DannyZZ2/video-auto-edit/blob/main/SKILL.md
```

## Purpose / 目的

When the user needs editing, use this as the default brief for upstream `$video-use`. The goal is a clean talking-head fine cut: remove weak delivery and keep the smoothest, most final-version-like take.

当用户需要剪辑时，把本文件作为默认 brief 交给上游 `$video-use`。目标是生成干净的口播精剪：去掉表达不顺的地方，保留最顺、最像最终成片的表达。

## Fine-Cut Intent / 精剪意图

Pass this intent to `$video-use`:

把下面意图传给 `$video-use`：

```text
请按口播精剪处理：删除重复、卡壳、试讲、说错重来、明显填充词和无意义停顿；保留表达最顺畅、语义完整、最像最终版本的内容。不要只剪掉被打断的片段，也要检查保留下来的段落内部是否有长静默、气口过长、等待感或死气。两句话之间有明显空白、呼吸或停顿时压短，但不要剪到完全没有呼吸感。
```

## Decision Rules / 决策规则

Use these rules when `$video-use` proposes or executes the edit:

让 `$video-use` 出剪辑策略或执行剪辑时使用这些规则：

1. Prefer the last smooth retake when the speaker repeats the same idea, restarts, or corrects themselves.
2. Remove obvious fillers, broken openings, half-sentences, failed starts, and corrected mistakes when removal does not damage meaning.
3. Inspect the kept material, not only the rejected material. Tighten long silences, overlong breaths, waiting gaps, and dead air inside retained paragraphs.
4. Shorten obvious blank space between adjacent sentences or clauses.
5. Preserve natural breathing room. Do not make the result sound mechanically over-tight.
6. Keep cut boundaries on word boundaries and respect upstream `video-use` cut-safety rules.
7. Preserve semantic completeness; do not remove context that makes the remaining sentence confusing.

1. 同一个意思重复讲、重新起头、说错后纠正时，优先保留最后一次讲顺的版本。
2. 在不破坏语义的前提下，删除明显填充词、破碎开头、半句话、失败起头和说错重来。
3. 不只检查被删除内容，也要检查保留下来的段落内部；压短长静默、过长气口、等待感和死气。
4. 两句话或从句之间有明显空白时压短。
5. 保留自然呼吸，不要剪成机械式过紧节奏。
6. 剪点必须落在词边界，并遵守上游 `video-use` 的剪辑安全规则。
7. 保留语义完整性；不要删到让剩余句子缺上下文。

## Output Requirements / 输出要求

Require `$video-use` to keep these outputs:

要求 `$video-use` 保留这些输出：

1. Never overwrite the original video.
2. Keep working artifacts and edit decisions under the normal `<videos_dir>/edit/` workspace.
3. Preserve `edl.json` or the equivalent edit decision record.
4. Export or copy the fine-cut deliverable near the source material with a clear suffix such as `_video-use精剪`.
5. After render, run a silence/dead-air check once. Fix obvious long blanks, accidental dead air, or audio mistakes before moving to Remotion packaging.

1. 不覆盖原始视频。
2. 工作产物和剪辑决策保留在标准 `<videos_dir>/edit/` 工作区。
3. 保留 `edl.json` 或等价剪辑决策记录。
4. 将精剪成片导出或复制到源素材附近，使用清晰后缀，例如 `_video-use精剪`。
5. 渲染后跑一次静默/死气检查；发现明显长空白、误留死气或音频错误，先修正再进入 Remotion 包装。

## Handoff / 交接

After `$video-use` finishes the fine cut, continue into this skill's normal workflow:

`$video-use` 完成精剪后，继续进入本 skill 的常规流程：

1. Report the edited video path and key verification result.
2. Locate `<videos_dir>/edit/`.
3. Run `scripts/normalize-video-use-output.py`.
4. Use the normalized JSON for Remotion timing.
5. End with a next-step prompt: ask whether the user wants to preview/adjust the cut, continue into packaging animation, or export/finalize.

1. 汇报精剪视频路径和关键检查结果。
2. 定位 `<videos_dir>/edit/`。
3. 运行 `scripts/normalize-video-use-output.py`。
4. 使用归一化 JSON 作为 Remotion 时间依据。
5. 结尾必须给下一步提示：询问用户要预览/调整剪辑、继续包装动效，还是导出/定稿。
