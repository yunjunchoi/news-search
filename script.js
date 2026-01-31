// =========================
// Config
// =========================
const USE_STRICT_LOCAL = true;
const STRICT_EN = new Set(['us','gb','ca','au','nz','in','ie','sg','ph','za','ng','ke']);
const STRICT_FR = new Set(['fr','be','ch','ca']);
const STRICT_ES = new Set(['es','mx','ar','co','cl','pe','ve']);
const STRICT_AR = new Set(['ae','sa','eg']);
const STRICT_ZH = new Set(['cn','hk','tw']);

// Storage keys
const STORAGE_KEYS = {
  API_KEY: 'geminiApiKey',
  ENABLE_AI: 'enableAiSummaries',
  HISTORY: 'searchHistory',
  RECENTS: 'newsSearchRecents'
};

const MAX_RECENTS = 5;
const MAX_HISTORY = 50; // Limit history to prevent excessive storage

// =========================
// Gemini API Integration
// =========================
class GeminiAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  }

  async generateSummary(searchQuery, country, dateRange) {
    if (!this.apiKey) {
      throw new Error('API key not configured');
    }

    // Cost-efficient prompt: Concise and focused
    const prompt = `Analyze this news search query and provide a brief summary (max 200 words):

Search Query: "${searchQuery}"
Region: ${country}
${dateRange ? `Date Range: ${dateRange}` : ''}

Provide:
1. Context & Background (2-3 sentences)
2. Key Trends & Topics (bullet points)
3. Related Keywords (comma-separated)

Be concise and informative.`;

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500, // Cost-efficient: limit output
            topP: 0.8,
            topK: 40
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      const summary = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!summary) {
        throw new Error('No summary generated');
      }

      return summary;
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }
}

// =========================
// Storage Management
// =========================
class Storage {
  static get(key) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  }

  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Storage error:', error);
      return false;
    }
  }

  static remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }
}

// =========================
// Search History Management
// =========================
class SearchHistory {
  static add(entry) {
    const history = Storage.get(STORAGE_KEYS.HISTORY) || [];
    
    // Add timestamp and ID
    entry.id = Date.now();
    entry.timestamp = new Date().toISOString();
    
    // Add to beginning
    history.unshift(entry);
    
    // Limit size
    if (history.length > MAX_HISTORY) {
      history.length = MAX_HISTORY;
    }
    
    Storage.set(STORAGE_KEYS.HISTORY, history);
    return entry;
  }

  static getAll() {
    return Storage.get(STORAGE_KEYS.HISTORY) || [];
  }

  static delete(id) {
    const history = this.getAll();
    const filtered = history.filter(item => item.id !== id);
    Storage.set(STORAGE_KEYS.HISTORY, filtered);
  }

  static clear() {
    Storage.remove(STORAGE_KEYS.HISTORY);
  }

  static exportToExcel(entries) {
    if (!entries || entries.length === 0) {
      alert('No data to export');
      return;
    }

    // Prepare data for Excel
    const data = entries.map(entry => ({
      'Search Query': entry.query,
      'Country': entry.country,
      'Date Range': entry.dateRange || 'N/A',
      'AI Summary': entry.aiSummary || 'N/A',
      'Timestamp': new Date(entry.timestamp).toLocaleString(),
      'Google News URL': entry.newsUrl
    }));

    // Create workbook
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Search History');

    // Auto-size columns
    const maxWidth = 100;
    const colWidths = Object.keys(data[0]).map(key => {
      const maxLen = Math.max(
        key.length,
        ...data.map(row => String(row[key]).length)
      );
      return { wch: Math.min(maxLen + 2, maxWidth) };
    });
    ws['!cols'] = colWidths;

    // Generate filename with timestamp
    const filename = `news-search-history-${new Date().toISOString().split('T')[0]}.xlsx`;
    
    // Download
    XLSX.writeFile(wb, filename);
  }
}

