// script.js
document.addEventListener('DOMContentLoaded', () => {
    // ✅ 지역별 국가 목록 (다언어 국가는 분리 코드 사용)
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
                { code: 'ru', name: 'Russia' },   // 일부 지역 접근 제한 가능
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
                { code: 'cn', name: 'China (Mainland)' }, // Google News 접근/결과 제한 가능
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

    // ✅ 각 지역 내부는 알파벳 정렬
    groupedCountries.forEach(group => {
        group.items.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
    });

    const select = document.getElementById('countrySelect');

    // ✅ 간이 검색창 삽입 (HTML 수정 없이)
    const filterInput = document.createElement('input');
    filterInput.type = 'text';
    filterInput.id = 'countryFilter';
    filterInput.placeholder = 'Search country… (e.g., "jap", "ca fr")';
    filterInput.className = 'input input-bordered mb-2';
    select.parentNode.insertBefore(filterInput, select);

    // ▶ 필터링: 여러 단어 AND 매칭 (name + code)
    function filterGroups(query) {
        if (!query.trim()) return groupedCountries;
        const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);

        return groupedCountries
            .map(group => {
                const filtered = group.items.filter(({ code, name }) => {
                    const hay = `${name} ${code}`.toLowerCase();
                    return tokens.every(t => hay.includes(t));
                });
                return { region: group.region, items: filtered };
            })
            .filter(group => group.items.length > 0); // 빈 그룹 제거
    }

    // ▶ 렌더링: optgroup 으로 지역 헤더(브라우저 기본 음영/비선택 처리)
    function renderOptions(groups) {
        const prev = select.value;
        select.innerHTML = '';
        groups.forEach(group => {
            const og = document.createElement('optgroup');
            og.label = `— ${group.region} —`; // 시각적 구분감
            group.items.forEach(({ code, name }) => {
                const opt = document.createElement('option');
                opt.value = code;
                opt.textContent = name;
                og.appendChild(opt);
            });
            select.appendChild(og);
        });
        // 기존 선택 유지 가능 시 복구
        const hasPrev = [...select.querySelectorAll('option')].some(o => o.value === prev);
        if (hasPrev) select.value = prev;
    }

    // 초기 렌더
    renderOptions(groupedCountries);

    // 입력 시 필터 적용
    filterInput.addEventListener('input', () => {
        renderOptions(filterGroups(filterInput.value));
    });

    // ▶ 동적 검색어 필드 추가(기존 Look & Feel)
    document.getElementById('addQueryBtn').addEventListener('click', () => {
        const container = document.getElementById('queryContainer');
        const newInput = document.createElement('input');
        newInput.type = 'text';
        newInput.className = 'search-input input input-bordered mb-2';
        newInput.placeholder = 'Enter search term';

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

// ✅ 국가 → 기본 언어 매핑 (에디션 강제용)
//   hl=<lang>, gl=<COUNTRY>, ceid=<COUNTRY>:<lang>
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

document.getElementById('searchBtn').addEventListener('click', () => {
    // 기존 검색어 수집
    const queries = Array.from(document.querySelectorAll('.search-input'))
        .map(input => input.value.trim())
        .filter(q => q);

    if (!queries.length) {
        alert('Please enter a search term');
        return;
    }

    // 날짜 입력/검증/토큰 (그대로 유지)
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

    // 국가 에디션 강제 파라미터
    const gl = (countryKey.includes('_') ? countryKey.split('_')[0] : countryKey).toUpperCase(); // 예: 'JP', 'CA'
    const lang = defaultLangByCountry[countryKey] || 'en'; // 예: 'ja'
    const hl = lang;                                       // 언어코드만
    const ceid = `${gl}:${lang}`;                          // 예: 'JP:ja'

    // 기존 OR 조합 유지
    const searchQuery = [...queries, ...dateFilters].join(' OR ');

    // 최종 URL
    const url = `https://news.google.com/search?q=${encodeURIComponent(searchQuery)}&hl=${encodeURIComponent(hl)}&gl=${encodeURIComponent(gl)}&ceid=${encodeURIComponent(ceid)}`;

    // 새 탭 오픈
    window.open(url, '_blank');
});
