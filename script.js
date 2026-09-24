(() => {
  'use strict';
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.getElementById('mobile-nav');
  const header = document.querySelector('.site-header');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const closeMenu = () => {
    menu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  };
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) { closeMenu(); menuButton.focus(); }
  });
  document.addEventListener('click', event => {
    if (!menu.hidden && !event.target.closest('.site-header')) closeMenu();
  });
  window.matchMedia('(min-width: 641px)').addEventListener('change', event => {
    if (event.matches) closeMenu();
  });

  const progress = document.querySelector('.reading-progress');
  let queued = false;
  const updateProgress = () => {
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (distance > 0 ? Math.min(100, Math.max(0, window.scrollY / distance * 100)) : 0) + '%';
    header.classList.toggle('scrolled', window.scrollY > 28);
    queued = false;
  };
  window.addEventListener('scroll', () => {
    if (!queued) { queued = true; requestAnimationFrame(updateProgress); }
  }, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.04 });
    if (!reducedMotion.matches) document.documentElement.classList.add('motion-ready');
    reveals.forEach(element => revealObserver.observe(element));
    const navLinks = [...document.querySelectorAll('.desktop-nav a')];
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          const active = link.hash === '#' + entry.target.id;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-18% 0px -55% 0px' });
    document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
  }

  // Keep the native details control and add cancellable, measured height transitions.
  const desiredStates = new WeakMap();
  const animations = new WeakMap();
  const controlMap = new Map();
  document.querySelectorAll('[data-details]').forEach(button => {
    const details = document.getElementById(button.dataset.details);
    if (!details) return;
    if (!controlMap.has(details)) controlMap.set(details, []);
    button.dataset.closedLabel = button.querySelector('.card-explore-label').textContent;
    controlMap.get(details).push(button);
    button.addEventListener('click', () => {
      const open = !(desiredStates.get(details) ?? details.open);
      changeDetails(details, open, open);
    });
  });
  const syncControls = (details, open) => {
    (controlMap.get(details) || []).forEach(button => {
      button.setAttribute('aria-expanded', String(open));
      button.querySelector('.card-explore-label').textContent = open ? 'Close project details' : button.dataset.closedLabel;
    });
  };
  function changeDetails(details, open, reveal = false) {
    const summary = details.querySelector('summary');
    const startHeight = details.getBoundingClientRect().height;
    const running = animations.get(details);
    if (running) { running.onfinish = null; running.cancel(); animations.delete(details); }
    desiredStates.set(details, open);
    syncControls(details, open);
    const finish = () => {
      details.open = open;
      details.style.removeProperty('height');
      details.style.removeProperty('overflow');
      animations.delete(details);
      updateProgress();
      if (open && reveal) {
        // Reveal the completed expansion, with room for the fixed navigation.
        summary.focus({ preventScroll: true });
        details.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
      }
    };
    if (reducedMotion.matches || typeof details.animate !== 'function') { finish(); return; }
    details.style.removeProperty('height');
    details.open = true;
    const styles = getComputedStyle(details);
    const borders = parseFloat(styles.borderTopWidth) + parseFloat(styles.borderBottomWidth);
    const endHeight = open ? details.getBoundingClientRect().height : summary.getBoundingClientRect().height + borders;
    details.style.height = startHeight + 'px';
    details.style.overflow = 'hidden';
    const animation = details.animate([{ height: startHeight + 'px' }, { height: endHeight + 'px' }], {
      duration: 360,
      easing: 'cubic-bezier(.22,.75,.25,1)',
      fill: 'both'
    });
    animations.set(details, animation);
    animation.onfinish = () => {
      animation.onfinish = null;
      animation.cancel();
      finish();
    };
  }
  document.querySelectorAll('details').forEach(details => {
    desiredStates.set(details, details.open);
    details.querySelector('summary').addEventListener('click', event => {
      event.preventDefault();
      changeDetails(details, !(desiredStates.get(details) ?? details.open));
    });
    details.addEventListener('toggle', () => {
      if (!animations.has(details)) {
        desiredStates.set(details, details.open);
        syncControls(details, details.open);
      }
      updateProgress();
    });
  });

  const toolsTrack = document.getElementById('tools-track');
  const toolsToggle = document.querySelector('.tools-toggle');
  if (toolsTrack && toolsToggle) {
    const updateToolsMotion = () => { toolsToggle.hidden = reducedMotion.matches; };
    updateToolsMotion();
    reducedMotion.addEventListener('change', updateToolsMotion);
    toolsToggle.addEventListener('click', () => {
      const paused = toolsTrack.dataset.paused !== 'true';
      toolsTrack.dataset.paused = String(paused);
      toolsToggle.setAttribute('aria-label', paused ? 'Resume logo animation' : 'Pause logo animation');
      toolsToggle.querySelector('.tools-toggle-label').textContent = paused ? 'Resume' : 'Pause';
      toolsToggle.querySelector('.tools-toggle-icon').textContent = paused ? '▷' : 'Ⅱ';
    });
  }

  // Pointer feedback is restrained and is disabled for touch and reduced motion.
  const tiles = document.querySelectorAll('.bento-tile');
  const resetTile = tile => {
    tile.style.removeProperty('--tilt-x');
    tile.style.removeProperty('--tilt-y');
    tile.style.removeProperty('--pointer-x');
    tile.style.removeProperty('--pointer-y');
  };
  tiles.forEach(tile => {
    let frame = 0;
    tile.addEventListener('pointermove', event => {
      if (reducedMotion.matches || !finePointer.matches) return;
      const x = event.clientX;
      const y = event.clientY;
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = 0;
        const bounds = tile.getBoundingClientRect();
        const px = Math.max(0, Math.min(1, (x - bounds.left) / bounds.width));
        const py = Math.max(0, Math.min(1, (y - bounds.top) / bounds.height));
        tile.style.setProperty('--pointer-x', (px * 100) + '%');
        tile.style.setProperty('--pointer-y', (py * 100) + '%');
        tile.style.setProperty('--tilt-x', ((.5 - py) * 2.6) + 'deg');
        tile.style.setProperty('--tilt-y', ((px - .5) * 2.6) + 'deg');
      });
    }, { passive: true });
    tile.addEventListener('pointerleave', () => {
      if (frame) { cancelAnimationFrame(frame); frame = 0; }
      resetTile(tile);
    });
  });
  reducedMotion.addEventListener('change', event => {
    if (event.matches) {
      document.documentElement.classList.remove('motion-ready');
      reveals.forEach(element => element.classList.add('visible'));
      tiles.forEach(resetTile);
      document.querySelectorAll('details').forEach(details => {
        if (animations.has(details)) changeDetails(details, desiredStates.get(details));
      });
    }
  });
  document.getElementById('year').textContent = new Date().getFullYear();
  updateProgress();
})();
