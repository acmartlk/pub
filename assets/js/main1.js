(function () {
  const navToggleButton = document.querySelector('.nav-toggle');
  const menuElement = document.getElementById('primary-menu');
  const yearElement = document.getElementById('year');
  const slideContainer = document.querySelector('.slides');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');

  if (yearElement) yearElement.textContent = String(new Date().getFullYear());

  if (navToggleButton && menuElement) {
    navToggleButton.addEventListener('click', () => {
      const expanded = navToggleButton.getAttribute('aria-expanded') === 'true';
      navToggleButton.setAttribute('aria-expanded', String(!expanded));
      menuElement.classList.toggle('is-open');
    });
    menuElement.querySelectorAll('a').forEach(linkEl => {
      linkEl.addEventListener('click', () => {
        menuElement.classList.remove('is-open');
        navToggleButton.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Intersection Observer
  const revealElements = Array.from(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window && revealElements.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // Slider
  let currentIndex = 0;
  function updateSlider(index) {
    if (!slideContainer || !slides.length) return;
    currentIndex = (index + slides.length) % slides.length;
    const offset = -currentIndex * 100;
    slideContainer.style.transform = `translateX(${offset}%)`;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === currentIndex));
  }
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => updateSlider(currentIndex - 1));
    nextBtn.addEventListener('click', () => updateSlider(currentIndex + 1));
  }
  if (slides.length) setInterval(() => updateSlider(currentIndex + 1), 6000);

  // Modal
  const modal = document.getElementById('reservation-modal');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const closeModalBtn = document.querySelector('.modal-close');
  const modalBackdrop = document.querySelector('.modal-backdrop');
  const reservationForm = document.getElementById('reservation-form');
  const formMessage = document.getElementById('form-message');

  function openModal() {
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    modal.setAttribute('aria-modal', 'true');
    document.body.style.overflow = 'hidden';
    const dateInput = document.getElementById('date');
    if (dateInput) dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('aria-modal', 'false');
    document.body.style.overflow = '';
    if (reservationForm) reservationForm.reset();
    if (formMessage) {
      formMessage.style.display = 'none';
      formMessage.className = 'form-message';
    }
  }

  openModalBtns.forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); openModal(); }));
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal(); });

  // Web3Forms AJAX
  if (reservationForm) {
    reservationForm.addEventListener('submit', async e => {
      e.preventDefault();
      const submitBtn = reservationForm.querySelector('button[type="submit"]');
      const btnText = submitBtn.querySelector('.btn-text');
      const btnSpinner = submitBtn.querySelector('.btn-spinner');

      if (btnText) btnText.style.display = 'none';
      if (btnSpinner) btnSpinner.style.display = 'inline';
      submitBtn.disabled = true;
      if (formMessage) formMessage.style.display = 'none';

      try {
        const formData = new FormData(reservationForm);
        formData.append('access_key', '9c022256-0bdc-43c1-bcb7-445c8c9cec1c');
        formData.append('_redirect', ''); // optional redirect URL
        formData.append('_autoresponse', 'Thank you! We received your reservation.'); // optional

        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();

        if (data.success) {
          if (formMessage) {
            formMessage.textContent = 'Reservation request sent successfully! We will confirm via email.';
            formMessage.className = 'form-message success';
            formMessage.style.display = 'block';
          }
          setTimeout(closeModal, 3000);
          reservationForm.reset();
        } else {
          throw new Error(data.message || 'Form submission failed');
        }
      } catch (error) {
        console.error('Form submission error:', error);
        if (formMessage) {
          formMessage.textContent = 'Error sending reservation. Please try again.';
          formMessage.className = 'form-message error';
          formMessage.style.display = 'block';
        }
      } finally {
        if (btnText) btnText.style.display = 'inline';
        if (btnSpinner) btnSpinner.style.display = 'none';
        submitBtn.disabled = false;
      }
    });
  }
})();
