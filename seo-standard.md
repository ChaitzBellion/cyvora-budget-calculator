# 🚀 Cyvora SEO Standard
### Version 1.0
Last Updated: July 2026

---

# Purpose

This document defines the SEO standards followed across the Cyvora website.

Every HTML page, blog, landing page and tool must follow these standards before deployment.

Goals:

- Improve Google rankings
- Maintain consistent metadata
- Improve social sharing
- Increase CTR
- Make future maintenance easier

---

# Folder Structure

```
/
│
├── index.html
├── about.html
├── blogs.html
├── tools/
├── blogs/
│
├── Assets/
│   ├── images/
│   ├── icons/
│   ├── logos/
│   └── og/
│
└── docs/
    └── seo-standard.md
```

---

# Required <head> Structure

Every page should follow this order.

```
Google Analytics

Charset

Viewport

Title

Description

Robots

Author

Favicons

Apple Touch Icon

Manifest

Theme Color

Canonical

Open Graph

Twitter Cards

JSON-LD

CSS

Google Fonts
```

Never change this order.

---

# Page Metadata Standard

Every page MUST contain

- Title
- Meta Description
- Canonical URL
- Open Graph Tags
- Twitter Cards
- JSON-LD
- Favicons
- Manifest
- Theme Color
- Robots
- Author

---

# Title Rules

Recommended Length

50–60 characters

Good Example

Budget Planner for Students | Cyvora

Bad Example

Budget Budget Budget Tool Best Budget Planner Free Online

Rules

- Put important keyword first
- Include branding at the end
- Avoid keyword stuffing
- Every page title must be unique

---

# Meta Description Rules

Recommended Length

140–160 characters

Example

Discover smart budgeting tools, AI tutorials, technology guides and career resources designed to help students and professionals learn, build and grow.

Rules

- Natural language
- Include primary keyword
- Every page unique
- Encourage clicks

---

# Canonical URL Rules

Always use

https://www.cyvora.in/about.html

Never use

/about.html

or

about.html

Each page must point to itself.

---

# Robots Tag

Every indexable page

```html
<meta name="robots" content="index, follow">
```

Pages not intended for Google

```html
<meta name="robots" content="noindex, nofollow">
```

---

# Favicons

Every page includes

```html
<link rel="icon" href="/favicon.ico" sizes="any">

<link rel="icon"
type="image/png"
sizes="32x32"
href="/favicon-32x32.png">

<link rel="icon"
type="image/png"
sizes="16x16"
href="/favicon-16x16.png">

<link rel="apple-touch-icon"
sizes="180x180"
href="/apple-touch-icon.png">

<link rel="manifest"
href="/site.webmanifest">
```

---

# Open Graph Standard

Every page must include

- og:type
- og:title
- og:description
- og:url
- og:image
- og:site_name

Image Size

1200 × 630 px

Image Format

PNG

---

# Twitter Card Standard

```html
<meta name="twitter:card"
content="summary_large_image">

<meta name="twitter:title">

<meta name="twitter:description">

<meta name="twitter:image">
```

---

# JSON-LD Standard

Homepage

Organization

About

AboutPage

Blog Listing

CollectionPage

Blog

BlogPosting

Budget Tool

SoftwareApplication

FAQ Pages

FAQPage

Never copy the same schema to every page.

---

# Heading Structure

Only ONE

```
<h1>
```

per page.

Use

```
<h2>

<h3>

<h4>
```

correctly.

Never skip heading levels.

---

# Images

Every image requires

```html
alt=""
```

Example

```html
<img
src="budget-tool.png"
alt="Budget Planner Dashboard">
```

---

# Internal Linking

Every page should link to

- Home
- Blogs
- Tools
- About

Relevant pages should cross-link to related blogs.

---

# Performance Checklist

Before deployment verify

✅ Title

✅ Description

✅ Canonical

✅ Robots

✅ Open Graph

✅ Twitter Card

✅ JSON-LD

✅ Favicon

✅ Manifest

✅ Theme Color

✅ One H1

✅ Image Alt Text

✅ Internal Links

✅ Mobile Friendly

---

# Page Type Standards

## Homepage

Schema

Organization

Purpose

Introduce website

Primary Keyword

AI Tools

Tech Tutorials

Career Resources

---

## About

Schema

AboutPage

Purpose

Build trust

---

## Blog Listing

Schema

CollectionPage

Purpose

Help Google discover articles

---

## Individual Blog

Schema

BlogPosting

Include

Author

Published Date

Modified Date

Featured Image

Breadcrumb

---

## Budget Planner

Schema

SoftwareApplication

Include

Application Category

Operating System

Offer

Aggregate Rating (future)

FAQ Schema (future)

---

# File Naming

Good

budget-planner.html

sql-formatter.html

career-roadmap.html

Bad

Tool1.html

New Page.html

MyToolFinalFinal.html

---

# URL Structure

Good

/tools/budget-planner.html

/blogs/sql-performance-guide.html

Bad

/page12.html

/blog1.html

/tool-new-final.html

---

# OG Image Naming

Homepage

og-home.png

About

og-about.png

Blogs

og-blogs.png

Budget Tool

og-budget.png

Blog

og-blog-name.png

---

# Deployment Checklist

Before every Git Push

- Validate HTML

- Check Lighthouse

- Test Mobile

- Validate Schema

- Check Open Graph

- Verify Canonical

- Test Sitemap

- Test robots.txt

- Verify all internal links

- Verify favicon

- Verify analytics

Only then deploy to production.

---

# Future SEO Roadmap

Phase 1 ✅

- Canonical
- Favicons
- Manifest
- JSON-LD
- Open Graph
- Twitter Cards

Phase 2

- FAQ Schema
- Breadcrumb Schema
- Article Schema
- Author Schema
- Review Schema

Phase 3

- Dynamic Sitemap
- Search Function
- SearchAction Schema
- RSS Feed
- Rich Snippets

---

Maintained by

Suman Chaitanya

Project

Cyvora

Version

1.0