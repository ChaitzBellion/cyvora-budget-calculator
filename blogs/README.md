# WealthPilot Blog System

This directory contains all blog posts for the WealthPilot website. The blog uses a consistent design system and structure for optimal readability and SEO.

## Files Overview

- **blog-post.css** - Styles specific to blog post pages (DO NOT modify structure)
- **BLOG_TEMPLATE.html** - Template for creating new blog posts (START HERE)
- **vercel-deployment-guide.html** - Example blog post showing proper implementation
- **README.md** - This file with instructions

## Creating a New Blog Post

### Step 1: Copy the Template
1. Duplicate `BLOG_TEMPLATE.html`
2. Rename it to: `your-blog-title.html` (use lowercase, hyphens instead of spaces)
3. Example: `emergency-fund-guide.html`, `tax-optimization-2026.html`

### Step 2: Update Meta Information
Replace all "UPDATE:" sections in the `<head>` with your content:

- **Title Tag**: `<title>Your Title | WealthPilot Blog</title>`
- **Meta Description**: 150-160 characters, includes main keywords
- **Meta Keywords**: 4-5 relevant keywords
- **Author**: Keep as "Cyvora" unless changed
- **OG Image**: Featured image URL (1200x630px recommended)
- **Published Date**: Current publication date in ISO format

### Step 3: Write Your Blog Post

#### Structure Guidelines
- Use semantic HTML: `<h2>`, `<h3>`, `<p>`, `<ul>`, `<ol>`
- Keep paragraphs to 2-4 sentences
- Use section IDs matching the Table of Contents links
- Update the TOC with your actual section headings

#### Content Elements Available

**Regular Text**
```html
<p>Your paragraph content here.</p>
```

**Highlight Box (Important Tips)**
```html
<div class="highlight-box">
    <h3>Pro Tip</h3>
    <p>Important information that readers should remember.</p>
</div>
```

**Info Box (Additional Context)**
```html
<div class="info-box">
    <p>Extra information or definitions.</p>
</div>
```

**Code Block**
```html
<div class="code-block">
    <pre><code>// Your code here</code></pre>
</div>
```

**Tables (Data)**
```html
<table class="dns-table">
    <tr>
        <th>Column Header 1</th>
        <th>Column Header 2</th>
    </tr>
    <tr>
        <td>Data 1</td>
        <td>Data 2</td>
    </tr>
</table>
```

**Lists**
```html
<ul>
    <li>Unordered item 1</li>
    <li>Unordered item 2</li>
</ul>

<ol>
    <li>Ordered item 1</li>
    <li>Ordered item 2</li>
</ol>
```

### Step 4: Add to Blog Listing

Once your blog post is complete, add it to `../blogs.html` in the blog grid:

```html
<article class="blog-card">
    <div class="blog-image">
        <!-- Use an emoji or icon -->
        <svg><!-- ... --></svg>
    </div>
    <div class="blog-content">
        <div class="blog-meta">
            <span>Category</span>
            <span>X min read</span>
        </div>
        <h3 class="blog-title">Your Blog Post Title</h3>
        <p class="blog-excerpt">
            Brief description of your blog post that entices readers.
        </p>
    </div>
</article>
```

Link it by wrapping the card in an anchor tag:
```html
<a href="blogs/your-blog-title.html" style="text-decoration: none;">
    <!-- Blog card content -->
</a>
```

## Blog Post Categories

Current categories available:
- **Technology** - Deployment, tools, coding
- **Investing** - Market insights, investment strategies
- **Budgeting** - Money management, expense tracking
- **FIRE** - Financial Independence/Retire Early
- **Tax** - Tax optimization, deductions
- **Savings** - Emergency funds, savings goals
- **Business** - Entrepreneurship, side hustles

Feel free to add new categories as needed.

## Best Practices

### Writing
- Start with a compelling hook
- Use short paragraphs (2-4 sentences)
- Include practical examples
- End with actionable takeaways
- Write in second person ("you") when appropriate

### SEO
- Include primary keyword in title, description, and first paragraph
- Use descriptive headings (h2, h3)
- Add internal links to other blog posts
- Include meta keywords (4-5 relevant terms)
- Use 1200x630px featured images for social sharing

### Structure
- Keep Table of Contents up to date with actual sections
- Use descriptive anchor IDs (id="section-name")
- Ensure TOC links match section IDs exactly
- Include author bio and share buttons at bottom

### Formatting
- Use **bold** for important terms (appears as primary color)
- Use *italic* for emphasis (appears as muted color)
- Code snippets should use the `.code-block` class
- Tables should use the `.dns-table` class

## File Naming Convention

Blog post filenames should:
- Use lowercase letters
- Replace spaces with hyphens
- Be descriptive and SEO-friendly
- Examples:
  - `how-to-start-investing.html`
  - `emergency-fund-calculator-guide.html`
  - `tax-deduction-checklist.html`

## Featured Images

- **Recommended Size**: 1200x630 pixels (for social media)
- **Format**: JPG or PNG
- **Storage**: Upload to a CDN or use data URLs
- **SVG Alternative**: Use the provided SVG template in blog-post.css

To use an image instead of SVG:
```html
<div class="blog-featured-image">
    <img src="path/to/image.jpg" alt="Blog post featured image">
</div>
```

## Related Posts

Keep the related posts section at the bottom updated with links to complementary content:
- At least 2 related articles
- Use relevant emoji or icon
- Write compelling descriptions
- Ensure links work correctly

## Testing Checklist

Before publishing a blog post:
- [ ] All TOC links work correctly
- [ ] Featured image displays
- [ ] Code blocks are properly formatted
- [ ] Tables render correctly
- [ ] Mobile responsiveness verified
- [ ] All links are valid
- [ ] Author info is updated
- [ ] Meta tags are complete
- [ ] Post is added to blogs.html listing
- [ ] Read time estimate is accurate

## Common Issues

**TOC links not working**
- Verify section IDs match href values exactly
- Section IDs should use hyphens, not spaces
- Example: `id="section-name"` matches `href="#section-name"`

**Images not showing**
- Check image path is correct and accessible
- Ensure image format is supported (JPG, PNG, SVG)
- Verify image permissions if using external URLs

**Styling looks off**
- Ensure you're using correct CSS classes
- Don't modify blog-post.css structure
- Check that blog-post.css is linked in your HTML
- Verify parent styles in styles.css haven't changed

## Publishing Workflow

1. Create blog post from template
2. Write and format content
3. Add to blogs.html blog grid
4. Test all functionality
5. Commit to GitHub with message: "Add blog: [Title]"
6. Push to main branch
7. Vercel auto-deploys

## Support

For questions about the blog system or need to add features, refer to the main style system in `../styles.css` and `../blogs/blog-post.css`.
