// Tự động scale trang theo tỷ lệ màn hình để tránh lỗi responsive trên các máy tính lạ
// Mobile Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
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
    btn.addEventListener('click', ()=> menu.classList.add('hidden'));
    // Close on ESC
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape') menu.classList.add('hidden');
    });
    // Close after clicking a link
    menu.querySelectorAll('a[href]').forEach(a=>{
      a.addEventListener('click', ()=> menu.classList.add('hidden'));
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