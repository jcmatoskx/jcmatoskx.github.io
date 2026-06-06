(function () {
  'use strict';

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const faqs = document.querySelectorAll('.faq details');
  faqs.forEach((d) => {
    d.addEventListener('toggle', () => {
      if (!d.open) return;
      faqs.forEach((other) => {
        if (other !== d) other.open = false;
      });
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 64;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  const floatWa = document.querySelector('.float-wa');
  if (floatWa) {
    let lastY = window.pageYOffset;
    window.addEventListener('scroll', () => {
      const y = window.pageYOffset;
      const goingDown = y > lastY && y > 200;
      floatWa.style.transform = goingDown ? 'translateY(120%)' : '';
      lastY = y;
    }, { passive: true });
  }
})();
