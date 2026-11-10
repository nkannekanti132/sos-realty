/* Janardhan Vangala / SOS Realty Group — frontend-only interactive experience.
   All data is fictional demo content served by window.MockAPI (mock-backend.js).
   Uses photographs and accessible controls; no 3D or canvas scene. */
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const money = value => new Intl.NumberFormat('en-US', {style:'currency',currency:'USD',maximumFractionDigits:0}).format(value);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const modal = $('#appModal');
  const modalBody = $('#modalBody');
  let reviewIndex = 0;
  let currentCategory = 'all';
  let currentCity = '';
  let toastTimer;
  const areaInfo = {
    'Las Vegas':{tag:'CITY ENERGY',title:'An iconic city with room to make it yours.',text:'Explore Las Vegas Valley neighborhoods, entertainment and desert scenery.'},
    'Henderson':{tag:'PARKS & LAKE MEAD',title:'Community life with scenic mountain views.',text:'Master-planned living and access to parks, trails and Lake Mead.'},
    'North Las Vegas':{tag:'ROOM TO GROW',title:'New possibilities beneath wide desert skies.',text:'Growing neighborhoods, local parks and everyday convenience.'},
    'Boulder City':{tag:'HISTORIC CHARACTER',title:'Small-town charm, lakeside adventures.',text:'Explore Boulder City history and the beautiful Lake Mead landscape.'}
  };
  const guideInfo = {
    buyers: {eyebrow:'THE BUYER’S EDIT',title:'Find your place. On your terms.',intro:'A thoughtful home search starts long before the first showing.',steps:['Start with your monthly budget, not just a listing price.','Get a mortgage pre-approval to understand your options.','Explore neighborhoods at different times of the day.','Tour with an eye for layout, condition, and long-term needs.','Use a local professional to understand contingencies and closing costs.']},
    sellers: {eyebrow:'SELL BEAUTIFULLY',title:'Make your next move a great one.',intro:'The little things, handled intentionally, can make an outsized difference.',steps:['Review neighborhood sales and your home’s distinctive features.','Address simple repairs and create a welcoming first impression.','Plan photography, staging, and a compelling marketing story.','Choose a pricing strategy based on current local market conditions.','Review offers holistically—not just the headline price.']}
  };
  function toast(message) {
    const node = $('#toast');
    node.textContent = message;
    node.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove('visible'), 3400);
  }
  function openModal(html) {
    modalBody.innerHTML = html;
    modal.showModal();
    document.body.classList.add('modal-open');
    $('#modalClose').focus({preventScroll:true});
  }
  function closeModal() { if (modal.open) modal.close(); }
  $('#modalClose').addEventListener('click', closeModal);
  modal.addEventListener('close', () => document.body.classList.remove('modal-open'));
  modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });

  function initPage() {
    const header = $('#siteHeader');
    const menu = $('#mobileMenu');
    const toggle = $('#menuToggle');
    const updateScroll = () => {
      header.classList.toggle('scrolled', scrollY > 80);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      $('#progress').style.width = `${Math.max(0, max ? scrollY / max * 100 : 0)}%`;
      const statement = $('.statement-photo');
      if (statement && !reducedMotion) {
        const rect = $('.statement-section').getBoundingClientRect();
        if (rect.top < innerHeight && rect.bottom > 0) {
          const amt = (innerHeight/2 - (rect.top + rect.height/2))/innerHeight;
          statement.style.transform = `scale(1.09) translateY(${amt*21}px)`;
        }
      }
    };
    window.addEventListener('scroll', updateScroll, {passive:true});
    updateScroll();
    const setMenu = (open) => {
      menu.classList.toggle('is-open', open);
      menu.setAttribute('aria-hidden', String(!open));
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('menu-open', open);
    };
    toggle.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
    $$('a', menu).forEach(link => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', e => { if(e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false); });
    $('#year').textContent = new Date().getFullYear();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
      });
    }, {threshold:.09,rootMargin:'0px 0px 45px 0px'});
    $$('.reveal').forEach(e => observer.observe(e));
    const metricsObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        metricsObserver.unobserve(entry.target);
        const target = Number(entry.target.dataset.count);
        if (reducedMotion) return;
        const started = performance.now();
        const animate = now => {
          const t = Math.min(1, (now - started)/1700);
          const eased = 1-Math.pow(1-t,4);
          entry.target.textContent = `${entry.target.dataset.prefix||''}${Math.round(target*eased)}${entry.target.dataset.suffix||''}`;
          if (t < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      });
    },{threshold:.65});
    $$('[data-count]').forEach(e => metricsObserver.observe(e));
  }

  function cardFor(listing, favorites) {
    const saved = favorites.includes(listing.id);
    return `<article class="listing-card" data-id="${listing.id}">
      <button class="listing-card-image" type="button" data-open-listing="${listing.id}" aria-label="View ${listing.name}">
        <img src="${listing.image}" alt="Architectural illustration of ${listing.name}" loading="lazy" />
      </button>
      <button class="favorite-button ${saved?'is-saved':''}" type="button" data-favorite="${listing.id}" aria-label="${saved?'Remove from':'Add to'} favorites" aria-pressed="${saved}">${saved?'♥':'♡'}</button>
      <div class="listing-body"><span class="listing-tag label-outside-photo">${listing.tag}</span><span class="listing-price">${money(listing.price)}</span><h3>${listing.name}</h3><span class="listing-location">${listing.address}</span>
        <div class="listing-features"><span>⌂ <b>${listing.beds}</b> beds</span><span>◫ <b>${listing.baths}</b> baths</span><span>◇ <b>${listing.sqft.toLocaleString()}</b> sq ft</span></div>
        <button class="listing-open" data-open-listing="${listing.id}" type="button">VIEW PROPERTY <span>↗</span></button>
      </div></article>`;
  }
  async function renderListings() {
    const grid = $('#listingGrid');
    const results = await MockAPI.getListings({category:currentCategory,city:currentCity});
    grid.innerHTML = results.length ? results.map(h => cardFor(h, MockAPI.getFavorites())).join('') : `<div class="listing-empty"><h3>No properties match just yet.</h3><p>Try another category or neighborhood.</p><button type="button" class="btn btn-dark" id="resetFilter">Show all homes <span>↗</span></button></div>`;
    $$('#listingFilters button').forEach(btn => btn.classList.toggle('active',btn.dataset.filter === currentCategory));
    $('.filter-search').innerHTML = `<span>⌕</span> ${currentCity ? currentCity+' · clear or change' : 'Search by area'} <span>↗</span>`;
    if (!results.length) $('#resetFilter').addEventListener('click', () => {currentCategory='all';currentCity='';renderListings();});
    $$('.listing-card-image img').forEach(img => {
      // Stock photos can be introduced later; keep the local fallback.
      // Real photography can be switched in after licensed assets are supplied.
      img.addEventListener('error', () => {img.style.background='#9fac9d';});
    });
  }
  function listingModal(listing) {
    openModal(`<div class="modal-property">
      <div class="modal-property-image" style="background-image:url('${listing.image}')"><span>ILLUSTRATIVE DEMO LISTING · NOT FOR SALE</span></div>
      <div class="modal-property-copy"><span class="mini-label">${listing.tag} · ${listing.city.toUpperCase()}</span><h2 id="modalTitle">${listing.name}</h2><span class="modal-price">${money(listing.price)}</span>
      <p>${listing.description}</p><div class="modal-detail-grid"><span>BEDROOMS<strong>${listing.beds}</strong></span><span>BATHROOMS<strong>${listing.baths}</strong></span><span>SQUARE FEET<strong>${listing.sqft.toLocaleString()}</strong></span></div>
      <p>Explore your next chapter in ${listing.city}. This is an example property for interface demonstration only.</p>
      <div class="modal-actions"><button type="button" class="btn btn-dark" id="modalInquiry">Ask about homes like this <span class="btn-arrow">↗</span></button><button type="button" class="btn modal-secondary" id="modalFavorite">${MockAPI.getFavorites().includes(listing.id)?'♥ Saved':'♡ Save home'}</button></div></div></div>`);
    $('#modalInquiry').addEventListener('click', () => {
      closeModal();
      $('#contactForm [name=intent]').value='buy';
      $('#contactForm [name=message]').value=`I'm interested in homes like ${listing.name} in ${listing.city}.`;
      $('#contact').scrollIntoView({behavior:reducedMotion?'auto':'smooth'});
    });
    $('#modalFavorite').addEventListener('click', () => {
      const favorites=MockAPI.toggleFavorite(listing.id);
      $('#modalFavorite').textContent = favorites.includes(listing.id) ? '♥ Saved' : '♡ Save home';
      renderListings();
      toast(favorites.includes(listing.id)?'Home saved to your demo favorites.':'Home removed from your demo favorites.');
    });
  }
  function searchModal() {
    openModal(`<div class="modal-simple"><span class="mini-label">FIND YOUR PLACE</span><h2 id="modalTitle">Where does your story begin?</h2><p>Browse our sample collection by neighborhood and discover a home that fits your next chapter.</p>
    <form class="modal-form" id="areaSearch"><label>SELECT AN AREA<select id="citySelect" aria-label="Select a neighborhood"><option value="">All four Las Vegas Valley communities</option>${['Las Vegas','Henderson','North Las Vegas','Boulder City'].map(s=>`<option value="${s}" ${currentCity===s?'selected':''}>${s}</option>`).join('')}</select></label><button type="submit" class="btn btn-dark">Explore homes <span class="btn-arrow">↗</span></button></form></div>`);
    $('#areaSearch').addEventListener('submit', e => {e.preventDefault();currentCity=$('#citySelect').value;closeModal();renderListings();$('#homes').scrollIntoView({behavior:reducedMotion?'auto':'smooth'});});
  }
  function areaModal(area) {
    const info=areaInfo[area];
    openModal(`<div class="modal-simple"><div class="modal-area-art scene-placeholder"></div><span class="mini-label">${info.tag} · LAS VEGAS VALLEY</span><h2 id="modalTitle">${area}.<br><em>${info.title}</em></h2><p>${info.text}</p><p>Explore a sample of homes in this community, or get in touch for neighborhood-specific guidance.</p><div class="modal-actions"><button class="btn btn-dark" id="showAreaHomes">Explore ${area} homes <span>↗</span></button><button class="btn modal-secondary" id="askArea">Ask about ${area} <span>↗</span></button></div></div>`);
    $('#showAreaHomes').addEventListener('click',()=>{currentCity=area;currentCategory='all';closeModal();renderListings();$('#homes').scrollIntoView({behavior:reducedMotion?'auto':'smooth'});});
    $('#askArea').addEventListener('click',()=>{closeModal();$('#contactForm [name=message]').value=`I'd love to learn more about the ${area} real estate market.`;$('#contact').scrollIntoView({behavior:reducedMotion?'auto':'smooth'});});
  }
  function valuationModal() {
    openModal(`<div class="modal-simple"><span class="mini-label">START WITH A CONVERSATION</span><h2 id="modalTitle">Curious what your home could be worth?</h2><p>Tell us a little about your property. This demo saves the request locally; no automatic valuation is generated and no request is sent.</p>
      <form class="modal-form" id="valuationForm"><label>PROPERTY ADDRESS<input type="text" name="address" required placeholder="Street address, city, ZIP" /></label><div class="input-row"><label>YOUR NAME<input type="text" name="name" required placeholder="Full name" /></label><label>EMAIL ADDRESS<input type="email" name="email" required placeholder="you@example.com" /></label></div><button type="submit" class="btn btn-dark">Save valuation request <span>↗</span></button><p class="modal-status" id="valuationStatus" role="status"></p></form></div>`);
    $('#valuationForm').addEventListener('submit', async e => {
      e.preventDefault();const form=e.currentTarget;if(!form.reportValidity())return;
      const data=Object.fromEntries(new FormData(form));
      const status=$('#valuationStatus');status.textContent='Saving your demo request...';
      await MockAPI.saveInquiry({...data,intent:'valuation'});
      status.textContent='Saved locally for this demo. No message was sent.';
      form.reset();
      toast('Valuation request saved locally.');
    });
  }
  function guideModal(key) {
    const g=guideInfo[key];
    openModal(`<div class="modal-simple modal-guide"><span class="mini-label">${g.eyebrow}</span><h2 id="modalTitle">${g.title}</h2><p>${g.intro}</p><ul>${g.steps.map(s=>`<li>${s}</li>`).join('')}</ul><p>Every purchase or sale is different. Get in touch for tailored guidance on your own move.</p><div class="modal-actions"><button type="button" class="btn btn-dark" id="guideContact">Let's talk about your plans <span>↗</span></button></div></div>`);
    $('#guideContact').addEventListener('click',()=>{closeModal();$('#contact').scrollIntoView({behavior:reducedMotion?'auto':'smooth'});});
  }
  function calculatorModal() {
    openModal(`<div class="modal-simple"><span class="mini-label">PAYMENT ESTIMATOR · DEMO TOOL</span><h2 id="modalTitle">Know your numbers.</h2><p>Adjust the figures to see an illustrative monthly principal-and-interest payment.</p>
      <div class="calculator-fields"><label>HOME PRICE ($)<input id="calcPrice" type="number" min="1" max="100000000" step="1000" value="650000" /></label><label>DOWN PAYMENT (%)<input id="calcDown" type="number" min="0" max="100" step="1" value="20" /></label><label>INTEREST RATE (%)<input id="calcRate" type="number" min="0" max="30" step=".1" value="6.5" /></label><label>LOAN TERM (YEARS)<input id="calcTerm" type="number" min="1" max="40" step="1" value="30" /></label></div>
      <div class="calculator-result"><span>ESTIMATED MONTHLY PRINCIPAL + INTEREST</span><strong id="calcTotal">$0</strong></div><p class="calculator-disclaimer">Estimate only. Excludes taxes, insurance, HOA fees, PMI, and other expenses. Not a lender quote or financing offer.</p></div>`);
    const calculate = () => {
      const price=Number($('#calcPrice').value), down=Number($('#calcDown').value), rate=Number($('#calcRate').value), term=Number($('#calcTerm').value);
      const output=$('#calcTotal');
      if (!(price>0) || down<0 || down>100 || rate<0 || rate>30 || !(term>=1&&term<=40)) {output.textContent='Check inputs';return;}
      const principal=price*(1-down/100), monthlyRate=rate/1200, months=term*12;
      const payment=monthlyRate===0?principal/months:principal*(monthlyRate*Math.pow(1+monthlyRate,months))/(Math.pow(1+monthlyRate,months)-1);
      output.textContent=money(Math.round(payment));
    };
    $$('.calculator-fields input').forEach(e=>e.addEventListener('input',calculate));calculate();
  }
  function initInteractions() {
    $('#listingFilters').addEventListener('click',e=>{
      const btn=e.target.closest('[data-filter]');if(!btn)return;
      currentCategory=btn.dataset.filter;
      renderListings();
    });
    $('#searchOpen').addEventListener('click',()=>window.RealEstateStudio?.open('search'));
    $('#listingGrid').addEventListener('click',async e=>{
      const favorite=e.target.closest('[data-favorite]');
      if(favorite){const id=Number(favorite.dataset.favorite),favorites=MockAPI.toggleFavorite(id);favorite.classList.toggle('is-saved',favorites.includes(id));favorite.textContent=favorites.includes(id)?'♥':'♡';favorite.setAttribute('aria-pressed',String(favorites.includes(id)));favorite.setAttribute('aria-label',favorites.includes(id)?'Remove from favorites':'Add to favorites');toast(favorites.includes(id)?'Saved to your demo favorites.':'Removed from favorites.');return;}
      const button=e.target.closest('[data-open-listing]');if(button){const listing=await MockAPI.getListing(button.dataset.openListing);if(listing)listingModal(listing);}
    });
    $$('.area-card').forEach(card=>card.addEventListener('click',()=>window.RealEstateStudio?.open('community-detail',{city:card.dataset.area})));
    $('#valueCard')?.addEventListener('click',()=>window.RealEstateStudio?.open('valuation'));
    $$('.resource-card').forEach(card=>card.addEventListener('click',()=>card.dataset.resource==='calculator'?calculatorModal():guideModal(card.dataset.resource)));
    $('#reviewPrev')?.addEventListener('click',()=>changeReview(-1));
    $('#reviewNext')?.addEventListener('click',()=>changeReview(1));
    $('#contactForm').addEventListener('submit',async e=>{
      e.preventDefault();const form=e.currentTarget;const status=$('#formStatus');
      if(!form.reportValidity()){status.textContent='Please complete your name, email, and the type of move.';status.classList.add('error');return;}
      const button=$('button[type=submit]',form);button.disabled=true;button.querySelector('span').textContent='Saving...';status.textContent='';status.classList.remove('error');
      try{await MockAPI.saveInquiry(Object.fromEntries(new FormData(form)));status.textContent='Your message has been saved in this demo browser. No email was sent.';form.reset();toast('Demo message saved locally.');}
      catch{status.textContent='Could not save the demo message. Please try again.';status.classList.add('error');}
      finally{button.disabled=false;button.querySelector('span').textContent='Send your message';}
    });
  }
  function changeReview(offset) {
    reviewIndex=(reviewIndex+offset+MockAPI.testimonials.length)%MockAPI.testimonials.length;
    const review=MockAPI.testimonials[reviewIndex];
    $('#reviewText').textContent=review.quote;$('#reviewName').textContent=review.name;$('#reviewRole').textContent=review.role;
    $('#reviewAvatar').textContent=review.name[0];
    $('#reviewCount').textContent=`${String(reviewIndex+1).padStart(2,'0')} / ${String(MockAPI.testimonials.length).padStart(2,'0')}`;
  }

  document.addEventListener('DOMContentLoaded',()=>{initPage();initInteractions();renderListings();});
})();
