# Quick Start Guide

Get up and running with News Search + AI Summaries in 5 minutes!

## ⚡ 5-Minute Setup

### Step 1: Get Your Free Groq API Key (2 minutes)

1. Open [Groq Console](https://console.groq.com/keys)
2. Sign in with your Google account
3. Click **"Create API Key"** or **"Get API Key"**
4. Copy the generated key (looks like: `AIzaSyC...`)

**Cost:** FREE! 
- 15 requests/minute
- 1,500 requests/day
- More than enough for news searches

### Step 2: Open the Application (1 minute)

**Option A: Use GitHub Pages** (if already deployed)
```
https://yourusername.github.io/news-search/
```

**Option B: Run Locally**
```bash
cd news-search
python -m http.server 8000
# Visit: http://localhost:8000
```

### Step 3: Configure API Key (1 minute)

1. Click the **Settings** tab
2. Paste your API key in the input field
3. Click **Save Settings**
4. ✅ Yellow warning banner should disappear

### Step 4: Search! (1 minute)

1. Go to **Search** tab
2. Enter a keyword (e.g., "artificial intelligence")
3. Select country (e.g., "United States")
4. Click **Search News**
5. 🎉 AI summary appears in modal!
6. Click **Continue to Google News** → See results

**Done!** You're all set! 🚀

---

## 🎯 Common Use Cases

### 1. Quick Research
**Goal:** Get context before diving deep

```
1. Enter topic: "quantum computing"
2. Select country: US
3. Search → Read AI summary
4. Get instant context + trends
5. Continue to news if interested
```

### 2. Historical Analysis
**Goal:** Understand topic evolution over time

```
1. Enter topic: "climate policy"
2. Set dates: Jan 1, 2024 - Dec 31, 2024
3. Search → AI summarizes the year
4. Export to Excel for records
```

### 3. Multi-Country Comparison
**Goal:** See how different regions cover a topic

```
1. Search "tech regulation" in US → Export
2. Search "tech regulation" in EU → Export
3. Search "tech regulation" in China → Export
4. Compare AI summaries in Excel
```

### 4. Tracking a Story
**Goal:** Follow a developing story

```
1. Search initial event
2. View History tab to see AI summaries
3. Weekly searches with date filters
4. Export all → See evolution
```

---

## 💡 Pro Tips

### Save API Costs

1. **Review history first** - You might already have the summary you need
2. **Disable AI when not needed** - Settings → Toggle off "Enable AI Summaries"
3. **Batch related queries** - AI summaries often include related keywords

### Search Better

1. **Use AND logic** - Add multiple keywords for precise results
2. **Filter by dates** - Narrow down to specific events
3. **Try different countries** - Get regional perspectives
4. **Use quotes for phrases** - Auto-handled by the app

### Stay Organized

1. **Export regularly** - Download history to Excel weekly
2. **Re-search from history** - Click 🔍 to reuse past searches
3. **Delete irrelevant searches** - Keep history clean
4. **Review AI summaries** - Expand collapsed summaries in History

---

## 📱 Shortcuts

| Action | Shortcut |
|--------|----------|
| Filter countries | Type while in dropdown |
| Select country | Arrow keys + Enter |
| Close modal | Escape |
| Switch tabs | Click tab names |

---

## 🚨 Troubleshooting

### "API Key Required" banner won't go away
- **Fix:** Settings → Enter valid key → Save → Refresh page

### AI summary shows error
- **Check:** API key is correct (no extra spaces)
- **Check:** Internet connection is working
- **Check:** Not over 1,500 requests/day limit
- **Quick fix:** Click "Continue Anyway" to skip AI

### Excel export doesn't work
- **Check:** Pop-up blocker disabled
- **Check:** Browser allows downloads
- **Try:** Different browser

### History disappeared
- **Cause:** Likely in Incognito/Private mode
- **Fix:** Use regular browser window

### Country filter not working
- **Fix:** Clear filter input (click ×)
- **Try:** Typing fewer letters
- **Refresh:** Page and try again

---

## 📊 Understanding Your Usage

### Free Tier Limits
- **15 requests/minute** = 1 search every 4 seconds max
- **1,500 requests/day** = More than enough for normal use
- **Reset:** Daily at midnight (Pacific Time)

### Typical Usage
- **Light user:** 10-20 searches/day → Stay in free tier easily
- **Heavy user:** 100+ searches/day → Still free, just spread out
- **Research mode:** Hundreds in one day → Might hit limit, can disable AI temporarily

### Monitoring
Check your usage:
1. Visit [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to APIs & Services → Dashboard
3. View Generative Language API usage

---

## 🎨 Customization

### Change Theme
DaisyUI themes can be changed in `index.html`:
```html
<html lang="en" data-theme="dark">  <!-- Try: dark, cupcake, forest, etc. -->
```

### Adjust AI Summary Length
In `script.js`, line ~65:
```javascript
maxOutputTokens: 500,  // Reduce to 300 for shorter summaries
```

### Change Summary Prompt
In `script.js`, line ~50, customize:
```javascript
const prompt = `Your custom prompt here...`;
```

---

## 📚 Next Steps

1. **Read full README** - Detailed feature explanations
2. **Check DEPLOYMENT** - Deploy to GitHub Pages / Netlify
3. **Run TESTING checklist** - Verify everything works
4. **Customize** - Make it your own!

---

## 🆘 Need Help?

1. Check TESTING.md for detailed test cases
2. Check DEPLOYMENT.md for deployment issues
3. Check browser console for error messages
4. Open GitHub issue with details

---

**Happy Searching! 🔍✨**

*Built for efficiency - Minimal API calls, maximum value!*
