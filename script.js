/**
 * SENTINEL SHIELD CYBERSECURITY
 * Main JavaScript — script.js
 * Handles: Loading screen, Navbar, Scroll reveal,
 *          Counters, FAQ, Forms, Back-to-top, Ripple
 */

'use strict';

/* =====================================================
   LOADING SCREEN
   ===================================================== */
(function initLoader() {
  const loader = document.getElementById('loading-screen');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1600);
  });

  document.body.style.overflow = 'hidden';
})();

/* =====================================================
   NAVBAR
   ===================================================== */
(function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const toggle  = document.getElementById('nav-toggle');
  const menu    = document.getElementById('nav-menu');
  const overlay = document.getElementById('nav-overlay');
  if (!navbar) return;

  // Shrink on scroll
  function handleScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile toggle
  if (toggle && menu && overlay) {
    function openMenu() {
      menu.classList.add('open');
      overlay.classList.add('open');
      toggle.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      menu.classList.remove('open');
      overlay.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', () => {
      menu.classList.contains('open') ? closeMenu() : openMenu();
    });

    overlay.addEventListener('click', closeMenu);

    // Close on nav link click
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Keyboard: Escape closes menu
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
    });
  }

  // Highlight active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* =====================================================
   SCROLL REVEAL
   ===================================================== */
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();

/* =====================================================
   ANIMATED COUNTERS
   ===================================================== */
(function initCounters() {
  const counters = document.querySelectorAll('.counter[data-target]');
  if (!counters.length) return;

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function animateCounter(el) {
    const target   = parseFloat(el.dataset.target);
    const duration = parseInt(el.dataset.duration || '2000');
    const suffix   = el.dataset.suffix || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const start    = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutExpo(progress);
      const current  = target * eased;

      el.innerHTML = current.toFixed(decimals) + '<span class="suffix">' + suffix + '</span>';

      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
})();

/* =====================================================
   FAQ ACCORDION
   ===================================================== */
(function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer   = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others
      items.forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          const a = other.querySelector('.faq-answer');
          if (a) a.style.maxHeight = '0';
        }
      });

      // Toggle clicked
      if (isOpen) {
        item.classList.remove('open');
        answer.style.maxHeight = '0';
      } else {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });

    // Keyboard support
    question.setAttribute('role', 'button');
    question.setAttribute('tabindex', '0');
    question.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });
  });
})();

/* =====================================================
   BUTTON RIPPLE EFFECT
   ===================================================== */
(function initRipple() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.btn');
    if (!btn) return;

    const rect   = btn.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    const x      = e.clientX - rect.left - size / 2;
    const y      = e.clientY - rect.top  - size / 2;
    const ripple = document.createElement('span');

    ripple.className = 'ripple';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
    btn.appendChild(ripple);

    ripple.addEventListener('animationend', () => ripple.remove());
  });
})();

/* =====================================================
   BACK TO TOP
   ===================================================== */
(function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* =====================================================
   TOAST NOTIFICATION
   ===================================================== */
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icon = type === 'success'
    ? '<i class="fa-solid fa-circle-check"></i>'
    : '<i class="fa-solid fa-circle-xmark"></i>';

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon" aria-hidden="true">${icon}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" aria-label="Close notification">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));

  function removeToast() {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }

  toast.querySelector('.toast-close').addEventListener('click', removeToast);
  setTimeout(removeToast, 5000);
}

/* =====================================================
   CONTACT FORM VALIDATION
   ===================================================== */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  function setError(input, msg) {
    input.classList.add('error');
    const errorEl = input.parentElement.querySelector('.form-error');
    if (errorEl) { errorEl.textContent = msg; errorEl.classList.add('visible'); }
  }

  function clearError(input) {
    input.classList.remove('error');
    const errorEl = input.parentElement.querySelector('.form-error');
    if (errorEl) errorEl.classList.remove('visible');
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    return phone === '' || /^[\+\d\s\-\(\)]{7,20}$/.test(phone);
  }

  // Live validation on blur
  form.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) clearError(input);
    });
  });

  function validateField(input) {
    const val = input.value.trim();
    const name = input.name;

    if (input.hasAttribute('required') && !val) {
      setError(input, 'This field is required.');
      return false;
    }
    if (name === 'email' && val && !validateEmail(val)) {
      setError(input, 'Please enter a valid email address.');
      return false;
    }
    if (name === 'phone' && !validatePhone(val)) {
      setError(input, 'Please enter a valid phone number.');
      return false;
    }
    if (name === 'message' && val.length < 20) {
      setError(input, 'Message must be at least 20 characters.');
      return false;
    }
    clearError(input);
    return true;
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();

    let valid = true;
    form.querySelectorAll('[required]').forEach(input => {
      if (!validateField(input)) valid = false;
    });

    const checkbox = form.querySelector('input[type="checkbox"][required]');
    if (checkbox && !checkbox.checked) {
      showToast('Please agree to the Privacy Policy before submitting.', 'error');
      valid = false;
    }

    if (!valid) return;

    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
    form.reset();

    showToast('Your message has been sent! We\'ll respond within 24 hours.', 'success');
  });
})();

/* =====================================================
   NEWSLETTER FORM VALIDATION
   ===================================================== */
(function initNewsletterForms() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      if (!input) return;

      const email = input.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Please enter a valid email address.', 'error');
        return;
      }

      const btn = form.querySelector('.btn');
      const orig = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

      await new Promise(resolve => setTimeout(resolve, 1200));

      btn.disabled = false;
      btn.innerHTML = orig;
      input.value = '';
      showToast('You\'ve been subscribed to our security bulletins!', 'success');
    });
  });
})();

/* =====================================================
   RESOURCES FILTER (resources page only)
   ===================================================== */
(function initResourcesFilter() {
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const resourceCards = document.querySelectorAll('.resource-card[data-category]');
  if (!filterBtns.length || !resourceCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      resourceCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          requestAnimationFrame(() => card.style.opacity = '1');
        } else {
          card.style.opacity = '0';
          setTimeout(() => {
            if (btn.dataset.filter !== card.dataset.category) {
              card.style.display = 'none';
            }
          }, 300);
        }
      });
    });
  });
})();

/* =====================================================
   SMOOTH SCROLL for anchor links
   ===================================================== */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = document.getElementById('navbar')?.offsetHeight || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();

/* =====================================================
   SITE ALERT DISMISS
   ===================================================== */
(function initSiteAlert() {
  const dismissBtn = document.getElementById('alert-dismiss');
  const alert = document.querySelector('.site-alert');
  if (!dismissBtn || !alert) return;
  dismissBtn.addEventListener('click', () => {
    alert.style.height = alert.offsetHeight + 'px';
    alert.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      alert.style.transition = 'height 0.3s ease, opacity 0.3s ease';
      alert.style.height = '0';
      alert.style.opacity = '0';
      setTimeout(() => alert.remove(), 350);
    });
  });
})();
