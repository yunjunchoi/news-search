# Testing Guide

Comprehensive testing checklist for the News Search application.

## 🧪 Pre-Deployment Testing

### 1. Initial Setup Tests

**Test 1.1: First Load - No API Key**
- [ ] Open application for the first time
- [ ] Yellow warning banner should appear at top
- [ ] Banner text: "Gemini API Key Required"
- [ ] Click "Configure Now" → should switch to Settings tab

**Test 1.2: API Key Configuration**
- [ ] Navigate to Settings tab
- [ ] Enter API key in input field
- [ ] Key should be masked (type="password")
- [ ] Click eye icon → key should become visible
- [ ] Click "Save Settings"
- [ ] Success message should appear
- [ ] Return to Search tab → warning banner should be gone

### 2. Search Functionality Tests

**Test 2.1: Basic Search**
- [ ] Enter single keyword (e.g., "climate change")
- [ ] Select country (e.g., "United States")
- [ ] Click "Search News"
- [ ] Modal should appear with "Generating AI summary..."
- [ ] Loading spinner should be visible
- [ ] After ~3-5 seconds, AI summary should appear
- [ ] Summary should include context, trends, and keywords

**Test 2.2: Multiple Keywords (AND search)**
- [ ] Enter first keyword (e.g., "artificial")
- [ ] Click "+ Add Search Keyword"
- [ ] Enter second keyword (e.g., "intelligence")
- [ ] Search
- [ ] Verify modal shows combined query
- [ ] AI summary should relate to both keywords

**Test 2.3: Date Range Search**
- [ ] Enter keyword
- [ ] Set Start Date (e.g., one month ago)
- [ ] Set End Date (today)
- [ ] Search
- [ ] Verify AI summary mentions the date range context

**Test 2.4: Invalid Date Range**
- [ ] Set Start Date: 2024-12-01
- [ ] Set End Date: 2024-11-01 (earlier than start)
- [ ] Click Search
- [ ] Should show alert: "Start date must be before end date"
- [ ] Modal should NOT appear

**Test 2.5: Empty Search**
- [ ] Clear all keywords
- [ ] Click Search
- [ ] Should show alert: "Please enter a search term"

### 3. Country Selection Tests

**Test 3.1: Country Filter**
- [ ] Click on country filter input
- [ ] Type "jap"
- [ ] Dropdown should filter to show only Japan
- [ ] Select dropdown should update
- [ ] Suggestions overlay should appear

**Test 3.2: Recent Countries**
- [ ] Search with Country A
- [ ] Search with Country B
- [ ] Search with Country C
- [ ] Open country dropdown
- [ ] "— Current —" group should show A, B, C at top
- [ ] Most recent (C) should be first

**Test 3.3: Keyboard Navigation**
- [ ] Focus on country filter input
- [ ] Type "ca"
- [ ] Press Arrow Down → first suggestion highlights
- [ ] Press Arrow Down again → second suggestion highlights
- [ ] Press Enter → country should be selected
- [ ] Suggestions should close

**Test 3.4: Clear Filter**
- [ ] Type in country filter
- [ ] Click "×" button
- [ ] Filter should clear
- [ ] All countries should show again

### 4. AI Summary Modal Tests

**Test 4.1: Summary Generation Success**
- [ ] Perform a search with valid API key
- [ ] Modal appears with loading state
- [ ] Summary generates successfully
- [ ] "Continue to Google News" button is enabled
- [ ] "Export" button is visible

**Test 4.2: Summary Generation Error - Invalid API Key**
- [ ] Settings → enter invalid API key → Save
- [ ] Perform a search
- [ ] Error state should appear
- [ ] Error message should explain the issue
- [ ] "Continue Anyway" button should be visible
- [ ] Click "Continue Anyway" → opens Google News

**Test 4.3: Summary Generation Error - Network Issue**
- [ ] Settings → enter valid API key
- [ ] Disconnect internet or block googleapis.com
- [ ] Perform a search
- [ ] Error state should appear with network error message
- [ ] "Continue Anyway" should still work

