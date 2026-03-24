/**
 * Gallery API Integration
 * Fetches images dynamically from the backend API with pagination and filtering.
 */
const API_BASE = window.SITE_CONFIG.API_BASE;

let currentPage = 1;
let hasMore = true;
let isLoading = false;
let currentCategory = 'all';

// Create skeleton loader HTML
function createSkeletonGrid(count = 8) {
  return Array(count).fill('').map(() => `
    <div class="gallery-item skeleton-item">
      <div class="gallery-image skeleton-shimmer" style="height:220px;border-radius:8px;"></div>
    </div>
  `).join('');
}

// Render a single gallery image card
function renderImageCard(img) {
  // Cloudinary responsive URL
  const thumbUrl = img.imageUrl.includes('cloudinary')
    ? img.imageUrl.replace('/upload/', '/upload/w_400,q_70,f_auto/')
    : img.imageUrl;

  return `
    <div class="gallery-item ${img.category}" data-category="${img.category}">
      <div class="gallery-image">
        <img src="${thumbUrl}" alt="${img.title}" loading="lazy"
             srcset="${img.imageUrl.includes('cloudinary') ? 
               img.imageUrl.replace('/upload/', '/upload/w_400,q_70,f_auto/') + ' 400w, ' +
               img.imageUrl.replace('/upload/', '/upload/w_800,q_80,f_auto/') + ' 800w, ' +
               img.imageUrl.replace('/upload/', '/upload/w_1200,q_80,f_auto/') + ' 1200w'
               : ''}"
             sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 25vw">
        <div class="item-overlay">
          <div class="overlay-content">
            <h3>${img.title}</h3>
            ${img.eventId ? `<p>${img.eventId.title || ''}</p>` : ''}
          </div>
        </div>
      </div>
    </div>
  `;
}

// Fetch and render gallery images
async function loadGallery(page = 1, append = false) {
  if (isLoading) return;
  isLoading = true;

  const container = document.querySelector('.gallery-grid');
  if (!container) return;

  if (!append) {
    container.innerHTML = createSkeletonGrid();
  }

  try {
    const categoryParam = currentCategory !== 'all' ? `&category=${currentCategory}` : '';
    const response = await fetch(`${API_BASE}/api/v1/gallery?page=${page}&limit=20${categoryParam}`);
    const data = await response.json();

    hasMore = data.pagination.hasMore;
    currentPage = page;

    const imagesHTML = data.images.map(renderImageCard).join('');

    if (append) {
      container.insertAdjacentHTML('beforeend', imagesHTML);
    } else {
      container.innerHTML = imagesHTML || '<p style="text-align:center;padding:40px;color:#999;">No images found.</p>';
    }

    // Update Load More button
    updateLoadMoreButton();

    // Apply AOS-like fade-in to new items
    container.querySelectorAll('.gallery-item:not(.visible)').forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('visible');
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, i * 50);
    });

  } catch (error) {
    console.error('Failed to load gallery:', error);
    if (!append) {
      container.innerHTML = '<p style="text-align:center;padding:40px;color:#dc2626;">Failed to load gallery. Please try later.</p>';
    }
  } finally {
    isLoading = false;
  }
}

// Update Load More button visibility
function updateLoadMoreButton() {
  let loadMoreContainer = document.querySelector('.gallery-load-more');
  if (!loadMoreContainer) {
    loadMoreContainer = document.createElement('div');
    loadMoreContainer.className = 'gallery-load-more';
    loadMoreContainer.style.cssText = 'text-align:center;margin-top:32px;';
    document.querySelector('.square-gallery .container')?.appendChild(loadMoreContainer);
  }

  if (hasMore) {
    loadMoreContainer.innerHTML = `
      <button class="load-more-btn" onclick="loadMoreGallery()" style="
        padding: 12px 32px;
        border: 2px solid #4f46e5;
        background: transparent;
        color: #4f46e5;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
        font-weight: 500;
        transition: all 0.3s;
      ">Load More</button>
    `;
  } else {
    loadMoreContainer.innerHTML = '';
  }
}

// Global function for Load More button
window.loadMoreGallery = () => {
  loadGallery(currentPage + 1, true);
};

// Category filter handling
function setupFilters() {
  document.querySelectorAll('.gallery-filter .filter-btn, .filter-btn[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.gallery-filter .filter-btn, .filter-btn[data-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.filter || 'all';
      currentPage = 1;
      hasMore = true;
      loadGallery(1);
    });
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.gallery-grid')) {
    loadGallery();
    setupFilters();
  }
});
