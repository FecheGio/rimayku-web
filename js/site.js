// ── Nav scroll ───────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Scroll reveal ─────────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── Dropdown (click-based) ────────────────────────────────────
const dropItem   = document.getElementById('dropdownItem');
const dropToggle = document.getElementById('dropdownToggle');

dropToggle.addEventListener('click', (e) => {
  if (window.innerWidth <= 900) return;
  e.preventDefault();
  dropItem.classList.toggle('open');
});
document.addEventListener('click', (e) => {
  if (!dropItem.contains(e.target)) dropItem.classList.remove('open');
});

// ── Mobile menu ───────────────────────────────────────────────
function closeMobile() {
  document.getElementById('mobileMenu').classList.remove('open');
}
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.add('open');
});
document.getElementById('mobileClose').addEventListener('click', closeMobile);