**Test 4.4: AI Toggle Disabled**
- [ ] Settings → toggle off "Enable AI Summaries"
- [ ] Save Settings
- [ ] Perform a search
- [ ] Modal should show error state immediately
- [ ] "Continue Anyway" opens Google News
- [ ] Search is still saved to history (without AI summary)

**Test 4.5: Continue to News**
- [ ] Perform successful search
- [ ] Click "Continue to Google News"
- [ ] New tab should open with Google News results
- [ ] Modal should close
- [ ] Search should appear in History tab

**Test 4.6: Export from Modal**
- [ ] Perform successful search
- [ ] Click "Export" button in modal
- [ ] Excel file should download
- [ ] File should contain the search data

**Test 4.7: Close Modal**
- [ ] Perform search
- [ ] Click "×" button in top-right
- [ ] Modal closes
- [ ] Click outside modal (backdrop)
- [ ] Modal closes
- [ ] Press Escape key
- [ ] Modal closes

### 5. Search History Tests

**Test 5.1: History Saves Automatically**
- [ ] Perform 3 different searches
- [ ] Click "Continue to Google News" for each
- [ ] Navigate to History tab
- [ ] All 3 searches should appear
- [ ] Most recent should be at top

**Test 5.2: History Display**
- [ ] Navigate to History tab
- [ ] Each item should show:
  - [ ] Search query
  - [ ] Country with code
  - [ ] Date range (if applicable)
  - [ ] Timestamp
  - [ ] Collapsible AI Summary
- [ ] Expand AI Summary section
- [ ] Summary text should be readable and formatted

**Test 5.3: Re-search from History**
- [ ] Navigate to History tab
- [ ] Click 🔍 (re-search) button on a history item
- [ ] Should switch to Search tab
- [ ] All fields should be pre-filled:
  - [ ] Keywords
  - [ ] Country
  - [ ] Dates
- [ ] Page should scroll to top

**Test 5.4: Export Single History Item**
- [ ] Navigate to History tab
- [ ] Click 📥 (export) button on one item
- [ ] Excel file downloads
- [ ] Open file:
  - [ ] Should contain 1 row
  - [ ] All columns present
  - [ ] Data matches the history item

**Test 5.5: Export All History**
- [ ] Perform 5+ searches
- [ ] Navigate to History tab
- [ ] Click "Export All" button
- [ ] Excel file downloads
- [ ] Open file:
  - [ ] Contains all searches
  - [ ] Sorted by newest first
  - [ ] All columns properly formatted

**Test 5.6: Delete Single History Item**
- [ ] Navigate to History tab
- [ ] Click 🗑️ (delete) button
- [ ] Confirmation dialog appears
- [ ] Click OK
- [ ] Item is removed
- [ ] Other items remain

**Test 5.7: Clear All History**
- [ ] Navigate to History tab (with items)
- [ ] Click "Clear All" button
- [ ] Confirmation dialog appears
- [ ] Click OK
- [ ] All items are removed
- [ ] Empty state message appears

**Test 5.8: Empty History State**
- [ ] Clear all history
- [ ] Navigate to History tab
- [ ] Should show:
  - [ ] Clock icon
  - [ ] "No search history yet" message
  - [ ] Helpful text about how to create history

**Test 5.9: History Limit**
- [ ] Perform 55+ searches
- [ ] Navigate to History tab
- [ ] Should show maximum 50 items
- [ ] Oldest items are removed automatically

**Test 5.10: History Persistence**
- [ ] Perform several searches
- [ ] Close browser completely
- [ ] Reopen application
- [ ] Navigate to History tab
- [ ] All history should still be there

### 6. Settings Tests

**Test 6.1: API Key Persistence**
- [ ] Enter API key in Settings
- [ ] Save
- [ ] Refresh page
- [ ] Navigate to Settings
- [ ] API key should still be there (masked)

