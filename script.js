/* DriveStyle Auto Accessories
   IA#2 JavaScript*/

/* ========================
   PRODUCTS DATA
   ======================== */
let products = [
  {
    name: "Car Phone Mount",
    price: 2500,
    description: "Strong and adjustable dashboard mount for safe driving.",
    image: "phone-mount.jpeg"
  },
  {
    name: "Interior LED Light Kit",
    price: 4500,
    description: "Bright multi-color LED lighting for a modern cabin look.",
    image: "led-lights.jpeg"
  },
  {
    name: "Premium Seat Covers",
    price: 6800,
    description: "Comfortable and stylish seat covers to protect your interior.",
    image: "seat-cover.jpeg"
  },
  {
    name: "Portable Car Vacuum",
    price: 5200,
    description: "Compact vacuum cleaner for quick and easy interior cleaning.",
    image: "car-vacuum.jpeg"
  },
  {
    name: "Luxury Air Freshener",
    price: 1200,
    description: "Long-lasting fragrance to keep your car smelling fresh.",
    image: "air-freshener.jpeg"
  },
  {
    name: "Dash Cam",
    price: 9500,
    description: "Record your trips with clear video for safety and security.",
    image: "dash-cam.jpeg"
  }
];

/* ========================
   PRODUCT STORAGE FUNCTIONS
   ======================== */

// Save products to localStorage
function saveProducts() {
  localStorage.setItem("AllProducts", JSON.stringify(products));
}

// Load products from localStorage (or use default if none saved)
function loadProducts() {
  let saved = localStorage.getItem("AllProducts");
  if (saved) {
    products = JSON.parse(saved);
  } else {
    saveProducts();
  }
}

/* ========================
   PRODUCT DISPLAY FUNCTION
   ======================== */

// Show all products as cards on the page
function displayProducts() {
  let container = document.getElementById("productList");
  if (!container) return;

  container.innerHTML = "";

  for (let i = 0; i < products.length; i++) {
    let p = products[i];

    let card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML =
      "<img src='" + p.image + "' alt='" + p.name + "'>" +
      "<h2>" + p.name + "</h2>" +
      "<p>" + p.description + "</p>" +
      "<p class='price'>$" + p.price.toFixed(2) + "</p>" +
      "<button class='add-cart' data-index='" + i + "'>Add to Cart</button>";

    container.appendChild(card);
  }

  // Add click listeners to all "Add to Cart" buttons
  let buttons = document.querySelectorAll(".add-cart");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
      let index = parseInt(this.getAttribute("data-index"));
      addToCart(index);
    });
  }
}

/* ========================
   CART FUNCTIONS
   ======================== */

