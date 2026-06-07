# WealthPilot - Quick Start Guide

Get your website up and running in 5 minutes!

## Prerequisites

- GitHub account (free at github.com)
- Vercel account (free, use GitHub login)
- Text editor (VS Code recommended)
- Custom domain (optional, use Vercel domain initially)

## Step-by-Step Deployment

### 1. Push to GitHub (2 minutes)

```bash
# Navigate to project folder
cd v0-project

# Initialize Git
git init
git add .
git commit -m "Initial commit: WealthPilot website"

# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/wealthpilot.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel (1 minute)

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Select your repository
5. Click "Import"
6. Click "Deploy"

**Your site is live!** Default URL: `wealthpilot.vercel.app`

### 3. Connect Custom Domain (2 minutes)

1. In Vercel dashboard, go to "Settings" → "Domains"
2. Click "Add"
3. Enter your domain (e.g., `yourdomain.com`)
4. Update DNS at your registrar:

**A Record:**
- Type: A
- Name: @
- Value: 76.76.21.21

**CNAME Record:**
- Type: CNAME
- Name: www
- Value: cname.vercel-dns.com

Wait 5 minutes to 24 hours for DNS to propagate.

---

## Common Tasks

### Update Website Content

```bash
# Edit files locally
# Update index.html, about.html, etc.

# Commit changes
git add .
git commit -m "Update: home page hero"
git push

# Done! Vercel auto-deploys
```

### Add a Blog Post

1. Copy `blogs/BLOG_TEMPLATE.html`
2. Rename to `blogs/your-title.html`
3. Edit content
4. Add card to `blogs.html`
5. Commit and push

**Full guide**: See `blogs/README.md`

### Add a New Page

1. Create `new-page.html` in root
2. Copy structure from `index.html`
3. Update floating nav with new link
4. Add to `styles.css` if needed
5. Commit and push

### Change Colors

Edit `styles.css` root variables:

```css
:root {
  --primary: #1e8a6a;      /* Main color */
  --secondary: #d99a25;    /* Accent */
  --accent: #d85f48;       /* Alert */
  --background: #0a0f0d;   /* Background */
  --foreground: #f4f7f5;   /* Text */
}
```

---

## File Quick Reference

| File | Purpose |
|------|---------|
| `index.html` | Home page |
| `about.html` | About page |
| `blogs.html` | Blog listing |
| `tips.html` | Tips page |
| `tools/index.html` | Tools hub |
| `styles.css` | Global styles |
| `blogs/BLOG_TEMPLATE.html` | Blog template |
| `blogs/blog-post.css` | Blog styles |

---

## Useful Commands

```bash
# Check status
git status

# View changes
git diff

# View commit history
git log

# Undo last commit (local only)
git reset HEAD~1

# Force push (be careful!)
git push --force
```

---

## Troubleshooting

**Site won't deploy**
- Verify GitHub connection in Vercel
- Check all files are committed: `git status`
- Review build logs in Vercel dashboard

**Custom domain shows error**
- Check DNS records are correct
- Wait for DNS propagation (up to 48 hours)
- Verify at: https://mxtoolbox.com/

**Site looks broken**
- Clear browser cache: Ctrl+Shift+Del
- Hard refresh: Ctrl+Shift+R
- Check file paths are correct
- View in incognito window

**Blog post not showing**
- Confirm file in `/blogs/` folder
- Check link in `blogs.html`
- Verify filename has no spaces

---

## Next Steps

1. ✓ Deploy to GitHub
2. ✓ Deploy to Vercel
3. ✓ Connect custom domain
4. ✓ Update home page content
5. ✓ Update about page
6. ✓ Add first blog post
7. ✓ Set up Google Analytics
8. ✓ Add blog post to blogs listing

---

## Help & Documentation

- **Full Setup**: See `SETUP_GUIDE.md`
- **Project Details**: See `PROJECT_OVERVIEW.md`
- **Blog System**: See `blogs/README.md`
- **Vercel Docs**: https://vercel.com/docs

---

## Quick Checklist Before Launch

- [ ] All pages deployed and working
- [ ] Custom domain connected
- [ ] Home page content updated
- [ ] About page completed
- [ ] At least one blog post published
- [ ] All links working
- [ ] Mobile tested
- [ ] Analytics set up
- [ ] Share across social media
- [ ] GitHub repo is public (if desired)

---

## Important Links

- **GitHub**: https://github.com
- **Vercel**: https://vercel.com
- **Domain Registrars**: GoDaddy, Namecheap, Google Domains
- **Browser DevTools**: F12 or Right-click → Inspect

---

**You're all set! Your WealthPilot website is live and ready to grow.**

Have questions? Check the full documentation files for detailed information.
