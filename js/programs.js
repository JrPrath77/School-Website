// Programs Filter JavaScript
document.addEventListener('DOMContentLoaded', function() {
  initProgramFilter();
});

function initProgramFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const programCards = document.querySelectorAll('.program-card');
  
  if (!filterBtns.length || !programCards.length) return;
  
  // Function to filter program cards
  function filterPrograms(category) {
    // Update active button state
    filterBtns.forEach(btn => {
      if (btn.dataset.filter === category) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    // Show/hide program cards based on category
    programCards.forEach(card => {
      const cardCategory = card.dataset.category;
      
      if (category === 'all' || category === cardCategory) {
        // Show with animation
        card.style.display = 'block';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 10);
      } else {
        // Hide with animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  }
  
  // Add click event listeners to filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.filter;
      filterPrograms(category);
    });
  });
  
  // Initialize with "all" filter active
  filterPrograms('all');
  
  // Set initial styles for animation
  programCards.forEach(card => {
    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  });
}