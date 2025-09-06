// script.js
document.addEventListener('DOMContentLoaded', () => {
    // ========== 데이터 정의 ==========
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
                { code: 'ru', name: 'Russia' }, // 일부 지역 접근 제한 가능
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

    // 각 지역 내부 알파벳 정렬
    groupedCountries.forEach(g => g.items.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })));

    // ========== 최근 사용 국가 관리 ==========
    const RECENT_KEY = 'newsSearchRecents';
    const MAX_RECENTS = 5;

    const select = document.getElementById('countrySelect');
    const filterInput = document.getElementById('countryFilter');

    function loadRecents() {
        try {
            const raw = localStorage.getItem(RECENT_KEY);
            const arr = raw ? JSON.parse(raw) : [];
            return Array.isArray(arr) ? arr : [];
        } catch { return []; }
    }
    function saveRecents(list) {
        try { localStorage.setItem(RECENT_KEY, JSON.stringify(list)); } catch {}
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

    // ========== 제안 리스트(오버레이) DOM 및 스타일 주입 ==========
    const suggWrap = document.createElement('div');
    suggWrap.id = 'countrySuggestions';
    suggWrap.className = 'absolute z-20 mt-1 w-full bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-64 overflow-auto hidden';
    // filter 입력 컨테이너를 relative로
    filterInput.parentNode.style.position = 'relative';
    filterInput.parentNode.appendChild(suggWrap);

    // 스크롤바 커스텀 (Micro UX #2)
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

    // ========== 렌더링 ==========
    function renderSelect(groups, { withRecents = true } = {}) {
        const prev = select.value;
        select.innerHTML = '';

        // Current 그룹 (최근 사용)
        const recents = withRecents ? loadRecents() : [];
        const recentItems = recents
            .map(code => findCountryByCode(code))
            .filter(Boolean);

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

        // 지역 그룹
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

        // 기존 선택 복구
        if ([...select.querySelectorAll('option')].some(o => o.value === prev)) {
            select.value = prev;
        }
    }

    function tokensFromQuery(q) {
        return q.toLowerCase().split(/\s+/).filter(Boolean);
    }

    function filterGroups(query) {
        if (!query.trim()) return groupedCountries.map(g => ({ region: g.region, items: [...g.items] }));
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
        // Current도 제안에 포함 (필터 기준으로)
        const recents = loadRecents();
        const tokens = tokensFromQuery(filterInput.value || '');
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
        // 중복 제거 (코드 기준) - Current가 우선
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

    function renderSuggestions(query) {
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
        suggWrap.innerHTML = items.map((it, idx) => `
            <button type="button"
                class="w-full text-left px-3 py-2 hover:bg-base-200 focus:bg-base-200 outline-none suggestion-item"
                data-code="${it.code}"
                data-index="${idx}"
            >
                <div class="text-sm font-medium">${highlight(it.name, tokens)}</div>
                <div class="text-xs opacity-60">${it.region} · <code>${highlight(it.code, tokens)}</code></div>
            </button>
        `).join('');

        suggWrap.classList.remove('hidden');
        activeIndex = -1; // 키보드 내비게이션 초기화
    }

    // 초기 렌더 (Current 포함)
    renderSelect(groupedCountries, { withRecents: true });

    // ========== 필터 바인딩 ==========
    filterInput.addEventListener('input', () => {
        const q = filterInput.value;
        const filtered = filterGroups(q);
        renderSelect(filtered, { withRecents: true });
        renderSuggestions(q);
    });

    // 제안 항목 클릭 선택 (+ Current 업데이트)
    suggWrap.addEventListener('click', (e) => {
        const btn = e.target.closest('.suggestion-item');
        if (!btn) return;
        const code = btn.getAttribute('data-code');
        select.value = code;
        upsertRecent(code);
        // 필터값 유지 상태에서 목록/Current 갱신
        renderSelect(filterGroups(filterInput.value), { withRecents: true });
        suggWrap.classList.add('hidden');
    });

    // (Micro UX #1) 제안 리스트 항목 호버 시 활성 처리 + 자동 스크롤
    let activeIndex = -1;
    suggWrap.addEventListener('mousemove', (e) => {
        const btn = e.target.closest('.suggestion-item');
        if (!btn) return;
        const buttons = Array.from(suggWrap.querySelectorAll('.suggestion-item'));
        const idx = buttons.indexOf(btn);
        if (idx === -1) return;
        // 활성 토글
        buttons.forEach((b, i) => b.classList.toggle('bg-base-200', i === idx));
        activeIndex = idx;
        // 가시 스크롤
        const rect = btn.getBoundingClientRect();
        const wrapRect = suggWrap.getBoundingClientRect();
        if (rect.top < wrapRect.top || rect.bottom > wrapRect.bottom) {
            btn.scrollIntoView({ block: 'nearest' });
        }
    });

    // 키보드 내비게이션 / Enter 단축키
    function moveActive(delta) {
        const buttons = Array.from(suggWrap.querySelectorAll('.suggestion-item'));
        if (buttons.length === 0) return;
        activeIndex = (activeIndex + delta + buttons.length) % buttons.length;
        buttons.forEach((b, i) => b.classList.toggle('bg-base-200', i === activeIndex));
        const active = buttons[activeIndex];
        if (active) active.scrollIntoView({ block: 'nearest' });
    }

    filterInput.addEventListener('keydown', (e) => {
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
                select.value = code;
                upsertRecent(code);
                renderSelect(filterGroups(filterInput.value), { withRecents: true });
                suggWrap.classList.add('hidden');
                e.preventDefault();
            } else {
                // 제안이 없으면 필터 결과의 첫 번째 option 선택
                const firstOpt = select.querySelector('option');
                if (firstOpt) {
                    select.value = firstOpt.value;
                    upsertRecent(firstOpt.value);
                    renderSelect(filterGroups(filterInput.value), { withRecents: true });
                }
            }
        } else if (e.key === 'Escape') {
            suggWrap.classList.add('hidden');
        }
    });

    // 포커스 아웃 시 제안 숨김 (약간 지연하여 클릭 허용)
    filterInput.addEventListener('blur', () => {
        setTimeout(() => suggWrap.classList.add('hidden'), 120);
    });

    // 드롭다운에서 직접 선택 변경 시에도 Current 반영
    select.addEventListener('change', () => {
        upsertRecent(select.value);
        renderSelect(filterGroups(filterInput.value), { withRecents: true });
    });

    // ========== 동적 키워드 입력(기존 UI 유지) ==========
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
});

