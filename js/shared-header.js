// ===== Shared Header Component =====
// Injects consistent header HTML across all pages
(function () {
  'use strict';

  // Determine active page for nav highlighting
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  function isActive(page) {
    if (page === 'index.html' && (currentPage === '' || currentPage === 'index.html')) return true;
    return currentPage === page;
  }

  function activeClass(page) {
    return isActive(page) ? ' active' : '';
  }

  const headerHTML = `
    <div class="announcement-banner" id="announcement-banner">
      <span id="announcement-text">📢 Loading announcement...</span>
      <button class="banner-close" id="banner-close" aria-label="Close announcement">×</button>
    </div>
    <div class="container">
      <div class="header-content">
        <div class="logo">
          <a href="index.html" class="logo-container">
            <img src="images/logo.png" alt="DAGA Logo" class="school-logo">
            <div class="school-name">
              <span class="line1">Dnyansiddhi Adarsh Gurukul Academy</span>
              <span class="line2">Ashta</span>
            </div>
          </a>
        </div>
        <nav class="desktop-nav">
          <ul class="nav-list">
            <li class="nav-item">
              <a href="index.html" class="nav-link${activeClass('index.html')}">Home</a>
            </li>
            <li class="nav-item dropdown">
              <a href="#about" class="nav-link${isActive('about_us.html') || isActive('founder_message.html') || isActive('executive-director1.html') || isActive('executive-director2.html') || isActive('principle.html') ? ' active' : ''}">About Us<span class="dropdown-arrow">▼</span></a>
              <ul class="dropdown-menu">
                <li><a href="about_us.html">About Us</a></li>
                <li><a href="founder_message.html">Founder's Message</a></li>
                <li><a href="executive-director1.html">DAGA Executive Director</a></li>
                <li><a href="executive-director2.html">DSA Executive Director</a></li>
                <li><a href="principle.html">Principal's Message</a></li>
              </ul>
            </li>
            <li class="nav-item dropdown">
              <a href="#programs" class="nav-link${activeClass('admissions.html')}">Admissions <span class="dropdown-arrow">▼</span></a>
              <ul class="dropdown-menu">
                <li><a href="admissions.html">Apply Now</a></li>
              </ul>
            </li>
            <li class="nav-item">
              <a href="event.html" class="nav-link${activeClass('event.html')}">Events</a>
            </li>
            <li class="nav-item">
              <a href="staff.html" class="nav-link${activeClass('staff.html')}">Staff</a>
            </li>
            <li class="nav-item dropdown">
              <a href="#gallery" class="nav-link${isActive('photo_gallary.html') || isActive('video_gallary.html') ? ' active' : ''}">Gallery <span class="dropdown-arrow">▼</span></a>
              <ul class="dropdown-menu">
                <li><a href="photo_gallary.html">Photo Gallery</a></li>
                <li><a href="video_gallary.html">Video Gallery</a></li>
              </ul>
            </li>
            <li class="nav-item">
              <a href="contact_us.html" class="nav-link${activeClass('contact_us.html')}">Contact Us</a>
            </li>
          </ul>
          <a href="admissions.html" class="apply-btn">Apply Now</a>
          <button class="dark-mode-toggle" id="dark-mode-toggle" aria-label="Toggle dark mode">🌙</button>
        </nav>
        <div class="header-right-mobile">
          <button class="dark-mode-toggle" id="dark-mode-toggle-mobile" aria-label="Toggle dark mode">🌙</button>
          <button class="mobile-menu-btn" aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </div>
    <!-- Mobile Navigation -->
    <div class="mobile-nav">
      <div class="container">
        <ul class="mobile-nav-list">
          <li class="mobile-nav-item">
            <a href="index.html">Home</a>
          </li>
          <li class="mobile-nav-item">
            <button class="mobile-dropdown-btn">About Us <span class="dropdown-arrow">▼</span></button>
            <ul class="mobile-dropdown-menu">
              <li><a href="about_us.html">About Us</a></li>
              <li><a href="founder_message.html">Founder's Message</a></li>
              <li><a href="executive-director1.html">DAGA Executive Director</a></li>
              <li><a href="executive-director2.html">DSA Executive Director</a></li>
              <li><a href="principle.html">Principal's Message</a></li>
            </ul>
          </li>
          <li class="mobile-nav-item">
            <button class="mobile-dropdown-btn">Admissions <span class="dropdown-arrow">▼</span></button>
            <ul class="mobile-dropdown-menu">
              <li><a href="admissions.html">Apply Now</a></li>
            </ul>
          </li>
          <li class="mobile-nav-item">
            <a href="event.html">Events</a>
          </li>
          <li class="mobile-nav-item">
            <a href="staff.html">Staff</a>
          </li>
          <li class="mobile-nav-item">
            <button class="mobile-dropdown-btn">Gallery <span class="dropdown-arrow">▼</span></button>
            <ul class="mobile-dropdown-menu">
              <li><a href="photo_gallary.html">Photo Gallery</a></li>
              <li><a href="video_gallary.html">Video Gallery</a></li>
            </ul>
          </li>
          <li class="mobile-nav-item">
            <a href="contact_us.html">Contact Us</a>
          </li>
          <li class="mobile-nav-item mobile-apply">
            <a href="admissions.html" class="apply-btn">Apply Now</a>
          </li>
        </ul>
      </div>
    </div>
  `;

  // Inject header
  document.addEventListener('DOMContentLoaded', function () {
    const header = document.getElementById('header');
    if (header) {
      header.innerHTML = headerHTML;
    }

    // ── Sticky header: add scrolled class ──
    const headerEl = document.getElementById('header');
    if (headerEl) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 80) {
          headerEl.classList.add('header-scrolled');
        } else {
          headerEl.classList.remove('header-scrolled');
        }
      });
    }

    // ── Mobile menu toggle ──
    initMobileMenu();
    initMobileDropdowns();
    initDesktopDropdowns();

    // ── Make mobile toggle also work for dark mode ──
    const mobileToggle = document.getElementById('dark-mode-toggle-mobile');
    if (mobileToggle) {
      const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';

      function updateMobileIcon() {
        mobileToggle.textContent = isDark() ? '☀️' : '🌙';
      }

      mobileToggle.addEventListener('click', function () {
        if (isDark()) {
          document.documentElement.removeAttribute('data-theme');
          localStorage.setItem('daga-theme', 'light');
        } else {
          document.documentElement.setAttribute('data-theme', 'dark');
          localStorage.setItem('daga-theme', 'dark');
        }
        updateMobileIcon();
        // Also update desktop toggle if it exists
        const desktopToggle = document.getElementById('dark-mode-toggle');
        if (desktopToggle) desktopToggle.textContent = isDark() ? '☀️' : '🌙';
      });

      updateMobileIcon();
    }
  });

  // ── Mobile Menu ──
  function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');

    if (mobileMenuBtn && mobileNav) {
      mobileMenuBtn.addEventListener('click', function () {
        mobileNav.classList.toggle('open');
        const spans = this.querySelectorAll('span');
        if (mobileNav.classList.contains('open')) {
          spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
          spans[1].style.opacity = '0';
          spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
          spans[0].style.transform = 'none';
          spans[1].style.opacity = '1';
          spans[2].style.transform = 'none';
        }
      });
    }
  }

  // ── Mobile Dropdowns ──
  function initMobileDropdowns() {
    const mobileDropdownBtns = document.querySelectorAll('.mobile-dropdown-btn');
    mobileDropdownBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const dropdownMenu = this.nextElementSibling;
        const arrow = this.querySelector('.dropdown-arrow');
        dropdownMenu.classList.toggle('open');
        if (arrow) {
          arrow.style.transform = dropdownMenu.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0)';
        }
        // Close other dropdowns
        mobileDropdownBtns.forEach(otherBtn => {
          if (otherBtn !== btn) {
            const otherMenu = otherBtn.nextElementSibling;
            const otherArrow = otherBtn.querySelector('.dropdown-arrow');
            if (otherMenu && otherMenu.classList.contains('open')) {
              otherMenu.classList.remove('open');
              if (otherArrow) otherArrow.style.transform = 'rotate(0)';
            }
          }
        });
      });
    });
  }

  // ── Desktop Dropdowns ──
  function initDesktopDropdowns() {
    const navItems = document.querySelectorAll('.nav-item.dropdown');
    navItems.forEach(item => {
      const link = item.querySelector('.nav-link');
      const dropdown = item.querySelector('.dropdown-menu');
      if (link && dropdown) {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          const isOpen = dropdown.style.opacity === '1';
          // Close all
          navItems.forEach(otherItem => {
            const otherDropdown = otherItem.querySelector('.dropdown-menu');
            if (otherDropdown) {
              otherDropdown.style.opacity = '0';
              otherDropdown.style.visibility = 'hidden';
              otherDropdown.style.transform = 'translateY(10px)';
            }
          });
          if (!isOpen) {
            dropdown.style.opacity = '1';
            dropdown.style.visibility = 'visible';
            dropdown.style.transform = 'translateY(0)';
          }
        });
      }
    });
    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.nav-item.dropdown')) {
        navItems.forEach(item => {
          const dropdown = item.querySelector('.dropdown-menu');
          if (dropdown) {
            dropdown.style.opacity = '0';
            dropdown.style.visibility = 'hidden';
            dropdown.style.transform = 'translateY(10px)';
          }
        });
      }
    });
  }
})();
