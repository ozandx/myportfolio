/* ===== Hamburger Menu ===== */
let subMenu = document.querySelector(".sub-menu");

window.addEventListener("click", (e) => {
  if (e.target.closest(".toggle")) {
    subMenu.style.display =
      subMenu.style.display === "flex" ? "none" : "flex";
  } else {
    subMenu.style.display = "none";
  }
});

function updateSubMenu() {
  const subMenu = document.querySelector(".sub-menu");

  // clear submenu first
  subMenu.innerHTML = "";

  if (window.innerWidth <= 768) {
    // Mobile: all links
    subMenu.innerHTML = `
      <a href="#home">HOME</a>
      <a href="#about">ABOUT</a>
      <a href="#experience">EXPERIENCE</a>
      <a href="#project">PROJECT</a>
      <a href="#post">POST</a>
      <a href="#contact">CONTACT</a>
    `;
  } else if (window.innerWidth <= 1024) {
    // Tablet: only hidden links
    subMenu.innerHTML = `
      <a href="#experience">EXPERIENCE</a>
      <a href="#project">PROJECT</a>
      <a href="#post">POST</a>
      <a href="#contact">CONTACT</a>
    `;
  }
}

// run on load + resize
updateSubMenu();
window.addEventListener("resize", updateSubMenu);


/* ===== Navbar scroll ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetID = this.getAttribute('href').slice(1);
        const targetElement = document.getElementById(targetID);

        if (targetElement) {
            const headerOffset = document.querySelector('.navbar').offsetHeight;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/* ===== About Section ===== */
const words = ["Engineering Graduate.", "Tech Enthusiast."];
let wordIndex   = 0;
let charIndex   = 0;
let isDeleting  = false;
const typingEl  = document.getElementById("typing-text");

function typeLoop() {
  const currentWord = words[wordIndex];
  const displayed   = currentWord.substring(0, charIndex);
  typingEl.textContent = displayed;

  if (!isDeleting && charIndex < currentWord.length) {
    charIndex++;
    setTimeout(typeLoop, 100);
  }
  else if (isDeleting && charIndex > 0) {
    charIndex--;
    setTimeout(typeLoop, 50);
  }
  else {
    isDeleting = !isDeleting;
    if (!isDeleting) {
      wordIndex = (wordIndex + 1) % words.length;
    }
    setTimeout(typeLoop, 2000);
  }
}

document.addEventListener("DOMContentLoaded", typeLoop);


/* ===== Project Section ===== */

document.addEventListener("DOMContentLoaded", () => {
  const slideWrapper = document.getElementById("project-slide-wrapper");

  fetch("data/project.json")
    .then(response => {
      if (!response.ok) throw new Error("Failed to load project data.");
      return response.json();
    })
    .then(projects => {
      projects.forEach(project => {
        const slide = document.createElement("li");
        slide.classList.add("project-template", "swiper-slide");

        slide.innerHTML = `
          <div class="project-frame">
            <div class="project-frame-layout">
              <div class="project-image">
                <img src="${project.image}" alt="${project.title}" />
              </div>
              <div class="project-description">
                <div class="project-description-title">
                  <h3>${project.title}</h3>
                </div>
                <div class="project-description-content">
                  <p>${project.description}</p>
                  <h3><span class="project-year">${project.year}</span></h3>
                </div>
              </div>
            </div>
          </div>

          <div class="card-hover">
            <div class="card-template">
              <div class="card-title">${project.role}</div>
              <div class="project-description-title">
                <h3>${project.title}</h3>
              </div>
              <div class="project-description-content">
                <p>${project.description}</p>
              </div>
              <div class="project-main-role">
                <p>${project.mainRole.replace(/\n/g, "<br>")}</p>
              </div>
              <div class="project-tag">
                ${(project.tags || []).map(tag => `<span>${tag}</span>`).join("")}
              </div>
            </div>
          </div>
        </div>
      `;

        slideWrapper.appendChild(slide);
      });

      // Initialize Swiper
      const swiper = new Swiper('.project-wrapper', {
        loop: true,
        spaceBetween: 32,
        speed: 1000,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          dynamicBullets: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }
      });

      // Pause autoplay when hovering slides (including duplicated ones)
      swiper.slides.forEach(slide => {
        slide.addEventListener("mouseenter", () => swiper.autoplay.stop());
        slide.addEventListener("mouseleave", () => swiper.autoplay.start());
      });
    })
    .catch(error => {
      console.error("Error loading projects:", error);
      slideWrapper.innerHTML = `<li class="swiper-slide">Unable to load projects.</li>`;
    });
});


