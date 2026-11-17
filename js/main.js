// Gerald Urey portfolio: nav state, video play buttons, scroll animations.
(function () {
  var nav = document.getElementById('nav');
  var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 24); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  // Video play / pause buttons
  document.querySelectorAll('.shot .play').forEach(function (btn) {
    var video = btn.parentElement.querySelector('video');
    btn.addEventListener('click', function () {
      if (video.paused) {
        document.querySelectorAll('.shot video').forEach(function (v) { if (v !== video) v.pause(); });
        video.play();
      } else {
        video.pause();
      }
    });
    video.addEventListener('play', function () { btn.textContent = '❚❚'; btn.setAttribute('aria-label', 'Pause video'); });
    video.addEventListener('pause', function () { btn.textContent = '▶'; btn.setAttribute('aria-label', 'Play video'); });
  });

  // Photo slider
  var slider = document.getElementById('photos');
  if (slider) {
    var slides = slider.querySelectorAll('figure');
    var count = document.querySelector('.slider-count');
    var btns = document.querySelectorAll('.slider-nav button');
    var step = function () { return slides[0].getBoundingClientRect().width + parseFloat(getComputedStyle(slider).columnGap || 0); };
    var update = function () {
      var i = Math.min(slides.length - 1, Math.round(slider.scrollLeft / step()));
      var atEnd = slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 4;
      if (atEnd) i = slides.length - 1;
      count.textContent = (i + 1) + ' / ' + slides.length;
      btns[0].disabled = slider.scrollLeft < 4;
      btns[1].disabled = atEnd;
    };
    btns.forEach(function (b) {
      b.addEventListener('click', function () { slider.scrollBy({ left: step() * parseInt(b.dataset.dir, 10), behavior: 'smooth' }); });
    });
    slider.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  var ease = 'power3.out';

  // Hero
  gsap.from('.hero h1 .line span', { yPercent: 110, duration: 1.1, ease: 'power4.out', stagger: 0.09, delay: 0.1 });
  gsap.from('.pill, .hero-foot', { opacity: 0, y: 16, duration: 0.9, ease: ease, delay: 0.55, stagger: 0.1 });

  // Count-up numbers
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var end = parseFloat(el.dataset.count);
    var dec = parseInt(el.dataset.decimals || '0', 10);
    var pre = el.dataset.prefix || '';
    var suf = el.dataset.suffix || '';
    var o = { v: 0 };
    gsap.to(o, {
      v: end, duration: 1.6, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: function () { el.textContent = pre + o.v.toFixed(dec) + suf; }
    });
  });

  // Section headings, panels, media
  gsap.utils.toArray('.sec-head, .cap, .rows a, .about > *, .contact .wrap > *').forEach(function (el) {
    gsap.from(el, { opacity: 0, y: 28, duration: 0.9, ease: ease, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });
  ScrollTrigger.batch('.panel, .shot, .slider-wrap, .stat', {
    start: 'top 90%', once: true,
    onEnter: function (els) { gsap.from(els, { opacity: 0, y: 34, duration: 0.9, ease: ease, stagger: 0.08 }); }
  });

  // Charts grow in
  var grow = function (sel, prop, stagger) {
    gsap.utils.toArray(sel).forEach(function (chart) {
      gsap.from(chart.children.length && prop === 'scaleY' ? chart.querySelectorAll('i') : chart.querySelectorAll('.fill, i'), {
        [prop]: 0, duration: 1.2, ease: 'power3.out', stagger: stagger,
        scrollTrigger: { trigger: chart, start: 'top 85%', once: true }
      });
    });
  };
  grow('.bars', 'scaleX', 0.1);
  grow('.stack', 'scaleX', 0.12);
  grow('.cols', 'scaleY', 0.05);
  grow('.versus', 'scaleY', 0.2);
  gsap.utils.toArray('.steps').forEach(function (s) {
    gsap.from(s.children, { opacity: 0, x: -20, duration: 0.8, ease: ease, stagger: 0.25, scrollTrigger: { trigger: s, start: 'top 85%', once: true } });
  });
})();
