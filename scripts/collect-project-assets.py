#!/usr/bin/env python3
"""Build a filename-only project asset manifest for video-auto-overlay.

This intentionally does not inspect image content, run OCR, classify subjects,
or infer semantic meaning from pixels. Matching is based only on filenames,
path segment names, and filename-token aliases.
"""

from __future__ import annotations

import argparse
import json
import re
import struct
import sys
from pathlib import Path
from typing import Any


ASSET_EXTENSIONS = {
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".svg",
    ".gif",
    ".json",
    ".lottie",
}

EXCLUDED_DIRS = {
    ".cache",
    ".git",
    ".hg",
    ".next",
    ".nuxt",
    ".remotion",
    ".svn",
    ".venv",
    "__pycache__",
    "build",
    "coverage",
    "dist",
    "exports",
    "node_modules",
    "out",
    "release",
    "target",
    "venv",
}

TOKEN_RE = re.compile(r"[A-Za-z0-9]+|[\u4e00-\u9fff]+")


def tokenize(value: str) -> list[str]:
    tokens = [match.group(0).lower() for match in TOKEN_RE.finditer(value)]
    return [token for token in tokens if token]


def unique(values: list[str]) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for value in values:
        if value and value not in seen:
            seen.add(value)
            result.append(value)
    return result


def png_meta(path: Path) -> dict[str, Any]:
    data = path.read_bytes()[:80]
    if not data.startswith(b"\x89PNG\r\n\x1a\n") or len(data) < 33:
        return {}
    width, height = struct.unpack(">II", data[16:24])
    color_type = data[25]
    has_alpha = color_type in {4, 6} or b"tRNS" in data
    return {"width": width, "height": height, "hasAlpha": has_alpha}


def gif_meta(path: Path) -> dict[str, Any]:
    data = path.read_bytes()[:16]
    if not (data.startswith(b"GIF87a") or data.startswith(b"GIF89a")) or len(data) < 10:
        return {}
    width, height = struct.unpack("<HH", data[6:10])
    return {"width": width, "height": height, "hasAlpha": None}


def jpeg_meta(path: Path) -> dict[str, Any]:
    data = path.read_bytes()
    if len(data) < 4 or not data.startswith(b"\xff\xd8"):
        return {}
    i = 2
    while i + 9 < len(data):
        if data[i] != 0xFF:
            i += 1
            continue
        marker = data[i + 1]
        i += 2
        if marker in {0xD8, 0xD9}:
            continue
        if i + 2 > len(data):
            break
        length = struct.unpack(">H", data[i : i + 2])[0]
        if marker in {0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF}:
            if i + 7 <= len(data):
                height, width = struct.unpack(">HH", data[i + 3 : i + 7])
                return {"width": width, "height": height, "hasAlpha": False}
        i += length
    return {}


def webp_meta(path: Path) -> dict[str, Any]:
    data = path.read_bytes()[:64]
    if len(data) < 30 or not (data.startswith(b"RIFF") and data[8:12] == b"WEBP"):
        return {}
    chunk = data[12:16]
    if chunk == b"VP8X" and len(data) >= 30:
        flags = data[20]
        width = 1 + int.from_bytes(data[24:27], "little")
        height = 1 + int.from_bytes(data[27:30], "little")
        return {"width": width, "height": height, "hasAlpha": bool(flags & 0b00010000)}
    return {}


def svg_meta(path: Path) -> dict[str, Any]:
    text = path.read_text(encoding="utf-8", errors="ignore")[:2048]
    width_match = re.search(r'\bwidth=["\']?([0-9.]+)', text)
    height_match = re.search(r'\bheight=["\']?([0-9.]+)', text)
    viewbox_match = re.search(r'\bviewBox=["\'][^"\']*?\s+([0-9.]+)\s+([0-9.]+)["\']', text)
    meta: dict[str, Any] = {"hasAlpha": True}
    if width_match and height_match:
        meta["width"] = float(width_match.group(1))
        meta["height"] = float(height_match.group(1))
    elif viewbox_match:
        meta["width"] = float(viewbox_match.group(1))
        meta["height"] = float(viewbox_match.group(2))
    return meta


def read_basic_metadata(path: Path) -> dict[str, Any]:
    try:
        suffix = path.suffix.lower()
        if suffix == ".png":
            return png_meta(path)
        if suffix in {".jpg", ".jpeg"}:
            return jpeg_meta(path)
        if suffix == ".gif":
            return gif_meta(path)
        if suffix == ".webp":
            return webp_meta(path)
        if suffix == ".svg":
            return svg_meta(path)
    except OSError:
        return {}
    except UnicodeDecodeError:
        return {}
    return {}


def should_skip_dir(path: Path) -> bool:
    return any(part in EXCLUDED_DIRS for part in path.parts)


