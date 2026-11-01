// Clireo Healthcare - Main Interaction Scripts

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // 2. FAQ Accordion
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (header) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Optional: close other accordion items
        accordionItems.forEach(other => {
          if (other !== item) other.classList.remove('active');
        });

        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
        } else {
          item.classList.add('active');
        }
      });
    }
  });

  // 3. Treatment Category Pills
  const treatmentPills = document.querySelectorAll('.treatment-pill');
  const treatmentCards = document.querySelectorAll('.treatment-card');

  treatmentPills.forEach(pill => {
    pill.addEventListener('click', () => {
      treatmentPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const category = pill.getAttribute('data-category');
      treatmentCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 4. Approach Steps Interactive Tabs
  const approachTabs = document.querySelectorAll('.approach-tab');
  const approachImage = document.getElementById('approachImage');
  const approachTitle = document.getElementById('approachTitle');
  const approachDesc = document.getElementById('approachDesc');

  const approachData = {
    consultation: {
      title: "Consultation",
      desc: "We begin by listening carefully to your concerns, reviewing your medical history, performing assessments & creating a personalized care plan tailored to your health needs.",
      image: "./assets/images/C8dunOfMYF9Jvnsi07RsgBh78.webp"
    },
    treatment: {
      title: "Personalized Treatment",
      desc: "Our specialists deliver evidence-based treatments using advanced technology and proven medical practices while keeping your comfort, safety, and wellbeing.",
      image: "./assets/images/AERyzXVYeSkqwWF9eBPGEoP5Ck.webp"
    },
    recovery: {
      title: "Recovery & Follow-Up",
      desc: "Your care continues beyond treatment with ongoing monitoring, recovery guidance, follow-up appointments, and preventive recommendations that support lasting health.",
      image: "./assets/images/dANsf6ioPNeYnwz49LXt7gZI7UE.webp"
    }
  };

  approachTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const step = tab.getAttribute('data-step');
      if (approachData[step]) {
        approachTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        if (approachTitle) approachTitle.textContent = approachData[step].title;
        if (approachDesc) approachDesc.textContent = approachData[step].desc;
        if (approachImage) {
          approachImage.style.opacity = '0';
          setTimeout(() => {
            approachImage.src = approachData[step].image;
            approachImage.style.opacity = '1';
          }, 150);
        }
      }
    });
  });

  // 5. Hero Time Slots Selection
  const timeSlots = document.querySelectorAll('.time-slot-btn');
  timeSlots.forEach(btn => {
    btn.addEventListener('click', () => {
      timeSlots.forEach(b => {
        b.classList.remove('bg-[#012b30]', 'text-white');
        b.classList.add('bg-gray-100', 'text-gray-700');
      });
      btn.classList.remove('bg-gray-100', 'text-gray-700');
      btn.classList.add('bg-[#012b30]', 'text-white');
    });
  });

  // 6. Appointment Form Submission Feedback
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Booking sent! ✓';
      submitBtn.classList.add('bg-emerald-600');
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.classList.remove('bg-emerald-600');
        bookingForm.reset();
      }, 3000);
    });
  }

  // 7. Counter Animation for Stats
  const statElements = document.querySelectorAll('.stat-counter');
  let counted = false;

  const countUp = () => {
    statElements.forEach(el => {
      const target = parseFloat(el.getAttribute('data-target'));
      const suffix = el.getAttribute('data-suffix') || '';
      let current = 0;
      const step = target / 40;
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = target + suffix;
          clearInterval(interval);
        } else {
          el.textContent = Math.floor(current) + suffix;
        }
      }, 30);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        countUp();
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('stats');
  if (statsSection) {
    observer.observe(statsSection);
  }
});
