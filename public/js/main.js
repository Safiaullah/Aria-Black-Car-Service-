/**
 * Aria Black Car Service — Interactive experience
 */

const BOOKING_URL = "https://book.ariablackcarservice.com/book";

document.addEventListener("DOMContentLoaded", () => {
  initHeroVideo();
  initNavbar();
  initMobileMenu();
  initFleetTabs();
  initFAQ();
  initReveal();
  initBookingForm();
  initCounters();
  initBookingModal();
});

/** Hero background: smooth ping-pong via forward + pre-rendered reverse clips. */
function initHeroVideo() {
  const forward = document.querySelector('.hero-bg video[data-hero="forward"]');
  const reverse = document.querySelector('.hero-bg video[data-hero="reverse"]');
  if (!forward || !reverse) return;

  let active = forward;
  let idle = reverse;

  const swap = () => {
    idle.currentTime = 0;
    idle.classList.add("is-active");
    active.classList.remove("is-active");
    active.pause();
    idle.play().catch(() => {});
    [active, idle] = [idle, active];
  };

  forward.addEventListener("ended", swap);
  reverse.addEventListener("ended", swap);

  const start = () => forward.play().catch(() => {});
  if (forward.readyState >= 1) start();
  else forward.addEventListener("loadedmetadata", start, { once: true });
}

function initNavbar() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".mobile-menu");
  const links = menu?.querySelectorAll("a");

  if (!toggle || !menu) return;

  const close = () => {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  links?.forEach((link) => link.addEventListener("click", close));
}

function initFleetTabs() {
  const tabs = document.querySelectorAll(".fleet-tab");
  const panels = document.querySelectorAll(".fleet-panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.fleet;

      tabs.forEach((t) => t.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById(`fleet-${target}`)?.classList.add("active");
    });
  });
}

function initFAQ() {
  const items = document.querySelectorAll(".faq-item");

  items.forEach((item) => {
    const btn = item.querySelector(".faq-question");
    btn?.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      items.forEach((i) => {
        i.classList.remove("open");
        i.querySelector(".faq-question")?.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
}

function initReveal() {
  const reveals = document.querySelectorAll(".reveal");

  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  reveals.forEach((el) => observer.observe(el));
}

function initCounters() {
  const counters = document.querySelectorAll("[data-count]");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || "";
        const duration = 2000;
        const start = performance.now();

        const animate = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target) + suffix;

          if (progress < 1) requestAnimationFrame(animate);
          else el.textContent = target + suffix;
        };

        requestAnimationFrame(animate);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((c) => observer.observe(c));
}

function initBookingModal() {
  // Booking moved from the Limo Anywhere iframe widget to our own app at
  // book.ariablackcarservice.com. The app (and Stripe Checkout inside it)
  // disallows being embedded in an iframe, so Book Now links now navigate
  // directly via their href instead of opening the modal.
  return;
  const links = document.querySelectorAll(".js-open-booking");
  if (!links.length) return;

  const modal = document.createElement("div");
  modal.className = "booking-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", "Online reservations");
  modal.hidden = true;
  modal.innerHTML = `
    <div class="booking-modal-backdrop" data-close-booking></div>
    <div class="booking-modal-panel">
      <header class="booking-modal-header">
        <span class="booking-modal-title">Book Your Ride</span>
        <button type="button" class="booking-modal-close" aria-label="Close booking">&times;</button>
      </header>
      <iframe class="booking-modal-iframe" title="Aria Black Car — online reservations" src="about:blank" loading="lazy"></iframe>
    </div>
  `;
  document.body.appendChild(modal);

  const iframe = modal.querySelector(".booking-modal-iframe");
  let loaded = false;

  const open = () => {
    if (!loaded) {
      iframe.src = BOOKING_URL;
      loaded = true;
    }
    modal.hidden = false;
    document.body.classList.add("booking-modal-open");
  };

  const close = () => {
    modal.hidden = true;
    document.body.classList.remove("booking-modal-open");
  };

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      open();
    });
  });

  modal.querySelector("[data-close-booking]")?.addEventListener("click", close);
  modal.querySelector(".booking-modal-close")?.addEventListener("click", close);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) close();
  });
}

function initBookingForm() {
  const form = document.getElementById("booking-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const name = data.get("name");
    const phone = data.get("phone");
    const service = data.get("service");
    const pickup = data.get("pickup");
    const dropoff = data.get("dropoff");
    const date = data.get("date");

    const subject = encodeURIComponent(`Aria Black Car — Quote Request from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nPhone: ${phone}\nService: ${service}\nDate/Time: ${date}\nPickup: ${pickup}\nDrop-off: ${dropoff}\n\nPlease send a flat-rate quote.`
    );

    window.location.href = `mailto:bookings@ariablackcarservice.com?subject=${subject}&body=${body}`;
  });
}
