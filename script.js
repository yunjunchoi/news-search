// script.js
document.addEventListener('DOMContentLoaded', () => {
    // ✅ 구글 뉴스 에디션 커버 국가/지역(다언어 국가는 분리 표기)
    const countries = [
        // Americas
        { code: 'us', name: 'United States' },
        { code: 'ca', name: 'Canada (English)' },
        { code: 'ca_fr', name: 'Canada (Français)' },
        { code: 'mx', name: 'Mexico' },
        { code: 'ar', name: 'Argentina' },
        { code: 'br', name: 'Brazil' },
        { code: 'cl', name: 'Chile' },
        { code: 'co', name: 'Colombia' },
        { code: 'pe', name: 'Peru' },
        { code: 've', name: 'Venezuela' },

        // Europe (West/North)
        { code: 'gb', name: 'United Kingdom' },
        { code: 'ie', name: 'Ireland' },
        { code: 'fr', name: 'France' },
        { code: 'be_fr', name: 'Belgium (Français)' },
        { code: 'be_nl', name: 'Belgium (Nederlands)' },
        { code: 'nl', name: 'Netherlands' },
        { code: 'de', name: 'Germany' },
        { code: 'at', name: 'Austria' },
        { code: 'ch_de', name: 'Switzerland (Deutsch)' },
        { code: 'ch_fr', name: 'Switzerland (Français)' },
        { code: 'ch_it', name: 'Switzerland (Italiano)' },
        { code: 'it', name: 'Italy' },
        { code: 'es', name: 'Spain' },
        { code: 'pt', name: 'Portugal' },
        { code: 'se', name: 'Sweden' },
        { code: 'no', name: 'Norway' },
        { code: 'dk', name: 'Denmark' },
        { code: 'fi', name: 'Finland' },
        { code: 'is', name: 'Iceland' },

        // Europe (Central/East)
        { code: 'pl', name: 'Poland' },
        { code: 'cz', name: 'Czechia' },
        { code: 'sk', name: 'Slovakia' },
        { code: 'hu', name: 'Hungary' },
        { code: 'ro', name: 'Romania' },
        { code: 'bg', name: 'Bulgaria' },
        { code: 'gr', name: 'Greece' },
        { code: 'tr', name: 'Türkiye' },
        { code: 'ua', name: 'Ukraine' },
        { code: 'ru', name: 'Russia' }, // 일부 지역 접근 제한 가능

        // Middle East & Africa
        { code: 'il', name: 'Israel' },
        { code: 'sa', name: 'Saudi Arabia' },
        { code: 'ae', name: 'United Arab Emirates' },
        { code: 'eg', name: 'Egypt' },
        { code: 'za', name: 'South Africa' },
        { code: 'ng', name: 'Nigeria' },
        { code: 'ke', name: 'Kenya' },

        // Asia-Pacific
        { code: 'kr', name: 'Korea (South)' },
        { code: 'jp', name: 'Japan' },
        { code: 'cn', name: 'China (Mainland)' },  // Google News 접근/결과 제한 가능
        { code: 'hk', name: 'Hong Kong' },
        { code: 'tw', name: 'Taiwan' },
        { code: 'sg', name: 'Singapore' },
        { code: 'my', name: 'Malaysia' },
        { code: 'th', name: 'Thailand' },
        { code: 'vn', name: 'Vietnam' },
        { code: 'ph', name: 'Philippines' },
        { code: 'id', name: 'Indonesia' },
        { code: 'in', name: 'India' },
        { code: 'pk', name: 'Pakistan' },
        { code: 'bd', name: 'Bangladesh' },
        { code: 'au', name: 'Australia' },
        { code: 'nz', name: 'New Zealand' }
    ];

    // 드롭다운 채우기 (Look & Feel 유지)
    const select = document.getElementById('countrySelect');
    select.innerHTML = '';
    countries.forEach(({ code, name }) => {
        const opt = document.createElement('option');
        opt.value = code;
        opt.textContent = name;
        select.appendChild(opt);
    });

    // 동적 검색어 입력창 (UI 그대로 유지)
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
    us: 'en', ca: 'en', ca_fr: 'fr', mx: 'es', ar: 'es', br: 'pt', cl: 'es', co: 'es', pe: 'es', ve: 'es',

    // Europe (West/North)
    gb: 'en', ie: 'en', fr: 'fr', be_fr: 'fr', be_nl: 'nl', nl: 'nl',
    de: 'de', at: 'de', ch_de: 'de', ch_fr: 'fr', ch_it: 'it', it: 'it',
    es: 'es', pt: 'pt', se: 'sv', no: 'no', dk: 'da', fi: 'fi', is: 'is',

    // Europe (Central/East)
    pl: 'pl', cz: 'cs', sk: 'sk', hu: 'hu', ro: 'ro', bg: 'bg', gr: 'el', tr: 'tr', ua: 'uk', ru: 'ru',

    // Middle East & Africa
    il: 'he', sa: 'ar', ae: 'ar', eg: 'ar', za: 'en', ng: 'en', ke: 'en',

    // Asia-Pacific
    kr: 'ko', jp: 'ja',
    cn: 'zh-CN', hk: 'zh-HK', tw: 'zh-TW',
    sg: 'en', my: 'ms', th: 'th', vn: 'vi', ph: 'en', id: 'id',
    in: 'en', pk: 'ur', bd: 'bn',
    au: 'en', nz: 'en'
};

document.getElementById('searchBtn').addEventListener('click', () => {
    // 기존 검색어 수집 로직 유지
    const queries = Array.from(document.querySelectorAll('.search-input'))
        .map(input => input.value.trim())
        .filter(q => q);

    if (!queries.length) {
        alert('Please enter a search term');
        return;
    }

    // 기존 날짜 입력값 로딩 (그대로)
    const countryKey = document.getElementById('countrySelect').value; // 예: 'jp' 또는 'ca_fr'
    const startDate  = document.getElementById('startDate').value;
    const endDate    = document.getElementById('endDate').value;

    // 기존 날짜 검증 로직 유지 (절대 변경 금지 요청 반영)
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        alert('Start date must be before end date');
        return;
    }

    // 기존 날짜 토큰 유지
    const dateFilters = [];
    if (startDate) dateFilters.push(`after:${startDate}`);
    if (endDate)   dateFilters.push(`before:${endDate}`);

    // --- 국가 에디션 강제 파라미터 ---
    // 다언어 코드(ca_fr, be_nl 등) 대응: gl은 앞부분 국가코드만 사용
    const gl = (countryKey.includes('_') ? countryKey.split('_')[0] : countryKey).toUpperCase(); // 예: 'JP', 'CA'
    const lang = defaultLangByCountry[countryKey] || 'en'; // 예: 'ja'
    const hl = lang;                                       // 언어코드만
    const ceid = `${gl}:${lang}`;                          // 예: 'JP:ja'

    // 기존 OR 조합 로직 유지
    const searchQuery = [...queries, ...dateFilters].join(' OR ');

    // 최종 URL: 선택 국가 에디션으로 강제
    const url = `https://news.google.com/search?q=${encodeURIComponent(searchQuery)}&hl=${encodeURIComponent(hl)}&gl=${encodeURIComponent(gl)}&ceid=${encodeURIComponent(ceid)}`;

    // 기존 동작 유지: 새 탭 오픈
    window.open(url, '_blank');
});
