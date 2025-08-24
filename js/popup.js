// Program Popup Functionality
class ProgramPopup {
  constructor() {
    this.overlay = null;
    this.modal = null;
    this.isOpen = false;
    this.init();
  }

  init() {
    this.createPopupHTML();
    this.bindEvents();
  }

  createPopupHTML() {
    // Create popup overlay and modal
    this.overlay = document.createElement('div');
    this.overlay.className = 'popup-overlay';
    this.overlay.innerHTML = `
      <div class="popup-modal">
        <div class="popup-header">
          <img class="popup-header-image" src="" alt="">
          <div class="popup-badge"></div>
          <button class="popup-close">&times;</button>
        </div>
        <div class="popup-content">
          <h2 class="popup-title"></h2>
          <p class="popup-description"></p>
          <div class="popup-details"></div>
          <div class="popup-actions">
            <a href="#contact" class="popup-btn popup-btn-primary">
              संपर्क करा
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </a>
            <button class="popup-btn popup-btn-secondary popup-close-btn">
              बंद करा
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.overlay);
    this.modal = this.overlay.querySelector('.popup-modal');
  }

  bindEvents() {
    // Close popup events
    const closeButtons = this.overlay.querySelectorAll('.popup-close, .popup-close-btn');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => this.close());
    });

    // Close on overlay click
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Bind program card clicks
    this.bindProgramCards();
  }

  bindProgramCards() {
    const programLinks = document.querySelectorAll('.program-link');
    programLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const card = link.closest('.program-card');
        const programId = card.dataset.id;
        this.open(programId);
      });
    });
  }

  open(programId) {
    const programData = this.getProgramData(programId);
    if (!programData) return;

    this.populatePopup(programData);
    this.overlay.classList.add('active');
    this.isOpen = true;
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.overlay.classList.remove('active');
    this.isOpen = false;
    document.body.style.overflow = '';
  }

  populatePopup(data) {
    const headerImage = this.overlay.querySelector('.popup-header-image');
    const badge = this.overlay.querySelector('.popup-badge');
    const title = this.overlay.querySelector('.popup-title');
    const description = this.overlay.querySelector('.popup-description');
    const details = this.overlay.querySelector('.popup-details');

    headerImage.src = data.image;
    headerImage.alt = data.title;
    badge.textContent = data.category;
    title.textContent = data.title;
    description.textContent = data.description;
    details.innerHTML = data.detailsHTML;
  }

  getProgramData(programId) {
    const programs = {
      '0': {
        title: 'नवोदय व सातारा सैनिक शाळा प्रवेश परीक्षा तयारी',
        category: 'ज्युनियर',
        image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg',
        description: 'प्रमुख नवोदय आणि सातारा सैनिक शाळांच्या प्रवेश परीक्षा तयारीसाठी उपयुक्त मार्गदर्शन आणि सखोल अभ्यास.',
        detailsHTML: `
          <div class="popup-highlight">
            <h4>🎯 कोर्स हायलाइट्स</h4>
            <p>इयत्ता 4वी - 5वी च्या विद्यार्थ्यांसाठी विशेष डिझाइन केलेला कोर्स</p>
          </div>
          
          <div class="popup-section">
            <h4>
              <svg class="popup-section-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
              मुख्य वैशिष्ट्ये
            </h4>
            <ul class="popup-list">
              <li>नवोदय विद्यालय प्रवेश परीक्षेची संपूर्ण तयारी</li>
              <li>सातारा सैनिक शाळा प्रवेश परीक्षा मार्गदर्शन</li>
              <li>गणित, विज्ञान आणि सामान्य ज्ञानावर विशेष भर</li>
              <li>नियमित मॉक टेस्ट आणि मूल्यमापन</li>
              <li>व्यक्तिगत लक्ष आणि मार्गदर्शन</li>
              <li>अभ्यास साहित्य आणि नोट्स प्रदान</li>
            </ul>
          </div>

          <div class="popup-section">
            <h4>
              <svg class="popup-section-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              कोर्स कालावधी
            </h4>
            <ul class="popup-list">
              <li>संपूर्ण शैक्षणिक वर्ष (जून ते मार्च)</li>
              <li>आठवड्यातून 5 दिवस क्लासेस</li>
              <li>दररोज 2-3 तास अभ्यास</li>
              <li>मासिक प्रगती मूल्यमापन</li>
            </ul>
          </div>

          <div class="popup-section">
            <h4>
              <svg class="popup-section-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              पात्रता
            </h4>
            <ul class="popup-list">
              <li>इयत्ता 4वी आणि 5वी चे विद्यार्थी</li>
              <li>मराठी/हिंदी/इंग्रजी माध्यमातील विद्यार्थी</li>
              <li>शिक्षणाबद्दल उत्सुकता असणारे विद्यार्थी</li>
            </ul>
          </div>
        `
      },
      '1': {
        title: 'गणित प्रविण्य व उच्च प्राथमिक शिष्यवृत्ती परीक्षा तयारी',
        category: 'मिडल स्कूल',
        image: 'https://images.pexels.com/photos/7096/people-woman-coffee-meeting.jpg',
        description: 'गणित विषयाची मजबूत पकड बनवून शिष्यवृत्ती परीक्षेसाठी तयारी करा आणि आपल्या गणिताच्या कौशल्याचा विकास करा.',
        detailsHTML: `
          <div class="popup-highlight">
            <h4>🎯 कोर्स हायलाइट्स</h4>
            <p>इयत्ता 6वी - 8वी च्या विद्यार्थ्यांसाठी गणित प्रविण्य विकसित करण्याचा कोर्स</p>
          </div>
          
          <div class="popup-section">
            <h4>
              <svg class="popup-section-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
              मुख्य वैशिष्ट्ये
            </h4>
            <ul class="popup-list">
              <li>गणित प्रविण्य परीक्षेची संपूर्ण तयारी</li>
              <li>उच्च प्राथमिक शिष्यवृत्ती परीक्षा मार्गदर्शन</li>
              <li>बीजगणित, भूमिती आणि अंकगणितावर विशेष भर</li>
              <li>समस्या सोडवण्याच्या तंत्रांचे शिक्षण</li>
              <li>नियमित सराव आणि चाचण्या</li>
              <li>गणिताची भीती दूर करण्याचे तंत्र</li>
            </ul>
          </div>

          <div class="popup-section">
            <h4>
              <svg class="popup-section-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 11H5a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2h4m6-6h4a2 2 0 0 1 2 2v3c0 1.1-.9 2-2 2h-4m-6 0V9a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2z"></path>
              </svg>
              अभ्यासक्रम
            </h4>
            <ul class="popup-list">
              <li>संख्या प्रणाली आणि मूलभूत संक्रिया</li>
              <li>भिन्न, दशांश आणि टक्केवारी</li>
              <li>बीजगणिताची मूलतत्त्वे</li>
              <li>भूमिती आणि क्षेत्रफळ</li>
              <li>आकडेवारी आणि आलेख</li>
              <li>तर्कशुद्ध गणित</li>
            </ul>
          </div>

          <div class="popup-section">
            <h4>
              <svg class="popup-section-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
              यशाची कहाणी
            </h4>
            <ul class="popup-list">
              <li>95% विद्यार्थी गणित प्रविण्य परीक्षेत उत्तीर्ण</li>
              <li>80% विद्यार्थ्यांना शिष्यवृत्ती मिळाली</li>
              <li>गणितातील गुण सुधारणा 40% पर्यंत</li>
            </ul>
          </div>
        `
      },
      '2': {
        title: 'JEE, NEET, CET फाउंडेशन कोर्स',
        category: 'हायस्कूल',
        image: 'https://images.pexels.com/photos/3183165/pexels-photo-3183165.jpeg',
        description: 'JEE, NEET, CET सारख्या राष्ट्रीय प्रवेश परीक्षा तयारीसाठी फाउंडेशन कोर्सेस आणि मजबूत पाया तयार करा.',
        detailsHTML: `
          <div class="popup-highlight">
            <h4>🎯 कोर्स हायलाइट्स</h4>
            <p>इयत्ता 9वी - 10वी च्या विद्यार्थ्यांसाठी इंजिनिअरिंग आणि मेडिकल प्रवेश परीक्षांचा पाया</p>
          </div>
          
          <div class="popup-section">
            <h4>
              <svg class="popup-section-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
              मुख्य वैशिष्ट्ये
            </h4>
            <ul class="popup-list">
              <li>JEE Main आणि Advanced ची फाउंडेशन तयारी</li>
              <li>NEET परीक्षेसाठी जीवशास्त्र आणि रसायनशास्त्र</li>
              <li>MHT-CET परीक्षेची संपूर्ण तयारी</li>
              <li>भौतिकशास्त्र, रसायनशास्त्र, गणित आणि जीवशास्त्र</li>
              <li>संकल्पनात्मक स्पष्टता आणि समस्या सोडवणे</li>
              <li>नियमित चाचण्या आणि स्पर्धा परीक्षा</li>
            </ul>
          </div>

          <div class="popup-section">
            <h4>
              <svg class="popup-section-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 11H5a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2h4m6-6h4a2 2 0 0 1 2 2v3c0 1.1-.9 2-2 2h-4m-6 0V9a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2z"></path>
              </svg>
              विषय कव्हरेज
            </h4>
            <ul class="popup-list">
              <li><strong>भौतिकशास्त्र:</strong> यांत्रिकी, उष्णता, प्रकाश, विद्युत</li>
              <li><strong>रसायनशास्त्र:</strong> अकार्बनी, कार्बनी, भौतिक रसायन</li>
              <li><strong>गणित:</strong> बीजगणित, त्रिकोणमिती, निर्देशांक भूमिती</li>
              <li><strong>जीवशास्त्र:</strong> वनस्पतिशास्त्र, प्राणिशास्त्र (NEET साठी)</li>
            </ul>
          </div>

          <div class="popup-section">
            <h4>
              <svg class="popup-section-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 9V5a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2z"></path>
              </svg>
              करिअर मार्गदर्शन
            </h4>
            <ul class="popup-list">
              <li>इंजिनिअरिंग शाखांची माहिती</li>
              <li>मेडिकल क्षेत्रातील संधी</li>
              <li>करिअर काउंसलिंग सेशन्स</li>
              <li>यशस्वी विद्यार्थ्यांशी संवाद</li>
            </ul>
          </div>
        `
      },
      '3': {
        title: 'SPI Academy प्रवेश परीक्षा तयारी',
        category: 'हायस्कूल',
        image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg',
        description: 'SPI Academy च्या प्रवेश परीक्षेसाठी इंटेन्सिव तयारी, महत्त्वपूर्ण विषय आणि चाचणी घेण्याचे तंत्र शिकवले जातात.',
        detailsHTML: `
          <div class="popup-highlight">
            <h4>🎯 कोर्स हायलाइट्स</h4>
            <p>SPI Academy प्रवेश परीक्षेसाठी विशेष डिझाइन केलेला इंटेन्सिव कोर्स</p>
          </div>
          
          <div class="popup-section">
            <h4>
              <svg class="popup-section-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
              मुख्य वैशिष्ट्ये
            </h4>
            <ul class="popup-list">
              <li>SPI Academy प्रवेश परीक्षेची संपूर्ण तयारी</li>
              <li>गणित, विज्ञान आणि इंग्रजीवर विशेष भर</li>
              <li>तर्कशुद्धता आणि विश्लेषणात्मक कौशल्य</li>
              <li>वेळ व्यवस्थापन तंत्र</li>
              <li>मॉक टेस्ट आणि सिम्युलेशन</li>
              <li>व्यक्तिगत कमकुवतपणा ओळखून सुधारणा</li>
            </ul>
          </div>

          <div class="popup-section">
            <h4>
              <svg class="popup-section-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 11H5a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2h4m6-6h4a2 2 0 0 1 2 2v3c0 1.1-.9 2-2 2h-4m-6 0V9a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2z"></path>
              </svg>
              परीक्षा पॅटर्न
            </h4>
            <ul class="popup-list">
              <li>बहुपर्यायी प्रश्न (MCQ) फॉर्मेट</li>
              <li>गणित - 40 प्रश्न</li>
              <li>विज्ञान - 30 प्रश्न</li>
              <li>इंग्रजी - 20 प्रश्न</li>
              <li>तर्कशुद्धता - 10 प्रश्न</li>
              <li>एकूण वेळ: 2 तास</li>
            </ul>
          </div>

          <div class="popup-section">
            <h4>
              <svg class="popup-section-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
              तयारीची रणनीती
            </h4>
            <ul class="popup-list">
              <li>दैनंदिन अभ्यास योजना</li>
              <li>कमकुवत विषयांवर विशेष लक्ष</li>
              <li>वेगवान गणनेचे तंत्र</li>
              <li>परीक्षेतील तणाव व्यवस्थापन</li>
              <li>नियमित प्रगती मूल्यमापन</li>
            </ul>
          </div>

          <div class="popup-section">
            <h4>
              <svg class="popup-section-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              यशाचे आकडे
            </h4>
            <ul class="popup-list">
              <li>90% विद्यार्थी SPI Academy मध्ये प्रवेश</li>
              <li>टॉप 10 मध्ये 60% विद्यार्थी</li>
              <li>सरासरी स्कोअर सुधारणा 35%</li>
            </ul>
          </div>
        `
      }
    };

    return programs[programId] || null;
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ProgramPopup();
});