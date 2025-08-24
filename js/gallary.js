// Gallery JavaScript Functions

// Initialize gallery functionality when document is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
    setupFilters();
    setupModal();
  });
  
  // Initialize gallery with animations
  function initializeGallery() {
    // Add staggered animation to diamond elements
    const diamonds = document.querySelectorAll('.diamond');
    diamonds.forEach((diamond, index) => {
      diamond.style.opacity = '0';
      diamond.style.animation = `fadeIn 0.5s ease ${0.1 * index}s forwards`;
    });
  
    // Add staggered animation to gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
      item.style.animationDelay = `${0.1 * index}s`;
    });
  }
  
  // Setup category filtering functionality
  function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
  
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
  
        // Get filter value
        const filterValue = button.getAttribute('data-filter');
  
        // Filter gallery items
        galleryItems.forEach(item => {
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
  
  // Setup modal for "Read More" functionality
  function setupModal() {
    const modal = document.getElementById('readMoreModal');
    const closeBtn = document.querySelector('.close-modal');
    const readMoreBtns = document.querySelectorAll('.read-more-btn');
    
    // Gallery item details - this would typically come from a database
    const galleryDetails = {
      1: {
        title: "Interactive Learning Sessions",
        date: "September 15, 2024",
        image: "https://images.pexels.com/photos/8423003/pexels-photo-8423003.jpeg",
        description: `
          <p>Our interactive learning sessions are designed to engage students in a dynamic educational environment. These sessions combine traditional teaching methods with modern technology to create an immersive learning experience.</p>
          <p>Key features of our interactive learning approach:</p>
          <ul>
            <li>Hands-on activities that reinforce theoretical concepts</li>
            <li>Group discussions to develop communication skills</li>
            <li>Use of digital tools and resources to enhance learning</li>
            <li>Personalized attention to address individual learning needs</li>
          </ul>
          <p>Studies have shown that interactive learning improves retention rates by up to 60% compared to passive learning methods. Our faculty members are trained to facilitate these sessions effectively, ensuring that every student actively participates and benefits from the collaborative learning environment.</p>
        `
      },
      2: {
        title: "Extensive Library Resources",
        date: "August 28, 2024",
        image: "https://images.pexels.com/photos/8364026/pexels-photo-8364026.jpeg",
        description: `
          <p>Our school library is a cornerstone of our academic resources, housing over 15,000 books across all subjects and disciplines. It provides a quiet and conducive environment for study, research, and literary exploration.</p>
          <p>The library is divided into several sections:</p>
          <ul>
            <li>Academic reference section with textbooks and scholarly works</li>
            <li>Fiction section with classic and contemporary literature</li>
            <li>Digital resource center with computers and online database access</li>
            <li>Media section with educational films and documentaries</li>
            <li>Reading lounge for comfortable reading and group study</li>
          </ul>
          <p>Our library staff are always available to assist students with finding resources, conducting research, and developing essential information literacy skills. The library regularly hosts book clubs, author talks, and literary events to promote a love for reading among students.</p>
        `
      },
      3: {
        title: "State-of-the-Art Computer Labs",
        date: "October 5, 2024",
        image: "https://images.pexels.com/photos/8364065/pexels-photo-8364065.jpeg",
        description: `
          <p>Our school is proud to offer state-of-the-art computer laboratories equipped with the latest hardware and software. These facilities are essential in today's digital age, providing students with the technological skills they need for academic success and future careers.</p>
          <p>Features of our computer labs:</p>
          <ul>
            <li>High-performance computers with the latest processors and software</li>
            <li>High-speed internet connectivity for research and online learning</li>
            <li>Specialized software for different subjects including programming, graphic design, and data analysis</li>
            <li>Interactive smartboards for collaborative learning</li>
            <li>Virtual reality stations for immersive educational experiences</li>
          </ul>
          <p>Computer classes are integrated into our curriculum from elementary grades, ensuring that all students develop digital literacy and computational thinking skills. Advanced courses in programming, web development, and digital media are offered to older students interested in pursuing technology-related careers.</p>
        `
      },
      4: {
        title: "Annual Cricket Tournament",
        date: "February 12, 2025",
        image: "https://images.pexels.com/photos/8471556/pexels-photo-8471556.jpeg",
        description: `
          <p>The Annual Cricket Tournament is one of the most anticipated sporting events in our school calendar. It brings together teams from various classes and grades to compete in the spirit of sportsmanship and camaraderie.</p>
          <p>Highlights of the tournament:</p>
          <ul>
            <li>Participation from students across all grade levels</li>
            <li>Professional coaching and umpiring</li>
            <li>State-of-the-art cricket field with proper facilities</li>
            <li>Trophy ceremony and recognition of outstanding players</li>
            <li>Development of teamwork, leadership, and strategic thinking skills</li>
          </ul>
          <p>Our school cricket team has consistently performed well in inter-school tournaments, bringing home several championships over the years. Many of our alumni have gone on to play at collegiate and professional levels, crediting their foundation to the robust cricket program at our institution.</p>
        `
      },
      5: {
        title: "Basketball Training Program",
        date: "March 8, 2025",
        image: "https://images.pexels.com/photos/8471915/pexels-photo-8471915.jpeg",
        description: `
          <p>Our basketball training program is designed to develop both technical skills and mental fortitude in our student athletes. Under the guidance of experienced coaches, students learn the fundamentals of the game while fostering discipline, teamwork, and perseverance.</p>
          <p>The training program includes:</p>
          <ul>
            <li>Regular practice sessions focusing on dribbling, shooting, passing, and defensive techniques</li>
            <li>Strength and conditioning exercises tailored for basketball players</li>
            <li>Strategic game planning and play execution</li>
            <li>Video analysis sessions to review performance and identify areas for improvement</li>
            <li>Friendly matches with other schools to gain competitive experience</li>
          </ul>
          <p>The basketball court is equipped with professional-grade flooring, adjustable hoops to accommodate different age groups, and electronic scoreboards. Our school teams participate in various local and regional tournaments, providing students with opportunities to showcase their skills and represent our institution with pride.</p>
        `
      },
      6: {
        title: "Annual Swimming Gala",
        date: "April 22, 2025",
        image: "https://images.pexels.com/photos/269948/pexels-photo-269948.jpeg",
        description: `
          <p>The Annual Swimming Gala is a highlight of our school's sporting calendar, showcasing the aquatic talents of our students. The event features various swimming competitions across different age categories and swimming styles.</p>
          <p>Event highlights:</p>
          <ul>
            <li>Competitions in freestyle, backstroke, breaststroke, and butterfly</li>
            <li>Relay races promoting teamwork and coordination</li>
            <li>Professional judging and electronic timing systems</li>
            <li>Spectator arrangements for parents and other students</li>
            <li>Medal ceremony recognizing outstanding performances</li>
          </ul>
          <p>Our swimming program begins with water safety and basic swimming skills for younger students, progressing to advanced techniques and competitive training for older students. The school swimming pool is maintained to the highest standards of safety and hygiene, with certified lifeguards present during all swimming activities.</p>
          <p>Several of our alumni have represented the district and state in swimming competitions, a testament to the quality of our aquatics program.</p>
        `
      },
      7: {
        title: "Creative Arts Program",
        date: "November 10, 2024",
        image: "https://images.pexels.com/photos/8422105/pexels-photo-8422105.jpeg",
        description: `
          <p>Our Creative Arts Program offers students a comprehensive exploration of visual arts, fostering creativity, self-expression, and aesthetic appreciation. The program is structured to develop technical skills while encouraging personal artistic voice and critical thinking.</p>
          <p>The program encompasses:</p>
          <ul>
            <li>Drawing and painting using various mediums and techniques</li>
            <li>Sculpture and three-dimensional art forms</li>
            <li>Digital art and graphic design</li>
            <li>Art history and appreciation</li>
            <li>Annual art exhibitions to showcase student work</li>
          </ul>
          <p>Our art studios are equipped with quality materials and tools, providing students with the resources they need to explore their creative potential. Students also have opportunities to visit museums and galleries, exposing them to diverse artistic traditions and contemporary practices.</p>
          <p>The arts program complements our academic curriculum, offering students a balanced education that values both analytical and creative thinking. Many of our graduates have pursued higher education in fine arts, design, and related fields.</p>
        `
      },
      8: {
        title: "Traditional Dance Festival",
        date: "December 5, 2024",
        image: "https://images.pexels.com/photos/7092613/pexels-photo-7092613.jpeg",
        description: `
          <p>Our Traditional Dance Festival celebrates India's rich cultural heritage through dance performances that showcase various classical and folk dance forms. This annual event brings together students from all grades to perform choreographed routines that they have practiced throughout the term.</p>
          <p>Festival highlights:</p>
          <ul>
            <li>Performances of classical dance forms like Bharatanatyam, Kathak, and Odissi</li>
            <li>Folk dance presentations from different regions of India</li>
            <li>Fusion performances combining traditional and contemporary elements</li>
            <li>Authentic costumes and makeup</li>
            <li>Live musical accompaniment</li>
          </ul>
          <p>Our dance program is led by trained instructors who specialize in various dance forms. Regular classes provide students with technical training, cultural context, and performance experience. Through dance, students develop physical coordination, rhythmic awareness, and an appreciation for India's diverse cultural traditions.</p>
          <p>The festival also serves as a platform for cultural exchange, with occasional participation from other schools and community groups. Parents and community members are invited to attend, fostering a sense of cultural pride and community engagement.</p>
        `
      },
      9: {
        title: "Theater and Drama Workshop",
        date: "January 18, 2025",
        image: "https://images.pexels.com/photos/7672106/pexels-photo-7672106.jpeg",
        description: `
          <p>Our Theater and Drama Workshop provides students with a comprehensive introduction to the performing arts. Through a combination of theory and practice, students develop acting skills, stage presence, and an understanding of theatrical production.</p>
          <p>Workshop components:</p>
          <ul>
            <li>Acting exercises focusing on voice, movement, and character development</li>
            <li>Script analysis and interpretation</li>
            <li>Technical aspects including set design, lighting, and sound</li>
            <li>Costume and makeup design</li>
            <li>Culminating in a full production performed for the school community</li>
          </ul>
          <p>The workshop is conducted in our purpose-built theater, equipped with professional lighting and sound systems, flexible seating, and backstage facilities. Students take on various roles both on stage and behind the scenes, gaining a holistic understanding of theatrical production.</p>
          <p>Through drama, students develop confidence, empathy, and collaboration skills that benefit them across all areas of life. The workshop is open to students of all experience levels, with opportunities for advanced students to take on leadership roles and mentor newcomers.</p>
        `
      },
      10: {
        title: "Annual Day Celebration",
        date: "February 28, 2025",
        image: "https://images.pexels.com/photos/8534188/pexels-photo-8534188.jpeg",
        description: `
          <p>Our Annual Day Celebration is the most significant event in the school calendar, marking the anniversary of our institution's founding. This grand event showcases student achievements and talents across academic, cultural, and co-curricular domains.</p>
          <p>Event highlights:</p>
          <ul>
            <li>Formal ceremony with distinguished guests and dignitaries</li>
            <li>Presentation of the annual school report</li>
            <li>Recognition of academic toppers and special achievers</li>
            <li>Cultural performances including music, dance, and drama</li>
            <li>Art and project exhibitions</li>
          </ul>
          <p>Preparations for the Annual Day begin months in advance, with students and teachers collaborating on performances and presentations. The event is held in our school auditorium or occasionally at larger external venues to accommodate the growing audience of parents, alumni, and community members.</p>
          <p>The Annual Day serves not only as a celebration but also as a reflection of our school's vision and values. It reinforces our commitment to holistic education and provides students with a platform to demonstrate their learning and growth.</p>
        `
      },
      11: {
        title: "Science Exhibition",
        date: "November 25, 2024",
        image: "https://images.pexels.com/photos/8364380/pexels-photo-8364380.jpeg",
        description: `
          <p>Our Science Exhibition is an annual event that showcases student projects across various scientific disciplines. It provides students with an opportunity to apply theoretical knowledge to practical problems, develop research skills, and communicate scientific concepts effectively.</p>
          <p>Exhibition features:</p>
          <ul>
            <li>Student-led research projects and experiments</li>
            <li>Working models and prototypes</li>
            <li>Interactive demonstrations and workshops</li>
            <li>Presentations on current scientific developments</li>
            <li>Guest lectures by scientists and industry professionals</li>
          </ul>
          <p>Projects span topics from physics, chemistry, and biology to environmental science, astronomy, and technology. Students work individually or in groups, guided by faculty mentors who provide support while encouraging independent inquiry.</p>
          <p>The exhibition is open to the school community, with special invitations extended to parents, local schools, and science enthusiasts. Projects are evaluated by a panel of judges including teachers and external experts, with outstanding entries receiving recognition and awards.</p>
          <p>The Science Exhibition reflects our school's emphasis on STEM education and inquiry-based learning, preparing students for future academic and career paths in scientific fields.</p>
        `
      },
      12: {
        title: "Parents' Day Meeting",
        date: "October 15, 2024",
        image: "https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg",
        description: `
          <p>Our Parents' Day Meeting is a cornerstone of our school's approach to parent-teacher collaboration. This bi-annual event provides a structured opportunity for parents to discuss their child's progress, learning needs, and overall school experience with teachers and administrators.</p>
          <p>Key aspects of the meeting:</p>
          <ul>
            <li>One-on-one consultations with subject teachers</li>
            <li>Review of academic performance and growth areas</li>
            <li>Discussion of behavioral and social development</li>
            <li>Sharing of portfolios and work samples</li>
            <li>Goal-setting for the upcoming term</li>
          </ul>
          <p>The meetings are scheduled over multiple days to accommodate parents' availability, with flexible timing options including some evening slots. For parents unable to attend in person, virtual meeting options are available.</p>
          <p>Beyond individual consultations, Parents' Day often includes general sessions on curriculum updates, educational approaches, and upcoming school initiatives. Parent support groups and volunteer opportunities are also highlighted, encouraging greater community involvement in school activities.</p>
          <p>We view parents as essential partners in education, and these meetings strengthen the home-school connection that is vital for student success.</p>
        `
      }
    };
  
    // Open modal with correct content when Read More is clicked
    readMoreBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const itemId = btn.getAttribute('data-id');
        const details = galleryDetails[itemId];
        
        // Set modal content
        document.getElementById('modalTitle').textContent = details.title;
        document.getElementById('modalDate').textContent = details.date;
        document.getElementById('modalDescription').innerHTML = details.description;
        document.getElementById('modalImage').src = details.image;
        document.getElementById('modalImage').alt = details.title;
        
        // Reset modal display and show it
        modal.style.display = 'block';
        setTimeout(() => {
          modal.classList.add('show');
        }, 10);
        document.body.style.overflow = 'hidden'; // Prevent scrolling
      });
    });
    

    function closeModal() {
      modal.classList.remove('show');
      setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }, 300);
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }