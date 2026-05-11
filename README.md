# Pietro Ilacqua — CV Monorepo

[![Validate YAML](https://github.com/the-water-robot/cv/actions/workflows/validate.yml/badge.svg)](https://github.com/the-water-robot/cv/actions/workflows/validate.yml)
[![Build PDF](https://github.com/the-water-robot/cv/actions/workflows/pdf.yml/badge.svg)](https://github.com/the-water-robot/cv/actions/workflows/pdf.yml)
[![Deploy Pages](https://github.com/the-water-robot/cv/actions/workflows/pages.yml/badge.svg)](https://github.com/the-water-robot/cv/actions/workflows/pages.yml)

| | |
|---|---|
| **PDF** | [Latest Release](https://github.com/the-water-robot/cv/releases/latest) |
| **Web** | [the-water-robot.github.io/cv](https://the-water-robot.github.io/cv) |

---

## Architecture

```
content/          ← single source of truth (YAML)
  cv.it.yaml
  cv.en.yaml
  schema.json     ← JSON Schema, validated in CI
pdf/              ← YAML → Typst → PDF
  template.typ
  build.py
web/              ← YAML → Astro → static site
  src/
.github/workflows/
  validate.yml    ← schema check on every push/PR
  pdf.yml         ← build PDFs, attach to Release on tag
  pages.yml       ← build Astro + deploy to GitHub Pages
```

The `emphasis` field in `meta.emphasis` controls which bullets are included:

| Value | Bullets shown |
|---|---|
| `hybrid` | leadership + engineering (deduplicated) |
| `leadership` | only `highlights.leadership` |
| `engineering` | only `highlights.engineering` |

Each push to `main` produces 6 PDFs: `cv_{it,en}_{hybrid,leadership,engineering}.pdf`.
Tagging with `v*` (e.g. `v2026-05`) creates a GitHub Release and attaches all 6 PDFs.

---

## How to update

1. Edit `content/cv.it.yaml` or `content/cv.en.yaml`
2. Push to `main`
3. CI validates the schema, rebuilds all PDFs, and redeploys the site

To cut a release:

```sh
git tag v$(date +%Y-%m)
git push origin --tags
```

---

## Local development

### PDF

```sh
# Install Python deps (Python 3.11+)
pip install -r pdf/requirements.txt

# Install Typst: https://github.com/typst/typst/releases
# or: brew install typst

# Build a single PDF
python pdf/build.py --lang it --emphasis hybrid

# Build all 6 PDFs
python pdf/build.py --all

# Output is in pdf/dist/
```

### Web

```sh
cd web
npm install
npm run dev       # http://localhost:4321/cv/
npm run build     # output in web/dist/
npm run preview   # preview the static build
npm run lint      # ESLint
npm run format    # Prettier
```

### Schema validation

```sh
npm install -g ajv-cli@5.0.0 ajv-formats@3.0.1
ajv validate -s content/schema.json -d content/cv.it.yaml --spec=draft7
ajv validate -s content/schema.json -d content/cv.en.yaml --spec=draft7
```

---

## License

MIT — see [LICENSE](LICENSE)
