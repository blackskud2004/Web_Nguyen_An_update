// Tự động scale trang theo tỷ lệ màn hình để tránh lỗi responsive trên các máy tính lạ
// Mobile Menu Toggle with focus-trap and background inert behavior
let menuToggle = null;
let mobileMenu = null;
function openMobileMenu(){
  if(!mobileMenu) return;
  console.log('openMobileMenu called');
  try{ mobileMenu.style.display = 'block'; }catch(e){}
  mobileMenu.setAttribute('aria-hidden','false');
  mobileMenu.classList.remove('hidden');
  document.body.classList.add('menu-open');
  // Move focus into the menu BEFORE hiding the main content.
  // This prevents the browser warning when a focused element becomes aria-hidden.
  const firstFocusable = mobileMenu.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if(firstFocusable){
    try{ firstFocusable.focus(); }catch(e){}
  } else {
    // make the menu itself focusable temporarily and focus it
    try{ if(!mobileMenu.hasAttribute('tabindex')) mobileMenu.setAttribute('data-added-tabindex','true'); mobileMenu.setAttribute('tabindex','-1'); mobileMenu.focus(); }catch(e){}
  }

  // mark main content as inert (aria-hidden) to assistive tech
  const main = document.getElementById('home');
  if(main) main.setAttribute('aria-hidden','true');
  // disable interactions outside menu (robust fallback)
  disableOutsideInteraction();
  // trap focus inside menu
  document.addEventListener('focus', focusTrap, true);
  // prevent touchmove/scroll on background for mobile
  document.addEventListener('touchmove', preventTouchMove, { passive: false });
  // overlay click closes menu
  const overlay = document.querySelector('#mobile-menu .overlay-strong');
  if(overlay) overlay.addEventListener('click', closeMobileMenu);
}
function closeMobileMenu(){
  if(!mobileMenu) return;
  console.log('closeMobileMenu called');
  try{ mobileMenu.style.display = 'none'; }catch(e){}
  mobileMenu.setAttribute('aria-hidden','true');
  mobileMenu.classList.add('hidden');
  document.body.classList.remove('menu-open');
  const main = document.getElementById('home');
  if(main) main.removeAttribute('aria-hidden');
  // restore interactions outside menu
  restoreOutsideInteraction();
  // cleanup any tabindex we added to the menu itself
  try{
    if(mobileMenu && mobileMenu.getAttribute('data-added-tabindex') === 'true'){
      mobileMenu.removeAttribute('tabindex');
      mobileMenu.removeAttribute('data-added-tabindex');
    }
  }catch(e){}
  document.removeEventListener('focus', focusTrap, true);
  document.removeEventListener('touchmove', preventTouchMove, { passive: false });
  const overlay = document.querySelector('#mobile-menu .overlay-strong');
  if(overlay) overlay.removeEventListener('click', closeMobileMenu);
  // return focus to hamburger button
  if(menuToggle) menuToggle.focus();
}
function focusTrap(e){
  if(!mobileMenu.contains(e.target)){
    e.stopPropagation();
    // redirect to menu
    const first = mobileMenu.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if(first) first.focus();
  }
}
// Initialize mobile menu after DOM is ready so elements exist
function initMobileMenu(){
  menuToggle = document.getElementById('menu-toggle');
  mobileMenu = document.getElementById('mobile-menu');
  if(menuToggle) menuToggle.addEventListener('click', openMobileMenu);

  // Close handlers: close button, ESC, clicking links inside menu
  const btn = document.getElementById('mobile-menu-close');
  if(btn) btn.addEventListener('click', ()=> closeMobileMenu());
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeMobileMenu(); });
  if(mobileMenu){
    mobileMenu.querySelectorAll('a[href]').forEach(a=> a.addEventListener('click', ()=> closeMobileMenu()));
  }
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', initMobileMenu);
} else {
  // DOM already ready
  initMobileMenu();
}

// Keep track of modifications so we can restore them
window.__outsideMenuState = window.__outsideMenuState || { items: [] };
function disableOutsideInteraction(){
  const bodyChildren = Array.from(document.body.children);
  window.__outsideMenuState.items = [];
  bodyChildren.forEach(el =>{
    if(el.id === 'mobile-menu') return;
    const prev = { el, pointerEvents: el.style.pointerEvents || '', ariaHidden: el.getAttribute('aria-hidden'), tabIndexMods: [] };
    // set pointer-events none
    el.style.pointerEvents = 'none';
    // mark aria-hidden
    el.setAttribute('aria-hidden','true');
    // remove focusability from any focusable children
    const focusables = el.querySelectorAll('a, button, input, select, textarea, [tabindex]');
    focusables.forEach(f=>{
      const old = f.getAttribute('tabindex');
      prev.tabIndexMods.push({ f, old });
      try{ f.setAttribute('tabindex','-1'); }catch(e){}
    });
    window.__outsideMenuState.items.push(prev);
  });
}
function restoreOutsideInteraction(){
  if(!window.__outsideMenuState || !window.__outsideMenuState.items) return;
  window.__outsideMenuState.items.forEach(item=>{
    try{ item.el.style.pointerEvents = item.pointerEvents || ''; }catch(e){}
    if(item.ariaHidden===null) item.el.removeAttribute('aria-hidden'); else item.el.setAttribute('aria-hidden', item.ariaHidden);
    item.tabIndexMods.forEach(mod=>{
      if(mod.old===null) mod.f.removeAttribute('tabindex'); else mod.f.setAttribute('tabindex', mod.old);
    });
  });
  window.__outsideMenuState.items = [];
}

