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

    /* PERSON 4 - GENERATE INVOICE FROM CHECKOUT DATA */
    generateInvoice(checkoutData);

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

/* ============================================================
   PERSON 4 - INVOICE SYSTEM
   Handles invoice generation, storage, and display
   ============================================================ */

/* PERSON 4 - INVOICE: Generate a unique invoice number */
function generateInvoiceNumber() {
  let allInvoices = getAllInvoices();
  let invoiceNumber = "INV-" + (1000 + allInvoices.length + 1);
  return invoiceNumber;
}

/* PERSON 4 - INVOICE: Get today's date formatted as DD/MM/YYYY */
function getFormattedDate() {
  let today = new Date();
  let day = today.getDate();
  let month = today.getMonth() + 1;
  let year = today.getFullYear();

  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }

  return day + "/" + month + "/" + year;
}

/* PERSON 4 - INVOICE: Get all invoices from localStorage */
function getAllInvoices() {
  let saved = localStorage.getItem("AllInvoices");
  if (saved === null) {
    return [];
  }
  return JSON.parse(saved);
}

/* PERSON 4 - INVOICE: Save all invoices to localStorage */
function saveAllInvoices(invoices) {
  localStorage.setItem("AllInvoices", JSON.stringify(invoices));
}

/* PERSON 4 - INVOICE: Generate invoice from checkout data and store it */
function generateInvoice(checkoutData) {

  let cart = checkoutData.cart;
  let subtotal = 0;

  for (let i = 0; i < cart.length; i++) {
    subtotal = subtotal + cart[i].subtotal;
  }

  let discount = 0;
  if (subtotal > 10000) {
    discount = subtotal * 0.10;
  }

  let tax = (subtotal - discount) * 0.15;
  let total = subtotal - discount + tax;

  // Get TRN from logged-in user in RegistrationData if available
  let trn = "N/A";
  let registrationData = localStorage.getItem("RegistrationData");
  if (registrationData) {
    let users = JSON.parse(registrationData);
    for (let i = 0; i < users.length; i++) {
      if (users[i].name === checkoutData.customerName) {
        trn = users[i].trn || "N/A";
      }
    }
  }

  // Build the invoice object
  let invoice = {
    invoiceNumber: generateInvoiceNumber(),
    date: getFormattedDate(),
    companyName: "DriveStyle Auto Accessories",
    trn: trn,
    customerName: checkoutData.customerName,
    address: checkoutData.address,
    items: cart,
    subtotal: subtotal,
    discount: discount,
    tax: tax,
    total: total
  };

  // Save invoice to AllInvoices in localStorage
  let allInvoices = getAllInvoices();
  allInvoices.push(invoice);
  saveAllInvoices(allInvoices);

  // Also save to user object if user exists in RegistrationData
  let registrationData2 = localStorage.getItem("RegistrationData");
  if (registrationData2) {
    let users = JSON.parse(registrationData2);
    for (let i = 0; i < users.length; i++) {
      if (users[i].name === checkoutData.customerName) {
        if (!users[i].invoices) {
          users[i].invoices = [];
        }
        users[i].invoices.push(invoice);
      }
    }
    localStorage.setItem("RegistrationData", JSON.stringify(users));
  }

  console.log("Invoice generated: " + invoice.invoiceNumber);
  console.log(invoice);
}

/* PERSON 4 - INVOICE: Display invoice on invoice.html */
function displayInvoice() {
  let invoiceBox = document.getElementById("invoiceDisplay");
  if (!invoiceBox) return;

  let allInvoices = getAllInvoices();

  // Show the most recently generated invoice
  if (allInvoices.length === 0) {
    invoiceBox.innerHTML = "<p>No invoice found.</p>";
    return;
  }

  let inv = allInvoices[allInvoices.length - 1];

  let itemRows = "";
  for (let i = 0; i < inv.items.length; i++) {
    let item = inv.items[i];
    itemRows +=
      "<tr>" +
      "<td>" + item.name + "</td>" +
      "<td>" + item.quantity + "</td>" +
      "<td>$" + item.price.toFixed(2) + "</td>" +
      "<td>$" + item.subtotal.toFixed(2) + "</td>" +
      "</tr>";
  }

  invoiceBox.innerHTML =
    "<h2>" + inv.companyName + "</h2>" +
    "<p>Invoice Number: " + inv.invoiceNumber + "</p>" +
    "<p>Date: " + inv.date + "</p>" +
    "<p>TRN: " + inv.trn + "</p>" +
    "<p>Customer: " + inv.customerName + "</p>" +
    "<p>Address: " + inv.address + "</p>" +
    "<hr>" +
    "<table border='1' width='100%'>" +
    "<tr><th>Item</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr>" +
    itemRows +
    "</table>" +
    "<hr>" +
    "<p>Subtotal: $" + inv.subtotal.toFixed(2) + "</p>" +
    "<p>Discount: $" + inv.discount.toFixed(2) + "</p>" +
    "<p>Tax (15%): $" + inv.tax.toFixed(2) + "</p>" +
    "<h3>Total: $" + inv.total.toFixed(2) + "</h3>";
}

