/**
 * Video API Integration
 * Fetches videos dynamically from the backend API.
 */
const API_BASE = 'http://localhost:3001'; // Change to your deployed URL

// Create skeleton loader
function createVideoSkeleton(count = 4) {
  return Array(count).fill('').map(() => `
    <div class="video-item skeleton-item">
      <div class="video-thumbnail skeleton-shimmer" style="height:200px;border-radius:8px;"></div>
    </div>
  `).join('');
}

// Render featured video
function renderFeaturedVideo(video) {
  if (!video) return '';
  return `
    <div class="video-wrapper">
      <iframe 
        src="https://www.youtube.com/embed/${video.youtubeId}" 
        title="${video.title}" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen></iframe>
    </div>
    <div class="featured-video-content">
      <h3>${video.title}</h3>
      <p class="video-date">${new Date(video.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <p class="video-description">${video.description}</p>
    </div>
  `;
}

// Render video grid item
function renderVideoCard(video) {
  return `
    <div class="video-item ${video.category}" data-category="${video.category}">
      <div class="video-thumbnail">
        <img src="https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg" alt="${video.title}" loading="lazy">
        <div class="play-button"></div>
        <div class="video-overlay">
          <div class="overlay-content">
            <h3>${video.title}</h3>
            <p>${video.description || ''}</p>
            <button class="watch-btn" data-video="${video.youtubeId}">Watch Now</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Fetch and render videos
async function loadVideos() {
  const videoGrid = document.querySelector('.video-grid');
  const featuredContainer = document.querySelector('.featured-video-player');

  if (videoGrid) videoGrid.innerHTML = createVideoSkeleton();

  try {
    const [allRes, featuredRes] = await Promise.all([
      fetch(`${API_BASE}/api/v1/videos`),
      fetch(`${API_BASE}/api/v1/videos/featured`),
    ]);

    const videos = await allRes.json();
    const featured = await featuredRes.json();

    // Render featured video
    if (featuredContainer && featured) {
      featuredContainer.innerHTML = renderFeaturedVideo(featured);
    }

    // Render video grid
    if (videoGrid) {
      if (videos.length > 0) {
        videoGrid.innerHTML = videos.map(renderVideoCard).join('');
        // No need to call setupVideoModals — video.js uses event delegation
      } else {
        videoGrid.innerHTML = '<p style="text-align:center;padding:40px;color:#999;">No videos available.</p>';
      }
    }

    // Setup filter buttons
    setupVideoFilters(videos);

  } catch (error) {
    console.error('Failed to load videos:', error);
    if (videoGrid) {
      videoGrid.innerHTML = '<p style="text-align:center;padding:40px;color:#dc2626;">Failed to load videos.</p>';
    }
  }
}

// Video modal handling
function setupVideoModals() {
  document.querySelectorAll('.watch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const videoId = btn.dataset.video;
      const modal = document.getElementById('videoModal');
      const modalVideo = document.getElementById('modalVideo');
      if (modal && modalVideo) {
        modalVideo.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        modal.style.display = 'flex';
      }
    });
  });
}

// Category filter
function setupVideoFilters(allVideos) {
  document.querySelectorAll('.gallery-filter .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.gallery-filter .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      const videoGrid = document.querySelector('.video-grid');
      if (!videoGrid) return;

      const filtered = filter === 'all' ? allVideos : allVideos.filter(v => v.category === filter);
      videoGrid.innerHTML = filtered.length > 0
        ? filtered.map(renderVideoCard).join('')
        : '<p style="text-align:center;padding:40px;color:#999;">No videos in this category.</p>';
      // No need to call setupVideoModals — video.js uses event delegation
    });
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.video-grid') || document.querySelector('.featured-video-player')) {
    loadVideos();
  }
});
