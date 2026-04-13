/* DriveStyle Auto Accessories
   IA#2 JavaScript*/

/* ============================================================
   MAJOR UPDATE LABEL - Script aligned to current login.html
   - removed shared-script login conflict because login is handled inline in login.html
   - removed dependency on currentUserTRN from shared features
   - current user lookup now aligns with localStorage username used by login.html
   - cart/user sync now uses RegistrationData only if matching username/fullName exists
   - invoices still save to AllInvoices and user invoices[] where possible
   ============================================================ */

const products = [
  { name: "Car Phone Mount", price: 2500, description: "Strong and adjustable dashboard mount for safe driving.", image: "phone-mount.jpeg" },
  { name: "Interior LED Light Kit", price: 4500, description: "Bright multi-color LED lighting for a modern cabin look.", image: "led-lights.jpeg" },
  { name: "Premium Seat Covers", price: 6800, description: "Comfortable and stylish seat covers to protect your interior.", image: "seat-cover.jpeg" },
  { name: "Portable Car Vacuum", price: 5200, description: "Compact vacuum cleaner for quick and easy interior cleaning.", image: "car-vacuum.jpeg" },
  { name: "Luxury Air Freshener", price: 1200, description: "Premium fragrance to keep your car fresh and inviting.", image: "air-freshener.jpeg" },
  { name: "Dash Cam", price: 9500, description: "Record every drive with a clear and reliable dashboard camera.", image: "dash-cam.jpeg" }
];

/* ========================
   STORAGE HELPERS
   ======================== */
function getRegistrationData() {
  let data = localStorage.getItem("RegistrationData");

  if (data === null) {
    return [];
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    console.log("RegistrationData parse error:", error);
    return [];
  }
}

function saveRegistrationData(users) {
  localStorage.setItem("RegistrationData", JSON.stringify(users));
}

/* MAJOR UPDATE LABEL - aligns with login.html storage */
function getStoredUsername() {
  return localStorage.getItem("username") || "";
}

function getCurrentUserIndex() {
  let storedUsername = getStoredUsername().trim().toLowerCase();
  let users = getRegistrationData();

  if (storedUsername === "") {
    return -1;
  }

  for (let i = 0; i < users.length; i++) {
    let user = users[i];

    let possibleNames = [
      user.username,
      user.name,
      user.fullName
    ];

    for (let j = 0; j < possibleNames.length; j++) {
      if (possibleNames[j] && possibleNames[j].trim().toLowerCase() === storedUsername) {
        return i;
      }
    }
  }

  return -1;
}

function getCurrentUser() {
  let userIndex = getCurrentUserIndex();
  let users = getRegistrationData();

  if (userIndex >= 0) {
    return users[userIndex];
  }

  return null;
}

function syncCartToCurrentUser(cart) {
  let userIndex = getCurrentUserIndex();

  if (userIndex >= 0) {
    let users = getRegistrationData();

    if (!users[userIndex].cart) {
      users[userIndex].cart = [];
    }

    users[userIndex].cart = cart;
    saveRegistrationData(users);
  }
}

function calculateAge(dob) {
  if (!dob) {
    return 0;
  }

  let birthDate = new Date(dob);
  let today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  let monthDiff = today.getMonth() - birthDate.getMonth();
  let dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age = age - 1;
  }

  return age;
}

function getAgeGroup(age) {
  if (age >= 18 && age <= 25) return "18-25";
  if (age >= 26 && age <= 35) return "26-35";
  if (age >= 36 && age <= 50) return "36-50";
  if (age > 50) return "50+";
  return "Under 18";
}

function getUserDisplayName(user) {
  if (!user) {
    return "";
  }

  if (user.fullName) {
    return user.fullName;
  }

  if (user.firstName && user.lastName) {
    return user.firstName + " " + user.lastName;
  }

  if (user.name) {
    return user.name;
  }

  if (user.username) {
    return user.username;
  }

  return "";
}

/* ========================
   PRODUCT FUNCTIONS
   ======================== */
function loadProducts() {
  localStorage.setItem("AllProducts", JSON.stringify(products));
}

function displayProducts() {
  let container = document.getElementById("productList");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  for (let i = 0; i < products.length; i++) {
    let p = products[i];

    let card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML =
      "<img src='" + p.image + "' alt='" + p.name + "'>" +
      "<h2>" + p.name + "</h2>" +
      "<p>" + p.description + "</p>" +
      "<p class='price'>JMD $" + p.price.toFixed(2) + "</p>" +
      "<button class='btn add-cart' data-index='" + i + "' data-bound='true'>Add to Cart</button>";

    container.appendChild(card);
  }

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

  try {
    return JSON.parse(cart);
  } catch (error) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  syncCartToCurrentUser(cart);
}

