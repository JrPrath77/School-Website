// Contact Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initAnimations();
    
    // Initialize Google Map
    initMap();
    
    // Initialize contact form
    initContactForm();
  });
  
  // Scroll animation
  function initAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    const slideLeftElements = document.querySelectorAll('.slide-in-left');
    const slideRightElements = document.querySelectorAll('.slide-in-right');
    
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-delay') || 0;
          
          if (entry.target.classList.contains('fade-in')) {
            entry.target.style.animation = `fadeIn 1s ease ${delay}s forwards`;
          } else if (entry.target.classList.contains('slide-in-left')) {
            entry.target.style.animation = `slideInLeft 1s ease ${delay}s forwards`;
          } else if (entry.target.classList.contains('slide-in-right')) {
            entry.target.style.animation = `slideInRight 1s ease ${delay}s forwards`;
          }
          
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(el => observer.observe(el));
    slideLeftElements.forEach(el => observer.observe(el));
    slideRightElements.forEach(el => observer.observe(el));
  }
  
  // Google Maps initialization
  function initMap() {
    // Replace with your school's coordinates
    const schoolLocation = { lat: YOUR_LATITUDE, lng: YOUR_LONGITUDE };
    
    const map = new google.maps.Map(document.getElementById('map'), {
      center: schoolLocation,
      zoom: 15,
      styles: [
        {
          featureType: 'all',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#6b7280' }]
        },
        {
          featureType: 'water',
          elementType: 'geometry.fill',
          stylers: [{ color: '#bae6fd' }]
        }
      ]
    });
    
    const marker = new google.maps.Marker({
      position: schoolLocation,
      map: map,
      title: 'DAGA Education'
    });
    
    // Optional: Add custom info window
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="padding: 1rem;">
          <h3 style="margin: 0 0 0.5rem; color: #1f2937;">DAGA Education</h3>
          <p style="margin: 0; color: #4b5563;">123 Education Street<br>Academic District<br>City, State 12345</p>
        </div>
      `
    });
    
    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });
  }
  
  // Contact form handling
  function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        try {
          // Replace with your form handling logic
          const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
          
          if (response.ok) {
            // Show success message
            alert('Thank you for your message. We will get back to you soon!');
            form.reset();
          } else {
            throw new Error('Failed to send message');
          }
        } catch (error) {
          // Show error message
          alert('Sorry, there was an error sending your message. Please try again later.');
          console.error('Form submission error:', error);
        }
      });
    }
    
    // Optional: Add form field validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('invalid', (e) => {
        e.preventDefault();
        input.classList.add('error');
      });
      
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          input.classList.remove('error');
        }
      });
    });
  }