**Test 6.2: API Key Validation**
- [ ] Enter obviously invalid key (e.g., "test123")
- [ ] Save Settings
- [ ] Perform search
- [ ] Should get API error in modal
- [ ] Error message should be clear

**Test 6.3: AI Toggle Persistence**
- [ ] Toggle off "Enable AI Summaries"
- [ ] Save
- [ ] Refresh page
- [ ] Navigate to Settings
- [ ] Toggle should still be off

**Test 6.4: Settings Link**
- [ ] Click "Get API Key (Free)" link
- [ ] Should open Google AI Studio in new tab
- [ ] URL: https://aistudio.google.com/app/apikey

### 7. Tab Navigation Tests

**Test 7.1: Tab Switching**
- [ ] Click Search tab → content changes
- [ ] Click History tab → history list loads
- [ ] Click Settings tab → settings form shows
- [ ] Active tab should have visual indicator
- [ ] Only one tab content visible at a time

**Test 7.2: Tab State Preservation**
- [ ] Enter data in Search tab
- [ ] Switch to History tab
- [ ] Switch back to Search tab
- [ ] Search form data should still be there

### 8. Excel Export Tests

**Test 8.1: Export File Format**
- [ ] Export any search
- [ ] Open in Excel/LibreOffice
- [ ] Verify columns:
  - [ ] Search Query
  - [ ] Country
  - [ ] Date Range
  - [ ] AI Summary
  - [ ] Timestamp
  - [ ] Google News URL

**Test 8.2: Export File Naming**
- [ ] Export history
- [ ] Filename should be: `news-search-history-YYYY-MM-DD.xlsx`
- [ ] Date should be current date

**Test 8.3: Export with Special Characters**
- [ ] Search with special characters (e.g., "AI & ML: "Future"")
- [ ] Export
- [ ] Open file
- [ ] Special characters should be properly escaped

**Test 8.4: Export Empty History**
- [ ] Clear all history
- [ ] Click "Export All"
- [ ] Should show alert: "No data to export"

**Test 8.5: Export Large Dataset**
- [ ] Perform 50 searches
- [ ] Export all
- [ ] File should contain all 50 rows
- [ ] Excel should open without errors

### 9. URL Generation Tests

**Test 9.1: Basic URL**
- [ ] Search: "climate"
- [ ] Country: US
- [ ] Check generated URL (in history)
- [ ] Should include: q=climate, gl=US, hl=en-US

**Test 9.2: Multi-word Query**
- [ ] Search: "climate change"
- [ ] Generated URL should have: q="climate change" (quoted)

**Test 9.3: Multiple Keywords**
- [ ] Search: "climate" AND "policy"
- [ ] URL should have: q=climate policy

**Test 9.4: Date Range URL**
- [ ] Add dates
- [ ] URL should include: after:YYYY-MM-DD before:YYYY-MM-DD

**Test 9.5: Strict Local Countries**
- [ ] Search in US, UK, Canada (English)
- [ ] URL should use: google.com/search?tbm=nws
- [ ] Should include: cr=country parameters

**Test 9.6: Non-Strict Countries**
- [ ] Search in Japan, Korea, etc.
- [ ] URL should use: news.google.com/search
- [ ] Should include: ceid parameter

### 10. Error Handling Tests

**Test 10.1: localStorage Full**
- [ ] Fill localStorage to limit (test in console)
- [ ] Try to save new search
- [ ] Should handle gracefully (console warning, no crash)

**Test 10.2: Malformed localStorage Data**
- [ ] Corrupt localStorage data manually (console)
- [ ] Refresh app
- [ ] Should reset to defaults, no crash

**Test 10.3: API Rate Limit**
- [ ] Make 20+ requests rapidly
- [ ] Should hit rate limit
- [ ] Error message should explain rate limiting
- [ ] "Continue Anyway" should still work

