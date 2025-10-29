(function () {
  const navToggleButton = document.querySelector('.nav-toggle');
  const menuElement = document.getElementById('primary-menu');
  const yearElement = document.getElementById('year');
  const slideContainer = document.querySelector('.slides');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');

  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }

  if (navToggleButton && menuElement) {
    navToggleButton.addEventListener('click', () => {
      const expanded = navToggleButton.getAttribute('aria-expanded') === 'true';
      navToggleButton.setAttribute('aria-expanded', String(!expanded));
      menuElement.classList.toggle('is-open');
    });
    // Close menu on link click (mobile)
    menuElement.querySelectorAll('a').forEach((linkEl) => {
      linkEl.addEventListener('click', () => {
        menuElement.classList.remove('is-open');
        navToggleButton.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Intersection Observer for reveal animations
  const revealElements = Array.from(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window && revealElements.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }

  // Basic slider logic
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
  // Auto-advance every 6s
  if (slides.length) {
    setInterval(() => updateSlider(currentIndex + 1), 6000);
  }

  // Modal functionality
  const modal = document.getElementById('reservation-modal');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const closeModalBtn = document.querySelector('.modal-close');
  const modalBackdrop = document.querySelector('.modal-backdrop');
  const reservationForm = document.getElementById('reservation-form');
  const formMessage = document.getElementById('form-message');

  function openModal() {
    if (modal) {
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      modal.setAttribute('aria-modal', 'true');
      document.body.style.overflow = 'hidden';
      // Set minimum date to today
      const dateInput = document.getElementById('date');
      if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
      }
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      modal.setAttribute('aria-modal', 'false');
      document.body.style.overflow = '';
      if (reservationForm) {
        reservationForm.reset();
      }
      if (formMessage) {
        formMessage.style.display = 'none';
        formMessage.className = 'form-message';
      }
    }
  }

  // Open modal on button click
  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  // Close modal handlers
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeModal);
  }

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  // Form submission handling
  if (reservationForm) {
    reservationForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = reservationForm.querySelector('button[type="submit"]');
      const btnText = submitBtn.querySelector('.btn-text');
      const btnSpinner = submitBtn.querySelector('.btn-spinner');
      
      // Get form data
      const formData = new FormData(reservationForm);
      const data = Object.fromEntries(formData);
      
      // Show loading state
      if (btnText) btnText.style.display = 'none';
      if (btnSpinner) btnSpinner.style.display = 'inline';
      submitBtn.disabled = true;
      
      // Hide previous message
      if (formMessage) {
        formMessage.style.display = 'none';
      }

      try {
        // Send email using FormSubmit service
        const response = await fetch('https://formsubmit.co/ajax/acmartlk@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            subject: 'New Table Reservation Request',
            message: `
New reservation request:

Date: ${data.date}
Time: ${data.time}
Title: ${data.title}
Name: ${data['first-name']} ${data['last-name']}
Phone: ${data.phone}
Email: ${data.email}
${data.notes ? `\nSpecial Notes: ${data.notes}` : ''}
            `,
            _captcha: false
          })
        });

        const result = await response.json();
        
        // Show success message
        if (formMessage) {
          formMessage.textContent = 'Reservation request sent successfully! We will confirm via email.';
          formMessage.className = 'form-message success';
          formMessage.style.display = 'block';
        }
        
        // Reset form after 3 seconds and close modal after 4 seconds
        setTimeout(() => {
          reservationForm.reset();
          closeModal();
        }, 4000);
        
      } catch (error) {
        console.error('Form submission error:', error);
        
        // Show error message
        if (formMessage) {
          formMessage.textContent = 'Error sending request. Please try again or call us directly.';
          formMessage.className = 'form-message error';
          formMessage.style.display = 'block';
        }
      } finally {
        // Reset button state
        if (btnText) btnText.style.display = 'inline';
        if (btnSpinner) btnSpinner.style.display = 'none';
        submitBtn.disabled = false;
      }
    });
  }
})();
