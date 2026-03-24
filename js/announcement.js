// ===== Announcement Popup =====
// Fetches latest notice and shows as popup + top banner
(function () {
  'use strict';

  const NOTICES_BASE = window.SITE_CONFIG.API_BASE + '/api/v1';
  const SESSION_KEY = 'daga-announcement-dismissed';

  document.addEventListener('DOMContentLoaded', function () {
    // Check if already dismissed this session
    if (sessionStorage.getItem(SESSION_KEY)) {
      return;
    }

    // Fetch latest notice
    fetchLatestNotice();
  });

  async function fetchLatestNotice() {
    try {
      const response = await fetch(NOTICES_BASE + '/notices?limit=1');
      if (!response.ok) return;
      
      const data = await response.json();
      const notices = data.data || data.notices || data;
      
      if (!notices || !Array.isArray(notices) || notices.length === 0) return;
      
      const notice = notices[0];
      showAnnouncementPopup(notice);
      showAnnouncementBanner(notice);
    } catch (error) {
      // Silently fail — don't block page load
      // Error gracefully handled by UI
    }
  }

  function showAnnouncementPopup(notice) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'announcement-modal-overlay';
    
    const date = notice.createdAt 
      ? new Date(notice.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      : '';
    
    overlay.innerHTML = `
      <div class="announcement-modal">
        <button class="announcement-modal-close" aria-label="Close">&times;</button>
        <div class="announcement-modal-icon">📢</div>
        ${date ? '<span class="announcement-modal-date">' + date + '</span>' : ''}
        <h3>${escapeHTML(notice.title || 'Notice')}</h3>
        <p>${escapeHTML(notice.content || notice.description || '')}</p>
        <button class="announcement-modal-btn" id="announcement-dismiss">Got it</button>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Show with animation
    requestAnimationFrame(function () {
      overlay.classList.add('active');
    });
    
    // Close handlers
    function dismiss() {
      overlay.classList.remove('active');
      sessionStorage.setItem(SESSION_KEY, 'true');
      setTimeout(function () {
        overlay.remove();
      }, 300);
    }
    
    overlay.querySelector('.announcement-modal-close').addEventListener('click', dismiss);
    overlay.querySelector('#announcement-dismiss').addEventListener('click', dismiss);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) dismiss();
    });
  }

  function showAnnouncementBanner(notice) {
    const banner = document.getElementById('announcement-banner');
    const bannerText = document.getElementById('announcement-text');
    const bannerClose = document.getElementById('banner-close');
    
    if (!banner || !bannerText) return;
    
    bannerText.textContent = '📢 ' + (notice.title || 'New Notice Available');
    banner.classList.add('visible');
    
    if (bannerClose) {
      bannerClose.addEventListener('click', function () {
        banner.classList.remove('visible');
        sessionStorage.setItem(SESSION_KEY + '-banner', 'true');
      });
    }
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
})();