**Test 10.4: Missing XLSX Library**
- [ ] Block CDN in network tab
- [ ] Try to export
- [ ] Should show error or fail gracefully

### 11. Mobile Responsiveness Tests

**Test 11.1: Mobile Layout (< 768px)**
- [ ] Resize browser to mobile width
- [ ] All tabs accessible
- [ ] Form inputs full-width
- [ ] Modal responsive
- [ ] History items stack properly
- [ ] Buttons touchable (min 44px)

**Test 11.2: Tablet Layout (768-1024px)**
- [ ] Resize to tablet width
- [ ] Grid layouts adapt (1-2 columns)
- [ ] Modal fits screen
- [ ] Navigation clear

**Test 11.3: Touch Interactions**
- [ ] Use browser device emulation
- [ ] Tap buttons → should respond
- [ ] Swipe/scroll should work smoothly
- [ ] No hover-dependent functionality broken

### 12. Browser Compatibility Tests

**Test in Each Browser:**
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

**For Each Browser:**
- [ ] All features work
- [ ] Styles render correctly
- [ ] localStorage works
- [ ] Excel export works
- [ ] No console errors

### 13. Performance Tests

**Test 13.1: Large History**
- [ ] Create 50 history items
- [ ] Navigate to History tab
- [ ] Should load within 1 second
- [ ] Scrolling should be smooth

**Test 13.2: AI Summary Speed**
- [ ] Measure time from search click to summary display
- [ ] Should be < 10 seconds
- [ ] Loading indicator should show throughout

**Test 13.3: Export Large Dataset**
- [ ] Export 50 items
- [ ] Should complete within 3 seconds
- [ ] No UI freezing

### 14. Accessibility Tests

**Test 14.1: Keyboard Navigation**
- [ ] Tab through entire interface
- [ ] All interactive elements reachable
- [ ] Focus indicators visible
- [ ] Enter/Space activates buttons

**Test 14.2: Screen Reader**
- [ ] Use screen reader (NVDA, VoiceOver, etc.)
- [ ] All labels read correctly
- [ ] Button purposes clear
- [ ] Error messages announced

**Test 14.3: Color Contrast**
- [ ] Check contrast ratios
- [ ] Text readable
- [ ] Buttons distinguishable

### 15. Security Tests

**Test 15.1: XSS Protection**
- [ ] Enter script in search: `<script>alert('xss')</script>`
- [ ] Should be escaped in history display
- [ ] Should be escaped in export

**Test 15.2: API Key Security**
- [ ] Check Network tab
- [ ] API key only sent to googleapis.com
- [ ] API key not logged in console

**Test 15.3: localStorage Security**
- [ ] Inspect localStorage
- [ ] API key stored (acceptable for client-side)
- [ ] No sensitive user data beyond API key

## 🔧 Automated Testing Setup (Future)

For CI/CD, consider:

```javascript
// Example Jest test
describe('SearchHistory', () => {
  test('adds entry to history', () => {
    const entry = {
      query: 'test',
      country: 'US',
      newsUrl: 'https://...'
    };
    SearchHistory.add(entry);
    const history = SearchHistory.getAll();
    expect(history[0].query).toBe('test');
  });
});
```

## 📋 Testing Checklist Summary

Before deployment:
- [ ] All 15 test categories completed
- [ ] No critical bugs found
- [ ] All browsers tested
- [ ] Mobile tested
- [ ] API key validated
- [ ] Export verified
- [ ] Error handling confirmed

## 🐛 Bug Report Template

When filing bugs:

```
**Bug Title:** Brief description

**Steps to Reproduce:**
1. Go to...
2. Click on...
3. See error

**Expected Behavior:** What should happen

**Actual Behavior:** What actually happened

**Environment:**
- Browser: Chrome 120
- OS: Windows 11
- Screen size: 1920x1080

**Screenshots:** (if applicable)

**Console Errors:** (if any)
```

---

**Happy Testing! 🧪**
