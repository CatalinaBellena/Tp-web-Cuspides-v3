const menuButton = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuButton && mainNav) menuButton.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".main-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const track = carousel.querySelector(".carousel-track");
  const section = carousel.closest("section") || carousel;
  const previous = carousel.querySelector(".prev") || section.querySelector(".prev");
  const next = carousel.querySelector(".next") || section.querySelector(".next");
  const autoplay = carousel.dataset.autoplay === "true";

  if (!track || !previous || !next) return;

  const updateButtons = () => {
    const maxScroll = track.scrollWidth - track.clientWidth - 2;
    previous.classList.toggle("is-disabled", track.scrollLeft <= 2);
    next.classList.toggle("is-disabled", track.scrollLeft >= maxScroll);
  };

  const move = (direction) => {
    const card = track.querySelector(".trip-card, .guide-card, .story-card, .testimonial-grid article");
    const amount = card ? card.offsetWidth + 20 : track.clientWidth * 0.85;
    const maxScroll = track.scrollWidth - track.clientWidth - 2;

    if (direction > 0 && track.scrollLeft >= maxScroll) {
      track.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    if (direction < 0 && track.scrollLeft <= 2) {
      track.scrollTo({ left: maxScroll, behavior: "smooth" });
      return;
    }

    track.scrollBy({ left: amount * direction, behavior: "smooth" });
  };

  previous.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  track.addEventListener("scroll", updateButtons);
  window.addEventListener("resize", updateButtons);
  updateButtons();

  if (autoplay) {
    let autoMove = window.setInterval(() => move(1), 2600);

    carousel.addEventListener("mouseenter", () => window.clearInterval(autoMove));
    carousel.addEventListener("mouseleave", () => {
      autoMove = window.setInterval(() => move(1), 2600);
    });
  }
});

document.querySelectorAll(".faq-list button").forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("is-open");
    button.querySelector("span").textContent = button.classList.contains("is-open") ? "−" : "+";
  });
});

document.querySelectorAll("form").forEach((form) => {
  const formMessage = form.querySelector("small");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      if (formMessage) formMessage.textContent = "Completá los campos requeridos para continuar.";
      return;
    }

    if (formMessage) {
      formMessage.textContent =
        form.dataset.form === "contact"
          ? "Mensaje preparado. Te responderemos con una propuesta de expedición."
          : "Gracias. Te sumamos a la lista de novedades.";
    }

    form.reset();
  });
});

const formatNumber = (value) => new Intl.NumberFormat("es-AR").format(value);

const animateCount = (element) => {
  const target = Number(element.dataset.count);
  const duration = 1700;
  const startTime = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = formatNumber(Math.round(target * eased));

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

const revealTargets = [
  ".method-card",
  ".mountain-system",
  ".staff-grid",
  ".split-section",
  ".expeditions",
  ".stats",
  ".carousel-section",
  ".gallery",
  ".brands",
  ".reviews",
  ".testimonials",
  ".articles",
  ".summit-system",
  ".expedition-code",
  ".patagonia-viewer",
  ".promo",
  ".brochure",
  ".school-2027",
  ".faq",
  ".newsletter",
  ".contact-section",
  ".site-footer",
  ".method-grid article",
  ".image-card",
  ".trip-card",
  ".gallery-grid img",
  ".guide-card",
  ".testimonial-grid article",
  ".article-row article",
  ".system-grid article",
  ".code-grid article",
  ".ice-map-visual",
].join(",");

document.querySelectorAll(revealTargets).forEach((element, index) => {
  element.dataset.reveal = "";
  element.style.setProperty("--reveal-delay", `${Math.min(index % 5, 4) * 70}ms`);
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");

      if (entry.target.classList.contains("stats")) {
        entry.target.querySelectorAll("[data-count]").forEach((number) => {
          if (number.dataset.animated) return;
          number.dataset.animated = "true";
          animateCount(number);
        });
      }

      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.16, rootMargin: "0px 0px -70px" }
);

document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));

// Parallax suave del hero: la montaña sube levemente al scrollear
const heroSection = document.querySelector('.hero');
const updateHeroParallax = () => {
  if (!heroSection) return;
  const offset = Math.min(window.scrollY * -0.08, 0);
  heroSection.style.setProperty('--hero-y', `${offset}px`);
};
window.addEventListener('scroll', updateHeroParallax, { passive: true });
updateHeroParallax();

