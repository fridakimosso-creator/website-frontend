document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     ELEMENTS
  =============================== */
  const toggleButton = document.querySelector(".toggle-button");
  const navLinks = document.querySelector(".nav-links");
  const header = document.querySelector("header");

  /* ===============================
     MOBILE MENU TOGGLE
  =============================== */
  toggleButton?.addEventListener("click", (e) => {
    e.stopPropagation();
    navLinks?.classList.toggle("active");
    toggleButton.classList.toggle("active");
  });

  /* ===============================
     STICKY HEADER
  =============================== */
  window.addEventListener("scroll", () => {
    header?.classList.toggle("scrolled", window.scrollY > 50);
  });

  /* ===============================
     DROPDOWN FIX (SAFE + NESTED READY)
  =============================== */
  document.querySelectorAll(".dropdown-toggle").forEach(toggle => {
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const dropdown = toggle.closest(".dropdown");
      if (!dropdown) return;

      // close only siblings (same level)
      const parent = dropdown.parentElement;
      if (parent) {
        parent.querySelectorAll(":scope > .dropdown").forEach(item => {
          if (item !== dropdown) {
            item.classList.remove("active");
          }
        });
      }

      dropdown.classList.toggle("active");
    });
  });

  /* ===============================
     CLOSE DROPDOWN ON OUTSIDE CLICK
  =============================== */
  document.addEventListener("click", () => {
    document.querySelectorAll(".dropdown").forEach(d => {
      d.classList.remove("active");
    });
  });

  /* ===============================
     NAV LINK CLICK HANDLER (FIXED + CLEAN)
  =============================== */
  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", (e) => {

      const href = link.getAttribute("href");

      // ignore dropdown toggle clicks
      if (link.classList.contains("dropdown-toggle")) return;

      // smooth scroll ONLY for internal links
      if (href && href.startsWith("#") && href.length > 1) {

        const targetEl = document.querySelector(href);

        if (targetEl) {
          e.preventDefault();

          window.scrollTo({
            top: targetEl.offsetTop - 70,
            behavior: "smooth"
          });
        }
      }

      // close mobile menu
      navLinks?.classList.remove("active");
      toggleButton?.classList.remove("active");

      // close dropdowns
      document.querySelectorAll(".dropdown").forEach(d => {
        d.classList.remove("active");
      });
    });
  });

});
  /* ===============================
     CAROUSEL
  =============================== */

  const carouselTrack = document.querySelector(".carousel-track");
  const slides = document.querySelectorAll(".carousel-item");
  const nextBtn = document.querySelector(".carousel-btn.next");
  const prevBtn = document.querySelector(".carousel-btn.prev");

  let slideIndex = 0;
  let autoSlide;

  function updateCarousel() {
    if (!carouselTrack || slides.length === 0) return;
    carouselTrack.style.transform = `translateX(-${slideIndex * 100}%)`;
  }

  function nextSlide() {
    slideIndex = (slideIndex + 1) % slides.length;
    updateCarousel();
  }

  function prevSlide() {
    slideIndex = (slideIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  }

  nextBtn?.addEventListener("click", nextSlide);
  prevBtn?.addEventListener("click", prevSlide);

  function startAutoSlide() {
    autoSlide = setInterval(nextSlide, 3000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlide);
  }

  startAutoSlide();

  const carouselContainer = document.querySelector(".carousel-container");
  carouselContainer?.addEventListener("mouseenter", stopAutoSlide);
  carouselContainer?.addEventListener("mouseleave", startAutoSlide);


  /* ===============================
     GALLERY FILTER
  =============================== */

  const filterButtons = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-grid .gallery-item");

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        item.style.display =
          filter === "all" || item.dataset.category === filter
            ? "block"
            : "none";
      });
    });
  });


  /* ===============================
     LIGHTBOX
  =============================== */

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.querySelector(".lightbox-img");
  const closeBtn = document.querySelector(".lightbox-close");
  const prev = document.querySelector(".lightbox-nav .prev");
  const next = document.querySelector(".lightbox-nav .next");

  let currentIndex = 0;
  const items = Array.from(galleryItems);

  function openLightbox(index) {
    currentIndex = index;
    lightboxImg.src = items[index].querySelector("img").src;
    lightbox.style.display = "flex";
  }

  items.forEach((item, i) => {
    item.addEventListener("click", () => openLightbox(i));
  });

  closeBtn?.addEventListener("click", () => lightbox.style.display = "none");

  prev?.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    lightboxImg.src = items[currentIndex].querySelector("img").src;
  });

  next?.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % items.length;
    lightboxImg.src = items[currentIndex].querySelector("img").src;
  });

  lightbox?.addEventListener("click", e => {
    if (e.target === lightbox) lightbox.style.display = "none";
  });


  /* ===============================
     HERO TYPING
  =============================== */

  const messages = [
    "We build websites.",
    "We create software.",
    "We solve IT problems.",
    "We design modern solutions.",
    "We support your business."
  ];

  const textElement = document.getElementById("dynamic-text");
  let current = 0;

  function type(message, i = 0) {
    if (!textElement) return;

    if (i < message.length) {
      textElement.textContent = message.slice(0, i + 1);
      setTimeout(() => type(message, i + 1), 80);
    } else {
      setTimeout(() => erase(message), 1500);
    }
  }

  function erase(message, i = message.length) {
    if (i > 0) {
      textElement.textContent = message.slice(0, i - 1);
      setTimeout(() => erase(message, i - 1), 40);
    } else {
      current = (current + 1) % messages.length;
      type(messages[current]);
    }
  }

  type(messages[current]);


  /* ===============================
     SCROLL REVEAL
  =============================== */

  function reveal() {
    document.querySelectorAll(".reveal").forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < window.innerHeight - 100) {
        el.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", reveal);
  reveal();


  /* ===============================
     SCROLL TO TOP
  =============================== */

  const arrow = document.getElementById("scrollArrow");

  window.addEventListener("scroll", () => {
    arrow?.classList.toggle("show", window.scrollY > 300);
  });

  arrow?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });


  /* ===============================
     FORM SUBMIT
  =============================== */

  const form = document.getElementById("registerForm");
  const status = document.getElementById("status");

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      full_name: document.getElementById("full_name").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      phone: document.getElementById("phone").value,
      message: document.getElementById("message").value
    };

    status.textContent = "Sending...";
    status.style.color = "#007bff";

    try {
      const response = await fetch("https://registration-backend-lpkd.onrender.com/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      status.textContent = result.message;

      if (response.ok) {
        status.style.color = "green";
        form.reset();
      } else {
        status.style.color = "red";
      }

    } catch (error) {
      status.textContent = "Server not responding!";
      status.style.color = "red";
    }
  });

