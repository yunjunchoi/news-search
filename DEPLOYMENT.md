# Deployment Guide

This guide covers multiple deployment options for the News Search application.

## 🚀 Quick Deploy (GitHub Pages)

### Prerequisites
- GitHub account
- Git installed locally

### Steps

1. **Push code to GitHub** (if not already done):
```bash
git add .
git commit -m "Add AI summary features"
git push origin main
```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under "Source", select branch `main` and folder `/ (root)`
   - Click **Save**
   - Your site will be live at: `https://yourusername.github.io/news-search/`

3. **Configure API Key**:
   - Visit your deployed site
   - Go to Settings tab
   - Enter your Gemini API key
   - Save settings

**Done!** 🎉

## 🌐 Other Deployment Options

### Option 1: Netlify

1. **Via Netlify UI**:
   - Go to [Netlify](https://netlify.com)
   - Drag and drop the `news-search` folder
   - Site is live instantly!

2. **Via Netlify CLI**:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy from project folder
cd news-search
netlify deploy --prod
```

### Option 2: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd news-search
vercel --prod
```

### Option 3: Local Server

For testing or personal use:

**Python**:
```bash
cd news-search
python -m http.server 8000
# Visit: http://localhost:8000
```

**Node.js**:
```bash
cd news-search
npx http-server -p 8000
# Visit: http://localhost:8000
```

**PHP**:
```bash
cd news-search
php -S localhost:8000
# Visit: http://localhost:8000
```

## 🔒 Security Best Practices

### API Key Management

**Important**: Since this is a client-side application, the API key is stored in localStorage and visible to users. For production use:

1. **Use Domain Restrictions**:
   - In Google Cloud Console, restrict your API key to specific domains
   - Navigate to: APIs & Services → Credentials → Edit API Key
   - Add your deployment domain(s)

2. **Monitor Usage**:
   - Check Google Cloud Console regularly
   - Set up billing alerts (if using paid tier)
   - Review API usage patterns

3. **User Education**:
   - Remind users their API key is personal
   - Don't share API keys publicly
   - Rotate keys if compromised

### Content Security Policy (Optional)

Add to `index.html` `<head>` for enhanced security:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://cdnjs.cloudflare.com;
  style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdn.tailwindcss.com;
  connect-src 'self' https://generativelanguage.googleapis.com;
  img-src 'self' data: https:;
  font-src 'self' data:;
">
```

## 📊 Analytics (Optional)

Track usage without compromising privacy:

### Google Analytics 4

Add before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Plausible (Privacy-focused)

```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

## 🧪 Testing Checklist

Before deploying to production:

- [ ] Test with valid Gemini API key
- [ ] Test without API key (should show warning)
- [ ] Test AI toggle on/off
- [ ] Test search with multiple keywords
- [ ] Test date range filtering
- [ ] Test country selection and filtering
- [ ] Test history save/load
- [ ] Test Excel export (single & bulk)
- [ ] Test re-search from history
- [ ] Test delete history item
- [ ] Test clear all history
- [ ] Test modal close/open
- [ ] Test on mobile devices
- [ ] Test in different browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test localStorage limits (50+ searches)
- [ ] Test network error handling

## 🔄 Updates & Maintenance

### Updating the Application

1. **Pull latest changes**:
```bash
git pull origin main
```

2. **Test locally**:
```bash
python -m http.server 8000
```

3. **Deploy**:
- GitHub Pages: Push to main branch (auto-deploys)
- Netlify: Push to repo or drag-drop updated folder
- Vercel: Push to repo or run `vercel --prod`

### Version Control

Suggested workflow:

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Merge to main
git checkout main
git merge feature/new-feature
git push origin main
```

## 🌍 Custom Domain (Optional)

### GitHub Pages

1. Go to Settings → Pages
2. Add custom domain (e.g., `news.yourdomain.com`)
3. Configure DNS:
   - Type: CNAME
   - Name: news
   - Value: yourusername.github.io

### Netlify/Vercel

Both platforms provide easy custom domain setup in their dashboard.

## 📱 Progressive Web App (Future Enhancement)

To make it installable on mobile devices, add:

**manifest.json**:
```json
{
  "name": "News Search with AI",
  "short_name": "NewsSearch",
  "description": "AI-powered news search tool",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**Service Worker** (sw.js):
```javascript
// Basic offline support
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('news-search-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/script.js',
        '/style.css'
      ]);
    })
  );
});
```

## 🆘 Support

If you encounter issues during deployment:

1. Check browser console for errors
2. Verify all files are uploaded
3. Check API key configuration
4. Ensure HTTPS is enabled (required for localStorage on some platforms)
5. Review deployment platform logs

---

**Happy Deploying! 🚀**
