// About Us Page JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initAnimations();
    
    // Initialize facility slider
    initFacilitySlider();
    
    // Initialize counter animation
    initCounters();
  });
  
  // Scroll animation
  function initAnimations() {
    // Get all elements with animation classes
    const fadeElements = document.querySelectorAll('.fade-in');
    const slideLeftElements = document.querySelectorAll('.slide-in-left');
    const slideRightElements = document.querySelectorAll('.slide-in-right');
    
    // Set up the Intersection Observer
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Get the delay attribute or use default
          const delay = entry.target.getAttribute('data-delay') || 0;
          
          // Add animation based on class
          if (entry.target.classList.contains('fade-in')) {
            entry.target.style.animation = `fadeIn 1s ease ${delay}s forwards`;
          } else if (entry.target.classList.contains('slide-in-left')) {
            entry.target.style.animation = `slideInLeft 1s ease ${delay}s forwards`;
          } else if (entry.target.classList.contains('slide-in-right')) {
            entry.target.style.animation = `slideInRight 1s ease ${delay}s forwards`;
          }
          
          // Unobserve after animation
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all elements
    fadeElements.forEach(el => observer.observe(el));
    slideLeftElements.forEach(el => observer.observe(el));
    slideRightElements.forEach(el => observer.observe(el));
  }
  
  // Facility slider functionality
  function initFacilitySlider() {
    const slides = document.querySelectorAll('.facility-slide');
    const dots = document.querySelectorAll('.facility-dots .dot');
    const prevBtn = document.querySelector('.facility-nav.prev');
    const nextBtn = document.querySelector('.facility-nav.next');
    
    if (!slides.length || !dots.length) return;
    
    let currentSlide = 0;
    const slideCount = slides.length;
    
    // Function to change slide
    const goToSlide = (index) => {
      // Hide all slides
      slides.forEach(slide => {
        slide.classList.remove('active');
        slide.style.display = 'none';
      });
      
      // Update dots
      dots.forEach(dot => dot.classList.remove('active'));
      
      // Show current slide
      slides[index].classList.add('active');
      slides[index].style.display = 'block';
      dots[index].classList.add('active');
      
      currentSlide = index;
    };
    
    // Event listeners for navigation
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        let newIndex = currentSlide - 1;
        if (newIndex < 0) newIndex = slideCount - 1;
        goToSlide(newIndex);
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        let newIndex = currentSlide + 1;
        if (newIndex >= slideCount) newIndex = 0;
        goToSlide(newIndex);
      });
    }
    
    // Event listeners for dots
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        goToSlide(index);
      });
    });
    
    // Auto-rotate slides every 5 seconds
    let slideInterval = setInterval(() => {
      let newIndex = currentSlide + 1;
      if (newIndex >= slideCount) newIndex = 0;
      goToSlide(newIndex);
    }, 5000);
    
    // Stop auto-rotation when user interacts with slider
    const sliderContainer = document.querySelector('.facilities-slider');
    if (sliderContainer) {
      sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
      });
      
      sliderContainer.addEventListener('mouseleave', () => {
        slideInterval = setInterval(() => {
          let newIndex = currentSlide + 1;
          if (newIndex >= slideCount) newIndex = 0;
          goToSlide(newIndex);
        }, 5000);
      });
    }
    
    // Initialize with first slide
    goToSlide(0);
  }
  
  // Number counter animation
  function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    if (!counters.length) return;
    
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute('data-count'));
          const duration = 2000; // Animation duration in milliseconds
          let startTimestamp = null;
          
          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentCount = Math.floor(progress * target);
            
            counter.textContent = currentCount;
            
            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              counter.textContent = target;
            }
          };
          
          window.requestAnimationFrame(step);
          observer.unobserve(counter);
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '0px 0px -100px 0px'
    });
    
    counters.forEach(counter => {
      observer.observe(counter);
    });
  }