function getCart() {
  let cart = localStorage.getItem("cart");

  if (cart === null) {
    return [];
  }

  return JSON.parse(cart);
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Add selected product to cart
function addToCart(index) {
  let product = products[index];
  let cart = getCart();

  let existingItem = null;

  for (let i = 0; i < cart.length; i++) {
    if (cart[i].name === product.name) {
      existingItem = cart[i];
    }
  }

  if (existingItem) {
    existingItem.quantity = existingItem.quantity + 1;
    existingItem.subtotal = existingItem.quantity * existingItem.price;
  } else {
    let cartItem = {
      name: product.name,
      price: product.price,
      quantity: 1,
      subtotal: product.price
    };

    cart.push(cartItem);
  }

  saveCart(cart);
  alert(product.name + " added to cart!");

  if (document.getElementById("cartItems")) {
    displayCart();
  }

  if (document.getElementById("orderSummary")) {
    displayOrderSummary();
  }
}

function removeFromCart(index) {
  let cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  displayCart();
  displayOrderSummary();
}

/* PERSON 3 - UPDATE QUANTITY */
function updateQuantity(index, newQty) {
  let cart = getCart();

  if (newQty <= 0) {
    cart.splice(index, 1);
  } else {
    cart[index].quantity = newQty;
    cart[index].subtotal = cart[index].quantity * cart[index].price;
  }

  saveCart(cart);
  displayCart();
  displayOrderSummary();
}

/* ========================
   PRODUCT BUTTON EVENTS
   ======================== */

function setupAddToCart() {
  let buttons = document.querySelectorAll(".add-cart");

  for (let i = 0; i < buttons.length; i++) {
    let index = i;
    buttons[i].addEventListener("click", function () {
      addToCart(index);
    });
  }
}

/* ========================
   CART DISPLAY
   ======================== */

function displayCart() {
  let cartTable = document.getElementById("cartItems");
  let summary = document.querySelector(".cart-summary");

  if (!cartTable || !summary) {
    return;
  }

  let cart = getCart();

  if (cart.length === 0) {
    cartTable.innerHTML = '<tr><td colspan="5">Your cart is empty</td></tr>';
    summary.innerHTML = "<p><strong>Total: $0.00</strong></p>";
    return;
  }

  let rows = "";
  let subtotal = 0;

  for (let i = 0; i < cart.length; i++) {
    let item = cart[i];
    subtotal = subtotal + item.subtotal;

    rows += "<tr>" +
      "<td>" + item.name + "</td>" +
      "<td>$" + item.price.toFixed(2) + "</td>" +

      "<!-- PERSON 3 - NEW FEATURE: UPDATE QUANTITY INPUT -->" +
      "<td>" +
      "<input type='number' min='1' value='" + item.quantity + "' " +
      "onchange='updateQuantity(" + i + ", this.value)'>" +
      "</td>" +

      "<td>$" + item.subtotal.toFixed(2) + "</td>" +
      "<td><button class='btn remove-btn' data-index='" + i + "'>Remove</button></td>" +
      "</tr>";
  }

  let discount = 0;
  if (subtotal > 10000) {
    discount = subtotal * 0.10;
  }

  let tax = (subtotal - discount) * 0.15;
  let total = subtotal - discount + tax;

  cartTable.innerHTML = rows;

  summary.innerHTML =
    "<p>Subtotal: $" + subtotal.toFixed(2) + "</p>" +
    "<p>Discount (10%): $" + discount.toFixed(2) + "</p>" +
    "<p>Tax (15%): $" + tax.toFixed(2) + "</p>" +
    "<h3>Total: $" + total.toFixed(2) + "</h3>";

  let removeButtons = document.querySelectorAll(".remove-btn");

  for (let i = 0; i < removeButtons.length; i++) {
    removeButtons[i].addEventListener("click", function () {
      let index = parseInt(removeButtons[i].getAttribute("data-index"));
      removeFromCart(index);
    });
  }
}

/* ========================
   CHECKOUT ORDER SUMMARY
   ======================== */

function displayOrderSummary() {
  let summaryBox = document.getElementById("orderSummary");

  if (!summaryBox) {
    return;
  }

  let cart = getCart();

  if (cart.length === 0) {
    summaryBox.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  let output = "";
  let subtotal = 0;

  for (let i = 0; i < cart.length; i++) {
    let item = cart[i];
    subtotal = subtotal + item.subtotal;

    output += "<p>" + item.name + " x " + item.quantity + " - $" + item.subtotal.toFixed(2) + "</p>";
  }

  let discount = 0;
  if (subtotal > 10000) {
    discount = subtotal * 0.10;
  }

  let tax = (subtotal - discount) * 0.15;
  let total = subtotal - discount + tax;

  output +=
    "<hr>" +
    "<p>Subtotal: $" + subtotal.toFixed(2) + "</p>" +
    "<p>Discount: $" + discount.toFixed(2) + "</p>" +
    "<p>Tax: $" + tax.toFixed(2) + "</p>" +
    "<h3>Total: $" + total.toFixed(2) + "</h3>";

  summaryBox.innerHTML = output;
}

/* PERSON 3 - CLOSE CART */
function closeCart() {
  let cartSection = document.getElementById("cartSection");
  if (cartSection) {
    cartSection.style.display = "none";
  }
}

/* ========================
   LOGIN FORM VALIDATION
   ======================== */
function loginValidation() { }

/* ========================
   REGISTER FORM VALIDATION
   ======================== */
function registerValidation() { }

/* ========================
   CHECKOUT FORM
   ======================== */
function checkoutValidation() {

  let form = document.getElementById("checkoutForm");
  let message = document.getElementById("checkoutMessage");

  if (!form || !message) {
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    let customerName = document.getElementById("customerName").value.trim();
    let address = document.getElementById("address").value.trim();
    let amountPaid = document.getElementById("amountPaid").value.trim();

    if (customerName === "" || address === "" || amountPaid === "") {
      message.innerHTML = "Please fill in all fields!";
      message.style.color = "red";
      return;
    }

    /* PERSON 3 PASS CHECKOUT DATA FOR INVOICE SYSTEM */
    let cart = getCart();

    let checkoutData = {
      customerName: customerName,
      address: address,
      amountPaid: amountPaid,
      cart: cart,
      total: document.querySelector(".cart-summary").innerText
    };

    localStorage.setItem("latestCheckout", JSON.stringify(checkoutData));

    message.innerHTML = "Order placed successfully!";
    message.style.color = "green";

    localStorage.removeItem("cart");
    form.reset();
    displayOrderSummary();
  });
}

/* ========================
   BUTTONS
   ======================== */
function setupButtons() {
  let buttons = document.querySelectorAll("button");

  for (let i = 0; i < buttons.length; i++) {
    let text = buttons[i].textContent.trim();

    if (text.includes("Clear")) {
      buttons[i].addEventListener("click", function () {
        localStorage.removeItem("cart");
        alert("Cart cleared!");
        displayCart();
        displayOrderSummary();
      });
    }

    /* PERSON 3 -  CLOSE BUTTON */
    if (text.includes("Close")) {
      buttons[i].addEventListener("click", function () {
        closeCart();
      });
    }
  }
}

/* ========================
   PAGE INITIALIZATION
   ======================== */

// Run when products.html loads
if (document.getElementById("productList")) {
  loadProducts();
  displayProducts();
}

/* FUNCTIONS */
function initializePage() {
  setupAddToCart();
  displayCart();
  displayOrderSummary();
  loginValidation();
  registerValidation();
  checkoutValidation();
  setupButtons();
}

document.addEventListener("DOMContentLoaded", initializePage);
