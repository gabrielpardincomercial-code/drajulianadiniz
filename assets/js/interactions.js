/**
 * Clireo Healthcare - Native Interaction & Effects Engine
 * Replaces Framer proprietary runtime with lightweight, high-performance vanilla JS & CSS
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. INFINITE MARQUEE TICKER (Dentistry * Pediatrics * Primary Care)
  // ==========================================
  const tickerSection = document.querySelector('[data-framer-name="Ticker"]');
  if (tickerSection) {
    const tickerUl = tickerSection.querySelector('ul');
    if (tickerUl) {
      // Duplicate items to ensure seamless loop
      const originalItems = Array.from(tickerUl.children);
      originalItems.forEach(item => {
        tickerUl.appendChild(item.cloneNode(true));
      });
      originalItems.forEach(item => {
        tickerUl.appendChild(item.cloneNode(true));
      });

      // Apply seamless marquee animation
      tickerUl.classList.add('clireo-ticker-active');
    }
  }

  // ==========================================
  // 2. SCROLL-DRIVEN TEXT REVEAL (About Clireo)
  // ==========================================
  const aboutSection = document.querySelector('[data-framer-name="About"]');
  if (aboutSection) {
    const textSpans = aboutSection.querySelectorAll('h2 span');
    if (textSpans.length > 0) {
      const updateScrollReveal = () => {
        const rect = aboutSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Progress from 0 (entering screen) to 1 (center of screen)
        const start = windowHeight * 0.85;
        const end = windowHeight * 0.25;
        const progress = Math.min(Math.max((start - rect.top) / (start - end), 0), 1);
        
        const activeCount = Math.floor(progress * textSpans.length);
        textSpans.forEach((span, i) => {
          if (i <= activeCount) {
            span.style.color = 'rgb(27, 41, 120)';
            span.style.opacity = '1';
          } else {
            span.style.color = 'rgba(26, 40, 120, 0.2)';
            span.style.opacity = '0.5';
          }
        });
      };

      window.addEventListener('scroll', updateScrollReveal, { passive: true });
      updateScrollReveal();
    }
  }

  // ==========================================
  // 3. OUR TREATMENTS SLIDER (Prev / Next & Swipe)
  // ==========================================
  const treatmentsSection = document.querySelector('[data-framer-name="Our Services"]');
  if (treatmentsSection) {
    const sliderUl = treatmentsSection.querySelector('.framer-slideshow ul');
    const prevBtns = treatmentsSection.querySelectorAll('button[aria-label="Previous"]');
    const nextBtns = treatmentsSection.querySelectorAll('button[aria-label="Next"]');

    let currentOffset = 0;
    const cardStep = 385; // approximate width of one card + gap

    const updateSlider = () => {
      if (!sliderUl) return;
      sliderUl.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      sliderUl.style.transform = `translateX(-${currentOffset}px)`;
    };

    const getMaxOffset = () => {
      if (!sliderUl) return 0;
      const totalWidth = sliderUl.scrollWidth;
      const visibleWidth = sliderUl.parentElement ? sliderUl.parentElement.offsetWidth : 1200;
      return Math.max(0, totalWidth - visibleWidth);
    };

    prevBtns.forEach(btn => {
      btn.removeAttribute('disabled');
      btn.style.cursor = 'pointer';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        currentOffset = Math.max(0, currentOffset - cardStep);
        updateSlider();
      });
    });

    nextBtns.forEach(btn => {
      btn.removeAttribute('disabled');
      btn.style.cursor = 'pointer';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const maxOffset = getMaxOffset();
        currentOffset = Math.min(maxOffset, currentOffset + cardStep);
        updateSlider();
      });
    });

    // Touch swipe support
    let startX = 0;
    if (sliderUl) {
      sliderUl.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
      }, { passive: true });

      sliderUl.addEventListener('touchend', (e) => {
        const diffX = startX - e.changedTouches[0].clientX;
        if (Math.abs(diffX) > 40) {
          const maxOffset = getMaxOffset();
          if (diffX > 0) {
            currentOffset = Math.min(maxOffset, currentOffset + cardStep);
          } else {
            currentOffset = Math.max(0, currentOffset - cardStep);
          }
          updateSlider();
        }
      }, { passive: true });
    }
  }

  // ==========================================
  // 4. FAQ ACCORDION INTERACTIVITY
  // ==========================================
  const faqSection = document.querySelector('[data-framer-name="FAQs"]');
  if (faqSection) {
    const faqAnswers = {
      'How can I schedule an appointment?': 'You can easily schedule an appointment online using our booking form, by phone at +44 501 255 001, or by visiting our clinic reception. We offer flexible scheduling with same-day and weekend availability.',
      'Do I need a referral to see a specialist?': 'No prior referral is required for the majority of our specialties, including dental consultations, pediatrics, and cosmetic care. You can book an appointment directly with any of our specialists.',
      'What should I bring to my first appointment?': 'Please bring a valid photo ID, your insurance information (if applicable), and any relevant prior medical records, diagnostic scans, or medication lists to ensure the most thorough consultation.',
      'Do you offer care for children and families?': 'Yes! Our pediatric specialists and family medicine team provide comprehensive, gentle care for patients of all ages, from newborns to seniors, in a family-friendly environment.',
      'Why choose Clireo for your healthcare needs?': 'Clireo unites top-tier clinical specialists, modern diagnostic equipment, and a patient-first approach ensuring comfort, clear communication, and personalized treatment plans.'
    };

    // Find all FAQ question containers
    const questionNodes = faqSection.querySelectorAll('.framer-text');
    questionNodes.forEach(node => {
      const qText = node.textContent.trim();
      if (faqAnswers[qText]) {
        // Find the parent item container
        const itemCard = node.closest('.framer-i8Jws') || node.closest('.framer-1x1hh8-container');
        if (itemCard) {
          // Check if answer already exists
          let ansWrapper = itemCard.querySelector('.clireo-faq-answer');
          if (!ansWrapper) {
            ansWrapper = document.createElement('div');
            ansWrapper.className = 'clireo-faq-answer';
            ansWrapper.innerHTML = `<p style="padding: 16px 24px 20px; font-size: 15px; line-height: 1.6; color: rgb(14, 25, 84); opacity: 0.85;">${faqAnswers[qText]}</p>`;
            ansWrapper.style.maxHeight = '0px';
            ansWrapper.style.overflow = 'hidden';
            ansWrapper.style.transition = 'max-height 0.35s ease, opacity 0.3s ease';
            ansWrapper.style.opacity = '0';
            itemCard.appendChild(ansWrapper);
          }

          // Make card clickable
          const headerRow = node.closest('[data-framer-name="Icon Wrap"]')?.parentElement || node.parentElement;
          if (headerRow) {
            headerRow.style.cursor = 'pointer';
            headerRow.addEventListener('click', () => {
              const isOpen = ansWrapper.style.maxHeight !== '0px';
              const iconWrap = itemCard.querySelector('[data-framer-name="Icon Wrap"]');

              // Close all others
              faqSection.querySelectorAll('.clireo-faq-answer').forEach(other => {
                other.style.maxHeight = '0px';
                other.style.opacity = '0';
              });
              faqSection.querySelectorAll('[data-framer-name="Icon Wrap"]').forEach(icon => {
                icon.style.transform = 'none';
              });

              // Toggle current
              if (!isOpen) {
                ansWrapper.style.maxHeight = '200px';
                ansWrapper.style.opacity = '1';
                if (iconWrap) {
                  iconWrap.style.transition = 'transform 0.3s ease';
                  iconWrap.style.transform = 'rotate(135deg)';
                }
              }
            });
          }
        }
      }
    });

    // Make the first question (which already had answer) also toggleable
    const firstQ = faqSection.querySelector('[data-framer-name="Answer"]');
    if (firstQ) {
      const firstParent = firstQ.closest('.framer-7546z8') || firstQ.parentElement;
      const firstHeader = firstQ.previousElementSibling;
      const firstIcon = firstParent?.querySelector('[data-framer-name="Icon Wrap"]');
      if (firstHeader && firstIcon) {
        firstHeader.style.cursor = 'pointer';
        firstQ.style.transition = 'max-height 0.35s ease, opacity 0.3s ease';
        firstQ.style.overflow = 'hidden';
        firstQ.style.maxHeight = firstQ.scrollHeight + 'px';
        firstIcon.style.transition = 'transform 0.3s ease';

        firstHeader.addEventListener('click', () => {
          const isOpen = firstQ.style.maxHeight !== '0px';
          if (isOpen) {
            firstQ.style.maxHeight = '0px';
            firstQ.style.opacity = '0';
            firstIcon.style.transform = 'none';
          } else {
            firstQ.style.maxHeight = firstQ.scrollHeight + 'px';
            firstQ.style.opacity = '1';
            firstIcon.style.transform = 'rotate(135deg)';
          }
        });
      }
    }
  }

  // ==========================================
  // 5. HERO APPOINTMENT FORM INTERACTIVITY
  // ==========================================
  const form = document.querySelector('form');
  if (form) {
    // Prevent default page reload and show feedback
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Appointment Requested! ✓';
        submitBtn.style.backgroundColor = '#059669';
        setTimeout(() => {
          submitBtn.innerText = originalText;
          submitBtn.style.backgroundColor = '';
          form.reset();
        }, 3000);
      }
    });
  }

  // ==========================================
  // 6. SMOOTH ANCHOR NAVIGATION
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const targetEl = document.getElementById(targetId) || document.querySelector(`[data-framer-name="${targetId}"]`);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
