# tutorial-kit

A Next.js framework for building timeboxed tutorial sites with MDX and i18n support.

## Features

- 🌍 **Multi-language** — Built-in i18n with per-tutorial translations
- 📝 **MDX-powered** — Write tutorials in MDX with custom components
- 🎨 **Customizable** — Tailwind v4 + shadcn-inspired components
- 📦 **Static Export** — Deploy to Cloudflare Pages, Vercel, Netlify, or any static host
- 🔍 **SEO-ready** — hreflang tags, sitemap, Open Graph, Twitter Cards
- ⚡ **Fast** — Next.js 16 App Router + Turbopack

## Architecture

This framework is **content-agnostic**. It reads tutorials from an external content repository at build time.

```
tutorial-kit (framework)       ← Pure rendering engine
    ↓ reads from
1hour-guide-content (content)  ← Pure MDX + YAML
    ↓ builds to
out/ (static site)             ← Deploy anywhere
```

## Quick Start

### 1. Clone this repo

```bash
git clone <repo-url> tutorial-kit
cd tutorial-kit
pnpm install
```

### 2. Point to your content repository

By default, the framework looks for content in `../1hour-guide-content/`.

You can override this with the `CONTENT_DIR` environment variable:

```bash
export CONTENT_DIR=/path/to/your/content
pnpm build
```

### 3. Build

```bash
pnpm build
```

Static site will be generated in `out/`.

### 4. Preview

```bash
pnpm preview
# or
cd out && python3 -m http.server 8000
```

## Content Repository Structure

Your content repository should follow this structure:

```
content-repo/
├─ site.yaml              # Site-wide config
├─ categories.yaml        # Category definitions
├─ i18n/
│  ├─ en.yaml            # English UI strings
│  └─ zh.yaml            # Chinese UI strings
└─ tutorials/
   ├─ python-basics/
   │  ├─ meta.yaml       # Shared metadata
   │  ├─ en.mdx          # English version
   │  └─ zh.mdx          # Chinese version
   └─ ...
```

### `site.yaml`

```yaml
defaultLocale: en
locales: [en, zh]
title:
  en: "Your Site Title"
  zh: "你的站点标题"
description:
  en: "Your site description"
  zh: "你的站点描述"
domain: yoursite.com
url: https://yoursite.com
author:
  name: Your Name
  url: https://yoursite.com
  twitter: yourhandle
  github: yourusername
```

### `categories.yaml`

```yaml
- slug: code
  name:
    en: Code
    zh: 编程
  icon: "💻"
  color: blue
  description:
    en: "Programming tutorials"
    zh: "编程教程"
```

### `tutorials/<slug>/meta.yaml`

```yaml
slug: python-basics
category: code
difficulty: beginner  # beginner | intermediate | advanced
duration: 60          # minutes
tags: [python, programming]
date: 2026-05-01
published: true
cover: /images/tutorials/python-basics.svg
translations:
  en: { status: published }
  zh: { status: published }
```

### `tutorials/<slug>/en.mdx`

```mdx
---
title: "1 Hour to Python Basics"
description: "Learn Python in 60 minutes"
---

# 1 Hour to Python Basics

Your tutorial content here...

<TimeBlock start="0" end="10" title="Setup" />

<Checkpoint>
Q: What is a variable?
<Answer>
A variable stores data.
</Answer>
</Checkpoint>

<NextStep slug="python-web-scraping" />
```

## Custom MDX Components

- `<TimeBlock start="0" end="10" title="Setup" />` — Time allocation
- `<Checkpoint>...</Checkpoint>` — Self-test questions
- `<Answer>...</Answer>` — Collapsible answer (inside Checkpoint)
- `<NextStep slug="next-tutorial" />` — Recommended next tutorial

## Deployment

### Cloudflare Pages

1. Push both repos to GitHub
2. In Cloudflare Pages, connect `tutorial-kit` repo
3. Build settings:
   - Build command: `pnpm build`
   - Build output directory: `out`
   - Environment variables: `CONTENT_DIR=../1hour-guide-content` (if using git submodule)

### Vercel / Netlify

Same as above. Make sure `output: 'export'` is set in `next.config.ts`.

## Development

```bash
pnpm dev
```

Note: You need a content repository at `../1hour-guide-content/` or set `CONTENT_DIR`.

## License

MIT

## Credits

Built by [Zoe](https://zoe.im) for [1hour.guide](https://1hour.guide).