// =========================
// Country Data & Management
// =========================
const groupedCountries = [
  {
    region: 'Americas',
    items: [
      { code: 'ar', name: 'Argentina' },
      { code: 'br', name: 'Brazil' },
      { code: 'ca', name: 'Canada (English)' },
      { code: 'ca_fr', name: 'Canada (Français)' },
      { code: 'cl', name: 'Chile' },
      { code: 'co', name: 'Colombia' },
      { code: 'mx', name: 'Mexico' },
      { code: 'pe', name: 'Peru' },
      { code: 'us', name: 'United States' },
      { code: 've', name: 'Venezuela' }
    ]
  },
  {
    region: 'Europe (West/North)',
    items: [
      { code: 'at', name: 'Austria' },
      { code: 'be_fr', name: 'Belgium (Français)' },
      { code: 'be_nl', name: 'Belgium (Nederlands)' },
      { code: 'dk', name: 'Denmark' },
      { code: 'fi', name: 'Finland' },
      { code: 'fr', name: 'France' },
      { code: 'de', name: 'Germany' },
      { code: 'ie', name: 'Ireland' },
      { code: 'it', name: 'Italy' },
      { code: 'nl', name: 'Netherlands' },
      { code: 'no', name: 'Norway' },
      { code: 'pt', name: 'Portugal' },
      { code: 'es', name: 'Spain' },
      { code: 'se', name: 'Sweden' },
      { code: 'ch_de', name: 'Switzerland (Deutsch)' },
      { code: 'ch_fr', name: 'Switzerland (Français)' },
      { code: 'ch_it', name: 'Switzerland (Italiano)' },
      { code: 'gb', name: 'United Kingdom' },
      { code: 'is', name: 'Iceland' }
    ]
  },
  {
    region: 'Europe (Central/East)',
    items: [
      { code: 'bg', name: 'Bulgaria' },
      { code: 'cz', name: 'Czechia' },
      { code: 'gr', name: 'Greece' },
      { code: 'hu', name: 'Hungary' },
      { code: 'pl', name: 'Poland' },
      { code: 'ro', name: 'Romania' },
      { code: 'ru', name: 'Russia' },
      { code: 'sk', name: 'Slovakia' },
      { code: 'tr', name: 'Türkiye' },
      { code: 'ua', name: 'Ukraine' }
    ]
  },
  {
    region: 'Middle East & Africa',
    items: [
      { code: 'ae', name: 'United Arab Emirates' },
      { code: 'eg', name: 'Egypt' },
      { code: 'il', name: 'Israel' },
      { code: 'ke', name: 'Kenya' },
      { code: 'ng', name: 'Nigeria' },
      { code: 'sa', name: 'Saudi Arabia' },
      { code: 'za', name: 'South Africa' }
    ]
  },
  {
    region: 'Asia-Pacific',
    items: [
      { code: 'au', name: 'Australia' },
      { code: 'bd', name: 'Bangladesh' },
      { code: 'cn', name: 'China (Mainland)' },
      { code: 'hk', name: 'Hong Kong' },
      { code: 'in', name: 'India' },
      { code: 'id', name: 'Indonesia' },
      { code: 'jp', name: 'Japan' },
      { code: 'kr', name: 'Korea (South)' },
      { code: 'my', name: 'Malaysia' },
      { code: 'nz', name: 'New Zealand' },
      { code: 'pk', name: 'Pakistan' },
      { code: 'ph', name: 'Philippines' },
      { code: 'sg', name: 'Singapore' },
      { code: 'tw', name: 'Taiwan' },
      { code: 'th', name: 'Thailand' },
      { code: 'vn', name: 'Vietnam' }
    ]
  }
];

// Sort each region's items alphabetically
groupedCountries.forEach(g =>
  g.items.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }))
);

const defaultLangByCountry = {
  ar: 'es-AR', br: 'pt-BR', ca: 'en-CA', ca_fr: 'fr-CA', cl: 'es-CL', co: 'es-CO',
  mx: 'es-MX', pe: 'es-PE', us: 'en-US', ve: 'es-VE', at: 'de-AT', be_fr: 'fr-BE',
  be_nl: 'nl-BE', dk: 'da-DK', fi: 'fi-FI', fr: 'fr-FR', de: 'de-DE', ie: 'en-IE',
  it: 'it-IT', nl: 'nl-NL', no: 'no-NO', pt: 'pt-PT', es: 'es-ES', se: 'sv-SE',
  ch_de: 'de-CH', ch_fr: 'fr-CH', ch_it: 'it-CH', gb: 'en-GB', is: 'is-IS',
  bg: 'bg-BG', cz: 'cs-CZ', gr: 'el-GR', hu: 'hu-HU', pl: 'pl-PL', ro: 'ro-RO',
  ru: 'ru-RU', sk: 'sk-SK', tr: 'tr-TR', ua: 'uk-UA', ae: 'ar-AE', eg: 'ar-EG',
  il: 'he-IL', ke: 'en-KE', ng: 'en-NG', sa: 'ar-SA', za: 'en-ZA', au: 'en-AU',
  bd: 'bn-BD', cn: 'zh-CN', hk: 'zh-HK', tw: 'zh-TW', in: 'en-IN', id: 'id-ID',
  jp: 'ja-JP', kr: 'ko-KR', my: 'ms-MY', nz: 'en-NZ', pk: 'ur-PK', ph: 'en-PH',
  sg: 'en-SG', th: 'th-TH', vn: 'vi-VN'
};

