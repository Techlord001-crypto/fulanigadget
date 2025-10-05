(function() {
  'use strict';

  // Helper functions for localStorage
  function getCart() {
    try {
      const cart = localStorage.getItem('cart');
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Error reading cart:', error);
      return [];
    }
  }

  function setCart(cart) {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
      console.log('Cart updated:', cart);
      return true;
    } catch (error) {
      console.error('Error saving cart:', error);
      return false;
    }
  }

  // Add item to cart
  function addItemToCart(id, name, price, image) {
    console.log('Adding to cart:', { id, name, price, image });
   
    // Validate all required fields
    if (!id || !name || !price || isNaN(price)) {
      console.error('Invalid item data:', { id, name, price, image });
      showNotification('Error: Invalid item data', 'error');
      return false;
    }
   
    let cart = getCart();
    const existingItem = cart.find(item => item.id === id);
   
    if (existingItem) {
      existingItem.quantity += 1;
      console.log('Item already exists, increased quantity to:', existingItem.quantity);
    } else {
      cart.push({
        id: id,
        name: name,
        price: price,
        image: image,
        quantity: 1
      });
      console.log('New item added to cart');
    }
   
    setCart(cart);
    console.log('Updated cart:', cart);
    return true;
  }

  // Show success notification
  function showNotification(message, type) {
    type = type || 'success';
    const alertDiv = document.createElement('div');
    alertDiv.textContent = message;
    alertDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#0a0a0' : '#dc3545'};
      color: #0a0a0aff;
      padding: 15px 25px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 9999;
      font-size: 1rem;
      font-weight: 600;
      max-width: 300px;
    `;
   
    document.body.appendChild(alertDiv);
   
    setTimeout(() => {
      alertDiv.style.transition = 'opacity 0.4s, transform 0.4s';
      alertDiv.style.opacity = '0';
      alertDiv.style.transform = 'translateX(400px)';
      setTimeout(() => alertDiv.remove(), 400);
    }, 2500);
  }

  // Initialize menu functionality
  document.addEventListener('DOMContentLoaded', function() {
    console.log('Menu page loaded');
    console.log('Current cart:', getCart());
   
    const cartButtons = document.querySelectorAll('.add-cart-btn');
    console.log('Found cart buttons:', cartButtons.length);
   
    cartButtons.forEach((btn, index) => {
      console.log(`Setting up button ${index + 1}`);
     
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Button clicked!');
       
        const card = e.target.closest('.menu-card');
       
        if (!card) {
          console.error('Menu card not found!');
          showNotification('Error: Menu card not found', 'error');
          return;
        }
       
        // Get item data with validation
        const idAttr = card.getAttribute('data-id');
        const nameElement = card.querySelector('h3');
        const priceElement = card.querySelector('strong');
        const imgElement = card.querySelector('img');
       
        console.log('Elements found:', {
          idAttr: idAttr,
          nameElement: !!nameElement,
          priceElement: !!priceElement,
          imgElement: !!imgElement
        });
       
        if (!idAttr || !nameElement || !priceElement || !imgElement) {
          console.error('Missing required elements in card');
          showNotification('Error: Missing product information', 'error');
          return;
        }
       
        const id = parseInt(idAttr);
        const name = nameElement.textContent.trim();
        const priceText = priceElement.textContent.trim();
        const image = imgElement.getAttribute('src') || imgElement.src;
       
        console.log('Price text before parsing:', priceText);
       
        // Extract price - handle different formats
        let price = 0;
        const priceMatch = priceText.match(/[\d,]+/);
        if (priceMatch) {
          price = parseInt(priceMatch[0].replace(/,/g, ''));
        }
       
        console.log('Extracted item data:', { id, name, price, image });
       
        // Final validation
        if (isNaN(id) || !name || isNaN(price) || price <= 0) {
          console.error('Invalid item data after extraction:', { id, name, price });
          showNotification('Error: Invalid product data', 'error');
          return;
        }
       
        // Add to cart
        const success = addItemToCart(id, name, price, image);
       
        if (success) {
          showNotification(`${name} added to cart!`, 'success');
         
          // Animate button with GSAP if available
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(btn,
              { scale: 1 },
              {
                scale: 1.15,
                backgroundColor: "#0a0a0aff",
                duration: 0.2,
                yoyo: true,
                repeat: 1,
                onComplete: function() {
                  btn.style.backgroundColor = "";
                }
              }
            );
          }
         
          // Change button text temporarily
          const originalText = btn.textContent;
          btn.textContent = "✓ Added!";
          btn.style.background = "#0a0a0aff";
         
          setTimeout(function() {
            btn.textContent = originalText;
            btn.style.background = "";
          }, 1500);
        }
      });
    });
   
    // GSAP 3D tilt effect for menu cards (if GSAP is loaded)
    if (typeof gsap !== 'undefined') {
      document.querySelectorAll('.menu-card').forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          gsap.to(card, {
            rotationY: ((x / rect.width) - 0.5) * 8,
            rotationX: ((y / rect.height) - 0.5) * -8,
            scale: 1.04,
            duration: 0.3,
            transformPerspective: 1000
          });
        });
       
        card.addEventListener('mouseleave', function() {
          gsap.to(card, {
            rotationY: 0,
            rotationX: 0,
            scale: 1,
            duration: 0.3
          });
        });
      });
    }
  });

  // Testing functions (accessible from browser console)
  window.testCart = function() {
    console.log('Current cart:', getCart());
    console.log('Cart items count:', getCart().length);
  };

  window.clearTestCart = function() {
    localStorage.removeItem('cart');
    console.log('Cart cleared!');
  };

  console.log('Menu.js loaded successfully!');
})();