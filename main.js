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