def collect_assets(roots: list[Path]) -> list[dict[str, Any]]:
    assets: list[dict[str, Any]] = []
    for root in roots:
        root = root.resolve()
        if not root.exists():
            continue
        for path in sorted(root.rglob("*")):
            if path.is_dir():
                continue
            if should_skip_dir(path.relative_to(root)):
                continue
            suffix = path.suffix.lower()
            if suffix not in ASSET_EXTENSIONS:
                continue
            try:
                rel = path.relative_to(root)
            except ValueError:
                rel = path
            path_segment_names = [part for part in rel.parts[:-1]]
            stem = path.stem
            filename_tokens = tokenize(stem)
            path_tokens = [token for segment in path_segment_names for token in tokenize(segment)]
            aliases = unique([stem.lower(), *filename_tokens, *path_tokens])
            metadata = read_basic_metadata(path)
            assets.append(
                {
                    "path": str(path.resolve()),
                    "relativePath": str(rel),
                    "sourceRoot": str(root),
                    "extension": suffix,
                    "filename": path.name,
                    "stem": stem,
                    "pathSegments": path_segment_names,
                    "filenameTokens": filename_tokens,
                    "pathTokens": path_tokens,
                    "aliases": aliases,
                    "metadata": metadata,
                    "matchingPolicy": "filename_path_tokens_only",
                }
            )
    return assets


def load_transcript_texts(normalized_json: Path | None) -> list[dict[str, Any]]:
    if not normalized_json:
        return []
    data = json.loads(normalized_json.read_text(encoding="utf-8"))
    texts: list[dict[str, Any]] = []
    for index, segment in enumerate(data.get("segments", [])):
        text = str(segment.get("text") or "")
        if text:
            texts.append(
                {
                    "kind": "segment",
                    "index": index,
                    "text": text,
                    "start": segment.get("start"),
                    "end": segment.get("end"),
                }
            )
    for index, word in enumerate(data.get("words", [])):
        text = str(word.get("text") or "")
        if text:
            texts.append(
                {
                    "kind": "word",
                    "index": index,
                    "text": text,
                    "start": word.get("start"),
                    "end": word.get("end"),
                }
            )
    return texts


def alias_matches_text(alias: str, text: str) -> bool:
    if not alias:
        return False
    lower_text = text.lower()
    lower_alias = alias.lower()
    if lower_alias in lower_text:
        return True
    return False


def match_assets(assets: list[dict[str, Any]], texts: list[dict[str, Any]]) -> list[dict[str, Any]]:
    matches: list[dict[str, Any]] = []
    for asset in assets:
        aliases = [alias for alias in asset.get("aliases", []) if len(alias) >= 2]
        for text_entry in texts:
            text = text_entry["text"]
            matched_aliases = [alias for alias in aliases if alias_matches_text(alias, text)]
            if not matched_aliases:
                continue
            matches.append(
                {
                    "assetPath": asset["path"],
                    "assetName": asset["filename"],
                    "textKind": text_entry["kind"],
                    "textIndex": text_entry["index"],
                    "text": text,
                    "start": text_entry.get("start"),
                    "end": text_entry.get("end"),
                    "matchedAliases": matched_aliases,
                    "matchSource": "filename_or_path_token",
                    "confidence": "name_match",
                }
            )
    return matches


def build_manifest(roots: list[Path], normalized_json: Path | None) -> dict[str, Any]:
    assets = collect_assets(roots)
    texts = load_transcript_texts(normalized_json)
    return {
        "version": 1,
        "producer": "video-auto-overlay",
        "policy": {
            "defaultRoots": "current Codex project/workspace plus explicit extra roots",
            "matching": "filename, filename stem, path segment, and filename-token aliases only",
            "forbidden": [
                "image_content_understanding",
                "ocr",
                "pixel_semantic_inference",
                "subject_classification",
            ],
        },
        "roots": [str(root.resolve()) for root in roots],
        "normalizedJson": str(normalized_json.resolve()) if normalized_json else None,
        "assets": assets,
        "matches": match_assets(assets, texts),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Collect project assets using filename-only matching.")
    parser.add_argument(
        "--workspace-root",
        type=Path,
        action="append",
        default=None,
        help="Current Codex project/workspace root. Defaults to cwd.",
    )
    parser.add_argument(
        "--extra-root",
        type=Path,
        action="append",
        default=[],
        help="Explicit extra asset root provided by the user.",
    )
    parser.add_argument(
        "--normalized-json",
        type=Path,
        default=None,
        help="Optional normalized.json for subtitle/word name matching.",
    )
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        required=True,
        help="Output asset manifest JSON path.",
    )
    args = parser.parse_args()

    roots = args.workspace_root or [Path.cwd()]
    roots = [*roots, *args.extra_root]
    manifest = build_manifest(roots, args.normalized_json)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"asset manifest: {args.output}")
    print(f"  assets={len(manifest['assets'])} matches={len(manifest['matches'])}")


if __name__ == "__main__":
    try:
        main()
    except BrokenPipeError:
        sys.exit(1)
