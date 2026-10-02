(() => {
  'use strict';
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const compact = matchMedia('(max-width: 640px)');
  const ease = 'cubic-bezier(.16,1,.3,1)';
  const portrait = document.querySelector('.portrait');
  const hero = document.querySelector('.hero');
  const timeline = document.querySelector('.timeline');
  const track = document.getElementById('tools-track');
  const animations = new Set();
  const play = (element, frames, options = {}) => {
    if (reduced.matches || typeof element.animate !== 'function') return;
    const animation = element.animate(frames, { duration: 650, easing: ease, ...options });
    animations.add(animation);
    const cleanup = () => animations.delete(animation);
    animation.addEventListener('finish', cleanup, { once: true });
    animation.addEventListener('cancel', cleanup, { once: true });
  };

  // Preserve the original text, line breaks and accessible reading order.
  let wordIndex = 0;
  function splitHeadline(node) {
    [...node.childNodes].forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        const fragment = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(word => {
          if (!word.trim()) { fragment.append(document.createTextNode(word)); return; }
          const clip = document.createElement('span');
          const inner = document.createElement('span');
          clip.className = 'word-clip';
          inner.className = 'word-rise';
          inner.style.setProperty('--word-delay', `${100 + wordIndex++ * 65}ms`);
          inner.textContent = word;
          clip.append(inner);
          fragment.append(clip);
        });
        child.replaceWith(fragment);
      } else if (child.nodeType === Node.ELEMENT_NODE) splitHeadline(child);
    });
  }
  splitHeadline(document.getElementById('hero-title'));

  // Short, staggered reading units keep the story readable during scroll.
  document.querySelectorAll('.reveal').forEach(element => element.classList.remove('reveal', 'visible'));
  const reveals = [...document.querySelectorAll([
    '.story-copy > h2', '.story-copy > details', '.story-copy > p', '.tools-heading',
    '.section-heading > *', '.project-visual', '.project-copy > *',
    '.research-heading > *', '.research-card', '.experience-intro > *',
    '.timeline-item', '.learning-grid > div > .eyebrow', '.learning-list > li',
    '.contact-layout > div:first-child > *', '.contact-links > a', '.footer > *'
  ].join(','))];
  const revealSet = new Set(reveals);
  reveals.forEach(element => {
    element.dataset.motion = element.matches('.project-visual, .research-card') ? 'card' : 'rise';
    const siblings = [...element.parentElement.children].filter(sibling => revealSet.has(sibling));
    element.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(element), 3) * 65}ms`);
  });
  function reveal(element) {
    if (element.classList.contains('is-revealed')) return;
    element.classList.add('is-revealed');
    if (element.matches('.qamar-visual')) {
      element.querySelectorAll('.bar-track > span').forEach((bar, i) => play(bar, [
        { transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }
      ], { duration: 1000, delay: 250 + i * 140, fill: 'backwards' }));
    }
  }
  let revealObserver;
  if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
    reveals.forEach(element => revealObserver.observe(element));
  } else reveals.forEach(reveal);
  document.addEventListener('focusin', event => {
    let element = event.target;
    while (element && element !== document.body) {
      if (element.hasAttribute('data-motion')) {
        element.style.setProperty('--reveal-delay', '0ms');
        reveal(element);
        revealObserver?.unobserve(element);
      }
      element = element.parentElement;
    }
  });

  // Native scrolling, one scheduled frame, no perpetual render loop.
  let scrollFrame = 0;
  let heroVisible = true;
  let timelineVisible = false;
  let toolsVisible = true;
  const navLinks = [...document.querySelectorAll('.desktop-nav a')];
  const sections = [...document.querySelectorAll('#story, #work, #experience')];
  function updateScroll() {
    scrollFrame = 0;
    if (heroVisible) {
      portrait.style.setProperty('--portrait-depth', `${!reduced.matches && !compact.matches ? Math.min(32, scrollY * .065) : 0}px`);
    }
    if (timelineVisible && !reduced.matches) {
      const rect = timeline.getBoundingClientRect();
      timeline.style.setProperty('--timeline-progress', Math.max(0, Math.min(1, (innerHeight * .72 - rect.top) / rect.height)));
    }
    let current = '';
    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= innerHeight * .4 && rect.bottom > innerHeight * .3) current = '#' + section.id;
    }
    navLinks.forEach(link => {
      const active = link.hash === current;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function scheduleScroll() { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); }
  function updateTools() { track.dataset.resting = String(!toolsVisible || document.hidden); }
  addEventListener('scroll', scheduleScroll, { passive: true });
  addEventListener('resize', scheduleScroll, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(scheduleScroll).observe(document.body);
  if ('IntersectionObserver' in window) {
    const visibility = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.target === hero) heroVisible = entry.isIntersecting;
      if (entry.target === timeline) timelineVisible = entry.isIntersecting;
      if (entry.target === track.parentElement) { toolsVisible = entry.isIntersecting; updateTools(); }
      scheduleScroll();
    }));
    [hero, timeline, track.parentElement].forEach(element => visibility.observe(element));
  }

  // Damped card light and magnetic buttons, limited to a few pixels/degrees.
  const pointers = [];
  let pointerFrame = 0;
  let lastTime = 0;
  const allowed = () => fine.matches && !reduced.matches && !document.hidden;
  function tick(time) {
    pointerFrame = 0;
    const dt = lastTime ? Math.min(32, time - lastTime) : 16.7;
    lastTime = time;
    const blend = 1 - Math.exp(-dt / 75);
    let moving = false;
    pointers.forEach(state => {
      if (!state.active && Math.abs(state.x) + Math.abs(state.y) < .001) return;
      state.x += (state.tx - state.x) * blend;
      state.y += (state.ty - state.y) * blend;
      if (Math.abs(state.tx - state.x) + Math.abs(state.ty - state.y) < .001) {
        state.x = state.tx; state.y = state.ty;
      } else moving = true;
      const style = state.element.style;
      if (state.card) {
        style.setProperty('--tilt-x', `${-state.y * 2.1}deg`);
        style.setProperty('--tilt-y', `${state.x * 2.1}deg`);
        style.setProperty('--pointer-x', `${50 + state.x * 50}%`);
        style.setProperty('--pointer-y', `${50 + state.y * 50}%`);
      } else {
        style.setProperty('--magnet-x', `${state.x * 3}px`);
        style.setProperty('--magnet-y', `${state.y * 3}px`);
      }
    });
    if (moving && allowed()) pointerFrame = requestAnimationFrame(tick);
    else lastTime = 0;
  }
  function wake() { if (!pointerFrame && allowed()) pointerFrame = requestAnimationFrame(tick); }
  document.querySelectorAll('.bento-tile, .button, .nav-contact, .back-top').forEach(element => {
    const state = { element, card: element.matches('.bento-tile'), x: 0, y: 0, tx: 0, ty: 0, active: false };
    pointers.push(state);
    element.addEventListener('pointerenter', () => { if (allowed()) state.bounds = element.getBoundingClientRect(); });
    element.addEventListener('pointermove', event => {
      if (!allowed()) return;
      const rect = state.bounds || element.getBoundingClientRect();
      state.active = true;
      state.tx = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
      state.ty = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
      wake();
    }, { passive: true });
    const leave = () => { state.active = false; state.bounds = null; state.tx = state.ty = 0; wake(); };
    element.addEventListener('pointerleave', leave);
    element.addEventListener('pointercancel', leave);
  });
  function resetPointers() {
    cancelAnimationFrame(pointerFrame); pointerFrame = 0; lastTime = 0;
    pointers.forEach(state => {
      if (!state.active && state.x === 0 && state.y === 0 && state.tx === 0 && state.ty === 0) return;
      state.active = false; state.bounds = null; state.x = state.y = state.tx = state.ty = 0;
      ['--tilt-x', '--tilt-y', '--pointer-x', '--pointer-y', '--magnet-x', '--magnet-y'].forEach(key => state.element.style.removeProperty(key));
    });
  }
  // Cached card geometry is invalid as soon as the viewport moves.
  addEventListener('scroll', resetPointers, { passive: true });
  fine.addEventListener('change', resetPointers);
  document.addEventListener('visibilitychange', () => { updateTools(); if (document.hidden) resetPointers(); });
  function updatePreference() {
    if (reduced.matches) {
      root.classList.remove('motion-ready');
      reveals.forEach(element => element.classList.add('is-revealed'));
      animations.forEach(animation => animation.cancel());
      document.getAnimations().forEach(animation => {
        if (animation.playState !== 'running') return;
        if (Number.isFinite(animation.effect?.getComputedTiming().endTime)) animation.finish();
        else animation.cancel();
      });
      resetPointers();
      portrait.style.removeProperty('--portrait-depth');
      timeline.style.setProperty('--timeline-progress', '1');
    }
    updateTools();
  }
  reduced.addEventListener('change', updatePreference);
  // Fail open: without working JavaScript, every word and control stays visible.
  if (!reduced.matches) root.classList.add('motion-ready');
  updatePreference();
  updateScroll();
})();