function preventTouchMove(e){
  // if touch is outside the menu, prevent default to stop background scroll
  if(!mobileMenu) return;
  if(!mobileMenu.contains(e.target)){
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
}


// Form Submission Handling
const contactForm = document.getElementById('contact-form');
if (contactForm) contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    alert(`Thank you, ${name}! Your message has been sent.`);
    contactForm.reset();
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const counters = document.querySelectorAll('.project-counter');
counters.forEach(counter => {
  const updateCount = () => {
    const target = +counter.getAttribute('data-target');
    const count = +counter.innerText;
    const increment = target / 200;
    if (count < target) {
      counter.innerText = Math.ceil(count + increment);
      setTimeout(updateCount, 1);
    } else {
      counter.innerText = target; // Cần sửa để thêm '+'
    }
  };
  updateCount();
});  
  
  // Responsive: Detect screen resolution and add class to body
  window.addEventListener('DOMContentLoaded', function() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    if (width <= 480) {
      document.body.classList.add('mobile');
      // Xử lý cho mobile
    } else if (width <= 768) {
      document.body.classList.add('tablet');
      // Xử lý cho tablet
    } else if (width <= 1024) {
      document.body.classList.add('small-desktop');
      // Xử lý cho desktop nhỏ
    } else {
      document.body.classList.add('large-desktop');
      // Xử lý cho desktop lớn
    }

    console.log('Width:', width, 'Height:', height);
  });

// Auto-hide update modal if present to avoid blocking clicks on mobile menu
window.addEventListener('DOMContentLoaded',()=>{const m=document.getElementById('update-modal');if(m){m.style.display='none';}});


// Mobile menu close handling
(function(){
  const menu = document.getElementById('mobile-menu');
  const btn = document.getElementById('mobile-menu-close');
  if (menu && btn){
    btn.addEventListener('click', ()=> closeMobileMenu());
    // Close on ESC
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape') closeMobileMenu();
    });
    // Close after clicking a link
    menu.querySelectorAll('a[href]').forEach(a=>{
      a.addEventListener('click', ()=> closeMobileMenu());
    });
  }
})();

// --- CSP-compatible migration: replace common inline onclick handlers with external listeners
// This scans for elements whose inline onclick only performs simple navigation or toggles modal display
// and attaches equivalent listeners, then removes the inline attribute so CSP won't block clicks.
(function(){
  function tryParseInlineNav(code){
    // simple heuristic: window.location.href='../index.html' or location.href='../index.html'
    const m = code && code.match(/location\.href\s*=\s*['"]([^'"]+)['"]/);
    if(m) return m[1];
    const m2 = code && code.match(/window\.location\.href\s*=\s*['"]([^'"]+)['"]/);
    if(m2) return m2[1];
    return null;
  }

  function tryParseInlineModal(code){
    // heuristic: document.getElementById('id').style.display='flex' or 'none'
    const m = code && code.match(/document\.getElementById\(['\"]([^'\"]+)['\"]\)\.style\.display\s*=\s*['\"]([^'\"]+)['\"]/);
    if(m) return {id:m[1], value:m[2]};
    return null;
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    // copy elements with inline onclick to rebind safely
    document.querySelectorAll('[onclick]').forEach(el => {
      try{
        const code = el.getAttribute('onclick');
        if(!code) return;

        // navigation handlers
        const href = tryParseInlineNav(code);
        if(href){
          const handler = () => { window.location.href = href; };
          el.addEventListener('click', handler, false);
          // keyboard accessibility
          el.setAttribute('role', el.getAttribute('role') || 'link');
          if(!el.hasAttribute('tabindex')) el.setAttribute('tabindex','0');
          el.addEventListener('keydown', (ev)=>{ if(ev.key==='Enter' || ev.key===' ' || ev.key==='Spacebar'){ ev.preventDefault(); handler(); } });
          // remove the inline handler so CSP won't block
          el.removeAttribute('onclick');
          return;
        }

        // modal show/hide handlers of form document.getElementById('id').style.display='flex' or 'none'
        const modal = tryParseInlineModal(code);
        if(modal){
          const target = document.getElementById(modal.id);
          if(target){
            const handler = () => { target.style.display = modal.value; };
            el.addEventListener('click', handler, false);
            el.removeAttribute('onclick');
          }
          return;
        }

        // fallback: do not remove arbitrary inline handlers (too risky). You can log for manual review.
      }catch(e){
        console.error('Error migrating inline onclick', e);
      }
    });
  });
})();

// Also bind elements that use data-attributes for navigation/modal (so HTML files can be cleaned on disk)
document.addEventListener('DOMContentLoaded', ()=>{
  // data-href navigation (logo and similar)
  document.querySelectorAll('[data-href]').forEach(el=>{
    const href = el.getAttribute('data-href');
    if(!href) return;
    const handler = ()=> window.location.href = href;
    el.addEventListener('click', handler, false);
    if(!el.hasAttribute('role')) el.setAttribute('role','link');
    if(!el.hasAttribute('tabindex')) el.setAttribute('tabindex','0');
    el.addEventListener('keydown', (ev)=>{ if(ev.key==='Enter' || ev.key===' ' || ev.key==='Spacebar'){ ev.preventDefault(); handler(); } });
  });

  // data-open-modal / data-close-modal
  document.querySelectorAll('[data-open-modal]').forEach(btn=>{
    const id = btn.getAttribute('data-open-modal');
    if(!id) return;
    const target = document.getElementById(id);
    if(!target) return;
    btn.addEventListener('click', ()=> { target.style.display = 'flex'; }, false);
  });
  document.querySelectorAll('[data-close-modal]').forEach(btn=>{
    const id = btn.getAttribute('data-close-modal');
    if(!id) return;
    const target = document.getElementById(id);
    if(!target) return;
    btn.addEventListener('click', ()=> { target.style.display = 'none'; }, false);
  });
});