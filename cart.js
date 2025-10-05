// ============================
// CART FUNCTIONALITY
// ============================

// Retrieve cart from localStorage
const getCart = () => JSON.parse(localStorage.getItem("cart")) || [];

// Save cart to localStorage
const setCart = (cart) => localStorage.setItem("cart", JSON.stringify(cart));

// Render cart items
const renderCart = () => {
  const cart = getCart();
  const cartContainer = document.querySelector(".cart-container");
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div style="text-align:center; padding:4rem;">
        <h2>Your cart is empty 🛒</h2>
        <p style="color:#555; margin:10px 0 20px;">Add some products to continue shopping!</p>
        <a href="products.html" style="
          background:#000;
          color:#fff;
          padding:12px 24px;
          border-radius:30px;
          text-decoration:none;
          font-weight:600;
          transition:0.3s;">Browse Products</a>
      </div>`;
    return;
  }

  // Items Section
  const itemsSection = document.createElement("div");
  itemsSection.className = "cart-items-section";

  cart.forEach((item) => {
    const imgSrc = item.image || "images/placeholder.jpg";
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";

    itemDiv.innerHTML = `
      <img src="${imgSrc}" alt="${item.name}">
      <div class="item-details">
        <h3>${item.name}</h3>
        <p class="item-price">₦${item.price.toLocaleString()} each</p>
        <div class="quantity">
          <button class="minus-btn" data-id="${item.id}">−</button>
          <span>${item.quantity}</span>
          <button class="plus-btn" data-id="${item.id}">+</button>
        </div>
      </div>
      <div class="item-actions">
        <p class="price">₦${(item.price * item.quantity).toLocaleString()}</p>
        <button class="remove-btn" data-id="${item.id}">Remove</button>
      </div>
    `;

    itemsSection.appendChild(itemDiv);
  });

  // Totals Section
  const subtotal = cart.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const shipping = subtotal > 0 ? 1500 : 0;
  const total = subtotal + shipping;

  const summaryDiv = document.createElement("div");
  summaryDiv.className = "cart-summary";
  summaryDiv.innerHTML = `
    <div>
      <div class="summary-row"><span>Subtotal</span><span>₦${subtotal.toLocaleString()}</span></div>
      <div class="summary-row"><span>Delivery Fee</span><span>₦${shipping.toLocaleString()}</span></div>
      <hr style="margin:10px 0;">
      <div class="summary-row total"><span>Total</span><span>₦${total.toLocaleString()}</span></div>
    </div>
    <button class="checkout-btn" id="proceedOrderBtn">Proceed to Checkout</button>
  `;

  cartContainer.appendChild(itemsSection);
  cartContainer.appendChild(summaryDiv);

  attachEvents();
};

// Button Events
const attachEvents = () => {
  document.querySelectorAll(".minus-btn").forEach(btn =>
    btn.addEventListener("click", () => updateQuantity(btn.dataset.id, -1))
  );
  document.querySelectorAll(".plus-btn").forEach(btn =>
    btn.addEventListener("click", () => updateQuantity(btn.dataset.id, 1))
  );
  document.querySelectorAll(".remove-btn").forEach(btn =>
    btn.addEventListener("click", () => removeItem(btn.dataset.id))
  );

  const proceedBtn = document.getElementById("proceedOrderBtn");
  if (proceedBtn) {
    proceedBtn.addEventListener("click", () => {
      window.location.href = "checkout.html";
    });
  }
};

// Quantity Updates
const updateQuantity = (id, change) => {
  let cart = getCart();
  const item = cart.find(it => it.id == id);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) cart = cart.filter(it => it.id != id);
    setCart(cart);
    renderCart();
  }
};

// Remove item
const removeItem = (id) => {
  let cart = getCart().filter(it => it.id != id);
  setCart(cart);
  renderCart();
};

// Run when page loads
document.addEventListener("DOMContentLoaded", renderCart);