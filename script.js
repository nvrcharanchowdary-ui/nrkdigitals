/**
 * nrkdigitals — Main Interactive JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // Remove no-js helper class if present
  document.documentElement.classList.remove('no-js');

  /* ==========================================================================
     1. Sticky & Scrolled Navbar Effect
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  
  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('is-scrolled');
    } else {
      navbar?.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  /* ==========================================================================
     2. Mobile Menu Toggle & Navigation
     ========================================================================== */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const navOverlay = document.getElementById('navOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-menu .btn');

  const openMobileMenu = () => {
    hamburgerBtn?.classList.add('is-open');
    hamburgerBtn?.setAttribute('aria-expanded', 'true');
    mobileMenu?.classList.add('is-open');
    navOverlay?.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    hamburgerBtn?.classList.remove('is-open');
    hamburgerBtn?.setAttribute('aria-expanded', 'false');
    mobileMenu?.classList.remove('is-open');
    navOverlay?.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  hamburgerBtn?.addEventListener('click', () => {
    const isOpen = hamburgerBtn.classList.contains('is-open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  navOverlay?.addEventListener('click', closeMobileMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburgerBtn?.classList.contains('is-open')) {
      closeMobileMenu();
    }
  });

  /* ==========================================================================
     3. Scroll Reveal Animation (IntersectionObserver)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Unobserve once revealed
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  /* ==========================================================================
     4. Contact Form Handling & Validation
     ========================================================================== */
  const enquiryForm = document.getElementById('enquiryForm');
  const formStatus = document.getElementById('formStatus');

  enquiryForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!formStatus) return;

    // Reset status
    formStatus.className = 'form-status';
    formStatus.textContent = '';

    const fullName = document.getElementById('fullName')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const need = document.getElementById('need')?.value;
    const message = document.getElementById('message')?.value.trim();

    // Validation
    if (!fullName || !phone || !email || !need || !message) {
      formStatus.classList.add('is-error');
      formStatus.textContent = 'Please fill in all required fields.';
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      formStatus.classList.add('is-error');
      formStatus.textContent = 'Please enter a valid email address.';
      return;
    }

    // Submit animation / state
    const submitBtn = enquiryForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.textContent : 'Send Enquiry';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    try {
      // Simulate form submission delay (or fetch to your backend API)
      await new Promise(resolve => setTimeout(resolve, 1000));

      formStatus.classList.add('is-success');
      formStatus.textContent = 'Thank you! Your enquiry has been received. We will contact you shortly.';
      enquiryForm.reset();
    } catch (err) {
      formStatus.classList.add('is-error');
      formStatus.textContent = 'Something went wrong while sending your message. Please try again.';
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    }
  });
});
