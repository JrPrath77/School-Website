// Navigation JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menu Toggle
  initMobileMenu();
  
  // Mobile Dropdown Toggles
  initMobileDropdowns();
});

// Initialize mobile menu functionality
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  
  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', function() {
      mobileNav.classList.toggle('open');
      
      // Toggle hamburger to X animation
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

// Initialize mobile dropdown menu functionality
function initMobileDropdowns() {
  const mobileDropdownBtns = document.querySelectorAll('.mobile-dropdown-btn');
  
  mobileDropdownBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const dropdownMenu = this.nextElementSibling;
      const arrow = this.querySelector('.dropdown-arrow');
      
      // Toggle the current dropdown
      dropdownMenu.classList.toggle('open');
      
      // Toggle arrow rotation
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
            if (otherArrow) {
              otherArrow.style.transform = 'rotate(0)';
            }
          }
        }
      });
    });
  });
}

// Desktop dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
  const navItems = document.querySelectorAll('.nav-item.dropdown');
  
  navItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    const dropdown = item.querySelector('.dropdown-menu');
    
    if (link && dropdown) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Check if this dropdown is already open
        const isOpen = dropdown.style.opacity === '1';
        
        // Close all dropdowns
        navItems.forEach(otherItem => {
          const otherDropdown = otherItem.querySelector('.dropdown-menu');
          if (otherDropdown) {
            otherDropdown.style.opacity = '0';
            otherDropdown.style.visibility = 'hidden';
            otherDropdown.style.transform = 'translateY(10px)';
          }
        });
        
        // If it wasn't open, open it
        if (!isOpen) {
          dropdown.style.opacity = '1';
          dropdown.style.visibility = 'visible';
          dropdown.style.transform = 'translateY(0)';
        }
      });
    }
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
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
});