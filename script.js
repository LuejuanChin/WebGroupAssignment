/* DriveStyle Auto Accessories
   IA#2 JavaScript*/

const products = [
  { name: "Car Phone Mount", price: 2500 },
  { name: "Interior LED Light Kit", price: 4500 },
  { name: "Premium Seat Covers", price: 6800 },
  { name: "Portable Car Vacuum", price: 5200 },
  { name: "Luxury Air Freshener", price: 1200 },
  { name: "Dash Cam", price: 9500 }
];

/* CART FUNCTIONS*/

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

function addToCart(productName) {
  let cart = getCart();
  let product = products.find(function (item) {
    return item.name === productName;
  });

  if (!product) {
    return;
  }

  let existingItem = cart.find(function (item) {
    return item.name === productName;
  });

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
  alert(productName + " has been added to your cart!");

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

/* PRODUCT BUTTON EVENTS*/

function setupAddToCart() {
  let buttons = document.querySelectorAll(".add-cart");

  buttons.forEach(function (button, index) {
    button.addEventListener("click", function () {
      addToCart(products[index].name);
    });
  });
}

/*CART DISPLAY*/
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

  cart.forEach(function (item, index) {
    subtotal = subtotal + item.subtotal;

    rows += `
      <tr>
        <td>${item.name}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>${item.quantity}</td>
        <td>$${item.subtotal.toFixed(2)}</td>
        <td><button class="btn remove-btn" data-index="${index}">Remove</button></td>
      </tr>
    `;
  });

  let discount = 0;
  if (subtotal > 10000) {
    discount = subtotal * 0.10;
  }

  let tax = (subtotal - discount) * 0.15;
  let total = subtotal - discount + tax;

  cartTable.innerHTML = rows;

  summary.innerHTML = `
    <p>Subtotal: $${subtotal.toFixed(2)}</p>
    <p>Discount (10%): $${discount.toFixed(2)}</p>
    <p>Tax (15%): $${tax.toFixed(2)}</p>
    <h3>Total: $${total.toFixed(2)}</h3>
  `;

  let removeButtons = document.querySelectorAll(".remove-btn");

  removeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      let index = parseInt(button.getAttribute("data-index"));
      removeFromCart(index);
    });
  });
}

/* CHECKOUT ORDER SUMMARY*/
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

  cart.forEach(function (item) {
    subtotal = subtotal + item.subtotal;

    output += `
      <p>${item.name} x ${item.quantity} - $${item.subtotal.toFixed(2)}</p>
    `;
  });

  let discount = 0;
  if (subtotal > 10000) {
    discount = subtotal * 0.10;
  }

  let tax = (subtotal - discount) * 0.15;
  let total = subtotal - discount + tax;

  output += `
    <hr>
    <p>Subtotal: $${subtotal.toFixed(2)}</p>
    <p>Discount: $${discount.toFixed(2)}</p>
    <p>Tax: $${tax.toFixed(2)}</p>
    <h3>Total: $${total.toFixed(2)}</h3>
  `;

  summaryBox.innerHTML = output;
}

/* LOGIN FORM VALIDATION*/
function loginValidation() {
  let form = document.getElementById("loginForm");
  let message = document.getElementById("loginMessage");

  if (!form || !message) {
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    let username = document.getElementById("loginUsername").value.trim();
    let password = document.getElementById("loginPassword").value.trim();

    if (username === "" || password === "") {
      message.innerHTML = "Please fill in all fields!";
      message.style.color = "red";
      return;
    }

    message.innerHTML = "Login successful!";
    message.style.color = "green";
    form.reset();
  });
}

/* REGISTER FORM VALIDATION*/
function registerValidation() {
  let form = document.getElementById("registerForm");
  let message = document.getElementById("registerMessage");

  if (!form || !message) {
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    let fullName = document.getElementById("fullName").value.trim();
    let dob = document.getElementById("dob").value.trim();
    let email = document.getElementById("email").value.trim();
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();
    let confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (
      fullName === "" ||
      dob === "" ||
      email === "" ||
      username === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      message.innerHTML = "Please fill in all fields!";
      message.style.color = "red";
      return;
    }

    if (!email.includes("@")) {
      message.innerHTML = "Please enter a valid email address!";
      message.style.color = "red";
      return;
    }

    if (password !== confirmPassword) {
      message.innerHTML = "Passwords do not match!";
      message.style.color = "red";
      return;
    }

    message.innerHTML = "Registration successful!";
    message.style.color = "green";
    form.reset();
  });
}

/* CHECKOUT FORM */
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

    message.innerHTML = "Order placed successfully!";
    message.style.color = "green";
    localStorage.removeItem("cart");
    form.reset();
    displayOrderSummary();
  });
}

/* BUTTONS*/
function setupButtons() {
  let buttons = document.querySelectorAll("button");

  buttons.forEach(function (button) {
    let text = button.textContent.trim();

    if (text.includes("Clear")) {
      button.addEventListener("click", function () {
        localStorage.removeItem("cart");
        alert("Cart cleared!");
        displayCart();
        displayOrderSummary();
      });
    }
  });
}

/*   FUNCTIONS */
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