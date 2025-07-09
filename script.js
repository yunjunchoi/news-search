document.addEventListener('DOMContentLoaded', () => {
    // Initialize country selection options
    const countries = [
        { code: 'kr', name: 'South Korea' },
        { code: 'us', name: 'United States' },
        { code: 'ca', name: 'Canada' },
        { code: 'mx', name: 'Mexico' },
        { code: 'gb', name: 'United Kingdom' },
        { code: 'jp', name: 'Japan' },
        { code: 'cn', name: 'China' },
        { code: 'de', name: 'Germany' },
        { code: 'fr', name: 'France' },
        { code: 'es', name: 'Spain' },
        { code: 'za', name: 'South Africa' }
    ];
    const select = document.getElementById('countrySelect');
    select.innerHTML = '';
    countries.forEach(({ code, name }) => {
        const opt = document.createElement('option');
        opt.value = code;
        opt.textContent = name;
        select.appendChild(opt);
    });

    // Add dynamic query field functionality
    document.getElementById('addQueryBtn').addEventListener('click', () => {
        const container = document.getElementById('queryContainer');
        const newInput = document.createElement('input');
        newInput.type = 'text';
        newInput.className = 'search-input input input-bordered mb-2';
        newInput.placeholder = 'Enter search term';
        
        // Delete button for the input
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

document.getElementById('searchBtn').addEventListener('click', () => {
    const queries = Array.from(document.querySelectorAll('.search-input'))
        .map(input => input.value.trim())
        .filter(q => q);
    
    if (!queries.length) {
        alert('Please enter a search term');
        return;
    }

    const country = document.getElementById('countrySelect').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        alert('Start date must be before end date');
        return;
    }

    // Add date filters
    const dateFilters = [];
    if (startDate) dateFilters.push(`after:${startDate}`);
    if (endDate)   dateFilters.push(`before:${endDate}`);

    // Configure language and region parameters
    const lang = country === 'kr' ? 'ko' : 'en';
    const hl = `${lang}-${country.toUpperCase()}`;
    const gl = country.toUpperCase();

    // Build the final query
    const searchQuery = [...queries, ...dateFilters].join(' OR ');
    const url = `https://news.google.com/search?q=${encodeURIComponent(searchQuery)}&hl=${hl}&gl=${gl}`;

    // Open Google News search results in a new tab
    window.open(url, '_blank');
});