function calculateCartTotals(cart) {
  let subtotal = 0;

  for (let i = 0; i < cart.length; i++) {
    subtotal = subtotal + Number(cart[i].subtotal);
  }

  let discount = 0;
  if (subtotal > 10000) {
    discount = subtotal * 0.10;
  }

  let tax = (subtotal - discount) * 0.15;
  let total = subtotal - discount + tax;

  return {
    subtotal: subtotal,
    discount: discount,
    tax: tax,
    total: total
  };
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
  let quantity = parseInt(newQty);

  if (isNaN(quantity) || quantity <= 0) {
    cart.splice(index, 1);
  } else {
    cart[index].quantity = quantity;
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
    if (buttons[i].getAttribute("data-bound") === "true") {
      continue;
    }

    let index = i;
    buttons[i].setAttribute("data-bound", "true");

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
    cartTable.innerHTML = '<tr><td colspan="8">Your cart is empty</td></tr>';
    summary.innerHTML = "<p><strong>Total: JMD $0.00</strong></p>";
    return;
  }

  let rows = "";
  let totals = calculateCartTotals(cart);

  for (let i = 0; i < cart.length; i++) {
    let item = cart[i];
    let itemDiscount = totals.subtotal > 10000 ? item.subtotal * 0.10 : 0;
    let itemTax = (item.subtotal - itemDiscount) * 0.15;
    let itemTotal = item.subtotal - itemDiscount + itemTax;

    rows += "<tr>" +
      "<td>" + item.name + "</td>" +
      "<td>JMD $" + item.price.toFixed(2) + "</td>" +
      "<td>" +
      "<input type='number' min='1' value='" + item.quantity + "' onchange='updateQuantity(" + i + ", this.value)'>" +
      "</td>" +
      "<td>JMD $" + item.subtotal.toFixed(2) + "</td>" +
      "<td>JMD $" + itemDiscount.toFixed(2) + "</td>" +
      "<td>JMD $" + itemTax.toFixed(2) + "</td>" +
      "<td>JMD $" + itemTotal.toFixed(2) + "</td>" +
      "<td><button class='btn remove-btn' data-index='" + i + "'>Remove</button></td>" +
      "</tr>";
  }

  cartTable.innerHTML = rows;

  summary.innerHTML =
    "<p>Subtotal: JMD $" + totals.subtotal.toFixed(2) + "</p>" +
    "<p>Discount (10%): JMD $" + totals.discount.toFixed(2) + "</p>" +
    "<p>Tax (15%): JMD $" + totals.tax.toFixed(2) + "</p>" +
    "<h3>Total: JMD $" + totals.total.toFixed(2) + "</h3>";

  let removeButtons = document.querySelectorAll(".remove-btn");

  for (let i = 0; i < removeButtons.length; i++) {
    removeButtons[i].addEventListener("click", function () {
      let index = parseInt(this.getAttribute("data-index"));
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
  let totals = calculateCartTotals(cart);

  for (let i = 0; i < cart.length; i++) {
    let item = cart[i];
    output += "<p>" + item.name + " x " + item.quantity + " - JMD $" + item.subtotal.toFixed(2) + "</p>";
  }

  output +=
    "<hr>" +
    "<p>Subtotal: JMD $" + totals.subtotal.toFixed(2) + "</p>" +
    "<p>Discount: JMD $" + totals.discount.toFixed(2) + "</p>" +
    "<p>Tax: JMD $" + totals.tax.toFixed(2) + "</p>" +
    "<h3>Total: JMD $" + totals.total.toFixed(2) + "</h3>";

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
function loginValidation() {
  /* Login is already handled inline in login.html */
}

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

    let cart = getCart();

    if (cart.length === 0) {
      message.innerHTML = "Your cart is empty!";
      message.style.color = "red";
      return;
    }

    let totals = calculateCartTotals(cart);

    if (Number(amountPaid) < totals.total) {
      message.innerHTML = "Amount paid must cover the total cost.";
      message.style.color = "red";
      return;
    }

    /* PERSON 3 PASS CHECKOUT DATA FOR INVOICE SYSTEM */
    let currentUser = getCurrentUser();

    let checkoutData = {
      customerName: customerName,
      address: address,
      amountPaid: amountPaid,
      cart: cart,
      total: totals.total,
      username: getStoredUsername(),
      trn: currentUser && currentUser.trn ? currentUser.trn : "N/A"
    };

    localStorage.setItem("latestCheckout", JSON.stringify(checkoutData));

    /* PERSON 4 - GENERATE INVOICE FROM CHECKOUT DATA */
    generateInvoice(checkoutData);

    message.innerHTML = "Order placed successfully! Invoice generated.";
    message.style.color = "green";

    localStorage.removeItem("cart");
    syncCartToCurrentUser([]);
    form.reset();
    displayOrderSummary();

    setTimeout(function () {
      window.location.href = "invoice.html";
    }, 1200);
  });
}

/* ========================
   BUTTONS
   ======================== */
function setupButtons() {
  let buttons = document.querySelectorAll("button");

  for (let i = 0; i < buttons.length; i++) {
    let text = buttons[i].textContent.trim();

    if (text.includes("Clear All")) {
      buttons[i].addEventListener("click", function () {
        localStorage.removeItem("cart");
        syncCartToCurrentUser([]);
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

  try {
    return JSON.parse(saved);
  } catch (error) {
    return [];
  }
}

/* PERSON 4 - INVOICE: Save all invoices to localStorage */
function saveAllInvoices(invoices) {
  localStorage.setItem("AllInvoices", JSON.stringify(invoices));
}

/* PERSON 4 - INVOICE: Generate invoice from checkout data and store it */
function generateInvoice(checkoutData) {
  let cart = checkoutData.cart;
  let totals = calculateCartTotals(cart);
  let currentUser = getCurrentUser();

  let invoice = {
    invoiceNumber: generateInvoiceNumber(),
    date: getFormattedDate(),
    companyName: "DriveStyle Auto Accessories",
    trn: checkoutData.trn || (currentUser && currentUser.trn ? currentUser.trn : "N/A"),
    customerName: checkoutData.customerName,
    address: checkoutData.address,
    items: cart,
    subtotal: totals.subtotal,
    discount: totals.discount,
    tax: totals.tax,
    total: totals.total,
    amountPaid: Number(checkoutData.amountPaid)
  };

  let allInvoices = getAllInvoices();
  allInvoices.push(invoice);
  saveAllInvoices(allInvoices);

  if (currentUser !== null) {
    let users = getRegistrationData();
    let userIndex = getCurrentUserIndex();

    if (userIndex >= 0) {
      if (!users[userIndex].invoices) {
        users[userIndex].invoices = [];
      }

      users[userIndex].invoices.push(invoice);
      saveRegistrationData(users);
    }
  }

  localStorage.setItem("latestInvoice", JSON.stringify(invoice));

  console.log("Invoice generated: " + invoice.invoiceNumber);
  console.log(invoice);
}

/* PERSON 4 - INVOICE: Display invoice on invoice.html */
function displayInvoice() {
  let invoiceBox = document.getElementById("invoiceDisplay");
  if (!invoiceBox) return;

  let allInvoices = getAllInvoices();

  if (allInvoices.length === 0) {
    invoiceBox.innerHTML = "<p>No invoice found.</p>";
    return;
  }

  let inv = allInvoices[allInvoices.length - 1];

  let itemRows = "";
  for (let i = 0; i < inv.items.length; i++) {
    let item = inv.items[i];
    let itemDiscount = inv.subtotal > 10000 ? item.subtotal * 0.10 : 0;

    itemRows +=
      "<tr>" +
      "<td>" + item.name + "</td>" +
      "<td>" + item.quantity + "</td>" +
      "<td>JMD $" + item.price.toFixed(2) + "</td>" +
      "<td>JMD $" + itemDiscount.toFixed(2) + "</td>" +
      "<td>JMD $" + item.subtotal.toFixed(2) + "</td>" +
      "</tr>";
  }

  invoiceBox.innerHTML =
    "<h2>" + inv.companyName + "</h2>" +
    "<p>Invoice Number: " + inv.invoiceNumber + "</p>" +
    "<p>Date of Invoice: " + inv.date + "</p>" +
    "<p>TRN: " + inv.trn + "</p>" +
    "<p>Shipping Name: " + inv.customerName + "</p>" +
    "<p>Shipping Address: " + inv.address + "</p>" +
    "<hr>" +
    "<table class='invoice-table'>" +
    "<tr><th>Item</th><th>Qty</th><th>Price</th><th>Discount</th><th>Subtotal</th></tr>" +
    itemRows +
    "</table>" +
    "<hr>" +
    "<p>Taxes: JMD $" + inv.tax.toFixed(2) + "</p>" +
    "<p>Subtotal: JMD $" + inv.subtotal.toFixed(2) + "</p>" +
    "<p>Total Cost: JMD $" + inv.total.toFixed(2) + "</p>" +
    "<p>Amount Paid: JMD $" + Number(inv.amountPaid).toFixed(2) + "</p>" +
    "<p>Invoice has been sent to the user's email.</p>";
}

/* ============================================================
   PERSON 4 - DASHBOARD: Analytics Functions
   Handles user frequency charts and invoice lookups
   ============================================================ */

/* PERSON 4 - DASHBOARD: Show user frequency by gender and age group */
function showUserFrequency() {
  let container = document.getElementById("frequencyDisplay");
  if (!container) return;

  let users = getRegistrationData();
  if (users.length === 0) {
    container.innerHTML = "<p>No user data found.</p>";
    return;
  }

  let male = 0;
  let female = 0;
  let other = 0;
  let age18to25 = 0;
  let age26to35 = 0;
  let age36to50 = 0;
  let age50plus = 0;

  for (let i = 0; i < users.length; i++) {
    let user = users[i];
    let gender = (user.gender || "Other").toLowerCase();
    let age = user.age ? parseInt(user.age) : calculateAge(user.dob);

    if (gender === "male") {
      male = male + 1;
    } else if (gender === "female") {
      female = female + 1;
    } else {
      other = other + 1;
    }

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

  console.log("--- User Frequency ---");
  console.log("Male: " + male);
  console.log("Female: " + female);
  console.log("Other: " + other);
  console.log("Age 18-25: " + age18to25);
  console.log("Age 26-35: " + age26to35);
  console.log("Age 36-50: " + age36to50);
  console.log("Age 50+: " + age50plus);

  let scale = 20;

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
      "<p><strong>Total:</strong> JMD $" + inv.total.toFixed(2) + "</p>" +
      "<hr>" +
      "</div>";

    console.log("Invoice " + inv.invoiceNumber + " | TRN: " + inv.trn + " | Total: JMD $" + inv.total.toFixed(2));
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

  let users = getRegistrationData();
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

  if (!foundUser.invoices || foundUser.invoices.length === 0) {
    container.innerHTML = "<p>" + getUserDisplayName(foundUser) + " has no invoices.</p>";
    console.log(getUserDisplayName(foundUser) + " has no invoices.");
    return;
  }

  let output = "<h3>Invoices for: " + getUserDisplayName(foundUser) + " (TRN: " + trn + ")</h3>";

  for (let i = 0; i < foundUser.invoices.length; i++) {
    let inv = foundUser.invoices[i];

    output +=
      "<div class='invoice-card'>" +
      "<p><strong>Invoice #:</strong> " + inv.invoiceNumber + "</p>" +
      "<p><strong>Date:</strong> " + inv.date + "</p>" +
      "<p><strong>Total:</strong> JMD $" + inv.total.toFixed(2) + "</p>" +
      "<hr>" +
      "</div>";

    console.log("User Invoice: " + inv.invoiceNumber + " | Total: JMD $" + inv.total.toFixed(2));
  }

  container.innerHTML = output;
}

/* ========================
   PAGE INITIALIZATION
   ======================== */
if (document.getElementById("productList")) {
  loadProducts();
  displayProducts();
}

if (document.getElementById("invoiceDisplay")) {
  displayInvoice();
}

if (document.getElementById("frequencyDisplay")) {
  showUserFrequency();
}

if (document.getElementById("invoiceList")) {
  showInvoices();
}

function initializePage() {
  setupAddToCart();
  displayCart();
  displayOrderSummary();
  loginValidation();
  registerValidation();
  checkoutValidation();
  setupButtons();

  let currentUser = getCurrentUser();
  let customerName = document.getElementById("customerName");

  if (currentUser && customerName) {
    customerName.value = getUserDisplayName(currentUser);
  }

  if (currentUser && currentUser.cart && currentUser.cart.length > 0 && getCart().length === 0) {
    saveCart(currentUser.cart);
  }
}

document.addEventListener("DOMContentLoaded", initializePage);
