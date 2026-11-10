/* Experience layer — motion, 3D tilt, valley explorer and live assumable-loan estimator. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const money = v => new Intl.NumberFormat('en-US', {style:'currency', currency:'USD', maximumFractionDigits:0}).format(v);

  function splitWords(el) {
    let i = 0;
    const walk = node => {
      [...node.childNodes].forEach(child => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const w = document.createElement('span');
            w.className = 'w';
            const inner = document.createElement('span');
            inner.style.setProperty('--i', i++);
            inner.textContent = part;
            w.appendChild(inner);
            frag.appendChild(w);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1 && child.tagName !== 'BR') walk(child);
      });
    };
    walk(el);
    el.classList.add('split-words');
  }

  function initReveals() {
    const headings = $$('#heroTitle, .section-heading-row h2, .intro h2, .about-copy h2, .seller-cta h2, .assumable-feature h2, .contact-left h2, .numbers-intro h2');
    headings.forEach(splitWords);
    $$('.community-promise-image').forEach(el => el.classList.add('img-reveal'));
    if (reduced) { headings.concat($$('.img-reveal')).forEach(el => el.classList.add('is-in')); return; }
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }), {threshold:0, rootMargin:'0px 0px -12% 0px'});
    headings.filter(h => h.id !== 'heroTitle').concat($$('.img-reveal')).forEach(el => io.observe(el));
    requestAnimationFrame(() => setTimeout(() => { $('#heroTitle')?.classList.add('is-in'); $('.cine-hero')?.classList.add('is-in'); }, 80));
  }

  function initHero() {
    const hero = $('.cine-hero');
    if (!hero) return;
    if (reduced) { hero.classList.add('is-in'); return; }
    const media = $('.cine-hero-media', hero), stack = $('.cine-stack', hero), copy = $('.cine-hero-copy', hero);
    let px = 0, py = 0, tx = 0, ty = 0, raf = 0, visible = true;
    if (finePointer) {
      hero.addEventListener('pointermove', e => {
        const r = hero.getBoundingClientRect();
        tx = (e.clientX - r.left) / r.width - .5;
        ty = (e.clientY - r.top) / r.height - .5;
        if (!raf) raf = requestAnimationFrame(tick);
      });
      hero.addEventListener('pointerleave', () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(tick); });
    }
    function tick() {
      raf = 0;
      px += (tx - px) * .08; py += (ty - py) * .08;
      stack?.style.setProperty('--ry', `${-15 + px * 22}deg`);
      stack?.style.setProperty('--rx', `${7 - py * 14}deg`);
      applyScroll();
      if (Math.abs(tx - px) > .001 || Math.abs(ty - py) > .001) raf = requestAnimationFrame(tick);
    }
    function applyScroll() {
      const y = Math.min(scrollY, innerHeight * 1.2);
      if (media) media.style.transform = `translate3d(${px * -24}px, ${y * .32 + py * -16}px, 0)`;
      if (copy && innerWidth > 1100) { copy.style.transform = `translate3d(0, ${y * .12}px, 0)`; copy.style.opacity = String(Math.max(0, 1 - y / (innerHeight * .85))); }
    }
    addEventListener('scroll', () => { if (visible) applyScroll(); }, {passive:true});
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(hero);
    applyScroll();
    initDust(hero);
  }

  function initDust(hero) {
    const canvas = $('.cine-hero-dust', hero);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, dpr = Math.min(devicePixelRatio || 1, 2), running = true, parts = [];
    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(90, w * h / 16000));
      parts = Array.from({length:count}, () => ({x:Math.random() * w, y:Math.random() * h, r:Math.random() * 1.6 + .3, s:Math.random() * .35 + .08, d:Math.random() * Math.PI * 2, a:Math.random() * .55 + .15}));
    };
    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.y -= p.s; p.d += .01; p.x += Math.sin(p.d) * .25;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        g.addColorStop(0, `rgba(240,215,158,${p.a})`);
        g.addColorStop(1, 'rgba(240,215,158,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2); ctx.fill();
      }
      requestAnimationFrame(draw);
    };
    resize();
    addEventListener('resize', resize);
    new IntersectionObserver(([e]) => { const was = running; running = e.isIntersecting; if (running && !was) draw(); }).observe(hero);
    draw();
  }

  function bindTilt(el, max = 8) {
    if (el.dataset.tiltBound) return;
    el.dataset.tiltBound = '1';
    el.classList.add('tilt');
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    const glare = document.createElement('span');
    glare.className = 'glare';
    glare.setAttribute('aria-hidden', 'true');
    el.appendChild(glare);
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.classList.remove('tilt-reset');
      el.classList.add('is-tilting');
      el.style.transform = `perspective(1000px) rotateX(${(.5 - y) * max}deg) rotateY(${(x - .5) * max}deg) translateY(-6px)`;
      el.style.setProperty('--gx', `${x * 100}%`);
      el.style.setProperty('--gy', `${y * 100}%`);
    });
    el.addEventListener('pointerleave', () => {
      el.classList.remove('is-tilting');
      el.classList.add('tilt-reset');
      el.style.transform = '';
    });
  }

  function initTilt() {
    if (reduced || !finePointer) return;
    const selector = '.neighborhood-showcase-card, .approach-card, .resource-card, .journal-card, .listing-card, .number-item';
    document.addEventListener('pointerover', e => {
      const el = e.target.closest(selector);
      if (el) bindTilt(el, el.classList.contains('listing-card') ? 7 : 9);
    });
    const portrait = $('.about-image-inner');
    if (portrait) bindTilt(portrait, 10);
  }

  function initMagnetic() {
    if (reduced || !finePointer) return;
    $$('.magnetic, .btn-gold, .header-contact').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px, ${(e.clientY - r.top - r.height / 2) * .3}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  function initValley() {
    const root = $('#valleyExplorer');
    if (!root) return;
    const data = {
      'Las Vegas': {n:'01', img:'assets/las-vegas.jpg?v=2', sub:'Downtown energy and west-side views', desc:'A revitalized downtown and Arts District, established ranch-home streets, and west-side neighborhoods near Red Rock Canyon.'},
      'Henderson': {n:'02', img:'assets/henderson.jpg?v=2', sub:'Master-planned living near Lake Mead', desc:'Parks, trails and master-planned neighborhoods, with Lake Mead recreation and mountain views close to home.'},
      'North Las Vegas': {n:'03', img:'assets/north-las-vegas.jpg?v=2', sub:'Planned neighborhoods and big parks', desc:'Growing residential areas, newer construction, large regional parks and convenient everyday connections across the valley.'},
      'Boulder City': {n:'04', img:'assets/boulder-city.jpg?v=2', sub:'Historic small-town life by the lake', desc:'Historic character, quieter tree-lined streets, and easy access to Lake Mead and Hoover Dam adventures.'}
    };
    const names = Object.keys(data);
    const map = $('.valley-map', root), photo = $('.valley-photo', root), img = $('img', photo), body = $('.valley-panel-body', root);
    let current = 'Las Vegas', timer = 0, interacted = false;
    const show = name => {
      if (name === current || !data[name]) return;
      current = name;
      $$('.valley-pin', root).forEach(p => p.classList.toggle('is-active', p.dataset.pin === name));
      const d = data[name];
      photo.classList.add('swap'); body.classList.add('swap');
      const pre = new Image(); pre.src = d.img;
      setTimeout(() => {
        img.src = d.img; img.alt = `${name}, Nevada`;
        $('.valley-kicker', body).textContent = `${d.n} / 04 · LAS VEGAS VALLEY`;
        $('h3', body).textContent = name;
        $('.valley-sub', body).textContent = d.sub;
        $('.valley-desc', body).textContent = d.desc;
        $$('[data-area]', body).forEach(b => { b.dataset.area = name; });
        requestAnimationFrame(() => { photo.classList.remove('swap'); body.classList.remove('swap'); });
      }, reduced ? 0 : 320);
    };
    root.addEventListener('click', e => {
      const pin = e.target.closest('.valley-pin');
      if (!pin) return;
      interacted = true; clearInterval(timer);
      show(pin.dataset.pin);
    });
    if (!reduced) {
      new IntersectionObserver(([e]) => {
        clearInterval(timer);
        if (e.isIntersecting && !interacted) timer = setInterval(() => show(names[(names.indexOf(current) + 1) % names.length]), 5200);
      }, {threshold:.4}).observe(root);
    }
    if (!reduced && finePointer) {
      map.addEventListener('pointermove', e => {
        const r = map.getBoundingClientRect();
        map.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - .5) * 14}deg`);
        map.style.setProperty('--rx', `${((e.clientY - r.top) / r.height - .5) * -10}deg`);
      });
      map.addEventListener('pointerleave', () => { map.style.setProperty('--ry', '0deg'); map.style.setProperty('--rx', '0deg'); });
    }
  }

  function initEstimator() {
    const root = $('#loanEstimator');
    if (!root) return;
    const input = n => $(`input[name=${n}]`, root);
    const out = n => $(`[data-out=${n}]`, root);
    const res = n => $(`[data-res=${n}]`, root);
    const shown = {old:0, new:0, diff:0};
    const payment = (bal, rate, years) => { const r = rate / 1200, n = years * 12; return r ? bal * r / (1 - Math.pow(1 + r, -n)) : bal / n; };
    const tween = (key, to) => {
      const from = shown[key], el = res(key);
      if (reduced) { shown[key] = to; el.textContent = money(to); return; }
      const start = performance.now();
      const step = now => {
        const t = Math.min(1, (now - start) / 500), v = from + (to - from) * (1 - Math.pow(1 - t, 3));
        shown[key] = v; el.textContent = money(Math.round(v));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const update = () => {
      const bal = +input('bal').value, oldR = +input('old').value, yrs = +input('yrs').value, newR = +input('new').value;
      $$('input[type=range]', root).forEach(i => i.style.setProperty('--p', `${(i.value - i.min) / (i.max - i.min) * 100}%`));
      out('bal').textContent = money(bal);
      out('old').textContent = `${oldR.toFixed(2)}%`;
      out('yrs').textContent = `${yrs} years`;
      out('new').textContent = `${newR.toFixed(2)}%`;
      const a = payment(bal, oldR, yrs), b = payment(bal, newR, 30);
      tween('old', a); tween('new', b); tween('diff', Math.max(0, b - a));
    };
    root.addEventListener('input', update);
    update();
  }

  function initParallax() {
    if (reduced) return;
    const items = $$('[data-parallax]');
    if (!items.length) return;
    const tick = () => items.forEach(el => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      el.style.transform = `translate3d(0, ${(r.top + r.height / 2 - innerHeight / 2) * -(+el.dataset.parallax)}px, 0)`;
    });
    addEventListener('scroll', () => requestAnimationFrame(tick), {passive:true});
    tick();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initReveals(); initHero(); initTilt(); initMagnetic(); initValley(); initEstimator(); initParallax();
  });
})();
