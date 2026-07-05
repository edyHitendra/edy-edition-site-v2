/* =========================================================
   EDY EDITION — Interactions
   Everything on this site (hero text, stats, portfolio,
   services, pricing, results, contact links, footer) is
   loaded automatically from the JSON files inside
   assets/data/ and from assets/config.js.

   YOU SHOULD NEVER NEED TO EDIT THIS FILE OR index.html
   TO UPDATE CONTENT — only the JSON files and config.js.
   ========================================================= */

(function(){
  "use strict";

  /* ---------- SMALL HELPERS ---------- */
  function esc(str){
    return String(str ?? '').replace(/[&<>"']/g, c => ({
      '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
    }[c]));
  }
  function slug(str){
    return String(str).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  async function loadJSON(path){
    try{
      const res = await fetch(path, { cache: 'no-store' });
      if(!res.ok) throw new Error(res.status + ' ' + res.statusText);
      return await res.json();
    }catch(err){
      console.error('Could not load ' + path + ' — check the file exists and is valid JSON.', err);
      return null;
    }
  }

  /* ---------- CUSTOM CURSOR ---------- */
  const dot = document.getElementById('cursorDot');
  const glow = document.getElementById('cursorGlow');
  let mx = window.innerWidth/2, my = window.innerHeight/2;
  let gx = mx, gy = my;

  window.addEventListener('mousemove', (e)=>{
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });

  function animateGlow(){
    gx += (mx - gx) * 0.14;
    gy += (my - gy) * 0.14;
    glow.style.left = gx + 'px';
    glow.style.top = gy + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  function bindHoverGrow(el){
    el.addEventListener('mouseenter', ()=>{ dot.classList.add('grow'); glow.classList.add('grow'); });
    el.addEventListener('mouseleave', ()=>{ dot.classList.remove('grow'); glow.classList.remove('grow'); });
  }
  function refreshHoverTargets(){
    document.querySelectorAll('a, button, input, textarea, .p-card, .cat-pill').forEach(bindHoverGrow);
  }

  /* ---------- MAGNETIC BUTTONS ---------- */
  function bindMagnetic(btn){
    btn.addEventListener('mousemove', (e)=>{
      const r = btn.getBoundingClientRect();
      const relX = e.clientX - r.left - r.width/2;
      const relY = e.clientY - r.top - r.height/2;
      btn.style.transform = `translate(${relX*0.18}px, ${relY*0.35}px)`;
    });
    btn.addEventListener('mouseleave', ()=>{ btn.style.transform = ''; });
  }
  function refreshMagnetic(){
    document.querySelectorAll('.magnetic').forEach(bindMagnetic);
  }

  /* ---------- NAVBAR ---------- */
  const navWrap = document.getElementById('navWrap');
  const navBurger = document.getElementById('navBurger');
  const navMobile = document.getElementById('navMobile');

  window.addEventListener('scroll', ()=>{
    navWrap.classList.toggle('scrolled', window.scrollY > 40);
  });

  navBurger.addEventListener('click', ()=>{
    navMobile.classList.toggle('open');
  });
  document.querySelectorAll('.nav-mobile-link').forEach(l=>{
    l.addEventListener('click', ()=> navMobile.classList.remove('open'));
  });

  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section, .hero');
  const navObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const id = entry.target.id;
        navLinks.forEach(l=>{
          l.classList.toggle('active', l.dataset.section === id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  sections.forEach(s=> navObserver.observe(s));

  /* ---------- SCROLL REVEAL ---------- */
  const revealObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  function refreshReveal(){
    document.querySelectorAll('.reveal-up:not(.in-view)').forEach(el=> revealObserver.observe(el));
  }

  /* ---------- COUNTERS ---------- */
  function animateCounter(el){
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0');
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();

    function tick(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = value.toFixed(decimals) + suffix;
      if(progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(tick);
  }
  const counterObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  function refreshHeroCounters(){
    document.querySelectorAll('#heroStats .stat-num').forEach(c=> counterObserver.observe(c));
  }

  /* ---------- PARTICLES CANVAS ---------- */
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;
  }
  function initParticles(){
    particles = [];
    const count = Math.min(70, Math.floor(window.innerWidth / 22));
    for(let i=0;i<count;i++){
      particles.push({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height,
        r: Math.random()*1.6 + 0.4,
        vy: Math.random()*0.15 + 0.03,
        o: Math.random()*0.5 + 0.15
      });
    }
  }
  function drawParticles(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    particles.forEach(p=>{
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(198,255,61,${p.o})`;
      ctx.fill();
      p.y -= p.vy;
      if(p.y < -10){ p.y = canvas.height + 10; p.x = Math.random()*canvas.width; }
    });
    requestAnimationFrame(drawParticles);
  }
  resizeCanvas(); initParticles(); drawParticles();
  window.addEventListener('resize', ()=>{ resizeCanvas(); initParticles(); });

  /* ---------- BLAST / GLASS-BREAK EFFECT + SFX ---------- */
  function triggerBlast(x, y){
    const fx = document.createElement('div');
    fx.className = 'blast-fx';
    fx.style.left = x + 'px';
    fx.style.top = y + 'px';

    const flash = document.createElement('div');
    flash.className = 'blast-flash';
    fx.appendChild(flash);

    const shardCount = 10;
    for(let i=0; i<shardCount; i++){
      const shard = document.createElement('div');
      shard.className = 'blast-shard';
      const ang = (360/shardCount) * i + (Math.random()*20 - 10);
      const dist = 38 + Math.random()*28;
      shard.style.setProperty('--ang', ang + 'deg');
      shard.style.setProperty('--dist', dist + 'px');
      shard.style.animationDelay = (Math.random()*0.04) + 's';
      fx.appendChild(shard);
    }
    document.body.appendChild(fx);
    setTimeout(()=> fx.remove(), 650);
    playImpactSFX();
  }

  const clickSfx = new Audio('assets/click-sfx.mp3');
  clickSfx.preload = 'auto';
  clickSfx.volume = 0.55;
  clickSfx.addEventListener('error', ()=>{
    console.warn('SFX file not found — make sure assets/click-sfx.mp3 exists.');
  });

  /* Mobile/Safari blocks audio until it's played inside a real user gesture.
     Unlock it on the very first tap/click anywhere on the page so later
     cloned plays (like the category-pill blast SFX) aren't silently rejected. */
  let audioUnlocked = false;
  function unlockAudio(){
    if(audioUnlocked) return;
    audioUnlocked = true;
    clickSfx.play().then(()=>{
      clickSfx.pause();
      clickSfx.currentTime = 0;
    }).catch(()=>{ audioUnlocked = false; });
  }
  document.addEventListener('pointerdown', unlockAudio, { once:false });

  function playImpactSFX(){
    try{
      const sfx = clickSfx.cloneNode();
      sfx.volume = 0.55;
      sfx.play().catch(()=>{ /* browser blocked autoplay before first interaction, ignore */ });
    }catch(e){ /* audio not available, fail silently */ }
  }

  /* ---------- POPUP MODAL ---------- */
  const overlay = document.getElementById('popupOverlay');
  const popupThumb = document.getElementById('popupThumb');
  const popupBody = document.getElementById('popupBody');
  const popupClose = document.getElementById('popupClose');

  function openPopup(item){
    popupThumb.style.backgroundImage = `url('${item.image}')`;
    let bodyHtml = `<span class="popup-badge">${esc(item.category)}</span>`;
    if(item.link){
      bodyHtml += `<p><a href="${esc(item.link)}" target="_blank" rel="noopener" class="btn btn-outline magnetic">View Project <span class="arrow">→</span></a></p>`;
    }
    popupBody.innerHTML = bodyHtml;
    refreshMagnetic();
    refreshHoverTargets();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closePopup(){
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  popupClose.addEventListener('click', closePopup);
  overlay.addEventListener('click', (e)=>{ if(e.target === overlay) closePopup(); });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closePopup(); });

  /* ---------- CONTACT FORM (auto-emails via FormSubmit) ---------- */
  function bindContactForm(){
    const contactForm = document.getElementById('contactForm');
    contactForm.action = `https://formsubmit.co/${SITE_CONFIG.email}`;
    contactForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const btn = contactForm.querySelector('button');
      const original = btn.innerHTML;
      btn.innerHTML = 'Sending…';
      const formData = new FormData(contactForm);

      fetch(contactForm.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      })
      .then(res => { if(!res.ok) throw new Error('send failed'); })
      .then(()=>{
        btn.innerHTML = 'Message Sent ✓';
        contactForm.reset();
      })
      .catch(()=>{
        btn.innerHTML = 'Could not send — try again';
      })
      .finally(()=>{
        setTimeout(()=>{ btn.innerHTML = original; }, 2800);
      });
    });
  }

  /* =========================================================
     RENDER FUNCTIONS — one per JSON file / config section
     ========================================================= */

  function renderBrand(){
    if(!window.SITE_CONFIG) return;
    const cfg = SITE_CONFIG;
    document.title = `${cfg.brandName} — After Effects Thumbnail Designer`;

    const navLogo = document.getElementById('navLogo');
    if(navLogo){
      if(cfg.logo){
        navLogo.innerHTML = `<img src="${esc(cfg.logo)}" alt="${esc(cfg.brandName)} logo" style="height:28px;display:block;">`;
      }else{
        const first = esc(cfg.brandName).split(' ')[0].toUpperCase();
        const rest = esc(cfg.brandName).split(' ').slice(1).join(' ') || cfg.brandTag || '';
        navLogo.innerHTML = `${first}<span>&lt;/&gt;</span><small>${esc(rest).toUpperCase()}</small>`;
      }
    }

    const footerBrand = document.getElementById('footerBrand');
    if(footerBrand){
      footerBrand.innerHTML = `
        <span class="nav-logo">${esc(cfg.brandName)}</span>
        <p>${esc(cfg.footerTagline)}</p>
      `;
    }

    const footerSocial = document.getElementById('footerSocial');
    if(footerSocial){
      footerSocial.innerHTML = `
        <a href="${esc(cfg.youtube)}" target="_blank" rel="noopener" aria-label="YouTube">▶</a>
        <a href="${esc(cfg.instagram)}" target="_blank" rel="noopener" aria-label="Instagram">◎</a>
        <a href="${esc(cfg.discordLink)}" target="_blank" rel="noopener" aria-label="Discord">◆</a>
      `;
    }

    const footerCopyright = document.getElementById('footerCopyright');
    if(footerCopyright){
      footerCopyright.textContent = `© ${new Date().getFullYear()} ${cfg.footerText}`;
    }

    const contactLinks = document.getElementById('contactLinks');
    if(contactLinks){
      const whatsappUrl = `https://wa.me/${cfg.whatsappNumber}`;
      contactLinks.innerHTML = `
        <a href="mailto:${esc(cfg.email)}" class="contact-link">
          <span class="contact-icon">✉</span> Email
          <small>${esc(cfg.email)}</small>
        </a>
        <a href="${esc(whatsappUrl)}" target="_blank" rel="noopener" class="contact-link">
          <span class="contact-icon">☎</span> WhatsApp
          <small>${esc(cfg.whatsappNumber)}</small>
        </a>
        <a href="${esc(cfg.discordLink)}" target="_blank" rel="noopener" class="contact-link">
          <span class="contact-icon">◆</span> Discord
          <small>${esc(cfg.discordHandle)}</small>
        </a>
        <a href="${esc(cfg.instagram)}" target="_blank" rel="noopener" class="contact-link">
          <span class="contact-icon">◎</span> Instagram
          <small>${esc(cfg.instagram.replace('https://instagram.com/','@'))}</small>
        </a>
        <a href="${esc(cfg.youtube)}" target="_blank" rel="noopener" class="contact-link">
          <span class="contact-icon">▶</span> YouTube
          <small>${esc(cfg.youtube.replace('https://www.youtube.com/',''))}</small>
        </a>
      `;
    }

    bindContactForm();
  }

  function renderHero(hero){
    if(!hero) return;
    const heroText = document.getElementById('heroText');
    const buttonsHtml = (hero.buttons || []).map(b=>{
      const styleClass = { primary:'btn-primary', ghost:'btn-ghost', outline:'btn-outline' }[b.style] || 'btn-primary';
      return `<a href="${esc(b.link)}" class="btn ${styleClass} magnetic">${esc(b.text)} <span class="arrow">→</span></a>`;
    }).join('');

    heroText.innerHTML = `
      <span class="badge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor"/></svg>
        ${esc(hero.badge)}
      </span>
      <h1 class="hero-title">
        ${esc(hero.titleLine1)}<br>
        <span class="glow-text">${esc(hero.titleHighlight)}</span>
      </h1>
      <p class="hero-sub">${esc(hero.subtitle)}</p>
      <div class="hero-actions">${buttonsHtml}</div>
    `;
  }

  function renderHeroStats(overallStats){
    const heroStats = document.getElementById('heroStats');
    if(!heroStats || !overallStats) return;
    heroStats.innerHTML = overallStats.map(s => `
      <div class="stat-card">
        <span class="stat-num" data-count="${s.value}" data-decimals="${s.decimals || 0}" data-suffix="${esc(s.suffix || '')}">0</span>
        <span class="stat-label">${esc(s.label)}</span>
      </div>
    `).join('');
  }

  function renderCaseStudies(caseStudies){
    const showcase = document.getElementById('channelShowcase');
    if(!showcase || !caseStudies) return;
    showcase.innerHTML = caseStudies.map((c, i) => `
      <div class="channel-item" data-order="${i}">
        <div class="channel-thumb-wrap">
          <img class="channel-thumb" src="${esc(c.image)}" alt="${esc(c.title)} thumbnail" loading="lazy">
        </div>
        <div class="channel-info">
          <h3 class="channel-title">${esc(c.title)}</h3>
          <div class="channel-stats">
            <div class="channel-stat"><span class="stat-num" data-count="${c.views.value}" data-decimals="${c.views.decimals||0}" data-suffix="${esc(c.views.suffix||'')}">0</span><span class="stat-label">Views</span></div>
            <div class="channel-stat"><span class="stat-num" data-count="${c.impressions.value}" data-decimals="${c.impressions.decimals||0}" data-suffix="${esc(c.impressions.suffix||'')}">0</span><span class="stat-label">Impressions</span></div>
            <div class="channel-stat"><span class="stat-num" data-count="${c.ctr.value}" data-decimals="${c.ctr.decimals||0}" data-suffix="${esc(c.ctr.suffix||'')}">0</span><span class="stat-label">CTR</span></div>
          </div>
        </div>
      </div>
    `).join('');

    const channelItems = [...showcase.querySelectorAll('.channel-item')];
    const showcaseObserver = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          channelItems.forEach((item, idx)=>{
            setTimeout(()=>{
              item.classList.add('in-view');
              item.querySelectorAll('.stat-num').forEach(n=>{
                if(!n.dataset.counted){ n.dataset.counted = '1'; animateCounter(n); }
              });
            }, idx * 350);
          });
          showcaseObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    showcaseObserver.observe(showcase);
  }

  function renderServices(services){
    const card = document.getElementById('servicesCard');
    if(!card || !services) return;
    const featuresHtml = (services.features || []).map(f => `<li>${esc(f)}</li>`).join('');
    const btn = services.button || {};
    const html = `
      <div class="services-text">
        <span class="eyebrow">◇ ${esc(services.eyebrow)}</span>
        <h2>${esc(services.heading)}</h2>
        <ul class="checklist">${featuresHtml}</ul>
        <a href="${esc(btn.link)}" class="btn btn-primary magnetic">${esc(btn.text)} <span class="arrow">→</span></a>
      </div>
    `;
    card.insertAdjacentHTML('afterbegin', html);
  }

  function renderPricing(pricing){
    const grid = document.getElementById('pricingGrid');
    if(!grid || !pricing || !pricing.plans) return;
    grid.innerHTML = pricing.plans.map((plan, i) => {
      const featuresHtml = (plan.features || []).map(f => `<li>${esc(f)}</li>`).join('');
      const featuredClass = plan.popular ? ' price-featured' : '';
      const popularTag = plan.popular ? `<span class="popular-tag">Most Popular</span>` : '';
      const addonHtml = plan.addon ? `
        <div class="price-addon price-addon-highlight">
          ${esc(plan.addon.text)} <strong>${esc(plan.addon.amount)}</strong>
          <span class="addon-note">${esc(plan.addon.note || '')}</span>
        </div>
      ` : '';
      const btn = plan.button || {};
      const btnClass = plan.popular ? 'btn-primary' : 'btn-outline';
      return `
        <div class="glass-card price-card${featuredClass} reveal-up" style="transition-delay:${i*0.1}s">
          ${popularTag}
          <h3 class="price-name">${esc(plan.name)}</h3>
          <div class="price-tag">${esc(plan.price)}</div>
          <ul class="price-list">${featuresHtml}</ul>
          ${addonHtml}
          <a href="${esc(btn.link)}" class="btn ${btnClass} magnetic">${esc(btn.text)} <span class="arrow">→</span></a>
        </div>
      `;
    }).join('');
  }

  /* ---------- PORTFOLIO (pills + grid, driven entirely by portfolio.json) ---------- */
  let portfolioItems = [];
  let activeCat = 'all';
  let expanded = false;
  const ALL_LIMIT = 5;

  function renderPortfolioPills(){
    const catPills = document.getElementById('catPills');
    if(!catPills) return;

    const seen = new Map(); // slug -> display label, keeps first-seen order
    portfolioItems.forEach(item=>{
      const s = slug(item.category);
      if(!seen.has(s)) seen.set(s, item.category);
    });

    let html = `<button class="cat-pill active" data-cat="all"><span class="pill-icon">${pillIconSvg()}</span>All</button>`;
    seen.forEach((label, s)=>{
      html += `<button class="cat-pill" data-cat="${esc(s)}"><span class="pill-icon">${pillIconSvg()}</span>${esc(label)}</button>`;
    });
    catPills.innerHTML = html;

    catPills.querySelectorAll('.cat-pill').forEach(pill=>{
      pill.addEventListener('click', ()=>{
        catPills.querySelectorAll('.cat-pill').forEach(p=>p.classList.remove('active'));
        pill.classList.add('active');
        activeCat = pill.dataset.cat;
        expanded = false;
        renderPortfolioGrid();
        const r = pill.getBoundingClientRect();
        triggerBlast(r.left + r.width/2, r.top + r.height/2);
      });
    });
  }
  function pillIconSvg(){
    return `<svg viewBox="0 0 24 24" width="11" height="11"><polygon points="4,4 20,4 12,20" fill="currentColor"/></svg>`;
  }

  function renderPortfolioGrid(){
    const grid = document.getElementById('portfolioGrid');
    const viewMoreWrap = document.getElementById('viewMoreWrap');
    if(!grid) return;

    const filtered = portfolioItems.filter(item => activeCat === 'all' || slug(item.category) === activeCat);
    const shouldLimit = activeCat === 'all' && !expanded && filtered.length > ALL_LIMIT;
    const displayItems = shouldLimit ? filtered.slice(0, ALL_LIMIT) : filtered;

    if(displayItems.length === 0){
      grid.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:var(--text-faint); padding:40px 0;">No thumbnails in this category yet.</p>`;
    }else{
      grid.innerHTML = '';
      displayItems.forEach((item, i)=>{
        const card = document.createElement('div');
        card.className = 'p-card reveal-up';
        card.style.transitionDelay = (i % 6) * 0.05 + 's';
        card.innerHTML = `
          <div class="p-thumb-wrap">
            <div class="p-thumb" style="background-image:url('${item.image}');"></div>
            <div class="p-shine"></div>
            <span class="p-cat-badge">${esc(item.category)}</span>
          </div>
        `;
        card.addEventListener('click', ()=> openPopup(item));
        bindHoverGrow(card);
        grid.appendChild(card);
        revealObserver.observe(card);
      });
    }

    if(viewMoreWrap) viewMoreWrap.style.display = shouldLimit ? 'flex' : 'none';
  }

  function renderMarquee(){
    const row1 = document.getElementById('marqueeRow1');
    const row2 = document.getElementById('marqueeRow2');
    if(portfolioItems.length === 0) return;
    const set = portfolioItems.map(item => item.image);

    function buildRow(el, items){
      const doubled = [...items, ...items];
      el.innerHTML = doubled.map(img => `<div class="marquee-thumb" style="background-image:url('${img}');"></div>`).join('');
    }
    if(row1) buildRow(row1, set);
    if(row2) buildRow(row2, [...set].reverse());
  }

  function renderPortfolio(portfolio){
    portfolioItems = (portfolio && portfolio.items) ? portfolio.items : [];
    renderMarquee();
    renderPortfolioPills();
    renderPortfolioGrid();

    const viewMoreBtn = document.getElementById('viewMoreBtn');
    if(viewMoreBtn){
      viewMoreBtn.addEventListener('click', ()=>{
        expanded = true;
        renderPortfolioGrid();
        refreshMagnetic();
        refreshHoverTargets();
      });
    }
  }

  /* =========================================================
     INIT — load every JSON file, then render everything
     ========================================================= */
  async function init(){
    renderBrand();

    const [hero, stats, services, pricing, portfolio] = await Promise.all([
      loadJSON('assets/data/hero.json'),
      loadJSON('assets/data/stats.json'),
      loadJSON('assets/data/services.json'),
      loadJSON('assets/data/pricing.json'),
      loadJSON('assets/data/portfolio.json')
    ]);

    renderHero(hero);
    renderHeroStats(stats && stats.overallStats);
    renderCaseStudies(stats && stats.caseStudies);
    renderServices(services);
    renderPricing(pricing);
    renderPortfolio(portfolio);

    // Everything above is now in the DOM — wire up cursor / magnetic / reveal / counters.
    refreshHoverTargets();
    refreshMagnetic();
    refreshReveal();
    refreshHeroCounters();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  }else{
    init();
  }

})();
