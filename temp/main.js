/* ==========================================================
   main.js — Entry Point
   Tanggung jawab: menginisialisasi semua modul setelah DOM siap.

   URUTAN PENTING:
   1. Particle system dulu  (tidak butuh DOM khusus)
   2. Cursor               (butuh #cursor-outer & #cursor-inner)
   3. ScrollFX             (butuh semua section sudah ada)

   Kalau perlu tambah modul baru, cukup:
   1. Buat file di js/
   2. Tambah <script src="js/namafile.js"> di index.html
   3. Panggil ModulBaru.init() di sini
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  ParticleSystem.init();
  Cursor.init();
  ScrollFX.init();

  console.log('%c[ RESONANCE ] Portfolio loaded ✓', 'color:#4de8d4; font-family:monospace;');

});