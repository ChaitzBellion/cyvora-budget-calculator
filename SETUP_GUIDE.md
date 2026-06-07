# WealthPilot Website - Setup & Deployment Guide

Welcome to the WealthPilot website repository! This guide will help you understand the project structure and how to deploy it to your domain.

## Project Structure

```
v0-project/
├── index.html                 # Home page hub
├── about.html                 # About/Bio page
├── blogs.html                 # Blog listing page
├── tips.html                  # Financial tips page
├── styles.css                 # Global styles (dark theme)
├── tools/
│   ├── index.html            # Tools listing page
│   ├── budget-calculator.html # Budget calculator tool
│   ├── budget-calculator.js   # Budget calculator logic
│   └── budget-calculator.css  # Budget calculator styles
├── blogs/
│   ├── README.md             # Blog system documentation
│   ├── BLOG_TEMPLATE.html    # Template for new blog posts
│   ├── blog-post.css         # Blog post styles
│   └── vercel-deployment-guide.html  # Example blog post
└── SETUP_GUIDE.md            # This file
```

## Key Features

### Home Page (`index.html`)
- Hero section with brand introduction
- Feature cards highlighting key offerings
- Tools preview section
- Blog preview section
- Call-to-action sections
- Responsive design

### Tools Section (`/tools/`)
- **Tools Hub** - Overview of all available tools
- **Budget Calculator** - Interactive personal finance tool
  - Real-time calculations
  - FIRE status tracking
  - Emergency fund monitoring
  - Wealth projection simulator
- Future tools can be easily added

### Blog System (`/blogs/`)
- Full-featured blog post template
- SEO-optimized meta tags
- Social sharing buttons
- Author information
- Related posts section
- Responsive typography
- Code highlighting support
- Highlight and info boxes

### Navigation
- **Floating Sidebar** - Modern, non-traditional navigation
  - Fixed position on desktop (left side)
  - Floating pill on mobile (bottom)
  - Icon-based with tooltips
  - Active state indicators
  - Smooth transitions

## Color Scheme

The website uses a dark theme with mint green accents (WealthPilot brand colors):

```css
--primary: #1e8a6a          /* Mint green - Main brand color */
--secondary: #d99a25        /* Gold - Accent color */
--accent: #d85f48           /* Coral - Alert/attention color */
--background: #0a0f0d       /* Dark background */
--foreground: #f4f7f5       /* Light text */
```

## Deployment to GitHub

### 1. Initialize Git (if not already done)
```bash
cd v0-project
git init
git add .
git commit -m "Initial commit: WealthPilot website"
```

### 2. Add Remote Repository
```bash
git remote add origin https://github.com/YourUsername/your-repo-name.git
git branch -M main
git push -u origin main
```

### 3. Verify on GitHub
- Go to your GitHub repository
- Check that all files are uploaded
- Verify the file structure matches above

## Deployment to Vercel

### Option 1: Connect GitHub to Vercel (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select "Import Git Repository"
4. Authorize Vercel to access your GitHub account
5. Select your repository
6. Click "Import"
7. Vercel will auto-detect the settings
8. Click "Deploy"

Your site is now live at: `your-project.vercel.app`

### Option 2: Manual Deployment

```bash
npm install -g vercel
vercel
# Follow the prompts to deploy
```

## Connecting a Custom Domain

Once deployed on Vercel, connect your custom domain:

### 1. Add Domain to Vercel
- Go to Vercel Project Settings
- Click "Domains"
- Click "Add Domain"
- Enter your domain (e.g., `yourdomain.com`)

### 2. Update DNS Records

Go to your domain registrar (GoDaddy, Namecheap, etc.):

**A Record (Root Domain)**
- Type: A
- Name: @
- Value: 76.76.21.21

**CNAME Record (www)**
- Type: CNAME
- Name: www
- Value: cname.vercel-dns.com

### 3. Wait for DNS Propagation
- Usually 5 minutes to 24 hours
- Check status in Vercel dashboard
- Once verified, HTTPS is automatically enabled

## Customizing the Website

### Changing Brand Information

**Home Page (`index.html`)**
- Update hero title and subtitle
- Change feature descriptions
- Update tools and blog previews

**About Page (`about.html`)**
- Replace with your bio
- Update the story section
- Modify focus areas

**Footer (Global in `styles.css`)**
- Update company name
- Change links

### Adding a New Blog Post