// =========================
// URL Builder
// =========================
function buildNewsUrl(queries, countryKey, startDate, endDate) {
  const dateFilters = [];
  if (startDate) dateFilters.push(`after:${startDate}`);
  if (endDate) dateFilters.push(`before:${endDate}`);

  const andTerms = queries.map(q => (/\s/.test(q) ? `"${q}"` : q));
  const searchQuery = [...andTerms, ...dateFilters].join(' ');

  const gl = (countryKey.includes('_') ? countryKey.split('_')[0] : countryKey).toUpperCase();
  const hlFull = defaultLangByCountry[countryKey] || 'en';
  const baseLang = (hlFull || 'en').split('-')[0];
  const ceidLang = baseLang;

  const glLower = gl.toLowerCase();
  const isCA_FR = (countryKey === 'ca_fr');
  const isStrictEnglish = STRICT_EN.has(glLower) && !isCA_FR;
  const isStrictFrench = isCA_FR || (STRICT_FR.has(glLower) && (baseLang === 'fr' || countryKey.endsWith('_fr')));
  const isStrictSpanish = STRICT_ES.has(glLower) && baseLang === 'es';
  const isStrictArabic = STRICT_AR.has(glLower) && baseLang === 'ar';
  const isStrictChinese = STRICT_ZH.has(glLower) && baseLang === 'zh';

  const useStrict = USE_STRICT_LOCAL && (isStrictEnglish || isStrictFrench || isStrictSpanish || isStrictArabic || isStrictChinese);

  if (useStrict) {
    const params = new URLSearchParams();
    params.set('tbm', 'nws');
    params.set('q', searchQuery);
    params.set('hl', hlFull);
    params.set('gl', gl);
    params.set('cr', `country${gl}`);
    params.set('lr', `lang_${baseLang}`);
    return `https://www.google.com/search?${params.toString()}`;
  } else {
    const params = new URLSearchParams();
    params.set('q', searchQuery);
    params.set('hl', hlFull);
    params.set('gl', gl);
    params.set('ceid', `${gl}:${ceidLang}`);
    return `https://news.google.com/search?${params.toString()}`;
  }
}

// =========================
// Recent Countries Management
// =========================
function loadRecents() {
  return Storage.get(STORAGE_KEYS.RECENTS) || [];
}

function saveRecents(list) {
  Storage.set(STORAGE_KEYS.RECENTS, list);
}

function findCountryByCode(code) {
  for (const g of groupedCountries) {
    const found = g.items.find(it => it.code === code);
    if (found) return { ...found, region: g.region };
  }
  return null;
}

function upsertRecent(code) {
  if (!code) return;
  const exists = findCountryByCode(code);
  if (!exists) return;
  const list = loadRecents().filter(c => c !== code);
  list.unshift(code);
  if (list.length > MAX_RECENTS) list.length = MAX_RECENTS;
  saveRecents(list);
}

