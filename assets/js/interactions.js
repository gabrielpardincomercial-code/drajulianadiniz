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
  // 2. SCROLL-DRIVEN WORD-BY-WORD TEXT REVEAL
  // ==========================================
  const initScrollTextReveal = () => {
    const stickyHeadings = document.querySelectorAll(
      'h2[style*="position:sticky"], .framer-1oz7viq h2, [data-code-component-plugin-id="84d4c1"] h2'
    );
    
    stickyHeadings.forEach(h2 => {
      let spans = h2.querySelectorAll('span');
      if (spans.length === 0) {
        const words = h2.textContent.trim().split(/\s+/);
        h2.innerHTML = words.map(w => `<span class="clireo-reveal-word">${w}</span>`).join(' ');
        spans = h2.querySelectorAll('span');
      } else {
        spans.forEach(s => s.classList.add('clireo-reveal-word'));
      }

      const container = h2.closest('.framer-1oz7viq') || h2.closest('.framer-q64aqy-container') || h2.parentElement;

      const updateProgress = () => {
        const target = container || h2;
        const rect = target.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Progress calculates as user scrolls through the section
        const start = windowHeight * 0.85;
        const end = windowHeight * 0.25;
        const progress = Math.min(Math.max((start - rect.top) / (start - end), 0), 1);

        const activeIndex = progress * spans.length;
        spans.forEach((span, i) => {
          if (i <= activeIndex) {
            span.classList.add('is-active');
          } else {
            span.classList.remove('is-active');
          }
        });
      };

      window.addEventListener('scroll', updateProgress, { passive: true });
      window.addEventListener('resize', updateProgress, { passive: true });
      // Initial trigger
      updateProgress();
    });
  };

  initScrollTextReveal();

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
  const faqSection = document.querySelector('[data-framer-name="FAQ"]');
  if (faqSection) {
    const faqAnswers = {
      "How can I schedule an appointment?": "You can schedule an appointment by filling out the online booking form on our homepage, calling our clinic directly, or sending us a message on WhatsApp. Our reception team will confirm your preferred date and time promptly.",
      "Do I need a referral to see a specialist?": "No referral is required for most consultations. You can directly book an appointment with any of our general physicians, dentists, or pediatric specialists at your convenience.",
      "What should I bring to my first appointment?": "Please bring a valid photo ID, your insurance card (if applicable), and any relevant previous medical records, test results, or prescription lists to help our doctors provide the best care.",
      "Do you offer care for children and families?": "Yes! We provide specialized pediatric care for infants, children, and adolescents, alongside comprehensive family medicine, dentistry, and preventive wellness checkups.",
      "Why choose Clireo for your healthcare needs?": "Clireo combines board-certified specialists, state-of-the-art diagnostic technology, transparent pricing, and a warm, patient-first approach to ensure exceptional care in every visit."
    };

    const questionNodes = faqSection.querySelectorAll('.framer-text');
    questionNodes.forEach(node => {
      const qText = node.textContent.trim();
      if (faqAnswers[qText]) {
        const itemCard = node.closest('.framer-i8Jws') || node.closest('.framer-1x1hh8-container');
        if (itemCard) {
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


  // ==========================================
  // 7. BEFORE & AFTER COMPARISON SLIDERS
  // ==========================================
  const initBeforeAfterSliders = () => {
    const sliders = document.querySelectorAll('.clireo-ba-slider');
    sliders.forEach(slider => {
      const overlay = slider.querySelector('.clireo-ba-overlay');
      const handle = slider.querySelector('.clireo-ba-handle');
      const range = slider.querySelector('.clireo-ba-range');
      const btnBefore = slider.querySelector('.clireo-ba-before');
      const btnAfter = slider.querySelector('.clireo-ba-after');

      if (!overlay || !handle || !range) return;

      const setPos = (val, animate = false) => {
        val = Math.max(0, Math.min(100, val));
        range.value = val;
        if (animate) {
          overlay.style.transition = 'clip-path 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
          handle.style.transition = 'left 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
          setTimeout(() => {
            overlay.style.transition = '';
            handle.style.transition = '';
          }, 360);
        } else {
          overlay.style.transition = '';
          handle.style.transition = '';
        }
        overlay.style.clipPath = `inset(0 0 0 ${val}%)`;
        handle.style.left = `${val}%`;
      };

      range.addEventListener('input', (e) => {
        setPos(e.target.value);
      });

      if (btnBefore) {
        btnBefore.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          setPos(0, true);
        });
      }

      if (btnAfter) {
        btnAfter.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          setPos(100, true);
        });
      }

      // Initial state
      setPos(50);
    });
  };

  initBeforeAfterSliders();

});