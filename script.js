document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
       1. AOS (ANIMATE ON SCROLL) INITIALIZATION
       ========================================================================== */
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 80,
    });
  }

  /* ==========================================================================
       1.5 THEME SWITCHER
       ========================================================================== */
  const themeOptions = document.querySelectorAll('.theme-option[data-theme]');
  const toggleModeBtn = document.getElementById('toggle-mode');
  const modeIcon = document.getElementById('mode-icon');
  const modeText = document.getElementById('mode-text');
  const themeLabel = document.querySelector('.theme-label');
  const themeToggle = document.getElementById('theme-toggle');

  // Load saved preferences
  const savedTheme = localStorage.getItem('colorTheme') || 'orange';
  const savedMode = localStorage.getItem('themeMode') || 'light';

  // Apply saved theme and mode
  applyTheme(savedTheme, savedMode === 'dark');

  // Theme selection - direct listeners on each option
  themeOptions.forEach(function (option) {
    option.addEventListener('click', function (e) {
      e.preventDefault();
      const selectedTheme = this.getAttribute('data-theme');
      const isDark = document.body.classList.contains('dark-theme');
      localStorage.setItem('colorTheme', selectedTheme);
      applyTheme(selectedTheme, isDark);
      updateThemeLabel(selectedTheme);
    });
  });

  // Dark/Light mode toggle
  if (toggleModeBtn) {
    toggleModeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isDarkMode = document.body.classList.toggle('dark-theme');
      localStorage.setItem('themeMode', isDarkMode ? 'dark' : 'light');
      updateModeIcon();
    });
  }

  function applyTheme(theme, isDark) {
    // Remove all theme classes
    document.body.classList.remove('orange-theme', 'green-theme', 'blue-theme');

    // Add selected theme class (except orange which is default)
    if (theme !== 'orange') {
      document.body.classList.add(theme + '-theme');
    }

    // Apply dark mode if needed
    document.body.classList.toggle('dark-theme', isDark);
    updateModeIcon();

    // Update particle colors based on theme
    updateParticleColors(theme);
  }

  function updateThemeLabel(theme) {
    const labels = {
      orange: 'Orange',
      green: 'Green',
      blue: 'Blue',
    };
    if (themeLabel) {
      themeLabel.textContent = labels[theme] || 'Orange';
    }
  }

  function updateModeIcon() {
    const isDarkMode = document.body.classList.contains('dark-theme');
    if (modeIcon) {
      modeIcon.className = isDarkMode ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
    if (modeText) {
      modeText.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
    }
  }

  // Initialize labels
  updateThemeLabel(savedTheme);
  updateModeIcon();

  // Function to get particle colors based on theme
  function getParticleColors(theme) {
    const colorPalettes = {
      orange: [
        'rgba(234, 88, 12, 0.45)', // Deep Orange
        'rgba(220, 38, 38, 0.45)', // Red
        'rgba(217, 119, 6, 0.45)', // Amber
        'rgba(251, 191, 36, 0.45)', // Gold
      ],
      green: [
        'rgba(16, 185, 129, 0.45)', // Emerald
        'rgba(5, 150, 105, 0.45)', // Medium Green
        'rgba(4, 120, 87, 0.45)', // Dark Green
        'rgba(52, 211, 153, 0.45)', // Light Green
      ],
      blue: [
        'rgba(59, 130, 246, 0.45)', // Bright Blue
        'rgba(37, 99, 235, 0.45)', // Medium Blue
        'rgba(29, 78, 216, 0.45)', // Dark Blue
        'rgba(96, 165, 250, 0.45)', // Sky Blue
      ],
    };
    return colorPalettes[theme] || colorPalettes['orange'];
  }

  // Function to update particle colors
  function updateParticleColors(theme) {
    const newColors = getParticleColors(theme);
    particles.forEach((particle) => {
      particle.color = newColors[Math.floor(Math.random() * newColors.length)];
    });
  }
  /* ==========================================================================
       2. AMBIENT PARTICLES CANVAS BACKGROUND
       ========================================================================== */
  let particles = [];
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor(colors = null) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.speedY = (Math.random() - 0.5) * 0.8;
        // Use provided colors or default to orange theme
        const pastelColors = colors || [
          'rgba(234, 88, 12, 0.45)', // Deep Orange
          'rgba(220, 38, 38, 0.45)', // Red
          'rgba(217, 119, 6, 0.45)', // Amber
          'rgba(251, 191, 36, 0.45)', // Gold
        ];
        this.color =
          pastelColors[Math.floor(Math.random() * pastelColors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 18000);
      const currentTheme = localStorage.getItem('colorTheme') || 'orange';
      const colors = getParticleColors(currentTheme);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(colors));
      }
    }
    initParticles();

    function connectParticles() {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 110) {
            const opacity = 1 - distance / 110;
            ctx.strokeStyle = `rgba(99, 102, 241, ${opacity * 0.15})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      connectParticles();
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* ==========================================================================
       3. TYPEWRITER EFFECT
       ========================================================================== */
  const typewriterText = document.getElementById('typewriter-text');
  if (typewriterText) {
    const words = JSON.parse(typewriterText.getAttribute('data-words'));
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        typewriterText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 40;
      } else {
        typewriterText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 90;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2200; // Pause at end of word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 400;
      }

      setTimeout(type, typeSpeed);
    }

    type();
  }

  /* ==========================================================================
       4. SCROLL PROGRESS & BACK TO TOP & STICKY NAVBAR
       ========================================================================== */
  const scrollProgress = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const totalHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    // Progress Bar Width
    if (scrollProgress && totalHeight > 0) {
      const progress = (scrollY / totalHeight) * 100;
      scrollProgress.style.width = `${progress}%`;
    }

    // Back to Top Visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  /* ==========================================================================
       5. ANIMATED SKILL PROGRESS BARS (INTERSECTION OBSERVER)
       ========================================================================== */
  const progressBars = document.querySelectorAll('.progress-bar');
  if (progressBars.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            const targetWidth = bar.getAttribute('data-width');
            bar.style.width = targetWidth;
            observer.unobserve(bar);
          }
        });
      },
      { threshold: 0.2 },
    );

    progressBars.forEach((bar) => observer.observe(bar));
  }

  /* ==========================================================================
       6. ACTIVE NAVBAR LINK HIGHLIGHTING
       ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

  window.addEventListener('scroll', () => {
    let currentSection = '';
    const scrollY = window.scrollY;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  /* ==========================================================================
       7. CONTACT FORM SUBMISSION HANDLER (FORMSUBMIT.CO)
       ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      const name = document.getElementById('form-name').value;
      const email = document.getElementById('form-email').value;
      const subject = document.getElementById('form-subject').value;
      const message = document.getElementById('form-message').value;

      // Client-side validation
      if (!name || !email || !subject || !message) {
        e.preventDefault();
        if (formStatus) {
          formStatus.className =
            'mt-3 text-center alert alert-danger glass-card p-2 text-white';
          formStatus.textContent = 'Please fill out all fields.';
          formStatus.classList.remove('d-none');
        }
        return;
      }

      // Show success message while form submits
      if (formStatus) {
        formStatus.className =
          'mt-3 text-center alert alert-info glass-card p-3 text-white';
        formStatus.innerHTML = `<i class="fa-solid fa-paper-plane me-2 text-accent"></i> Sending your message...`;
        formStatus.classList.remove('d-none');
      }

      // Let the form submit to FormSubmit.co
      // The form will automatically submit and redirect after email is sent
    });

    // Check for form submission success (after redirect from FormSubmit.co)
    const urlParams = new URLSearchParams(window.location.search);
    if (
      urlParams.has('success') ||
      document.referrer.includes('formsubmit.co')
    ) {
      if (formStatus) {
        formStatus.className =
          'mt-3 text-center alert alert-success glass-card p-3 text-white';
        formStatus.innerHTML = `<i class="fa-solid fa-circle-check me-2 text-accent"></i> Thank you! Your message has been sent successfully. I will get back to you shortly.`;
        formStatus.classList.remove('d-none');
      }
      contactForm.reset();
    }
  }
});
