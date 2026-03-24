// ===== Announcement Toast Popup =====
// Fetches latest popup-enabled notice and shows as bottom-right toast
(function () {
  'use strict';

  // API_BASE is the global from js/config.js
  const NOTICES_BASE = API_BASE + '/api/v1';
  const STORAGE_KEY = 'daga-announcement-dismissed';
  const AUTO_CLOSE_MS = 10000; // 10 seconds

  document.addEventListener('DOMContentLoaded', function () {
    // ── Once-per-day check ──────────────────────────────────────
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const today = new Date();
      // Same calendar day → don't show again
      if (
        dismissedDate.getFullYear() === today.getFullYear() &&
        dismissedDate.getMonth() === today.getMonth() &&
        dismissedDate.getDate() === today.getDate()
      ) {
        return;
      }
    }

    fetchLatestNotice();
  });

  async function fetchLatestNotice() {
    try {
      const response = await fetch(NOTICES_BASE + '/notices?limit=5');
      if (!response.ok) return;

      const result = await response.json();
      const notices = result.data || result.notices || result;

      if (!Array.isArray(notices) || notices.length === 0) return;

      // Find the first notice that has isPopup = true
      const notice = notices.find(function (n) { return n.isPopup && n.isActive !== false; });
      if (!notice) return;

      showToast(notice);
    } catch (err) {
      // Silently fail — don't block page load
      console.log('Announcement toast skipped:', err.message || err);
    }
  }

  function showToast(notice) {
    const toast = document.getElementById('announcement-toast');
    if (!toast) return;

    // Set priority attribute for colour coding
    if (notice.priority) {
      toast.setAttribute('data-priority', notice.priority);
    }

    // Populate date
    const dateEl = document.getElementById('toast-date');
    if (dateEl && notice.date) {
      dateEl.textContent = new Date(notice.date).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
      });
    }

    // Populate title
    const titleEl = document.getElementById('toast-notice-title');
    if (titleEl) {
      titleEl.textContent = escapeHTML(notice.title || 'Notice');
    }

    // Populate body text
    const textEl = document.getElementById('toast-text');
    if (textEl) {
      textEl.textContent = escapeHTML(notice.description || '');
    }

    // Show/hide "Read more" link
    const linkEl = document.getElementById('toast-link');
    if (linkEl) {
      if (notice.link) {
        linkEl.href = notice.link;
        linkEl.style.display = 'inline-flex';
      } else {
        linkEl.style.display = 'none';
      }
    }

    // Slide in after short delay (let page render first)
    setTimeout(function () {
      toast.classList.add('show');

      // Auto-close after 10 seconds
      setTimeout(function () {
        dismissToast(toast);
      }, AUTO_CLOSE_MS);
    }, 800);

    // Close button
    const closeBtn = document.getElementById('toast-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        dismissToast(toast);
      });
    }

    // Click anywhere on toast dismisses (optional convenience)
    toast.addEventListener('click', function (e) {
      if (e.target === toast) dismissToast(toast);
    });
  }

  function dismissToast(toast) {
    toast.classList.remove('show');
    // Store today's date — won't show again until tomorrow
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
  }

  function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
})();
