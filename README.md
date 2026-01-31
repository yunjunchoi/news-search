# Global News Search with AI Summaries

An enhanced news search application that provides AI-powered summaries before directing you to Google News results. Features include search history, Excel export, and cost-efficient Gemini API integration.

## 🚀 Features

### 1. **AI Summary Generation**
- Powered by Google Gemini AI (free tier)
- Generates concise summaries with context, trends, and related keywords
- Cost-efficient: Only one API call per search
- Smart prompt engineering to minimize token usage

### 2. **Enhanced Search Flow**
- Click "Search News" → AI summary modal appears first
- Review context and key insights before viewing results
- "Continue to Google News" button opens results in new tab
- Option to skip AI summary and go directly to news

### 3. **Search History**
- Automatically saves each search to localStorage
- View all past searches with AI summaries
- Quick actions: Re-search, Export, Delete
- Collapsible AI summary sections to save space

### 4. **Excel Export**
- Export individual search results
- Bulk export all history at once
- Columns: Search Query, Country, Date Range, AI Summary, Timestamp, Google News URL
- Auto-sized columns for better readability

### 5. **Smart Country Selection**
- Fuzzy search for countries
- Recent countries shown at top
- Keyboard navigation support (Arrow keys, Enter)
- Multi-language support with locale-specific results

## 📋 Setup Instructions

### Step 1: Get Your Free Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key" or "Create API Key"
4. Copy the generated API key

**Free Tier Limits:**
- 15 requests per minute
- 1,500 requests per day
- 1 million tokens per day

More than enough for news searches!

### Step 2: Configure the Application

1. Open the application in your browser
2. Click the **Settings** tab
3. Paste your API key in the "Gemini API Key" field
4. Click "Save Settings"

**Your API key is stored locally in your browser** - it never leaves your device except when making requests directly to Google's Gemini API.

### Step 3: Start Searching!

1. Go to the **Search** tab
2. Enter your search terms
3. Select a country
4. (Optional) Set date range
5. Click "Search News"
6. Review the AI summary
7. Click "Continue to Google News" to see results

## 🎯 Usage Tips

### Cost-Efficient Search Strategies

Since you mentioned being cost-sensitive, here are tips to minimize API usage:

1. **Disable AI when not needed**: In Settings, toggle off "Enable AI Summaries" to skip AI generation and go straight to Google News

2. **Review history**: Check your search history before searching again - you might find the summary you need already saved

3. **Batch related searches**: If researching a topic, review the AI summary carefully - it often includes related keywords that might answer follow-up questions

4. **Free tier is generous**: 1,500 requests/day means you can do 1,500 searches daily - more than enough for most use cases

### Advanced Search Features

- **Multiple keywords**: Add multiple search terms (combined with AND)
- **Date filtering**: Narrow results to specific time periods
- **Country filtering**: Type to search countries quickly (e.g., "jap" finds Japan)
- **Keyboard shortcuts**: Use Arrow keys and Enter in country dropdown

## 🔧 Technical Details

### Architecture

- **Frontend Only**: No backend required - runs entirely in browser
- **Storage**: localStorage for API key, settings, and history
- **API**: Direct calls to Google Gemini API (no proxy needed)
- **Export**: SheetJS (xlsx) library for Excel generation

### Files

```
news-search/
├── index.html       # Main HTML structure with tabs and modal
├── script.js        # Core logic, API integration, history management
├── style.css        # Custom animations and styles
└── README.md        # This file
```

### Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- localStorage support required

## 📊 Data Storage

All data is stored locally in your browser using localStorage:

- **API Key**: Encrypted storage in browser (never sent to third parties)
- **Search History**: Up to 50 most recent searches
- **Settings**: AI toggle, recent countries

**Privacy**: No data leaves your device except:
- Search queries sent to Google News (standard search behavior)
- AI summary requests sent to Google Gemini API

## 🛠️ Development

### Local Testing

Simply open `index.html` in a browser - no build step required!

### Deployment Options

1. **GitHub Pages**: Push to GitHub, enable Pages in settings
2. **Netlify/Vercel**: Drop the folder for instant deployment
3. **Local Server**: Any static file server works

### Customization

**Change AI prompt** (in `script.js`, line ~50):
```javascript
const prompt = `Your custom prompt here...`;
```

**Adjust token limits** (line ~65):
```javascript
maxOutputTokens: 500, // Reduce for lower cost
```

**Change history limit** (line ~16):
```javascript
const MAX_HISTORY = 50; // Store more or fewer searches
```

## 🐛 Troubleshooting

### AI Summary Not Working

1. **Check API key**: Go to Settings → verify key is entered correctly
2. **Check free tier limits**: 15 requests/minute, 1,500/day
3. **Network issues**: Check browser console for errors
4. **API key validity**: Ensure key hasn't been revoked

### History Not Saving

1. **localStorage full**: Browser may limit storage (clear old data)
2. **Private/Incognito mode**: localStorage doesn't persist
3. **Browser settings**: Check if localStorage is enabled

### Export Not Working

1. **Pop-up blocker**: Allow downloads from the site
2. **File permissions**: Ensure browser can write files
3. **XLSX library**: Check if CDN loaded (see browser console)

## 📝 Release Notes

### Version 2.0 (Current)

**New Features:**
- ✨ AI summary generation with Gemini API
- 📊 Search history with localStorage
- 📥 Excel export (individual & bulk)
- ⚙️ Settings page with API key management
- 🎨 Modal interface for AI summaries
- 🔄 Re-search functionality from history

**Improvements:**
- Cost-efficient AI prompting
- Smart token usage limits
- Better error handling
- Enhanced UI with DaisyUI tabs

### Version 1.0 (Original)

- Basic news search
- Country selection
- Date range filtering
- Multiple keyword support

## 🤝 Contributing

Found a bug or have a feature request? Feel free to:
1. Open an issue on GitHub
2. Submit a pull request
3. Contact the maintainer

## 📄 License

MIT License - feel free to use and modify as needed!

## 🙏 Credits

- **Google Gemini API**: AI summary generation
- **Google News**: News search results
- **DaisyUI + Tailwind CSS**: UI framework
- **SheetJS**: Excel export functionality

## 💡 Future Ideas

Potential enhancements (not yet implemented):
- [ ] Sentiment analysis in AI summaries
- [ ] Trending topics detection
- [ ] Summary comparison across date ranges
- [ ] RSS feed generation
- [ ] Custom summary templates
- [ ] Multi-language summary support

---

**Made with ❤️ for efficient news research**

*Cost-efficient by design - minimal API calls, maximum value!*
