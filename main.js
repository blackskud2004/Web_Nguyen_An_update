// Tự động scale trang theo tỷ lệ màn hình để tránh lỗi responsive trên các máy tính lạ
function autoScalePage() {
  // Tỷ lệ chuẩn là 1440px (hoặc 1920px tuỳ thiết kế gốc)
  var baseWidth = 1440;
  var w = window.innerWidth;
  var scale = w / baseWidth;
  // Chỉ scale nếu nhỏ hơn 1 (màn hình nhỏ hơn thiết kế)
  if (scale < 1) {
    document.body.style.transform = 'scale(' + scale + ')';
    document.body.style.transformOrigin = 'top left';
    document.body.style.width = (100/scale) + '%';
    document.body.style.overflowX = 'auto';
  } else {
    document.body.style.transform = '';
    document.body.style.width = '';
    document.body.style.overflowX = '';
  }
}
window.addEventListener('DOMContentLoaded', autoScalePage);
window.addEventListener('resize', autoScalePage);
// Mobile Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Form Submission Handling
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (e) => {
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
