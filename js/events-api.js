/**
 * Events API Integration
 * Fetches events dynamically from the backend and renders them.
 */

function createEventSkeleton(count = 3) {
  return Array(count).fill('').map(() => `
    <div class="news-card skeleton-item">
      <div class="news-image skeleton-shimmer" style="height:200px;border-radius:12px 12px 0 0;"></div>
      <div class="news-content" style="padding:24px;">
        <div class="skeleton-shimmer" style="width:60px;height:24px;border-radius:12px;margin-bottom:8px;"></div>
        <div class="skeleton-shimmer" style="width:80%;height:24px;border-radius:4px;margin-bottom:12px;"></div>
        <div class="skeleton-shimmer" style="width:100%;height:60px;border-radius:4px;"></div>
      </div>
    </div>
  `).join('');
}

function renderEventCard(event) {
  const eventDate = new Date(event.date);
  const day = eventDate.getDate().toString().padStart(2, '0');
  const month = eventDate.toLocaleDateString('en-US', { month: 'short' });

  // Use coverImageUrl from the backend, or fallback to placeholder
  const imageUrl = event.coverImageUrl || 'images/events-placeholder.jpg';

  return `
    <div class="news-card fade-in">
      <div class="news-image">
        <img src="${imageUrl}" alt="${event.title}" loading="lazy" onerror="this.src='images/events-placeholder.jpg'">
        <div class="news-date">
          <span class="day">${day}</span>
          <span class="month">${month}</span>
        </div>
      </div>
      <div class="news-content">
        <div class="news-meta">
          <span class="news-tag">Event</span>
          ${event.time ? `<span class="news-time">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${event.time}</span>` : ''}
        </div>
        <h3 title="${event.title}">${event.title}</h3>
        <p>${event.description || ''}</p>
        ${event.location ? `<div class="news-location">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>${event.location}</span>
        </div>` : ''}
      </div>
    </div>
  `;
}

async function loadEvents() {
  const API_BASE = 'http://localhost:3001'; // Update to your deployed URL in prod
  const eventsGrid = document.getElementById('events-grid');
  if (!eventsGrid) return;

  const limitParam = eventsGrid.getAttribute('data-limit');
  const featuredParam = eventsGrid.getAttribute('data-featured');
  
  const queryParams = [];
  if (limitParam) queryParams.push(`limit=${limitParam}`);
  if (featuredParam === 'true') queryParams.push('featured=true');
  
  // Cache buster to ensure the user always sees fresh data during tests
  queryParams.push(`_t=${new Date().getTime()}`);
  
  const url = `${API_BASE}/api/v1/events?${queryParams.join('&')}`;

  // Provide initial skeleton
  const limitCount = limitParam ? parseInt(limitParam) : 6;
  eventsGrid.innerHTML = createEventSkeleton(limitCount);

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network response was not ok');
    
    // Response is { success: true, data: [...] } based on standard patterns, 
    // or just [...] depending on backend. Let's handle both.
    const json = await res.json();
    const data = json.data || json;

    const limitCount = limitParam ? parseInt(limitParam) : data.length;
    const itemsToRender = data.slice(0, limitCount);

    if (!Array.isArray(itemsToRender) || itemsToRender.length === 0) {
      eventsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #6b7280; font-size: 1.1rem; background: #f9fafb; border-radius: 12px;">No upcoming events at the moment. Please check back later!</div>';
      return;
    }

    // Render events
    eventsGrid.innerHTML = itemsToRender.map(renderEventCard).join('');
    
  } catch (err) {
    console.error('Failed to load events:', err);
    eventsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #ef4444; font-size: 1.1rem; background: #fef2f2; border-radius: 12px; border: 1px solid #fecaca;">Failed to load events. Please try refreshing the page.</div>';
  }
}

// Safe init: call directly if DOM already loaded, otherwise wait for the event
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadEvents);
} else {
  loadEvents();
}
