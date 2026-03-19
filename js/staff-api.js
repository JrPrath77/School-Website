// ===== Staff Page Dynamic Loader =====
// Fetches staff from the backend API and renders them in grouped sections
(function () {
  'use strict';

  const API_BASE = 'http://localhost:3001/api/v1';
  const PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'150\' height=\'150\' viewBox=\'0 0 150 150\'%3E%3Crect width=\'150\' height=\'150\' fill=\'%23e0e7ff\'/%3E%3Ccircle cx=\'75\' cy=\'55\' r=\'28\' fill=\'%234f46e5\'/%3E%3Cellipse cx=\'75\' cy=\'130\' rx=\'45\' ry=\'35\' fill=\'%234f46e5\'/%3E%3C/svg%3E';

  // Department display config
  const DEPT_CONFIG = {
    Teaching: { label: 'Our Teaching Staff', color: '#1e40af' },
    Foundation: { label: 'Foundation Staff', color: '#6d28d9' },
    'Non-Teaching': { label: 'Non-Teaching Staff', color: '#b45309' },
    Management: { label: 'Management', color: '#065f46' },
  };

  // Order in which departments appear
  const DEPT_ORDER = ['Management', 'Teaching', 'Foundation', 'Non-Teaching'];

  document.addEventListener('DOMContentLoaded', function () {
    loadStaff();
  });

  async function loadStaff() {
    const container = document.getElementById('staff-dynamic-container');
    if (!container) return;

    try {
      const response = await fetch(API_BASE + '/staff');
      if (!response.ok) throw new Error('API error ' + response.status);

      const data = await response.json();
      const staff = data.data || data;

      if (!Array.isArray(staff) || staff.length === 0) {
        renderFallback(container, 'No staff information is currently available.');
        return;
      }

      // Group staff by department
      const grouped = {};
      staff.forEach(function (member) {
        const dept = member.department || 'Teaching';
        if (!grouped[dept]) grouped[dept] = [];
        grouped[dept].push(member);
      });

      // Render each department in order
      container.innerHTML = '';
      DEPT_ORDER.forEach(function (dept) {
        if (grouped[dept] && grouped[dept].length > 0) {
          container.appendChild(renderDeptSection(dept, grouped[dept]));
        }
      });

      // Render any remaining departments not in DEPT_ORDER
      Object.keys(grouped).forEach(function (dept) {
        if (!DEPT_ORDER.includes(dept) && grouped[dept].length > 0) {
          container.appendChild(renderDeptSection(dept, grouped[dept]));
        }
      });

    } catch (err) {
      console.log('Staff API unavailable:', err.message);
      renderFallback(container, 'Staff information could not be loaded. Please try again later or contact the school directly.');
    }
  }

  function renderDeptSection(dept, members) {
    const config = DEPT_CONFIG[dept] || { label: dept, color: '#4f46e5' };

    const section = document.createElement('section');
    section.className = 'staff-section reveal-on-scroll';

    const heading = document.createElement('h2');
    heading.textContent = config.label;
    heading.style.cssText = 'border-left: 4px solid ' + config.color + '; padding-left: 16px; margin-bottom: 32px; font-size: 1.6rem; font-weight: 700; letter-spacing: -0.01em;';
    section.appendChild(heading);

    const grid = document.createElement('div');
    grid.className = 'staff-grid';

    members.forEach(function (member) {
      grid.appendChild(renderCard(member));
    });

    section.appendChild(grid);
    return section;
  }

  function renderCard(member) {
    const card = document.createElement('div');
    card.className = 'staff-card';

    const img = document.createElement('img');
    img.src = member.photo || PLACEHOLDER;
    img.alt = member.name || 'Staff';
    img.loading = 'lazy';
    // Fallback if photo fails to load
    img.onerror = function () { this.src = PLACEHOLDER; };

    const nameEl = document.createElement('h4');
    nameEl.className = 'staff-name';
    nameEl.textContent = member.name || '';

    const titleEl = document.createElement('p');
    titleEl.className = 'staff-title';
    
    const parts = [];
    if (member.designation && member.designation.trim() !== '') {
      parts.push(member.designation.trim());
    }
    if (member.qualification && member.qualification.trim() !== '') {
      parts.push(member.qualification.trim());
    }
    
    titleEl.textContent = parts.join(' — ');

    card.appendChild(img);
    card.appendChild(nameEl);
    card.appendChild(titleEl);

    if (member.description) {
      const desc = document.createElement('p');
      desc.style.cssText = 'font-size:12px;color:var(--gray-500, #64748b);margin:4px 0 0;line-height:1.4;';
      desc.textContent = member.description;
      card.appendChild(desc);
    }

    return card;
  }

  function renderFallback(container, message) {
    container.innerHTML = `
      <section class="staff-section" style="text-align:center;padding:60px 20px;">
        <div style="font-size:48px;margin-bottom:16px;">👥</div>
        <h3 style="color:#64748b;font-weight:500;">${message}</h3>
        <p style="color:#94a3b8;margin-top:8px;">
          You can reach us at 
          <a href="tel:9518373747" style="color:#2563eb;">9518373747</a> or 
          <a href="mailto:dnyansiddhigurukul@gmail.com" style="color:#2563eb;">dnyansiddhigurukul@gmail.com</a>
        </p>
      </section>
    `;
  }
})();