// ========== 국가→언어 매핑 (에디션 강제) ==========
const defaultLangByCountry = {
    // Americas
    ar: 'es', br: 'pt', ca: 'en', ca_fr: 'fr', cl: 'es', co: 'es', mx: 'es', pe: 'es', us: 'en', ve: 'es',
    // Europe (West/North)
    at: 'de', be_fr: 'fr', be_nl: 'nl', dk: 'da', fi: 'fi', fr: 'fr', de: 'de', ie: 'en', it: 'it',
    nl: 'nl', no: 'no', pt: 'pt', es: 'es', se: 'sv', ch_de: 'de', ch_fr: 'fr', ch_it: 'it', gb: 'en', is: 'is',
    // Europe (Central/East)
    bg: 'bg', cz: 'cs', gr: 'el', hu: 'hu', pl: 'pl', ro: 'ro', ru: 'ru', sk: 'sk', tr: 'tr', ua: 'uk',
    // Middle East & Africa
    ae: 'ar', eg: 'ar', il: 'he', ke: 'en', ng: 'en', sa: 'ar', za: 'en',
    // Asia-Pacific
    au: 'en', bd: 'bn', cn: 'zh-CN', hk: 'zh-HK', in: 'en', id: 'id', jp: 'ja', kr: 'ko',
    my: 'ms', nz: 'en', pk: 'ur', ph: 'en', sg: 'en', tw: 'zh-TW', th: 'th', vn: 'vi'
};

// ========== 검색 실행 (AND 조합 + 날짜 로직 그대로) ==========
document.getElementById('searchBtn').addEventListener('click', () => {
    const queries = Array.from(document.querySelectorAll('.search-input'))
        .map(input => input.value.trim())
        .filter(q => q);

    if (!queries.length) {
        alert('Please enter a search term');
        return;
    }

    const countryKey = document.getElementById('countrySelect').value; // 예: 'jp' 또는 'ca_fr'
    const startDate  = document.getElementById('startDate').value;
    const endDate    = document.getElementById('endDate').value;

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        alert('Start date must be before end date');
        return;
    }

    const dateFilters = [];
    if (startDate) dateFilters.push(`after:${startDate}`);
    if (endDate)   dateFilters.push(`before:${endDate}`);

    // AND 검색: 공백 포함은 따옴표로 묶어 구문 검색
    const andTerms = queries.map(q => (/\s/.test(q) ? `"${q}"` : q));
    const searchQuery = [...andTerms, ...dateFilters].join(' '); // 공백 결합 = AND

    const gl = (countryKey.includes('_') ? countryKey.split('_')[0] : countryKey).toUpperCase();
    const lang = defaultLangByCountry[countryKey] || 'en';
    const hl = lang;
    const ceid = `${gl}:${lang}`;

    const url = `https://news.google.com/search?q=${encodeURIComponent(searchQuery)}&hl=${encodeURIComponent(hl)}&gl=${encodeURIComponent(gl)}&ceid=${encodeURIComponent(ceid)}`;

    window.open(url, '_blank');

    // 검색 시 선택 국가를 최근 목록에 반영
    if (countryKey) {
        try {
            const raw = localStorage.getItem('newsSearchRecents');
            const list = raw ? JSON.parse(raw) : [];
            const without = Array.isArray(list) ? list.filter(c => c !== countryKey) : [];
            without.unshift(countryKey);
            if (without.length > 5) without.length = 5;
            localStorage.setItem('newsSearchRecents', JSON.stringify(without));
        } catch {}
    }
});