/* ============================================================
   PERSON 4 - DASHBOARD: Analytics Functions
   Handles user frequency charts and invoice lookups
   ============================================================ */

/* PERSON 4 - DASHBOARD: Show user frequency by gender and age group */
function showUserFrequency() {
  let container = document.getElementById("frequencyDisplay");
  if (!container) return;

  let registrationData = localStorage.getItem("RegistrationData");
  if (!registrationData) {
    container.innerHTML = "<p>No user data found.</p>";
    return;
  }

  let users = JSON.parse(registrationData);

  // Count by gender
  let male = 0;
  let female = 0;
  let other = 0;

  // Count by age group
  let age18to25 = 0;
  let age26to35 = 0;
  let age36to50 = 0;
  let age50plus = 0;

  for (let i = 0; i < users.length; i++) {
    let user = users[i];

    // Gender count
    if (user.gender === "Male") {
      male = male + 1;
    } else if (user.gender === "Female") {
      female = female + 1;
    } else {
      other = other + 1;
    }

    // Age group count
    let age = parseInt(user.age);
    if (age >= 18 && age <= 25) {
      age18to25 = age18to25 + 1;
    } else if (age >= 26 && age <= 35) {
      age26to35 = age26to35 + 1;
    } else if (age >= 36 && age <= 50) {
      age36to50 = age36to50 + 1;
    } else if (age > 50) {
      age50plus = age50plus + 1;
    }
  }

  // Log counts to console
  console.log("--- User Frequency ---");
  console.log("Male: " + male);
  console.log("Female: " + female);
  console.log("Other: " + other);
  console.log("Age 18-25: " + age18to25);
  console.log("Age 26-35: " + age26to35);
  console.log("Age 36-50: " + age36to50);
  console.log("Age 50+: " + age50plus);

  // Bar chart scale: each user = 20px wide bar
  let scale = 20;

  // Build bar chart using image width technique (div widths)
  container.innerHTML =
    "<h3>Gender Frequency</h3>" +

    "<p>Male (" + male + ")" +
    "<div style='background-color: #4a90d9; height: 20px; width: " + (male * scale) + "px;'></div></p>" +

    "<p>Female (" + female + ")" +
    "<div style='background-color: #e87ba0; height: 20px; width: " + (female * scale) + "px;'></div></p>" +

    "<p>Other (" + other + ")" +
    "<div style='background-color: #7bc47b; height: 20px; width: " + (other * scale) + "px;'></div></p>" +

    "<h3>Age Group Frequency</h3>" +

    "<p>18-25 (" + age18to25 + ")" +
    "<div style='background-color: #f0a500; height: 20px; width: " + (age18to25 * scale) + "px;'></div></p>" +

    "<p>26-35 (" + age26to35 + ")" +
    "<div style='background-color: #e05c5c; height: 20px; width: " + (age26to35 * scale) + "px;'></div></p>" +

    "<p>36-50 (" + age36to50 + ")" +
    "<div style='background-color: #7b5ea7; height: 20px; width: " + (age36to50 * scale) + "px;'></div></p>" +

    "<p>50+ (" + age50plus + ")" +
    "<div style='background-color: #5eaaa8; height: 20px; width: " + (age50plus * scale) + "px;'></div></p>";
}

