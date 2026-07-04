/* ============================================================
   LuxLife — interactions
   Lenis smooth scroll + GSAP ScrollTrigger choreography
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

const isFine = window.matchMedia("(pointer: fine)").matches;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------- smooth scroll ---------------- */

const lenis = new Lenis({
  duration: 1.15,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* ---------------- helpers ---------------- */

function splitChars(el) {
  const text = el.textContent;
  el.textContent = "";
  el.setAttribute("aria-label", text);
  [...text].forEach((ch) => {
    const span = document.createElement("span");
    span.className = "ch";
    span.textContent = ch === " " ? "\u00A0" : ch;
    span.setAttribute("aria-hidden", "true");
    el.appendChild(span);
  });
  return el.querySelectorAll(".ch");
}

function splitWords(el) {
  const words = el.textContent.trim().split(/\s+/);
  el.textContent = "";
  words.forEach((w, i) => {
    const span = document.createElement("span");
    span.className = "wd";
    span.textContent = w;
    el.appendChild(span);
    if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
  });
  return el.querySelectorAll(".wd");
}

/* ---------------- preloader → hero intro ---------------- */

const preloader = document.getElementById("preloader");
const countEl = document.getElementById("preloaderCount");
const heroChars = [];
document.querySelectorAll(".hero-line").forEach((line) => heroChars.push(splitChars(line)));

const counter = { value: 0 };

const intro = gsap.timeline({ paused: true });

heroChars.forEach((chars, i) => {
  intro.to(chars, {
    y: 0,
    rotate: 0,
    duration: 1.1,
    ease: "power4.out",
    stagger: 0.022,
  }, i * 0.14);
});

intro
  .to("#heroSub", { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, "-=0.7")
  .to(".hero-foot", { opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.5");

gsap.to(counter, {
  value: 100,
  duration: reduceMotion ? 0.3 : 1.5,
  ease: "power2.inOut",
  onUpdate: () => {
    countEl.textContent = String(Math.round(counter.value)).padStart(2, "0");
  },
  onComplete: () => {
    preloader.classList.add("is-done");
    setTimeout(() => intro.play(), 250);
    setTimeout(() => preloader.remove(), 1200);
  },
});

/* ---------------- header state ---------------- */

const header = document.getElementById("siteHeader");
ScrollTrigger.create({
  start: 80,
  onUpdate: (self) => header.classList.toggle("is-scrolled", self.scroll() > 80),
  onToggle: (self) => header.classList.toggle("is-scrolled", self.isActive),
});

/* ---------------- NYC clock ---------------- */

function tickClock() {
  const t = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
  const navClock = document.getElementById("nycClock");
  const footClock = document.getElementById("footClock");
  if (navClock) navClock.textContent = t;
  if (footClock) footClock.textContent = t + " EST";
}
tickClock();
setInterval(tickClock, 10000);

/* ---------------- manifesto word scrub ---------------- */

const manifestoWords = splitWords(document.getElementById("manifestoText"));

gsap.to(manifestoWords, {
  opacity: 1,
  ease: "none",
  stagger: 0.06,
  scrollTrigger: {
    trigger: ".manifesto",
    start: "top 75%",
    end: "bottom 45%",
    scrub: 0.6,
  },
});

/* ---------------- generic reveals ---------------- */

document.querySelectorAll("[data-reveal]").forEach((el) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: { trigger: el, start: "top 86%" },
  });
});

/* ---------------- fleet: pinned horizontal scroll ---------------- */

const mm = gsap.matchMedia();

mm.add("(min-width: 901px)", () => {
  const track = document.getElementById("fleetTrack");
  const progressBar = document.getElementById("fleetProgressBar");
  const getDistance = () => track.scrollWidth - window.innerWidth;

  const tween = gsap.to(track, {
    x: () => -getDistance(),
    ease: "none",
    scrollTrigger: {
      trigger: "#fleetViewport",
      start: "top top",
      end: () => "+=" + getDistance(),
      scrub: 1,
      pin: ".fleet",
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        progressBar.style.width = self.progress * 100 + "%";
      },
    },
  });

  // subtle parallax on each car while the track moves
  document.querySelectorAll(".fleet-visual img").forEach((img) => {
    gsap.fromTo(img, { xPercent: 6 }, {
      xPercent: -6,
      ease: "none",
      scrollTrigger: {
        containerAnimation: tween,
        trigger: img,
        start: "left right",
        end: "right left",
        scrub: true,
      },
    });
  });

  return () => {};
});

mm.add("(max-width: 900px)", () => {
  // stacked slides: simple fade-up per slide
  document.querySelectorAll(".fleet-slide").forEach((slide) => {
    gsap.from(slide, {
      opacity: 0,
      y: 50,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: slide, start: "top 82%" },
    });
  });
});

