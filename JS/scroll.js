/* ==========================================================
   scroll.js — Scroll Reveal & Parallax & Active Nav
   Tanggung jawab: semua behavior yang dipicu oleh scroll.
   ========================================================== */

const ScrollFX = (() => {

  // ---- Scroll Reveal (Intersection Observer) ----
  function initReveal() {
    const revealEls = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          const delay = parseFloat(entry.target.dataset.delay || 0);
          setTimeout(() => entry.target.classList.add('visible'), delay * 1000);

          // Unobserve setelah reveal — tidak perlu di-check lagi
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    // Stagger animasi untuk elemen di dalam grid (anak-anak yang berurutan)
    const STAGGER_SELECTORS = [
      '.skills-grid',
      '.projects-grid',
      '.about-grid',
      '.contact-links',
    ];
    STAGGER_SELECTORS.forEach(selector => {
      document.querySelectorAll(`${selector} .reveal`).forEach((child, i) => {
        child.dataset.delay = (i * 0.12).toFixed(2);
      });
    });

    revealEls.forEach(el => observer.observe(el));
  }


  // ---- Active Nav Link ----
  function initActiveNav() {
    const sections  = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('.nav-links a');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          navLinks.forEach(a => a.classList.remove('is-active'));
          const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
          if (active) active.classList.add('is-active');
        });
      },
      { rootMargin: '-40% 0px -40% 0px' }
    );

    sections.forEach(s => observer.observe(s));
  }


  // ---- Hero Parallax (scroll listener — tekan throttle kalau butuh) ----
  function initParallax() {
    const heroGrid   = document.querySelector('#hero .hero-bg-grid');
    const heroRadial = document.querySelector('#hero .hero-radial');
    if (!heroGrid || !heroRadial) return;

    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroGrid.style.transform   = `translateY(${y * 0.3}px)`;
      heroRadial.style.transform = `translateY(${y * 0.2}px)`;
    }, { passive: true });    // passive:true → tidak blok thread scroll
  }


  // ---- Public API ----
  function init() {
    initReveal();
    initActiveNav();
    initParallax();
  }

  return { init };

})();