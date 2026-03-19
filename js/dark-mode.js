// ===== Dark Mode Toggle =====
(function () {
  'use strict';

  const STORAGE_KEY = 'daga-theme';

  // Apply saved theme immediately (before DOM ready to prevent flash)
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Find the toggle button (injected by shared-header.js)
    const toggle = document.getElementById('dark-mode-toggle');
    if (!toggle) return;

    const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';

    function updateIcon() {
      toggle.textContent = isDark() ? '☀️' : '🌙';
      toggle.setAttribute('aria-label', isDark() ? 'Switch to light mode' : 'Switch to dark mode');
    }

    function toggleTheme() {
      if (isDark()) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem(STORAGE_KEY, 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem(STORAGE_KEY, 'dark');
      }
      updateIcon();
    }

    toggle.addEventListener('click', toggleTheme);
    updateIcon();
  });
})();
