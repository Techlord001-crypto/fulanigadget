document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const summary = document.getElementById("cartSummary");
  if (summary) {
    summary.value = cart.map(it => `${it.quantity} × ${it.name} (₦${(it.price * it.quantity).toLocaleString()})`).join("\n");
  }

  const form = document.getElementById("orderForm");
  form.onsubmit = e => {
    e.preventDefault();
    const name = form.querySelector("#name").value.trim();
    const phone = form.querySelector("#phone").value.trim();
    const address = form.querySelector("#address").value.trim();
    const payment = form.querySelector("#payment").value;
    const sendmethod = form.querySelector("#sendmethod").value;
    const total = cart.reduce((sum, it) => sum + it.price * it.quantity, 0);

    if (!name || !phone || !address) return alert("Please fill all fields");

    const orderDetails = `Name: ${name}\nPhone: ${phone}\nAddress: ${address}\nPayment: ${payment}\nOrder:\n${summary.value}\nTotal: ₦${total.toLocaleString()}`;

    if (payment === "Bank Transfer") {
      alert(`💳 Transfer ₦${total.toLocaleString()} to:
Bank: Zenith Bank
Account Name: YummyTreats Naija
Account Number: 1234567890
Then send proof via WhatsApp.`);
      return;
    }

    if (payment === "Paystack") {
      const handler = PaystackPop.setup({
        key: "YOUR_PUBLIC_KEY_HERE",
        email: `${phone}@testmail.com`,
        amount: total * 100,
        currency: "NGN",
        callback: res => {
          alert(`✅ Payment successful! Ref: ${res.reference}`);
          sendOrder(sendmethod, orderDetails + `\nRef: ${res.reference}`);
        },
        onClose: () => alert("Payment window closed."),
      });
      handler.openIframe();
      return;
    }

    sendOrder(sendmethod, orderDetails);
  };

  function sendOrder(method, details) {
    if (method === "whatsapp") {
      window.open(`https://wa.me/2348012345678?text=${encodeURIComponent(details)}`, "_blank");
    } else {
      emailjs.send("your_service_id", "your_template_id", { message: details })
        .then(() => alert("Order sent via Email!"))
        .catch(() => alert("Failed to send email."));
    }
  }
});