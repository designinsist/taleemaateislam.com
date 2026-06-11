#!/usr/bin/env python3
"""Update daily-shorts.js from the homepage daily shorts YouTube playlist."""

from __future__ import annotations

import argparse
import re
import subprocess
import sys
from pathlib import Path


DEFAULT_PLAYLIST_URL = "https://www.youtube.com/playlist?list=PLdujDev9jtVYtRi2Ef_X85JaqfhMPT0Ai"
DEFAULT_TARGET = Path("daily-shorts.js")


def fetch_playlist_items(playlist_url: str) -> list[tuple[str, str]]:
    command = [
        "yt-dlp",
        "--flat-playlist",
        "--no-warnings",
        "--print",
        "%(id)s|||%(title)s",
        playlist_url,
    ]
    try:
        result = subprocess.run(command, check=True, capture_output=True, text=True)
    except FileNotFoundError:
        print("yt-dlp is required but was not found in PATH.", file=sys.stderr)
        return []
    except subprocess.CalledProcessError as exc:
        print(exc.stderr or exc.stdout, file=sys.stderr)
        return []

    items: list[tuple[str, str]] = []
    seen: set[str] = set()
    for raw_line in result.stdout.splitlines():
        if "|||" not in raw_line:
            continue
        video_id, title = raw_line.split("|||", 1)
        video_id = video_id.strip()
        title = title.strip()
        if not video_id or video_id in seen:
            continue
        if title.upper() == "NA" or "[private video]" in title.lower():
            continue
        seen.add(video_id)
        items.append((video_id, title))
    return items


def format_ids(video_ids: list[str]) -> str:
    lines = []
    for start in range(0, len(video_ids), 5):
        chunk = video_ids[start:start + 5]
        lines.append("    " + ", ".join(f"'{video_id}'" for video_id in chunk) + ",")
    return "\n".join(lines)


def update_daily_shorts(target: Path, video_ids: list[str], dry_run: bool) -> bool:
    source = target.read_text()
    next_source, count = re.subn(
        r"var DAILY_SHORTS = \[\n[\s\S]*?\n  \];",
        "var DAILY_SHORTS = [\n" + format_ids(video_ids) + "\n  ];",
        source,
        count=1,
    )
    if count != 1:
        raise RuntimeError("Could not find the DAILY_SHORTS array in daily-shorts.js")
    if next_source == source:
        return False
    if not dry_run:
        target.write_text(next_source)
    return True


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--playlist", default=DEFAULT_PLAYLIST_URL, help="YouTube playlist URL to sync")
    parser.add_argument("--target", default=str(DEFAULT_TARGET), help="daily-shorts.js path")
    parser.add_argument("--dry-run", action="store_true", help="Check what would change without writing")
    args = parser.parse_args()

    items = fetch_playlist_items(args.playlist)
    if not items:
        print("No public playlist videos found.", file=sys.stderr)
        return 1

    # yt-dlp returns the playlist in YouTube order, normally newest first.
    # daily-shorts.js stores IDs oldest first because the homepage reverses it.
    chronological_ids = [video_id for video_id, _title in reversed(items)]
    changed = update_daily_shorts(Path(args.target), chronological_ids, args.dry_run)

    status = "would update" if args.dry_run and changed else "updated" if changed else "already up to date"
    print(f"{Path(args.target)} {status}: {len(chronological_ids)} public shorts")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
