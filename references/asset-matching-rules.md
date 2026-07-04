# Project Asset Matching / 项目素材匹配

## Source / 来源

This reference is distilled from the public `DannyZZ2/video-auto-edit` workflow, `SKILL.md` on `main` at commit `405c341d216334ad9154602b2f35fb8b9c48df21`.

本参考提炼自公开仓库 `DannyZZ2/video-auto-edit` 的 `SKILL.md`，`main` 分支 commit `405c341d216334ad9154602b2f35fb8b9c48df21`。

Source URL / 来源链接:

```text
https://github.com/DannyZZ2/video-auto-edit/blob/main/SKILL.md
```

## Purpose / 目的

Before Remotion packaging design, build an asset manifest from the current Codex project/workspace. Use the manifest to match available image or element assets to subtitle keywords.

进入 Remotion 包装设计前，先从当前 Codex 项目/工作区生成素材清单。用这个清单把可用图片或元素素材匹配到字幕关键词。

## Default Roots / 默认素材来源

Default to the current Codex project/workspace. Do not use the uploaded video's source folder or parent directory as the asset root unless the user explicitly designates it as an asset source.

默认使用当前 Codex 项目/工作区。不要因为视频来自某个文件夹，就把视频源文件夹或父目录当作素材根目录，除非用户明确指定该目录为素材来源。

The user may explicitly provide extra asset roots. Treat those as additional roots, not as replacements for the current workspace unless the user says so.

用户可以明确补充额外素材目录。把这些目录作为额外来源；除非用户明确要求，否则不要替代当前 workspace。

## Included Asset Types / 纳入素材类型

Include common static or animation element files:

纳入常见静态或动效元素文件：

- `.png`
- `.jpg`
- `.jpeg`
- `.webp`
- `.svg`
- `.gif`
- `.json`
- `.lottie`

Examples: logos, UI screenshots, product images, transparent PNGs, icons, stickers, named element folders, and animation JSON files.

示例：logo、UI 截图、产品图、透明 PNG、图标、贴纸、命名清晰的元素文件夹和动画 JSON 文件。

## Excluded Directories / 排除目录

Exclude dependency, build, cache, VCS, and rendered-output folders:

排除依赖、构建、缓存、版本控制和渲染输出目录：

```text
node_modules
.git
dist
build
.next
out
exports
release
.cache
.remotion
coverage
venv
.venv
__pycache__
```

## Matching Rule / 匹配规则

Use only:

只使用：

- asset filename
- filename stem
- path segment names
- filename-token aliases

- 素材文件名
- 文件名主干
- 路径片段名称
- 文件名分词别名

Match these names against subtitle text, keyword cues, and normalized word/segment text. Exact substring and token matches are allowed.

用这些名称去匹配字幕文本、关键词 cue，以及归一化后的 word/segment 文本。允许精确子串匹配和 token 匹配。

## Forbidden / 禁止行为

Do not:

不要：

- inspect image contents to decide what the image means
- run OCR
- infer product, object, or topic from pixels
- classify the image subject
- treat a discovered asset as a style reference unless the user explicitly says so

- 理解图片内容来判断图片含义
- 做 OCR
- 从像素推断产品、物体或主题
- 对图片主体做分类
- 在用户没有明确说明时，把扫描到的素材当作风格参考图

Basic file metadata such as dimensions and alpha/transparent-background indicators may be recorded for layout safety, but not for semantic matching.

可以记录尺寸、透明通道/透明背景等基础文件元数据，用于布局安全；但不能用于语义匹配。

## Script / 脚本

Run:

运行：

```bash
python3 <skill-dir>/scripts/collect-project-assets.py \
  --workspace-root <current-codex-project-root> \
  --normalized-json <videos_dir>/edit/video-auto-overlay/normalized.json \
  -o <videos_dir>/edit/video-auto-overlay/asset-manifest.json
```

If the user explicitly supplies extra asset paths:

如果用户明确提供额外素材路径：

```bash
python3 <skill-dir>/scripts/collect-project-assets.py \
  --workspace-root <current-codex-project-root> \
  --extra-root /abs/path/to/assets \
  --normalized-json <videos_dir>/edit/video-auto-overlay/normalized.json \
  -o <videos_dir>/edit/video-auto-overlay/asset-manifest.json
```

## Manifest Contract / 清单契约

The output manifest contains:

输出清单包含：

- `assets`: discovered assets, filename tokens, path tokens, aliases, extension, and basic metadata.
- `matches`: filename/path-token matches against normalized transcript text.
- `policy`: explicit matching policy and forbidden operations.

- `assets`：发现的素材、文件名 token、路径 token、别名、扩展名和基础元数据。
- `matches`：基于文件名/路径 token 与归一化转写文本的匹配结果。
- `policy`：明确的匹配策略和禁止行为。

Pass this manifest into the Remotion design step. If a matching asset exists, the plan must either use it at the matching keyword cue or explain why it is unsafe or unsuitable.

把这个清单传入 Remotion 设计阶段。如果存在匹配素材，方案必须在匹配关键词 cue 使用它，或说明为什么不安全/不适合使用。