/* ---------------- stats counters ---------------- */

document.querySelectorAll("[data-count]").forEach((el) => {
  const target = Number(el.dataset.count);
  const obj = { v: 0 };
  gsap.to(obj, {
    v: target,
    duration: 1.8,
    ease: "power2.out",
    snap: { v: 1 },
    onUpdate: () => (el.textContent = obj.v),
    scrollTrigger: { trigger: el, start: "top 88%", once: true },
  });
});

/* ---------------- city list stagger ---------------- */

gsap.from("#cityList li", {
  opacity: 0,
  y: 30,
  duration: 0.7,
  ease: "power3.out",
  stagger: 0.06,
  scrollTrigger: { trigger: "#cityList", start: "top 82%" },
});

/* ---------------- CTA title reveal ---------------- */

const ctaChars = splitChars(document.querySelector(".cta-title"));
gsap.to(ctaChars, {
  y: 0,
  duration: 0.9,
  ease: "power4.out",
  stagger: 0.025,
  scrollTrigger: { trigger: ".cta", start: "top 70%" },
});

/* ---------------- anchor scrolling ---------------- */

document.querySelectorAll("[data-scroll]").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    lenis.scrollTo(link.getAttribute("href"), { offset: -70 });
  });
});

const cue = document.querySelector("[data-scroll-to]");
if (cue) {
  cue.addEventListener("click", () => lenis.scrollTo(cue.dataset.scrollTo, { offset: -70 }));
}

/* ---------------- custom cursor ---------------- */

if (isFine && !reduceMotion) {
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  const pos = { x: innerWidth / 2, y: innerHeight / 2 };
  const ringPos = { x: pos.x, y: pos.y };

  window.addEventListener("mousemove", (e) => {
    pos.x = e.clientX;
    pos.y = e.clientY;
    dot.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
  });

  gsap.ticker.add(() => {
    ringPos.x += (pos.x - ringPos.x) * 0.14;
    ringPos.y += (pos.y - ringPos.y) * 0.14;
    ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%)`;
  });

  document.querySelectorAll("[data-hover], a, button").forEach((el) => {
    el.addEventListener("mouseenter", () => ring.classList.add("is-hover"));
    el.addEventListener("mouseleave", () => ring.classList.remove("is-hover"));
  });
} else {
  document.getElementById("cursorDot").remove();
  document.getElementById("cursorRing").remove();
}

/* ---------------- contact modal ---------------- */

const modal = document.getElementById("contactModal");
const formView = document.getElementById("modalFormView");
const successView = document.getElementById("modalSuccessView");
const form = document.getElementById("contactForm");

function openModal() {
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  lenis.stop();
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  lenis.start();
  setTimeout(() => {
    formView.hidden = false;
    successView.hidden = true;
    form.reset();
  }, 450);
}

document.querySelectorAll(".js-contact").forEach((btn) => btn.addEventListener("click", openModal));
document.querySelectorAll("[data-close-modal]").forEach((el) => el.addEventListener("click", closeModal));
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  formView.hidden = true;
  successView.hidden = false;
});
