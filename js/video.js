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
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
  
        // Get filter value
        const filterValue = button.getAttribute('data-filter');
  
        // Filter video items
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
  
  // Setup video modal functionality
  function setupVideoModal() {
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const closeBtn = document.querySelector('.close-modal');
    const watchBtns = document.querySelectorAll('.watch-btn');
  
    // Open modal with correct video
    watchBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const videoId = btn.getAttribute('data-video');
        modalVideo.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
      });
    });
  
    // Close modal
    closeBtn.addEventListener('click', closeVideoModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeVideoModal();
      }
    });
  
    // Close modal function
    function closeVideoModal() {
      modal.classList.remove('show');
      modalVideo.src = '';
      document.body.style.overflow = 'auto';
    }
  }
  
  // Setup load more functionality
  function setupLoadMore() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    let currentItems = 8;
    const videoItems = document.querySelectorAll('.video-item');
    
    // Initially hide items beyond the first 8
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
  
      // Hide button if no more items
      if (currentItems >= videoItems.length) {
        loadMoreBtn.style.display = 'none';
      }
    });
  }