1. Copy `blogs/BLOG_TEMPLATE.html`
2. Rename to `blogs/your-blog-title.html`
3. Update all "UPDATE:" sections with your content
4. Add to `blogs.html` blog grid
5. Commit and push to GitHub
6. Vercel auto-deploys

See `blogs/README.md` for detailed instructions.

### Adding a New Tool

1. Create new HTML file in `tools/` directory
2. Create corresponding JS and CSS files
3. Add floating navigation to the new tool
4. Add tool card to `tools/index.html`
5. Update links to point to new tool
6. Commit and push

## Important Files to Update

When launching, update these files with your information:

- `index.html` - Hero section, feature descriptions
- `about.html` - Your bio and background
- `blogs.html` - Add your blog posts
- `tips.html` - Financial tips content
- `tools/index.html` - Update tool descriptions
- `styles.css` - Keep global styles consistent

## Environment Variables

This project doesn't require environment variables for basic functionality. However, if you add features that need them:

1. Create `.env.local` in project root
2. Add variables: `NEXT_PUBLIC_VAR_NAME=value`
3. These are already available in all HTML files

## Performance Tips

- Images: Use optimized formats (JPG, WebP)
- Code: Minimize JavaScript for faster loading
- Fonts: Currently using Google Fonts Inter (cached)
- CSS: Leverage CSS custom properties for theming
- Mobile: Test on various screen sizes (template is responsive)

## SEO Optimization

Each page includes:
- ✓ Meta descriptions
- ✓ Meta keywords
- ✓ Open Graph tags (social sharing)
- ✓ Twitter Card tags
- ✓ Canonical URLs
- ✓ Semantic HTML
- ✓ Proper heading hierarchy

To improve SEO further:
1. Add structured data (schema.org)
2. Submit sitemap to Google Search Console
3. Use Google Analytics for tracking
4. Build backlinks from other sites

## Troubleshooting

### Site Not Deploying
- Check GitHub connection in Vercel
- Ensure all files are committed and pushed
- Check build logs in Vercel dashboard

### CSS Not Loading
- Verify stylesheet paths are correct
- Check that `styles.css` exists in root
- Clear browser cache and hard refresh (Ctrl+Shift+R)

### Navigation Not Working
- Verify file paths in nav links
- Check that HTML files are in correct directories
- Test in different browsers

### Blog Post Not Showing
- Confirm HTML file is saved in `blogs/` directory
- Check that blog card is added to `blogs.html`
- Verify link path is correct

## Updating Content

### Regular Updates
1. Make changes locally
2. Commit: `git commit -m "Update: description"`
3. Push: `git push`
4. Vercel auto-deploys within seconds

### Blog Post Updates
1. Edit the `.html` file
2. Commit and push
3. No rebuild needed - instant update

### CSS Changes
1. Edit `styles.css` or specific component CSS
2. Commit and push
3. Changes take effect immediately

## Backup & Version Control

**Important**: Always commit changes before deploying
```bash
git add .
git commit -m "Meaningful commit message"
git push origin main
```

Use descriptive commit messages:
- ✓ "Add new blog post: Emergency Fund Guide"
- ✓ "Update home page hero section"
- ✗ "Update files"
- ✗ "Fix bug"

## Analytics Setup

### Google Analytics
1. Create Google Analytics account
2. Get your Tracking ID
3. Add to `<head>` of `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR_ID');
</script>
```

### Vercel Analytics
- Available in Vercel dashboard
- No setup needed
- Shows Core Web Vitals and performance metrics

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **GitHub Docs**: https://docs.github.com
- **HTML/CSS Reference**: https://developer.mozilla.org
- **Blog System**: See `blogs/README.md`

## Next Steps

1. ✓ Customize content for your brand
2. ✓ Deploy to GitHub
3. ✓ Deploy to Vercel
4. ✓ Connect custom domain
5. ✓ Set up analytics
6. ✓ Add your blog posts
7. ✓ Monitor performance
8. ✓ Keep content updated

## Maintenance Checklist

- [ ] Update blog posts monthly
- [ ] Check links for broken references
- [ ] Monitor analytics for traffic patterns
- [ ] Update tips and tools as needed
- [ ] Backup repository regularly
- [ ] Test mobile responsiveness
- [ ] Review and update meta descriptions

---

**Happy publishing! Your WealthPilot website is ready to go live.**
