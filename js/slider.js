document.addEventListener('DOMContentLoaded', function() {
  const sliderTrack = document.querySelector('.slider-track');
  const slides = document.querySelectorAll('.slider-slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.querySelector('.slider-arrow.prev');
  const nextBtn = document.querySelector('.slider-arrow.next');
  
  // Exit early if slider elements don't exist on this page
  if (!sliderTrack || !prevBtn || !nextBtn || !slides.length) return;

  let currentSlide = 0;
  const totalSlides = slides.length;
  let autoplayInterval;
  
  function goToSlide(index) {
    currentSlide = index;
    sliderTrack.style.transform = `translateX(-${currentSlide * 25}%)`;
    
    // Update active dot
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentSlide].classList.add('active');
  }
  
  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    goToSlide(currentSlide);
  }
  
  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    goToSlide(currentSlide);
  }
  
  // Event Listeners
  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoplay();
  });
  
  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoplay();
  });
  
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
      resetAutoplay();
    });
  });
  
  // Autoplay
  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5000);
  }
  
  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }
  
  // Pause autoplay on hover
  sliderTrack.addEventListener('mouseenter', () => {
    clearInterval(autoplayInterval);
  });
  
  sliderTrack.addEventListener('mouseleave', startAutoplay);
  
  // Touch support
  let touchStartX = 0;
  let touchEndX = 0;
  
  sliderTrack.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  });
  
  sliderTrack.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      resetAutoplay();
    }
  }
  
  // Initialize slider
  startAutoplay();
});