// Visor 360 funcional: arrastrar / flechas
const viewer = document.querySelector('[data-viewer]');
if (viewer) {
  let pos = -12;
  let startX = 0;
  let startPos = pos;
  let dragging = false;

  const applyViewer = () => {
    pos = Math.max(-32, Math.min(0, pos));
    viewer.style.setProperty('--viewer-x', `${pos}%`);
  };

  const shiftViewer = (amount) => {
    pos += amount;
    applyViewer();
  };

  viewer.querySelector('[data-viewer-left]')?.addEventListener('click', () => shiftViewer(7));
  viewer.querySelector('[data-viewer-right]')?.addEventListener('click', () => shiftViewer(-7));

  viewer.addEventListener('pointerdown', (event) => {
    dragging = true;
    startX = event.clientX;
    startPos = pos;
    viewer.setPointerCapture(event.pointerId);
  });

  viewer.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    const delta = (event.clientX - startX) / viewer.clientWidth * 42;
    pos = startPos + delta;
    applyViewer();
  });

  viewer.addEventListener('pointerup', () => { dragging = false; });
  viewer.addEventListener('pointercancel', () => { dragging = false; });
  applyViewer();
}


// === FIX v20: visor 360 real, galería modal y testimonios desplegables ===

// Visor 360 con Pannellum. Reemplazá data-panorama por una imagen equirectangular 360 real.
const panoramaStage = document.querySelector(".viewer-360[data-panorama]");
if (panoramaStage && window.pannellum) {
  const panoramaCanvas = panoramaStage.querySelector("#patagonia-panorama");
  const panoramaSource = panoramaStage.dataset.panorama || "assets/imag.10.jpg";

  if (panoramaCanvas) {
    try {
      const viewer360 = pannellum.viewer(panoramaCanvas, {
        type: "equirectangular",
        panorama: panoramaSource,
        autoLoad: true,
        compass: false,
        showControls: false,
        mouseZoom: false,
        draggable: true,
        hfov: 105,
        pitch: 0,
        yaw: 0,
        autoRotate: -0.6
      });

      panoramaStage.classList.add("is-pannellum-ready");

      panoramaStage.querySelector("[data-viewer-left]")?.addEventListener("click", () => {
        viewer360.setYaw(viewer360.getYaw() - 25);
      });

      panoramaStage.querySelector("[data-viewer-right]")?.addEventListener("click", () => {
        viewer360.setYaw(viewer360.getYaw() + 25);
      });
    } catch (error) {
      console.warn("No se pudo inicializar el visor 360:", error);
    }
  }
}

// Galería con modal / pop up
const galleryModal = document.querySelector(".gallery-modal");
const galleryModalImg = galleryModal?.querySelector("img");
const galleryModalClose = galleryModal?.querySelector(".gallery-modal-close");

const closeGalleryModal = () => {
  if (!galleryModal) return;
  galleryModal.classList.remove("is-open");
  galleryModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
};

document.querySelectorAll(".gallery-grid img").forEach((image) => {
  image.addEventListener("click", () => {
    if (!galleryModal || !galleryModalImg) return;
    galleryModalImg.src = image.currentSrc || image.src;
    galleryModalImg.alt = image.alt || "Imagen de galería ampliada";
    galleryModal.classList.add("is-open");
    galleryModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  });
});

galleryModalClose?.addEventListener("click", closeGalleryModal);

galleryModal?.addEventListener("click", (event) => {
  if (event.target === galleryModal) closeGalleryModal();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeGalleryModal();
});

// Testimonios expandibles
const reviewsToggle = document.querySelector(".reviews-toggle");
const moreReviews = document.querySelector(".more-reviews");

reviewsToggle?.addEventListener("click", () => {
  if (!moreReviews) return;
  const isOpen = moreReviews.classList.toggle("is-open");
  moreReviews.setAttribute("aria-hidden", String(!isOpen));
  reviewsToggle.setAttribute("aria-expanded", String(isOpen));
  reviewsToggle.textContent = isOpen ? "Ocultar reseñas" : "Mostrar todas las reseñas";
});
