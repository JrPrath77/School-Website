// ===== Gallery Lightbox =====
// Pure JS lightbox with keyboard navigation
(function () {
  'use strict';

  let currentIndex = 0;
  let images = [];
  let overlay = null;

  document.addEventListener('DOMContentLoaded', function () {
    // Create lightbox DOM
    createLightbox();

    // Attach to gallery images
    attachToGallery();
  });

  function createLightbox() {
    overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
      <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
      <button class="lightbox-prev" aria-label="Previous image">&#8249;</button>
      <div class="lightbox-content">
        <img src="" alt="Gallery image" id="lightbox-img">
      </div>
      <button class="lightbox-next" aria-label="Next image">&#8250;</button>
      <div class="lightbox-counter" id="lightbox-counter"></div>
    `;
    document.body.appendChild(overlay);

    // Event listeners
    overlay.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    overlay.querySelector('.lightbox-prev').addEventListener('click', function () { navigate(-1); });
    overlay.querySelector('.lightbox-next').addEventListener('click', function () { navigate(1); });
    
    // Close on overlay click (not image)
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
      if (!overlay.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });
  }

  function attachToGallery() {
    // Find all gallery images
    const galleryImages = document.querySelectorAll(
      '.gallery-grid img, .gallery-item img, .gallery-container img, [data-lightbox] img'
    );

    if (galleryImages.length === 0) return;

    images = Array.from(galleryImages).map(function (img) {
      return img.src || img.dataset.src;
    });

    galleryImages.forEach(function (img, index) {
      img.style.cursor = 'pointer';
      img.addEventListener('click', function () {
        openLightbox(index);
      });
    });
  }

  function openLightbox(index) {
    currentIndex = index;
    updateImage();
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Animate in
    requestAnimationFrame(function () {
      overlay.style.opacity = '1';
    });
  }

  function closeLightbox() {
    overlay.style.opacity = '0';
    setTimeout(function () {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }, 300);
  }

  function navigate(direction) {
    currentIndex = (currentIndex + direction + images.length) % images.length;
    updateImage();
  }

  function updateImage() {
    const img = document.getElementById('lightbox-img');
    const counter = document.getElementById('lightbox-counter');
    
    if (img && images[currentIndex]) {
      img.src = images[currentIndex];
    }
    
    if (counter) {
      counter.textContent = (currentIndex + 1) + ' / ' + images.length;
    }
  }
})();
