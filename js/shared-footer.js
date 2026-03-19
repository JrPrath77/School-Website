// ===== Shared Footer Component =====
// Injects consistent footer HTML across all pages
(function () {
  'use strict';

  const footerHTML = `
    <div class="container">
      <div class="footer-content">
        <!-- Logo & Description -->
        <div class="footer-column">
          <div class="footer-logo">
            <a href="index.html" class="footer-logo-link">
              <img src="images/circle logo.png" alt="DAGA Education Logo" class="footer-logo-img">
              <span class="footer-logo-text">DAGA Education</span>
            </a>
          </div>
          <p class="footer-description">
            Empowering future leaders through innovative education and practical learning experiences.
          </p>
          <div class="footer-social">
            <a href="https://www.facebook.com/share/168rpjq5bm/" aria-label="Facebook" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="https://www.instagram.com/dnyansiddhi_academy/?igsh=MTdvMDNxam1ldjh6ZA%3D%3D#" aria-label="Instagram" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg>
            </a>
            <a href="https://www.youtube.com/@dnyansiddhiacademy" target="_blank" aria-label="YouTube">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29.94 29.94 0 0 0 1 12a29.94 29.94 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29.94 29.94 0 0 0 23 12a29.94 29.94 0 0 0-.46-5.58z"></path>
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon>
              </svg>
            </a>
            <a href="https://whatsapp.com/channel/0029VbBUh6N4NVinozfFmp3M" target="_blank" aria-label="WhatsApp">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" fill="currentColor">
                <path d="M16.004 2.003a13.994 13.994 0 0 0-12.02 21.16L2 30l7.077-1.948a13.993 13.993 0 1 0 6.927-26.05zM16 26.99a10.985 10.985 0 0 1-5.62-1.537l-.4-.237-4.198 1.156 1.122-4.093-.26-.42A10.99 10.99 0 1 1 16 26.99zm6.018-8.36c-.33-.165-1.948-.963-2.25-1.073-.302-.11-.522-.165-.742.166s-.853 1.074-1.045 1.296c-.192.22-.385.247-.714.082-.33-.165-1.392-.513-2.65-1.638-.98-.873-1.64-1.952-1.832-2.28-.192-.33-.021-.508.144-.672.148-.147.33-.384.495-.576.165-.192.22-.33.33-.55.11-.22.055-.412-.028-.577-.083-.165-.742-1.785-1.018-2.45-.27-.648-.545-.56-.742-.57l-.633-.012a1.23 1.23 0 0 0-.887.412c-.308.33-1.16 1.132-1.16 2.76 0 1.628 1.188 3.2 1.353 3.42.165.22 2.345 3.57 5.682 5.003 2.338.992 3.252 1.077 4.425.908.71-.106 1.948-.793 2.222-1.56.275-.77.275-1.43.192-1.56-.082-.13-.303-.22-.633-.385z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="footer-column">
          <h3>Quick Links</h3>
          <ul class="footer-links">
            <li><a href="about_us.html">About Us</a></li>
            <li><a href="staff.html">Our Staff</a></li>
            <li><a href="admissions.html">Admissions</a></li>
            <li><a href="event.html">Events</a></li>
            <li><a href="contact_us.html">Contact Us</a></li>
            <li><a href="photo_gallary.html">Photo Gallery</a></li>
            <li><a href="video_gallary.html">Video Gallery</a></li>
            <li><a href="contact_us.html#map">Find Us on Google Maps📍</a></li>
          </ul>
        </div>

        <!-- Programs -->
        <div class="footer-column">
          <h3>Programs</h3>
          <ul class="footer-links">
            <li><a href="index.html#programs">Junior Programs (4th–5th)</a></li>
            <li><a href="index.html#programs">Middle School (6th–8th)</a></li>
            <li><a href="index.html#programs">High School (9th–10th)</a></li>
            <li><a href="index.html#programs">Foundation Courses (JEE/NEET/CET)</a></li>
            <li><a href="index.html#programs">SPI & Military School Prep</a></li>
          </ul>
        </div>

        <!-- Contact Us -->
        <div class="footer-column">
          <h3>Contact Us</h3>
          <ul class="footer-links">
            <li>📞 +91-9518373747</li>
            <li>📞 +91-8788148420</li>
            <li>📞 +91-7744062018</li>
            <li>📞 +91-8010954006</li>
            <li class="footer-inline-icon">
              <a href="mailto:dnyansiddhigurukul@gmail.com">✉️ dnyansiddhigurukul@gmail.com</a>
            </li>
            <li>📍 Zolambi Vasahat,<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Nagaon Road, Ashta<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tal-Walwa, Dist-Sangli,<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Maharashtra – 416301</li>
          </ul>
        </div>
      </div>

      <!-- Bottom Footer -->
      <div class="footer-bottom">
        <div class="copyright">
          <p>&copy; 2025 DAGA Education. All rights reserved.</p>
        </div>
        <div class="footer-bottom-links">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#accessibility">Accessibility</a>
        </div>
      </div>
    </div>
  `;

  document.addEventListener('DOMContentLoaded', function () {
    const footer = document.querySelector('footer.footer');
    if (footer) {
      footer.innerHTML = footerHTML;
    }
  });
})();
