(() => {
  'use strict';
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.getElementById('mobile-nav');
  const header = document.querySelector('.site-header');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  let menuAnimation;
  const closeMenu = () => {
    menuAnimation?.cancel();
    menu.inert = true;
    if (!reducedMotion.matches && !menu.hidden && typeof menu.animate === 'function') {
      menuAnimation = menu.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-6px)' }], { duration: 160, easing: 'ease-out' });
      menuAnimation.onfinish = () => { menu.hidden = true; };
    } else menu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  };
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    if (!open) { closeMenu(); return; }
    menuAnimation?.cancel();
    menu.hidden = false;
    menu.inert = false;
    if (!reducedMotion.matches && typeof menu.animate === 'function') {
      menuAnimation = menu.animate([{ opacity: 0, transform: 'translateY(-10px)' }, { opacity: 1, transform: 'none' }], { duration: 350, easing: 'cubic-bezier(.16,1,.3,1)' });
      menu.querySelectorAll('a').forEach((link, i) => link.animate([{ opacity: 0, transform: 'translateY(-7px)' }, { opacity: 1, transform: 'none' }], { duration: 340, delay: 35 + i * 35, fill: 'backwards', easing: 'cubic-bezier(.16,1,.3,1)' }));
    }
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
    progress.style.transform = 'scaleX(' + (distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0) + ')';
    header.classList.toggle('scrolled', window.scrollY > 28);
    queued = false;
  };
  window.addEventListener('scroll', () => {
    if (!queued) { queued = true; requestAnimationFrame(updateProgress); }
  }, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });

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
    details.dataset.expanded = String(open);
    const finish = () => {
      details.open = open;
      details.style.removeProperty('height');
      details.style.removeProperty('overflow');
      animations.delete(details);
      updateProgress();
      if (open && reveal) {
        // Reveal the completed expansion, with room for the fixed navigation.
        summary.focus({ preventScroll: true });
        const rect = summary.getBoundingClientRect();
        if (rect.top < header.offsetHeight + 20 || rect.bottom > innerHeight * .7) {
          details.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
        }
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
      duration: Math.min(560, Math.max(280, Math.abs(endHeight - startHeight) * .35 + 250)),
      easing: 'cubic-bezier(.16,1,.3,1)',
      fill: 'both'
    });
    animations.set(details, animation);
    if (open) details.querySelector('.details-body')?.animate([
      { opacity: 0, transform: 'translateY(8px)' },
      { opacity: 1, transform: 'none' }
    ], { duration: 380, delay: 60, fill: 'backwards', easing: 'cubic-bezier(.16,1,.3,1)' });
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

  reducedMotion.addEventListener('change', event => {
    if (event.matches) {
      document.querySelectorAll('details').forEach(details => {
        if (animations.has(details)) changeDetails(details, desiredStates.get(details));
      });
    }
  });
  document.getElementById('year').textContent = new Date().getFullYear();
  if ('ResizeObserver' in window) new ResizeObserver(updateProgress).observe(document.body);
  updateProgress();
})();
