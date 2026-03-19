// Video Gallery JavaScript Functions

document.addEventListener('DOMContentLoaded', function() {
  initializeVideoGallery();
  setupFilters();
  setupVideoModal();
  setupLoadMore();
});

// Initialize video gallery functionality
function initializeVideoGallery() {
  const videoItems = document.querySelectorAll('.video-item');
  videoItems.forEach((item, index) => {
    item.style.animationDelay = `${0.1 * index}s`;
  });
}

// Setup category filtering functionality
function setupFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const videoItems = document.querySelectorAll('.video-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      videoItems.forEach(item => {
        if (filterValue === 'all' || item.classList.contains(filterValue)) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

// Setup video modal — uses event delegation so it works even after
// dynamic cards are injected by video-api.js
function setupVideoModal() {
  const modal = document.getElementById('videoModal');
  const modalVideo = document.getElementById('modalVideo');
  const closeBtn = document.querySelector('.close-modal');

  if (!modal || !modalVideo) return;

  function openModal(videoId) {
    modalVideo.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    modal.classList.add('show');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeVideoModal() {
    modal.classList.remove('show');
    modal.style.display = 'none';
    modalVideo.src = ''; // stop playback
    document.body.style.overflow = 'auto';
  }

  // Event delegation on document — catches dynamically-added buttons
  document.addEventListener('click', function(e) {
    // "Watch Now" button
    const watchBtn = e.target.closest('.watch-btn');
    if (watchBtn) {
      e.preventDefault();
      e.stopPropagation();
      const videoId = watchBtn.getAttribute('data-video');
      if (videoId) openModal(videoId);
      return;
    }

    // Click on the play-button overlay
    const playBtn = e.target.closest('.play-button');
    if (playBtn) {
      e.preventDefault();
      e.stopPropagation();
      const nearbyWatchBtn = playBtn.closest('.video-thumbnail')?.querySelector('.watch-btn');
      if (nearbyWatchBtn) {
        const videoId = nearbyWatchBtn.getAttribute('data-video');
        if (videoId) openModal(videoId);
      }
      return;
    }

    // Click on modal backdrop closes it
    if (e.target === modal) {
      closeVideoModal();
    }
  }, true); // capture phase so lightbox.js doesn't intercept first

  if (closeBtn) {
    closeBtn.addEventListener('click', closeVideoModal);
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeVideoModal();
  });
}

// Setup load more functionality
function setupLoadMore() {
  const loadMoreBtn = document.querySelector('.load-more-btn');
  if (!loadMoreBtn) return;
  let currentItems = 8;
  const videoItems = document.querySelectorAll('.video-item');

  videoItems.forEach((item, index) => {
    if (index >= currentItems) {
      item.style.display = 'none';
    }
  });

  loadMoreBtn.addEventListener('click', () => {
    for (let i = currentItems; i < currentItems + 4; i++) {
      if (videoItems[i]) {
        videoItems[i].style.display = 'block';
        videoItems[i].style.animation = 'fadeIn 0.5s ease forwards';
      }
    }
    currentItems += 4;

    if (currentItems >= videoItems.length) {
      loadMoreBtn.style.display = 'none';
    }
  });
}