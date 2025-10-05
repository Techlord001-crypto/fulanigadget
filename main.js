/* ==============================
ZEERID INTERNATIONAL CONCEPTS
Hamburger Menu JavaScript
============================== */

// Get elements
const hamburger = document.querySelector('.hamburger');
const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu-overlay a');

// Toggle mobile menu
hamburger.addEventListener('click', () => {
  mobileMenuOverlay.classList.toggle('active');
  hamburger.classList.toggle('active');
 
  // Prevent body scroll when menu is open
  document.body.style.overflow = mobileMenuOverlay.classList.contains('active') ? 'hidden' : '';
});

// Close menu when clicking on a link
mobileMenuLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenuOverlay.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// Close menu when clicking outside
mobileMenuOverlay.addEventListener('click', (e) => {
  if (e.target === mobileMenuOverlay) {
    mobileMenuOverlay.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Optional: Animate hamburger icon
// Add this CSS to make the hamburger transform into an X
const style = document.createElement('style');
style.textContent = `
  .hamburger.active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }
 
  .hamburger.active span:nth-child(2) {
    opacity: 0;
  }
 
  .hamburger.active span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
  }
`;
document.head.appendChild(style);