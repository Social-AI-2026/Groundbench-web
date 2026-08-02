<div align="center">

<h1>GroundBench — Web</h1>

固定顶点预算多边形定位基准的项目主页
</br>
<em>The project site for an exact-N polygon grounding benchmark</em>

[![Site](https://img.shields.io/badge/site-social--ai--2026.github.io-1baf7a?style=flat-square)](https://social-ai-2026.github.io/Groundbench-web/)
[![Build](https://img.shields.io/badge/build-none%20%C2%B7%20static-e87ba4?style=flat-square)](#site-at-a-glance)
[![Deploy](https://img.shields.io/badge/deploy-GitHub%20Pages-222222?style=flat-square&logo=github&logoColor=white)](https://pages.github.com/)
[![Bilingual](https://img.shields.io/badge/i18n-EN%20%C2%B7%20%E4%B8%AD%E6%96%87-2563EB?style=flat-square)](#site-at-a-glance)

[![Code](https://img.shields.io/badge/Project-Groundbench--codebase-1baf7a?style=flat-square&logo=github&logoColor=white)](https://github.com/Social-AI-2026/Groundbench-codebase)
[![Dataset](https://img.shields.io/badge/Project-%F0%9F%A4%97%20GroundBench-FFD21E?style=flat-square)](https://huggingface.co/datasets/Social-AI-2026/GroundBench)

[English](./README.md) | [中文文档](./README-ZH.md)

</div>

## ⚡ Overview

**GroundBench** asks a vision-language system to outline the object a referring expression describes
— as a polygon with an exact vertex budget. Given an image, an expression, and a vertex count N, a
model must return exactly N ordered vertices, that is 2N numbers. The same 1,500 items are asked at
five budgets, so only the answer surface changes while image, phrase, and referent stay fixed.

This repository is the **project site** only. The evaluation code lives in
[Groundbench-codebase](https://github.com/Social-AI-2026/Groundbench-codebase) and the questions and
reference targets are released as
[`Social-AI-2026/Groundbench`](https://huggingface.co/datasets/Social-AI-2026/GroundBench).

> **Scope:** this repository carries presentation only — markup, styles, and the figures the page
> shows.</br>
> It runs no evaluation, holds no benchmark payload, and is **not** the source of truth for any number
> on the page.

### Site at a Glance

| Item | Value |
|------|-------|
| **Stack** | Vanilla HTML / CSS / JavaScript |
| **Build step** | None — files are served exactly as committed |
| **Dependencies** | Zero; nothing is fetched at runtime |
| **Hosting** | GitHub Pages from `main`, with `.nojekyll` |
| **Languages** | English in the markup, 中文 in `i18n.js`, switched in the nav |
| **Source of numbers** | `results.js`, transcribed from the frozen protocol — never typed into markup |

## 🔄 How a Change Reaches the Site

1. **Edit** — change the markup, styles, or a figure in this repository
2. **Preview** — serve the folder locally and check both languages
3. **Commit** — push to `main`
4. **Publish** — GitHub Pages serves the new commit; `.nojekyll` keeps the files unprocessed
5. **Verify** — reload the live URL and confirm the page and both language states render

## 📦 What Is on the Page

Three pages, all bilingual through the nav toggle:

| Page | What it is |
|------|-----------|
| `index.html` | Project page — the gap, the task, canonical targets, cohort, results, findings, run/cite |
| `explorer.html` | Every table from the paper (T1–T5), sliceable |
| `playground.html` | Place exactly *N* vertices yourself and score your contour against G<sub>N</sub> |

> Every figure is **drawn live in `<canvas>`** from the paper's own algorithm and numbers — there are
> no static figure images to keep in sync. The hero cycles each referent across N ∈ {8, 16, 64}, and
> the task and target figures let you pick the referent.

## 🚀 Quick Start

### Option 1: Preview Locally (Recommended)

#### Prerequisites

| Tool | Version | Description | Check Installation |
|------|---------|-------------|--------------------|
| **Python** | 3.x | Only to run a static file server | `python3 --version` |
| **git** | Any | Clone and publish | `git --version` |
| **A browser** | Any | Nothing else is required | — |

#### 1. Clone the Repository

```bash
git clone https://github.com/Social-AI-2026/Groundbench-web.git
cd Groundbench-web
```

#### 2. Serve the Folder

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Any static server works. There is nothing to install and nothing to compile.

> Check **both languages** before committing. A string added in one language and missed in the other
> is the failure this layout invites, and it is invisible until someone toggles.

### Option 2: Publish to GitHub Pages

#### 1. Push to `main`

```bash
git add -A
git commit -m "Update the site"
git push origin main
```

#### 2. Confirm the Deployment

Pages builds from `main` and serves the repository root. `.nojekyll` is committed so files beginning
with `_` survive and nothing is run through Jekyll.

> A hard refresh is often needed after a deploy — browsers cache `styles.css` and the scripts
> aggressively.

## 📤 Where the Numbers Come From

Every score shown on the page is produced by the frozen evaluation protocol in the
[code release](https://github.com/Social-AI-2026/Groundbench-codebase). The questions and reference
targets are the frozen materials published on the
[dataset repository](https://huggingface.co/datasets/Social-AI-2026/GroundBench), which itself
carries **no model outputs and no scores** — it is the questions and the reference targets, not
anyone's results.

> Scores are comparable only under that frozen protocol. Prompt, image handling, coordinate mapping,
> and the polygon backend each change what a number means. The page must not present numbers from a
> different pipeline as if they were the same.

## 🗂️ Repository Map

```text
index.html        project page
explorer.html     every paper table, sliceable
playground.html   trace a contour yourself and score it

results.js        all paper numbers as `window.GB` — every metric is [fixed, parseable-only]
poly.js           geometry kit: source contours, exact-N construction, raster IoU, canvas drawing
shapes.js         the four referent silhouettes shared by every figure and the playground
i18n.js           EN + 中文 dictionary and the data-t / data-th runtime
app.js            index page: nav, scroll-spy, hero and figure canvases, charts, leaderboard
explorer.js       explorer tables and charts
playground.js     tracing interaction, legality checks, scoring
styles.css        theme — box amber, canonical target mint, model prediction coral

uploads/          the paper PDF the pages link to
.nojekyll         tells GitHub Pages to serve the files unprocessed
```

**Updating results.** Everything reads from `results.js`. Add a configuration to `GB.configs` (id,
name, vendor, colour) and a matching key in each budget block of `GB.table1`, plus `GB.selcon.data`
and `GB.slices.data` if you have the diagnostics. Nothing else needs to change.

## 🔬 Scope and Limitations

- The site is a presentation layer; it reproduces no result and verifies no claim on its own.
- Figures are exported artifacts. When the underlying analysis changes, the export must be redone —
  the page cannot detect that it has gone stale.
- The page is static. It has no server, no analytics, and no runtime data fetching.
- Any number reproduced here is only as current as the last commit that touched it.

## 📬 Contributing

Issues and focused pull requests are welcome. Keep changes presentation-only, update both languages
together, and never commit credentials or private run artifacts.

## 📄 Citation and Licence

Citation metadata for the benchmark is in the code release
([CITATION.cff](https://github.com/Social-AI-2026/Groundbench-codebase/blob/main/CITATION.cff)); the
associated manuscript remains under anonymous review, so no DOI or public paper URL is asserted here.

A licence for this repository is **not yet chosen**. The code release is under the non-commercial
[GroundBench Peer-Review Research License](https://github.com/Social-AI-2026/Groundbench-codebase/blob/main/LICENSE),
and COCO, RefCOCO-family material, and any figure sources retain their own terms.
