import { setupCounter } from './counter.js' // for program section popup (read more button)

// Main JavaScript File
document.addEventListener('DOMContentLoaded', function() {
  // Initialize header scroll effect
  initHeaderScroll();
  
  // Apply animations to elements when they become visible
  initScrollAnimations();

   // Add Vite-like UI to #app
  const appDiv = document.querySelector('#app');
  if (appDiv) {
    appDiv.innerHTML = `
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="vite.svg" class="logo" alt="Vite logo" />
        </a>
        <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
          <img src="javascript.svg" class="logo vanilla" alt="JavaScript logo" />
        </a>
        <h1>Hello Vite!</h1>
        <div class="card">
          <button id="counter" type="button"></button>
        </div>
        <p class="read-the-docs">
          Click on the Vite logo to learn more
        </p>
      </div>
    `;

    // Initialize the counter
    setupCounter(document.querySelector('#counter'));
  }
});

// Header scroll effect
function initHeaderScroll() {
  const header = document.getElementById('header');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  
  // Initial check in case page is loaded scrolled down
  if (window.scrollY > 10) {
    header.classList.add('scrolled');
  }
}

// Animations on scroll
function initScrollAnimations() {
  // Select all sections to animate
  const sections = document.querySelectorAll('section');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, {
    threshold: 0.1
  });
  
  sections.forEach(section => {
    observer.observe(section);
  });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      // Close mobile menu if open
      const mobileNav = document.querySelector('.mobile-nav');
      if (mobileNav.classList.contains('open')) {
        mobileNav.classList.remove('open');
      }
      
      // Scroll to target with offset for fixed header
      const headerHeight = document.querySelector('header').offsetHeight;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});