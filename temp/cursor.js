/* ==========================================================
   cursor.js — Custom Cursor
   Tanggung jawab: menggerakkan cursor custom dan efek hover.
   Tidak ada ketergantungan ke modul lain.
   ========================================================== */

const Cursor = (() => {

  // --- State ---
  let outer, inner;
  let mouseX = 0, mouseY = 0;
  let outerX = 0, outerY = 0;
  let rafId   = null;


  // ---- Selector untuk elemen yang memicu efek hover ----
  const HOVER_SELECTOR = 'a, button, .skill-card, .project-card, .contact-link';


  // ---- Smooth follow animation ----
  function animate() {
    // Lerp (linear interpolation) supaya outer cursor mengikuti mouse dengan lag
    outerX += (mouseX - outerX) * 0.12;
    outerY += (mouseY - outerY) * 0.12;

    outer.style.left = `${outerX}px`;
    outer.style.top  = `${outerY}px`;

    rafId = requestAnimationFrame(animate);
  }


  // ---- Event handlers ----
  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Inner cursor: langsung tanpa lag
    inner.style.left = `${mouseX}px`;
    inner.style.top  = `${mouseY}px`;
  }

  function onMouseEnterInteractive() {
    outer.classList.add('is-hovered');
  }

  function onMouseLeaveInteractive() {
    outer.classList.remove('is-hovered');
  }

  function attachHoverListeners() {
    document.querySelectorAll(HOVER_SELECTOR).forEach(el => {
      el.addEventListener('mouseenter', onMouseEnterInteractive);
      el.addEventListener('mouseleave', onMouseLeaveInteractive);
    });
  }


  // ---- Public API ----
  function init() {
    outer = document.getElementById('cursor-outer');
    inner = document.getElementById('cursor-inner');
    if (!outer || !inner) return;

    document.addEventListener('mousemove', onMouseMove);
    attachHoverListeners();
    animate();
  }

  function destroy() {
    if (rafId) cancelAnimationFrame(rafId);
    document.removeEventListener('mousemove', onMouseMove);
  }

  // Re-attach listeners setelah DOM update (berguna jika konten dinamis)
  function refresh() {
    attachHoverListeners();
  }

  return { init, destroy, refresh };

})();