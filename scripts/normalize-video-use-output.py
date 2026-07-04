#!/usr/bin/env python3
"""Normalize upstream video-use artifacts into one stable JSON contract.

This script does not call or patch video-use. It only reads files that
upstream video-use writes under <videos_dir>/edit/.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any


SRT_TIME_RE = re.compile(
    r"(?P<start>\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*"
    r"(?P<end>\d{2}:\d{2}:\d{2},\d{3})"
)


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def srt_time_to_seconds(value: str) -> float:
    hours_s, minutes_s, rest = value.split(":")
    seconds_s, millis_s = rest.split(",")
    return (
        int(hours_s) * 3600
        + int(minutes_s) * 60
        + int(seconds_s)
        + int(millis_s) / 1000
    )


def parse_srt(path: Path, timeline: str) -> list[dict[str, Any]]:
    if not path.exists():
        return []

    blocks = re.split(r"\n\s*\n", path.read_text(encoding="utf-8").strip())
    segments: list[dict[str, Any]] = []
    for block in blocks:
        lines = [line.strip() for line in block.splitlines() if line.strip()]
        if len(lines) < 2:
            continue
        match_line_index = next((i for i, line in enumerate(lines) if SRT_TIME_RE.search(line)), None)
        if match_line_index is None:
            continue
        match = SRT_TIME_RE.search(lines[match_line_index])
        if not match:
            continue
        text = " ".join(lines[match_line_index + 1 :]).strip()
        if not text:
            continue
        segments.append(
            {
                "text": " ".join(text.split()),
                "start": round(srt_time_to_seconds(match.group("start")), 3),
                "end": round(srt_time_to_seconds(match.group("end")), 3),
                "timeline": timeline,
                "source": str(path),
            }
        )
    return segments


def transcript_words(json_path: Path) -> list[dict[str, Any]]:
    data = read_json(json_path)
    words: list[dict[str, Any]] = []
    for item in data.get("words", []):
        if item.get("type") != "word":
            continue
        if item.get("start") is None or item.get("end") is None:
            continue
        text = (item.get("text") or "").strip()
        if not text:
            continue
        word = {
            "text": text,
            "start": round(float(item["start"]), 3),
            "end": round(float(item["end"]), 3),
            "timeline": "source",
            "source": json_path.stem,
        }
        if item.get("speaker_id") is not None:
            word["speakerId"] = item["speaker_id"]
        words.append(word)
    return words


def group_words(words: list[dict[str, Any]], timeline: str, max_gap: float = 0.5) -> list[dict[str, Any]]:
    if not words:
        return []

    segments: list[dict[str, Any]] = []
    current: list[dict[str, Any]] = []

    def flush() -> None:
        nonlocal current
        if not current:
            return
        text = " ".join(w["text"] for w in current)
        text = (
            text.replace(" ,", ",")
            .replace(" .", ".")
            .replace(" ?", "?")
            .replace(" !", "!")
            .strip()
        )
        if text:
            segments.append(
                {
                    "text": text,
                    "start": round(float(current[0]["start"]), 3),
                    "end": round(float(current[-1]["end"]), 3),
                    "timeline": timeline,
                    "source": current[0].get("source"),
                }
            )
        current = []

    previous: dict[str, Any] | None = None
    for word in sorted(words, key=lambda w: (str(w.get("source", "")), float(w["start"]))):
        if previous:
            speaker_changed = (
                previous.get("speakerId") is not None
                and word.get("speakerId") is not None
                and previous.get("speakerId") != word.get("speakerId")
            )
            source_changed = previous.get("source") != word.get("source")
            gap = float(word["start"]) - float(previous["end"])
            if source_changed or speaker_changed or gap >= max_gap:
                flush()
        current.append(word)
        previous = word
    flush()
    return segments


def source_stem_map(edl: dict[str, Any]) -> dict[str, str]:
    stems: dict[str, str] = {}
    for source_id, source_path in edl.get("sources", {}).items():
        stems[source_id] = Path(source_path).stem
    return stems


def map_words_to_output_timeline(
    source_words: list[dict[str, Any]],
    edl: dict[str, Any],
) -> list[dict[str, Any]]:
    if not edl.get("ranges"):
        return []

    stem_by_source_id = source_stem_map(edl)
    by_stem: dict[str, list[dict[str, Any]]] = {}
    for word in source_words:
        by_stem.setdefault(str(word["source"]), []).append(word)

    output_words: list[dict[str, Any]] = []
    offset = 0.0
    for index, clip in enumerate(edl.get("ranges", [])):
        source_id = str(clip.get("source", ""))
        source_stem = stem_by_source_id.get(source_id, source_id)
        start = float(clip.get("start", 0.0))
        end = float(clip.get("end", start))
        if end <= start:
            continue
        for word in by_stem.get(source_stem, []):
            word_start = float(word["start"])
            word_end = float(word["end"])
            if word_start + 0.001 < start or word_end - 0.001 > end:
                continue
            mapped = dict(word)
            mapped["sourceTimelineStart"] = mapped["start"]
            mapped["sourceTimelineEnd"] = mapped["end"]
            mapped["start"] = round(word_start - start + offset, 3)
            mapped["end"] = round(word_end - start + offset, 3)
            mapped["timeline"] = "output"
            mapped["clipIndex"] = index
            mapped["sourceId"] = source_id
            output_words.append(mapped)
        offset += end - start
    return sorted(output_words, key=lambda w: float(w["start"]))


def discover_video_path(edit_dir: Path, explicit_video: Path | None) -> Path | None:
    if explicit_video:
        return explicit_video.resolve()
    for name in ("final.mp4", "preview.mp4"):
        candidate = edit_dir / name
        if candidate.exists():
            return candidate.resolve()
    return None


def build_contract(edit_dir: Path, video: Path | None) -> dict[str, Any]:
    edit_dir = edit_dir.resolve()
    if not edit_dir.is_dir():
        raise SystemExit(f"edit directory not found: {edit_dir}")

    transcripts_dir = edit_dir / "transcripts"
    transcript_files = sorted(transcripts_dir.glob("*.json")) if transcripts_dir.is_dir() else []
    source_words = [word for path in transcript_files for word in transcript_words(path)]

    edl_path = edit_dir / "edl.json"
    edl = read_json(edl_path) if edl_path.exists() else None

    if edl:
        output_words = map_words_to_output_timeline(source_words, edl)
    else:
        output_words = []

    timeline = "output" if output_words else "source"
    words = output_words if output_words else sorted(source_words, key=lambda w: (str(w["source"]), float(w["start"])))

    master_srt = edit_dir / "master.srt"
    if master_srt.exists():
        segments = parse_srt(master_srt, "output")
        timeline = "output"
    else:
        subtitle_files = sorted((edit_dir / "subtitles").glob("*.srt")) if (edit_dir / "subtitles").is_dir() else []
        segments = []
        if not edl:
            for subtitle in subtitle_files:
                segments.extend(parse_srt(subtitle, "source"))
        if not segments:
            segments = group_words(words, timeline)

    video_path = discover_video_path(edit_dir, video)

    duration = None
    if edl and edl.get("total_duration_s") is not None:
        duration = round(float(edl["total_duration_s"]), 3)
    elif segments:
        duration = round(max(float(segment["end"]) for segment in segments), 3)
    elif words:
        duration = round(max(float(word["end"]) for word in words), 3)

    return {
        "version": 1,
        "producer": "video-auto-overlay",
        "sourceSystem": "video-use",
        "editDir": str(edit_dir),
        "videoPath": str(video_path) if video_path else None,
        "timeline": timeline,
        "duration": duration,
        "edlPath": str(edl_path) if edl_path.exists() else None,
        "transcriptFiles": [str(path.resolve()) for path in transcript_files],
        "subtitleFiles": [str(path.resolve()) for path in sorted((edit_dir / "subtitles").glob("*.srt"))]
        if (edit_dir / "subtitles").is_dir()
        else [],
        "words": words,
        "segments": sorted(segments, key=lambda s: float(s["start"])),
        "edl": edl,
    }


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Normalize upstream video-use outputs for video-auto-overlay."
    )
    parser.add_argument("--edit-dir", type=Path, required=True, help="Path to <videos_dir>/edit")
    parser.add_argument("--video", type=Path, default=None, help="Optional final/prepared video path")
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        default=None,
        help="Output JSON path. Default: <edit-dir>/video-auto-overlay/normalized.json",
    )
    args = parser.parse_args()

    contract = build_contract(args.edit_dir, args.video)
    output = args.output or (args.edit_dir / "video-auto-overlay" / "normalized.json")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(contract, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"normalized: {output}")
    print(
        f"  timeline={contract['timeline']} words={len(contract['words'])} "
        f"segments={len(contract['segments'])} duration={contract['duration']}"
    )


if __name__ == "__main__":
    try:
        main()
    except BrokenPipeError:
        sys.exit(1)