// =========================
// UI Management
// =========================
class UI {
  static showTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => {
      tab.classList.remove('tab-active');
    });
    document.getElementById(`${tabName}Tab`).classList.add('tab-active');

    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(`${tabName}Content`).classList.add('active');

    // Special actions
    if (tabName === 'history') {
      this.renderHistory();
    }
  }

  static checkApiKey() {
    const apiKey = Storage.get(STORAGE_KEYS.API_KEY);
    const banner = document.getElementById('apiKeyBanner');
    
    if (!apiKey) {
      banner.classList.remove('hidden');
    } else {
      banner.classList.add('hidden');
    }
  }

  static renderHistory() {
    const history = SearchHistory.getAll();
    const container = document.getElementById('historyList');

    if (history.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12 text-gray-500">
          <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="text-lg">No search history yet</p>
          <p class="text-sm mt-2">Your search history will appear here after you search for news</p>
        </div>
      `;
      return;
    }

    container.innerHTML = history.map(entry => `
      <div class="card bg-base-100 shadow history-item">
        <div class="card-body">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <h3 class="card-title text-lg">${this.escapeHtml(entry.query)}</h3>
              <div class="flex gap-4 text-sm text-gray-600 mt-2">
                <span>🌍 ${this.escapeHtml(entry.country)}</span>
                ${entry.dateRange ? `<span>📅 ${this.escapeHtml(entry.dateRange)}</span>` : ''}
                <span>🕐 ${new Date(entry.timestamp).toLocaleString()}</span>
              </div>
            </div>
            <div class="flex gap-2">
              <button class="btn btn-sm btn-ghost" onclick="UI.reSearch(${entry.id})" title="Re-search">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </button>
              <button class="btn btn-sm btn-ghost" onclick="SearchHistory.exportToExcel([SearchHistory.getAll().find(e => e.id === ${entry.id})])" title="Export">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </button>
              <button class="btn btn-sm btn-ghost text-error" onclick="UI.deleteHistory(${entry.id})" title="Delete">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
          
          ${entry.aiSummary ? `
            <div class="mt-4">
              <details class="collapse collapse-arrow bg-base-200">
                <summary class="collapse-title font-medium">
                  AI Summary
                </summary>
                <div class="collapse-content">
                  <p class="whitespace-pre-wrap">${this.escapeHtml(entry.aiSummary)}</p>
                </div>
              </details>
            </div>
          ` : ''}
          
          <div class="card-actions justify-end mt-2">
            <a href="${entry.newsUrl}" target="_blank" class="btn btn-sm btn-primary">
              Open Google News
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    `).join('');
  }

  static reSearch(id) {
    const entry = SearchHistory.getAll().find(e => e.id === id);
    if (!entry) return;

    // Switch to search tab
    this.showTab('search');

    // Fill in the form
    const queryInputs = document.querySelectorAll('.search-input');
    const queries = entry.query.split(' AND ').map(q => q.replace(/"/g, ''));
    
    // Clear existing inputs
    const container = document.getElementById('queryContainer');
    container.innerHTML = '<input type="text" class="search-input input input-bordered mb-2" placeholder="Enter search term">';
    
    // Add query inputs
    queries.forEach((q, i) => {
      if (i > 0) {
        document.getElementById('addQueryBtn').click();
      }
      document.querySelectorAll('.search-input')[i].value = q;
    });

    // Set country (extract from entry.country string)
    const countryMatch = entry.country.match(/\(([^)]+)\)/);
    if (countryMatch) {
      const countryCode = countryMatch[1];
      document.getElementById('countrySelect').value = countryCode;
    }

    // Set dates if present
    if (entry.dateRange) {
      const dateMatch = entry.dateRange.match(/(\d{4}-\d{2}-\d{2})\s+to\s+(\d{4}-\d{2}-\d{2})/);
      if (dateMatch) {
        document.getElementById('startDate').value = dateMatch[1];
        document.getElementById('endDate').value = dateMatch[2];
      }
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  static deleteHistory(id) {
    if (confirm('Delete this search from history?')) {
      SearchHistory.delete(id);
      this.renderHistory();
    }
  }

  static escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// =========================
// Country Dropdown Setup
// =========================
let activeIndex = -1;

function tokensFromQuery(q) {
  return q.toLowerCase().split(/\s+/).filter(Boolean);
}

function filterGroups(query) {
  if (!query.trim())
    return groupedCountries.map(g => ({ region: g.region, items: [...g.items] }));
  const tokens = tokensFromQuery(query);
  return groupedCountries
    .map(group => {
      const filtered = group.items.filter(({ code, name }) => {
        const hay = `${name} ${code}`.toLowerCase();
        return tokens.every(t => hay.includes(t));
      });
      return { region: group.region, items: filtered };
    })
    .filter(g => g.items.length > 0);
}

function allCountriesFlat(groups) {
  const list = [];
  const recents = loadRecents();
  const tokens = tokensFromQuery(document.getElementById('countryFilter').value || '');
  const currentFiltered = recents
    .map(code => findCountryByCode(code))
    .filter(Boolean)
    .filter(({ code, name }) => {
      if (!tokens.length) return true;
      const hay = `${name} ${code}`.toLowerCase();
      return tokens.every(t => hay.includes(t));
    })
    .map(it => ({ ...it, region: 'Current' }));
  list.push(...currentFiltered);

  groups.forEach(g => {
    g.items.forEach(it => list.push({ ...it, region: g.region }));
  });
  
  const seen = new Set();
  return list.filter(it => (seen.has(it.code) ? false : (seen.add(it.code), true)));
}

function highlight(text, tokens) {
  let out = text;
  tokens.forEach(t => {
    if (!t) return;
    const re = new RegExp(`(${t.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')})`, 'ig');
    out = out.replace(re, '<mark class="px-0.5 rounded">$1</mark>');
  });
  return out;
}

function renderSelect(groups, { withRecents = true } = {}) {
  const select = document.getElementById('countrySelect');
  const prev = select.value;
  select.innerHTML = '';

  const recents = withRecents ? loadRecents() : [];
  const recentItems = recents.map(code => findCountryByCode(code)).filter(Boolean);

  if (recentItems.length) {
    const ogCur = document.createElement('optgroup');
    ogCur.label = '— Current —';
    recentItems.forEach(({ code, name }) => {
      const opt = document.createElement('option');
      opt.value = code;
      opt.textContent = name;
      ogCur.appendChild(opt);
    });
    select.appendChild(ogCur);
  }

  (groups || groupedCountries).forEach(group => {
    const og = document.createElement('optgroup');
    og.label = `— ${group.region} —`;
    group.items.forEach(({ code, name }) => {
      const opt = document.createElement('option');
      opt.value = code;
      opt.textContent = name;
      og.appendChild(opt);
    });
    select.appendChild(og);
  });

  if ([...select.querySelectorAll('option')].some(o => o.value === prev)) {
    select.value = prev;
  }
}

function renderSuggestions(query) {
  const suggWrap = document.getElementById('countrySuggestions');
  const groups = filterGroups(query);
  const tokens = tokensFromQuery(query);
  const flat = allCountriesFlat(groups);

  if (!query.trim() || flat.length === 0) {
    suggWrap.classList.add('hidden');
    suggWrap.innerHTML = '';
    return;
  }

  const MAX = 20;
  const items = flat.slice(0, MAX);
  suggWrap.innerHTML = items
    .map(
      (it, idx) => `
      <button type="button"
        class="w-full text-left px-3 py-2 hover:bg-base-200 focus:bg-base-200 outline-none suggestion-item"
        data-code="${it.code}" data-index="${idx}">
        <div class="text-sm font-medium">${highlight(it.name, tokens)}</div>
        <div class="text-xs opacity-60">${it.region} · <code>${highlight(it.code, tokens)}</code></div>
      </button>`
    )
    .join('');

  suggWrap.classList.remove('hidden');
  activeIndex = -1;
}

// =========================
// Modal Management
// =========================
let currentSearchData = null;

function showSummaryModal(data) {
  const modal = document.getElementById('summaryModal');
  const loadingState = document.getElementById('loadingState');
  const summaryContent = document.getElementById('summaryContent');
  const errorState = document.getElementById('errorState');

  // Reset states
  loadingState.classList.remove('hidden');
  summaryContent.classList.add('hidden');
  errorState.classList.add('hidden');

  currentSearchData = data;
  modal.showModal();

  // Generate AI summary
  const apiKey = Storage.get(STORAGE_KEYS.API_KEY);
  const enableAI = Storage.get(STORAGE_KEYS.ENABLE_AI) !== false; // Default true

  if (!enableAI || !apiKey) {
    // Skip AI summary
    loadingState.classList.add('hidden');
    errorState.classList.remove('hidden');
    document.getElementById('errorMessage').textContent = 'AI summaries are disabled or API key is not configured.';
    return;
  }

  const gemini = new GeminiAPI(apiKey);
  const dateRange = data.dateRange ? `${data.startDate} to ${data.endDate}` : null;

  gemini.generateSummary(data.query, data.country, dateRange)
    .then(summary => {
      loadingState.classList.add('hidden');
      summaryContent.classList.remove('hidden');
      document.getElementById('summaryText').textContent = summary;
      
      // Save to history with summary
      data.aiSummary = summary;
    })
    .catch(error => {
      console.error('Error generating summary:', error);
      loadingState.classList.add('hidden');
      errorState.classList.remove('hidden');
      document.getElementById('errorMessage').textContent = error.message || 'Failed to generate AI summary';
    });
}

// =========================
// Initialize
// =========================
document.addEventListener('DOMContentLoaded', () => {
  // Check API key
  UI.checkApiKey();

  // Initialize country dropdown
  renderSelect(groupedCountries, { withRecents: true });

  // Create suggestions wrapper
  const filterInput = document.getElementById('countryFilter');
  const suggWrap = document.createElement('div');
  suggWrap.id = 'countrySuggestions';
  suggWrap.className = 'absolute z-40 mt-1 w-full bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-64 overflow-auto hidden';
  filterInput.parentNode.style.position = 'relative';
  filterInput.parentNode.appendChild(suggWrap);

  // Add custom scrollbar styles
  const style = document.createElement('style');
  style.textContent = `
    #countrySuggestions::-webkit-scrollbar { width: 8px; height: 8px; }
    #countrySuggestions::-webkit-scrollbar-thumb { background: rgba(120,120,120,.35); border-radius: 6px; }
    #countrySuggestions:hover::-webkit-scrollbar-thumb { background: rgba(120,120,120,.6); }
    #countrySuggestions::-webkit-scrollbar-track { background: transparent; }
    @supports (scrollbar-color: auto) {
      #countrySuggestions { scrollbar-color: rgba(120,120,120,.45) transparent; scrollbar-width: thin; }
    }
  `;
  document.head.appendChild(style);

  // Country filter
  filterInput.addEventListener('input', () => {
    const q = filterInput.value;
    const filtered = filterGroups(q);
    renderSelect(filtered, { withRecents: true });
    renderSuggestions(q);
  });

  // Suggestion click
  suggWrap.addEventListener('click', e => {
    const btn = e.target.closest('.suggestion-item');
    if (!btn) return;
    const code = btn.getAttribute('data-code');
    document.getElementById('countrySelect').value = code;
    upsertRecent(code);
    renderSelect(filterGroups(filterInput.value), { withRecents: true });
    suggWrap.classList.add('hidden');
  });

  // Keyboard navigation
  function moveActive(delta) {
    const buttons = Array.from(suggWrap.querySelectorAll('.suggestion-item'));
    if (buttons.length === 0) return;
    activeIndex = (activeIndex + delta + buttons.length) % buttons.length;
    buttons.forEach((b, i) => b.classList.toggle('bg-base-200', i === activeIndex));
    const active = buttons[activeIndex];
    if (active) active.scrollIntoView({ block: 'nearest' });
  }

  filterInput.addEventListener('keydown', e => {
    const visible = !suggWrap.classList.contains('hidden');
    if (e.key === 'ArrowDown') {
      if (!visible) renderSuggestions(filterInput.value);
      moveActive(+1);
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      if (!visible) renderSuggestions(filterInput.value);
      moveActive(-1);
      e.preventDefault();
    } else if (e.key === 'Enter') {
      const buttons = Array.from(suggWrap.querySelectorAll('.suggestion-item'));
      if (visible && buttons.length > 0) {
        const pick = activeIndex >= 0 ? buttons[activeIndex] : buttons[0];
        const code = pick.getAttribute('data-code');
        document.getElementById('countrySelect').value = code;
        upsertRecent(code);
        renderSelect(filterGroups(filterInput.value), { withRecents: true });
        suggWrap.classList.add('hidden');
        e.preventDefault();
      }
    } else if (e.key === 'Escape') {
      suggWrap.classList.add('hidden');
    }
  });

  filterInput.addEventListener('blur', () => {
    setTimeout(() => suggWrap.classList.add('hidden'), 120);
  });

  // Country select change
  document.getElementById('countrySelect').addEventListener('change', () => {
    upsertRecent(document.getElementById('countrySelect').value);
    renderSelect(filterGroups(filterInput.value), { withRecents: true });
  });

  // Add query button
  document.getElementById('addQueryBtn').addEventListener('click', () => {
    const container = document.getElementById('queryContainer');
    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.className = 'search-input input input-bordered mb-2';
    newInput.placeholder = 'Enter search keyword';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '×';
    deleteBtn.className = 'btn btn-xs btn-circle btn-outline ml-2 mb-2';
    deleteBtn.addEventListener('click', () => {
      container.removeChild(newInput);
      container.removeChild(deleteBtn);
    });

    container.appendChild(newInput);
    container.appendChild(deleteBtn);
  });

  // Search button
  document.getElementById('searchBtn').addEventListener('click', () => {
    const queries = Array.from(document.querySelectorAll('.search-input'))
      .map(input => input.value.trim())
      .filter(q => q);

    if (!queries.length) {
      alert('Please enter a search term');
      return;
    }

    const countryKey = document.getElementById('countrySelect').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      alert('Start date must be before end date');
      return;
    }

    const newsUrl = buildNewsUrl(queries, countryKey, startDate, endDate);
    const country = findCountryByCode(countryKey);
    
    const dateRange = (startDate && endDate) ? `${startDate} to ${endDate}` :
                      startDate ? `from ${startDate}` :
                      endDate ? `until ${endDate}` : '';

    const searchData = {
      query: queries.join(' AND '),
      country: `${country.name} (${countryKey})`,
      dateRange,
      startDate,
      endDate,
      newsUrl
    };

    // Show modal with AI summary
    showSummaryModal(searchData);
    
    // Update recent countries
    upsertRecent(countryKey);
  });

  // Modal buttons
  document.getElementById('continueToNewsBtn').addEventListener('click', () => {
    if (currentSearchData) {
      // Save to history
      SearchHistory.add(currentSearchData);
      
      // Open Google News
      window.open(currentSearchData.newsUrl, '_blank');
      
      // Close modal
      document.getElementById('summaryModal').close();
    }
  });

  document.getElementById('continueAnywayBtn').addEventListener('click', () => {
    if (currentSearchData) {
      // Save to history without AI summary
      SearchHistory.add(currentSearchData);
      
      // Open Google News
      window.open(currentSearchData.newsUrl, '_blank');
      
      // Close modal
      document.getElementById('summaryModal').close();
    }
  });

  document.getElementById('exportSummaryBtn').addEventListener('click', () => {
    if (currentSearchData && currentSearchData.aiSummary) {
      SearchHistory.exportToExcel([currentSearchData]);
    }
  });

  // Tab switching
  document.getElementById('searchTab').addEventListener('click', () => UI.showTab('search'));
  document.getElementById('historyTab').addEventListener('click', () => UI.showTab('history'));
  document.getElementById('settingsTab').addEventListener('click', () => UI.showTab('settings'));

  // History buttons
  document.getElementById('exportAllBtn').addEventListener('click', () => {
    SearchHistory.exportToExcel(SearchHistory.getAll());
  });

  document.getElementById('clearHistoryBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all search history? This cannot be undone.')) {
      SearchHistory.clear();
      UI.renderHistory();
    }
  });

  // Settings
  document.getElementById('showApiKeyBtn').addEventListener('click', () => {
    UI.showTab('settings');
  });

  // Load settings
  const apiKey = Storage.get(STORAGE_KEYS.API_KEY);
  const enableAI = Storage.get(STORAGE_KEYS.ENABLE_AI);
  
  if (apiKey) {
    document.getElementById('apiKeyInput').value = apiKey;
  }
  if (enableAI !== null) {
    document.getElementById('enableAiToggle').checked = enableAI;
  }

  // Toggle API key visibility
  document.getElementById('toggleApiKeyBtn').addEventListener('click', () => {
    const input = document.getElementById('apiKeyInput');
    input.type = input.type === 'password' ? 'text' : 'password';
  });

  // Save settings
  document.getElementById('saveSettingsBtn').addEventListener('click', () => {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    const enableAI = document.getElementById('enableAiToggle').checked;
    
    if (apiKey) {
      Storage.set(STORAGE_KEYS.API_KEY, apiKey);
    } else {
      Storage.remove(STORAGE_KEYS.API_KEY);
    }
    
    Storage.set(STORAGE_KEYS.ENABLE_AI, enableAI);
    
    UI.checkApiKey();
    
    // Show success message
    const btn = document.getElementById('saveSettingsBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Saved!';
    btn.disabled = true;
    
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }, 2000);
  });
});

// Make UI methods globally accessible for inline onclick handlers
window.UI = UI;
window.SearchHistory = SearchHistory;
