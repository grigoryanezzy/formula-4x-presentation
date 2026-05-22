/* =====================================================================
   interactive.js — slide-aware behaviors
   - counter animations on slide activation
   - checkbox interaction on slide 4
   - QR code rendering on slides 44 + 47
   ===================================================================== */

(() => {
  const stage = document.querySelector('deck-stage');
  if (!stage) return;

  /* ---------- QR codes (eagerly rendered once on load) ---------- */
  const renderQRCodes = () => {
    document.querySelectorAll('[data-qr]').forEach((el) => {
      if (el.dataset.qrDone) return;
      const data = el.getAttribute('data-qr');
      const size = 320;
      const img = document.createElement('img');
      img.alt = data;
      img.width = size;
      img.height = size;
      img.style.imageRendering = 'pixelated';
      // qrserver public api — renders a clean black-on-white QR
      img.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=2&qzone=2&format=png&data=${encodeURIComponent(data)}`;
      // graceful fallback: if image fails, draw a placeholder grid
      img.addEventListener('error', () => {
        el.innerHTML = '';
        const fb = document.createElement('div');
        fb.style.cssText = `
          width:100%; height:100%; display:flex; align-items:center; justify-content:center;
          font-family:var(--serif); font-weight:700; font-size:18px;
          color:var(--accent-3); background:repeating-linear-gradient(45deg, #fff 0 12px, var(--accent-1) 12px 14px);
          letter-spacing:.18em;
        `;
        fb.textContent = 'QR · ' + data.replace(/^https?:\/\//, '');
        el.appendChild(fb);
      });
      el.appendChild(img);
      el.dataset.qrDone = '1';
    });
  };
  renderQRCodes();

  /* ---------- Counter animation ---------- */
  const animateCounter = (el) => {
    if (el.dataset.counterRunning) return;
    const from = parseFloat(el.dataset.from || '0');
    const to   = parseFloat(el.dataset.to || el.textContent.replace(/\D/g, '') || '0');
    const dur  = parseInt(el.dataset.dur || '1400', 10);

    if (document.body.classList.contains('no-anim')) {
      el.textContent = formatNum(to);
      return;
    }

    el.dataset.counterRunning = '1';
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);

    const step = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const v = from + (to - from) * ease(t);
      el.textContent = formatNum(v, to);
      if (t < 1) requestAnimationFrame(step);
      else delete el.dataset.counterRunning;
    };
    requestAnimationFrame(step);
  };

  const formatNum = (v, target) => {
    // pick a format that resembles the target's authored number
    const tgt = target != null ? target : v;
    if (!Number.isFinite(v)) return String(v);
    if (tgt >= 1000) {
      const n = Math.round(v);
      return n.toLocaleString('ru-RU').replace(/,/g, ' ');
    }
    if (tgt % 1 !== 0) return v.toFixed(1);
    return String(Math.round(v));
  };

  const runSlideAnimations = (slide) => {
    if (!slide) return;
    slide.querySelectorAll('[data-counter]').forEach((el) => {
      // reset for replay
      delete el.dataset.counterRunning;
      animateCounter(el);
    });
    // restart .anim CSS animations by toggling the attribute
    slide.querySelectorAll('.anim, [class*="anim-"]').forEach((el) => {
      el.style.animation = 'none';
      // force reflow
      void el.offsetHeight;
      el.style.animation = '';
    });
  };

  /* ---------- Slide change wiring ---------- */
  // Tag the active slide with data-active for CSS selectors
  const tagActive = (slide) => {
    document.querySelectorAll('deck-stage > section[data-active]').forEach((s) => {
      if (s !== slide) s.removeAttribute('data-active');
    });
    if (slide) slide.setAttribute('data-active', '');
  };

  stage.addEventListener('slidechange', (e) => {
    const slide = e.detail.slide;
    tagActive(slide);
    runSlideAnimations(slide);
  });

  // initial tag (in case slidechange has already fired before this listener)
  requestAnimationFrame(() => {
    const idx = (typeof stage.currentIndex === 'number') ? stage.currentIndex : 0;
    const slides = stage.querySelectorAll(':scope > section');
    const active = slides[idx] || slides[0];
    tagActive(active);
    runSlideAnimations(active);
  });

  /* ---------- Checkbox interaction (slide 4) ---------- */
  document.querySelectorAll('[data-checklist]').forEach((list) => {
    const items  = list.querySelectorAll('[data-check]');
    const slide  = list.closest('section');
    const count  = slide ? slide.querySelector('[data-check-count]') : null;
    const verdict = slide ? slide.querySelector('[data-check-verdict]') : null;

    const update = () => {
      const checked = list.querySelectorAll('.is-checked').length;
      if (count)   count.textContent = checked;
      if (verdict) {
        if (checked === 0) verdict.textContent = 'Кликайте по\u00A0пунктам';
        else if (checked <= 2) verdict.textContent = 'Есть симптомы — стоит разобраться';
        else if (checked <= 4) verdict.textContent = 'Классическая операционка';
        else verdict.textContent = 'Срочно — диагностика на\u00A0слайде 44';
      }
    };

    items.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.stopPropagation(); // don't trigger slide nav
        item.classList.toggle('is-checked');
        update();
      });
    });
    update();
  });

  /* ---------- Suppress click-to-advance on interactive items ---------- */
  // deck-stage advances on tap; we already stop propagation on checkboxes.
  // Also stop on any element that should be "interactive within a slide".
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-no-nav]')) {
      e.stopPropagation();
    }
  }, true);
})();
