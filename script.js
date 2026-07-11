/* =========================================================
   CREATIVEPAGE
   Main JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initIntro();
  initMobileMenu();
  initProjectPanels();
  initCustomCursor();
  initMouseTrail();
  initParallax();
  initHeroCreatures();
  initTiltCards();
  initMagneticElements();
  initScrollReveal();
  setCurrentYear();
});

/* =========================================================
   INTRO
   ========================================================= */

function initIntro() {
   window.scrollTo({
    top: 0,
    left: 0,
    behavior: "instant"
});
   
  const introScreen = document.getElementById("introScreen");

  if (!introScreen) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion) {
    introScreen.remove();
    return;
  }

  window.setTimeout(() => {
    introScreen.style.transition =
      "opacity 0.8s ease, transform 1.1s cubic-bezier(0.16, 1, 0.3, 1)";
    introScreen.style.opacity = "0";
    introScreen.style.transform = "scale(1.08)";
    introScreen.classList.add("is-complete");
  }, 2750);

  window.setTimeout(() => {
    introScreen.remove();
  }, 3900);
}

/* =========================================================
   MOBILE MENU
   ========================================================= */

function initMobileMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  if (!menuToggle || !mainNav) return;

  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });
}

/* =========================================================
   FOLDING PROJECT PANELS
   ========================================================= */

function initProjectPanels() {
  const buttons = document.querySelectorAll(".project-card__front");

  buttons.forEach((button) => {
    const panelId = button.getAttribute("aria-controls");
    const panel = document.getElementById(panelId);
    const card = button.closest(".project-card");

    if (!panel || !card) return;

    button.addEventListener("click", () => {
      const isOpen = button.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        closeProjectPanel(button, panel, card);
      } else {
        openProjectPanel(button, panel, card);
      }
    });
  });
}

function openProjectPanel(button, panel, card) {
  button.setAttribute("aria-expanded", "true");
  card.classList.add("is-open");

  panel.hidden = false;

  const targetHeight = panel.scrollHeight;

  panel.style.height = "0px";
  panel.style.opacity = "0";
  panel.style.transform = "perspective(900px) rotateX(-18deg)";
  panel.style.transformOrigin = "top";

  requestAnimationFrame(() => {
    panel.style.transition =
      "height 0.55s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease, transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)";
    panel.style.height = `${targetHeight}px`;
    panel.style.opacity = "1";
    panel.style.transform = "perspective(900px) rotateX(0deg)";
  });

  window.setTimeout(() => {
    panel.style.height = "auto";
  }, 580);
}

function closeProjectPanel(button, panel, card) {
  button.setAttribute("aria-expanded", "false");
  card.classList.remove("is-open");

  panel.style.height = `${panel.scrollHeight}px`;

  requestAnimationFrame(() => {
    panel.style.height = "0px";
    panel.style.opacity = "0";
    panel.style.transform = "perspective(900px) rotateX(-18deg)";
  });

  window.setTimeout(() => {
    panel.hidden = true;
    panel.removeAttribute("style");
  }, 580);
}

/* =========================================================
   CUSTOM CURSOR
   ========================================================= */

function initCustomCursor() {
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");

  if (!dot || !ring) return;

  const isTouchDevice =
    window.matchMedia("(pointer: coarse)").matches ||
    "ontouchstart" in window;

  if (isTouchDevice) {
    dot.style.display = "none";
    ring.style.display = "none";
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;

    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;

    requestAnimationFrame(animateRing);
  }

  animateRing();

  const interactiveElements = document.querySelectorAll(
    "a, button, .tilt-card"
  );

  interactiveElements.forEach((element) => {
    element.addEventListener("mouseenter", () => {
      ring.classList.add("is-active");
    });

    element.addEventListener("mouseleave", () => {
      ring.classList.remove("is-active");
    });
  });
}

/* =========================================================
   MOUSE TRAIL
   ========================================================= */