/* ===== Post Section ===== */
function truncateText(text, maxLength) {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

$.getJSON('data/post.json', function (posts) {
  const container = $('.post-item');

  posts.forEach(post => {
    const title = truncateText(post.title, 42); // limit to 42 chars
    const html = `
      <div class="post-template">
        <a href="${post.link}" class="post-frame" target="_blank" rel="noopener noreferrer">
          <div class="post-frame-layout">
            <p class="post-type">${post.type}</p>
            <div class="post-image">
              <img src="${post.image}" alt="${post.type} preview" loading="lazy" />
            </div>
            <div class="post-summary">
              <p class="post-title">${title}</p>
              <button class="view-post">
                view post
                <svg class="arrow-icon" fill="none" stroke="currentColor" stroke-width="1.5"
                     viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </button>
            </div>
          </div>
        </a>
      </div>
    `;
    container.append(html);
  });

  const step = 6;
  const allPosts = $('.post-template');
  const btn = $('.loadmore');

  // Hide all posts initially
  allPosts.hide();

  // Show initial posts with animation
  allPosts.slice(0, step).each(function (i) {
    $(this).css('display', 'flex');
    setTimeout(() => $(this).addClass('show'), i * 100);
  });

  // Load more / hide toggle
  btn.on('click', function () {
    const hidden = allPosts.filter(':hidden');

    if (hidden.length > 0) {
      // Reveal next batch with stagger
      hidden.slice(0, step).each(function (i) {
        $(this).css('display', 'flex');
        setTimeout(() => $(this).addClass('show'), i * 100);
      });

      if (hidden.length <= step) {
        btn.text('Hide All');
      }
    } else {
      // Fade out posts except the first batch
      allPosts.slice(step).removeClass('show');
      setTimeout(() => {
        allPosts.slice(step).hide();
        btn.text('Load More');
      }, 400); // matches CSS transition time
    }
  });
});


/* ===== Scroll animation ===== */
document.addEventListener("DOMContentLoaded", () => {
  const revealElements = document.querySelectorAll(".scroll-reveal");

  const animateStats = (statNumbers) => {
    statNumbers.forEach(el => {
      const raw = el.dataset.number;
      const hasPlus = raw.includes("+");
      const final = parseInt(raw);
      let current = 0;

      const duration = 1000; // total animation duration in ms
      const steps = 30; // total steps
      const increment = Math.ceil(final / steps);
      const intervalTime = duration / steps;

      const interval = setInterval(() => {
        current += increment;
        if (current >= final) {
          el.textContent = hasPlus ? `${final}+` : `${final}`;
          clearInterval(interval);
        } else {
          el.textContent = current;
        }
      }, intervalTime);
    });
  };

  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;

    revealElements.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;

      if (elementTop < windowHeight - 100 && !el.classList.contains("revealed")) {
        el.classList.add("revealed");

        // Animate numbers only for .stats
        if (el.classList.contains("stats")) {
          const statNumbers = el.querySelectorAll(".stat-number");
          animateStats(statNumbers);
        }
      }
    });
  };

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();
});



document.addEventListener("DOMContentLoaded", () => {
  const revealElements = document.querySelectorAll(".scroll-reveal-delay");

  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;

    revealElements.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;

      if (elementTop < windowHeight - 100) {
        el.classList.add("revealed");
      }
    });
  };

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();
});

document.addEventListener("DOMContentLoaded", () => {
    const watermark = document.getElementById("watermark");

    function checkWatermarkVisibility() {
        const rect = watermark.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight;
        if (isVisible) {
            watermark.classList.add("show");
        }
    }

    window.addEventListener("scroll", checkWatermarkVisibility);
    checkWatermarkVisibility(); // Check once on load
});
