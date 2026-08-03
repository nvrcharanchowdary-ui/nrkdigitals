/* ==========================================================================
   nrkdigitals — Site scripts
   No external libraries. Vanilla JS only.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------ *
   * 1. Navbar: shrink + solid background on scroll
   * ------------------------------------------------------------------ */
  var navbar = document.getElementById('navbar');
  var SCROLL_THRESHOLD = 40;

  function handleNavbarScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  }
  handleNavbarScroll();
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  /* ------------------------------------------------------------------ *
   * 2. Mobile hamburger menu
   * ------------------------------------------------------------------ */
  var hamburgerBtn = document.getElementById('hamburgerBtn');
  var mobileMenu = document.getElementById('mobileMenu');
  var navOverlay = document.getElementById('navOverlay');

  function openMobileMenu() {
    hamburgerBtn.classList.add('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('is-open');
    navOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    hamburgerBtn.classList.remove('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
    navOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  hamburgerBtn.addEventListener('click', function () {
    var isOpen = mobileMenu.classList.contains('is-open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  navOverlay.addEventListener('click', closeMobileMenu);

  document.querySelectorAll('.mobile-menu a').forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMobileMenu();
  });

  /* ------------------------------------------------------------------ *
   * 3. Smooth scrolling for all in-page anchor links
   *    (native `scroll-behavior: smooth` handles most of it; this adds
   *    an offset for the fixed navbar so section headings aren't hidden)
   * ------------------------------------------------------------------ */
  var anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = link.getAttribute('href');
      if (targetId.length <= 1) return; // ignore bare "#"
      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      var navHeight = navbar.offsetHeight;
      var targetTop = target.getBoundingClientRect().top + window.pageYOffset - navHeight + 1;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    });
  });

  /* ------------------------------------------------------------------ *
   * 4. Scroll-reveal animations (IntersectionObserver)
   * ------------------------------------------------------------------ */
  var revealEls = document.querySelectorAll('.reveal');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, index) {
          if (entry.isIntersecting) {
            var delay = (index % 4) * 90; // slight stagger within a batch
            setTimeout(function () {
              entry.target.classList.add('is-visible');
            }, delay);
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // No IntersectionObserver support or reduced motion preferred: show everything immediately
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ------------------------------------------------------------------ *
   * 5. Contact form
   *
   *    This site has no backend configured. The handler below performs
   *    client-side validation and prepares a clean payload object, then
   *    logs it and shows a confirmation message. To go live:
   *
   *    1. Replace the body of `submitEnquiry()` with a real request, e.g.:
   *
   *       fetch('https://your-endpoint.example.com/enquiries', {
   *         method: 'POST',
   *         headers: { 'Content-Type': 'application/json' },
   *         body: JSON.stringify(payload)
   *       })
   *         .then(function (res) { ... })
   *         .catch(function (err) { ... });
   *
   *       Popular no-backend options: Formspree, Getform, EmailJS,
   *       Netlify Forms, or a small serverless function that emails
   *       charanchowdary945@gmail.com.
   *
   *    2. Update the success/error UI states as needed below.
   * ------------------------------------------------------------------ */
  var enquiryForm = document.getElementById('enquiryForm');
  var formStatus = document.getElementById('formStatus');

  function setStatus(message, isError) {
    formStatus.textContent = message;
    formStatus.classList.toggle('is-error', !!isError);
  }

  function submitEnquiry(payload) {
    // ---- Backend integration point ----
    // Currently this only logs the payload; no data is sent anywhere.
    console.log('nrkdigitals enquiry payload (ready for backend):', payload);
    return Promise.resolve({ ok: true });
  }

  if (enquiryForm) {
    enquiryForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var formData = new FormData(enquiryForm);
      var payload = {
        fullName: (formData.get('fullName') || '').toString().trim(),
        phone: (formData.get('phone') || '').toString().trim(),
        email: (formData.get('email') || '').toString().trim(),
        business: (formData.get('business') || '').toString().trim(),
        need: (formData.get('need') || '').toString().trim(),
        message: (formData.get('message') || '').toString().trim(),
        submittedAt: new Date().toISOString()
      };

      if (!payload.fullName || !payload.phone || !payload.email || !payload.need || !payload.message) {
        setStatus('Please fill in all required fields.', true);
        return;
      }

      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(payload.email)) {
        setStatus('Please enter a valid email address.', true);
        return;
      }

      var submitBtn = enquiryForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      setStatus('Sending your enquiry…', false);

      submitEnquiry(payload)
        .then(function () {
          setStatus("Thanks! Your enquiry has been noted — we'll get back to you soon.", false);
          enquiryForm.reset();
        })
        .catch(function () {
          setStatus('Something went wrong. Please try again or reach us on WhatsApp.', true);
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  }
})();
