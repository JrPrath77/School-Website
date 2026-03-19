/**
 * Notices API Integration
 * Fetches active notices from the backend and displays them on the homepage.
 */
const API_BASE = 'http://localhost:3001'; // Change to your deployed URL

// Priority badge styles
const priorityStyles = {
  normal: { bg: '#e0f2fe', color: '#0369a1', label: 'Notice' },
  important: { bg: '#fef3c7', color: '#92400e', label: 'Important' },
  urgent: { bg: '#fee2e2', color: '#991b1b', label: 'Urgent' },
};

function renderNoticeCard(notice) {
  const pStyle = priorityStyles[notice.priority] || priorityStyles.normal;
  const dateStr = new Date(notice.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return `
    <div class="notice-card" style="
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      border-left: 4px solid ${pStyle.color};
      transition: transform 0.2s;
    " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <span style="
          background:${pStyle.bg};color:${pStyle.color};
          padding:2px 10px;border-radius:20px;font-size:12px;font-weight:600;
        ">${pStyle.label}</span>
        <span style="color:#6b7280;font-size:13px;">${dateStr}</span>
      </div>
      <h3 style="margin:0 0 8px;font-size:16px;color:#1f2937;">${notice.title}</h3>
      <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.5;">${notice.description}</p>
    </div>
  `;
}

async function loadNotices() {
  const container = document.getElementById('notices-container');
  if (!container) return;

  try {
    const response = await fetch(`${API_BASE}/api/v1/notices`);
    const notices = await response.json();

    if (notices.length === 0) {
      container.style.display = 'none';
      return;
    }

    // Take latest 6 notices
    const latest = notices.slice(0, 6);

    container.innerHTML = `
      <div class="container">
        <div class="section-header">
          <h2>📢 Notices & Announcements</h2>
          <p>Stay updated with the latest announcements</p>
        </div>
        <div style="
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(320px,1fr));
          gap:16px;
          margin-top:24px;
        ">
          ${latest.map(renderNoticeCard).join('')}
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Failed to load notices:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadNotices);
