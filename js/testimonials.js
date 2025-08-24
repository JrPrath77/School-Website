// Testimonials Slider JavaScript
document.addEventListener('DOMContentLoaded', function() {
  initTestimonialsSlider();
});

function initTestimonialsSlider() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dots .dot');
  const prevBtn = document.querySelector('.testimonial-nav.prev');
  const nextBtn = document.querySelector('.testimonial-nav.next');
  
  if (!slides.length || !dots.length) return;
  
  let currentSlide = 0;
  const totalSlides = slides.length;
  
  // Function to show a specific slide
  function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => {
      slide.classList.remove('active');
    });
    
    // Deactivate all dots
    dots.forEach(dot => {
      dot.classList.remove('active');
    });
    
    // Show the current slide and activate corresponding dot
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    
    currentSlide = index;
  }
  
  // Event listener for the previous button
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      let newIndex = currentSlide - 1;
      if (newIndex < 0) newIndex = totalSlides - 1;
      showSlide(newIndex);
    });
  }
  
  // Event listener for the next button
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      let newIndex = currentSlide + 1;
      if (newIndex >= totalSlides) newIndex = 0;
      showSlide(newIndex);
    });
  }
  
  // Event listeners for the dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
    });
  });
  
  // Auto-advance slides every 5 seconds
  let slideInterval = setInterval(() => {
    let newIndex = currentSlide + 1;
    if (newIndex >= totalSlides) newIndex = 0;
    showSlide(newIndex);
  }, 5000);
  
  // Pause auto-advance on hover
  const testimonialSlider = document.querySelector('.testimonial-slider');
  if (testimonialSlider) {
    testimonialSlider.addEventListener('mouseenter', () => {
      clearInterval(slideInterval);
    });
    
    testimonialSlider.addEventListener('mouseleave', () => {
      slideInterval = setInterval(() => {
        let newIndex = currentSlide + 1;
        if (newIndex >= totalSlides) newIndex = 0;
        showSlide(newIndex);
      }, 5000);
    });
  }
  
  // Initialize the first slide
  showSlide(0);
}