/* PERSON 4 - DASHBOARD: Show all invoices, with optional search by TRN */
function showInvoices() {
  let container = document.getElementById("invoiceList");
  if (!container) return;

  let allInvoices = getAllInvoices();

  // Check if user entered a TRN to search by
  let searchInput = document.getElementById("searchTRN");
  let searchTRN = "";
  if (searchInput) {
    searchTRN = searchInput.value.trim();
  }

  if (allInvoices.length === 0) {
    container.innerHTML = "<p>No invoices found.</p>";
    console.log("No invoices in storage.");
    return;
  }

  let output = "";
  let found = 0;

  for (let i = 0; i < allInvoices.length; i++) {
    let inv = allInvoices[i];

    // If search TRN entered, only show matching invoices
    if (searchTRN !== "" && inv.trn !== searchTRN) {
      continue;
    }

    found = found + 1;

    output +=
      "<div class='invoice-card'>" +
      "<p><strong>Invoice #:</strong> " + inv.invoiceNumber + "</p>" +
      "<p><strong>Date:</strong> " + inv.date + "</p>" +
      "<p><strong>Customer:</strong> " + inv.customerName + "</p>" +
      "<p><strong>TRN:</strong> " + inv.trn + "</p>" +
      "<p><strong>Total:</strong> $" + inv.total.toFixed(2) + "</p>" +
      "<hr>" +
      "</div>";

    // Log each invoice to console as required
    console.log("Invoice " + inv.invoiceNumber + " | TRN: " + inv.trn + " | Total: $" + inv.total.toFixed(2));
  }

  if (found === 0) {
    container.innerHTML = "<p>No invoices found for TRN: " + searchTRN + "</p>";
    console.log("No invoices matched TRN: " + searchTRN);
  } else {
    container.innerHTML = output;
  }
}

/* PERSON 4 - DASHBOARD: Get and display invoices for a specific user by TRN from RegistrationData */
function getUserInvoices() {
  let container = document.getElementById("userInvoiceDisplay");
  if (!container) return;

  let trnInput = document.getElementById("userTRN");
  if (!trnInput) return;

  let trn = trnInput.value.trim();

  if (trn === "") {
    container.innerHTML = "<p>Please enter a TRN.</p>";
    return;
  }

  // Look up user in RegistrationData by TRN
  let registrationData = localStorage.getItem("RegistrationData");
  if (!registrationData) {
    container.innerHTML = "<p>No registration data found.</p>";
    console.log("No RegistrationData in localStorage.");
    return;
  }

  let users = JSON.parse(registrationData);
  let foundUser = null;

  for (let i = 0; i < users.length; i++) {
    if (users[i].trn === trn) {
      foundUser = users[i];
    }
  }

  if (!foundUser) {
    container.innerHTML = "<p>No user found with TRN: " + trn + "</p>";
    console.log("No user matched TRN: " + trn);
    return;
  }

  // Display user invoices stored in their user object
  if (!foundUser.invoices || foundUser.invoices.length === 0) {
    container.innerHTML = "<p>" + foundUser.name + " has no invoices.</p>";
    console.log(foundUser.name + " has no invoices.");
    return;
  }

  let output = "<h3>Invoices for: " + foundUser.name + " (TRN: " + trn + ")</h3>";

  for (let i = 0; i < foundUser.invoices.length; i++) {
    let inv = foundUser.invoices[i];

    output +=
      "<div class='invoice-card'>" +
      "<p><strong>Invoice #:</strong> " + inv.invoiceNumber + "</p>" +
      "<p><strong>Date:</strong> " + inv.date + "</p>" +
      "<p><strong>Total:</strong> $" + inv.total.toFixed(2) + "</p>" +
      "<hr>" +
      "</div>";

    console.log("User Invoice: " + inv.invoiceNumber + " | Total: $" + inv.total.toFixed(2));
  }

  container.innerHTML = output;
}

/* ========================
   PAGE INITIALIZATION
   ======================== */

// Run when products.html loads
if (document.getElementById("productList")) {
  loadProducts();
  displayProducts();
}

// PERSON 4 - Run when invoice.html loads
if (document.getElementById("invoiceDisplay")) {
  displayInvoice();
}

// PERSON 4 - Run when dashboard.html loads
if (document.getElementById("frequencyDisplay")) {
  showUserFrequency();
}
if (document.getElementById("invoiceList")) {
  showInvoices();
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