function initMouseTrail() {
  const isTouchDevice =
    window.matchMedia("(pointer: coarse)").matches ||
    "ontouchstart" in window;

  if (isTouchDevice) return;

  const particles = ["✦", "•", "○", "△", "⋆"];
  let lastParticleTime = 0;

  window.addEventListener("mousemove", (event) => {
    const now = Date.now();

    if (now - lastParticleTime < 70) return;

    lastParticleTime = now;

    const particle = document.createElement("span");
    particle.className = "trail-particle";
    particle.textContent =
      particles[Math.floor(Math.random() * particles.length)];

    particle.style.left = `${event.clientX + randomBetween(-8, 8)}px`;
    particle.style.top = `${event.clientY + randomBetween(-8, 8)}px`;

    document.body.appendChild(particle);

    window.setTimeout(() => {
      particle.remove();
    }, 760);
  });
}

/* =========================================================
   PARALLAX
   ========================================================= */

function initParallax() {
  const floatingShapes = document.querySelectorAll(".float-shape");
  const heroStage = document.getElementById("heroStage");

  if (!floatingShapes.length && !heroStage) return;

  window.addEventListener("mousemove", (event) => {
    const x = event.clientX - window.innerWidth / 2;
    const y = event.clientY - window.innerHeight / 2;

    floatingShapes.forEach((shape) => {
      const speed = Number(shape.dataset.speed || 0.03);

      shape.style.transform = `translate(${x * speed}px, ${
        y * speed
      }px)`;
    });

    if (heroStage && window.innerWidth > 760) {
      const stageX = x * 0.012;
      const stageY = y * 0.012;

      heroStage.style.transform = `perspective(1000px) rotateY(${
        stageX * 0.18
      }deg) rotateX(${-stageY * 0.18}deg)`;
    }
  });

  window.addEventListener("mouseleave", () => {
    if (heroStage) {
      heroStage.style.transition = "transform 0.5s ease";
      heroStage.style.transform =
        "perspective(1000px) rotateY(0deg) rotateX(0deg)";

      window.setTimeout(() => {
        heroStage.style.transition = "";
      }, 500);
    }
  });
}

/* =========================================================
   HERO CREATURES
   ========================================================= */

function initHeroCreatures() {
  const fish = document.querySelector(".hero-creature--fish");
  const jelly = document.querySelector(".hero-creature--jelly");

  if (fish) {
    fish.addEventListener("click", () => {
      fish.classList.remove("is-swimming");

      requestAnimationFrame(() => {
        fish.classList.add("is-swimming");
      });

      window.setTimeout(() => {
        fish.classList.remove("is-swimming");
      }, 1200);
    });
  }

  if (jelly) {
    jelly.addEventListener("click", () => {
      jelly.classList.remove("is-wiggling");

      requestAnimationFrame(() => {
        jelly.classList.add("is-wiggling");
      });

      window.setTimeout(() => {
        jelly.classList.remove("is-wiggling");
      }, 2100);
    });
  }
}

/* =========================================================
   TILT CARDS
   ========================================================= */

function initTiltCards() {
  const cards = document.querySelectorAll(".tilt-card");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      if (window.matchMedia("(pointer: coarse)").matches) return;

      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const rotateY = ((x / rect.width) - 0.5) * 10;
      const rotateX = ((y / rect.height) - 0.5) * -10;

      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transition = "transform 0.45s ease";
      card.style.transform =
        "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)";

      window.setTimeout(() => {
        card.style.transition = "";
      }, 460);
    });
  });
}

/* =========================================================
   MAGNETIC BUTTONS
   ========================================================= */

function initMagneticElements() {
  const elements = document.querySelectorAll(".magnetic");

  elements.forEach((element) => {
    element.addEventListener("mousemove", (event) => {
      if (window.matchMedia("(pointer: coarse)").matches) return;

      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      element.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
    });

    element.addEventListener("mouseleave", () => {
      element.style.transition = "transform 0.3s ease";
      element.style.transform = "translate(0, 0)";

      window.setTimeout(() => {
        element.style.transition = "";
      }, 320);
    });
  });
}

/* =========================================================
   SCROLL REVEAL
   ========================================================= */

function initScrollReveal() {
  const targets = document.querySelectorAll(
    ".section-heading, .project-card, .download-card, .illustration-break__frame, .about-badge, .about-copy"
  );

  targets.forEach((target) => {
    target.classList.add("reveal-ready");
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  targets.forEach((target) => {
    observer.observe(target);
  });
}

/* =========================================================
   YEAR
   ========================================================= */

function setCurrentYear() {
  const yearElement = document.getElementById("currentYear");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

/* =========================================================
   UTILITIES
   ========================================================= */

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}
