#!/usr/bin/env python3
"""
YAML → Typst → PDF pipeline.

Usage:
    python pdf/build.py --lang it --emphasis hybrid
    python pdf/build.py --lang en --emphasis leadership
    python pdf/build.py --all   # builds all 6 combinations
"""

from __future__ import annotations

import argparse
import copy
import shutil
import subprocess
import sys
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, StrictUndefined
from ruamel.yaml import YAML

ROOT = Path(__file__).parent.parent
CONTENT_DIR = ROOT / "content"
PDF_DIR = ROOT / "pdf"
DIST_DIR = ROOT / "pdf" / "dist"

LANGS = ["it", "en"]
EMPHASES = ["leadership", "engineering", "hybrid"]


def load_yaml(lang: str) -> dict:
    yaml = YAML()
    yaml.preserve_quotes = True
    path = CONTENT_DIR / f"cv.{lang}.yaml"
    with open(path, encoding="utf-8") as f:
        return yaml.load(f)


def apply_emphasis(data: dict, emphasis: str) -> dict:
    """
    Return a deep copy of data with highlights filtered by emphasis.
    hybrid → deduplicated union of leadership + engineering bullets.
    """
    result = copy.deepcopy(data)
    result["emphasis"] = emphasis
    for job in result.get("experience", []):
        h = job.get("highlights", {})
        if emphasis == "leadership":
            job["_bullets"] = h.get("leadership", [])
        elif emphasis == "engineering":
            job["_bullets"] = h.get("engineering", [])
        else:
            seen: set[str] = set()
            bullets: list[str] = []
            for b in h.get("leadership", []) + h.get("engineering", []):
                if b and b not in seen:
                    seen.add(b)
                    bullets.append(b)
            job["_bullets"] = bullets
    return result


def render_typ(data: dict, emphasis: str) -> str:
    env = Environment(
        loader=FileSystemLoader(PDF_DIR),
        undefined=StrictUndefined,
        trim_blocks=True,
        lstrip_blocks=True,
        comment_start_string="{##",
        comment_end_string="##}",
    )
    template = env.get_template("template.typ")
    enriched = apply_emphasis(data, emphasis)
    return template.render(**enriched)


def compile_pdf(typ_source: str, output_path: Path) -> None:
    DIST_DIR.mkdir(parents=True, exist_ok=True)
    typ_path = DIST_DIR / output_path.with_suffix(".typ").name
    typ_path.write_text(typ_source, encoding="utf-8")

    font_dir = PDF_DIR / "assets" / "fonts"
    font_paths = [str(font_dir)] if font_dir.exists() else []

    typst_bin = shutil.which("typst")
    if typst_bin:
        cmd = [typst_bin, "compile"]
        for fp in font_paths:
            cmd += ["--font-path", fp]
        cmd += [str(typ_path), str(output_path)]
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            print(result.stderr, file=sys.stderr)
            sys.exit(result.returncode)
    else:
        try:
            import typst as typst_py
        except ImportError:
            print(
                "ERROR: typst CLI not found and 'typst' Python package not installed.\n"
                "Install one of:\n"
                "  - typst CLI: https://github.com/typst/typst/releases\n"
                "  - pip install typst",
                file=sys.stderr,
            )
            sys.exit(1)
        typst_py.compile(str(typ_path), output=str(output_path), font_paths=font_paths)
    print(f"  ✓  {output_path.relative_to(ROOT)}")


def build_one(lang: str, emphasis: str) -> None:
    data = load_yaml(lang)
    source = render_typ(data, emphasis)
    out = DIST_DIR / f"cv_{lang}_{emphasis}.pdf"
    compile_pdf(source, out)
    # canonical names for the default emphasis
    if emphasis == "hybrid":
        canonical = DIST_DIR / f"cv_{lang}.pdf"
        shutil.copy2(out, canonical)
        print(f"  →  {canonical.relative_to(ROOT)} (canonical)")
        web_public = ROOT / "web" / "public" / f"cv_{lang}.pdf"
        shutil.copy2(out, web_public)
        print(f"  →  {web_public.relative_to(ROOT)} (web/public)")


def main() -> None:
    parser = argparse.ArgumentParser(description="Build CV PDFs from YAML")
    parser.add_argument("--lang", choices=LANGS, help="Language (it or en)")
    parser.add_argument("--emphasis", choices=EMPHASES, default="hybrid",
                        help="Emphasis mode (default: hybrid)")
    parser.add_argument("--all", action="store_true", dest="build_all",
                        help="Build all 6 combinations")
    args = parser.parse_args()

    if args.build_all:
        for lang in LANGS:
            for emphasis in EMPHASES:
                build_one(lang, emphasis)
    elif args.lang:
        build_one(args.lang, args.emphasis)
    else:
        parser.error("Specify --lang or --all")


if __name__ == "__main__":
    main()
