"use strict";

const products = [
  {
    id: 1,
    name: "Nova Lounge Chair",
    category: "Chair",
    price: 289,
    oldPrice: 340,
    image: "assets/images/chair-nova.jpg",
    badge: "New",
    material: "Boucle"
  },
  {
    id: 2,
    name: "Cane Accent Chair",
    category: "Chair",
    price: 329,
    oldPrice: null,
    image: "assets/images/chair-cane.jpg",
    badge: "Bestseller",
    material: "Velvet"
  },
  {
    id: 3,
    name: "Form Side Chair",
    category: "Chair",
    price: 179,
    oldPrice: 220,
    image: "assets/images/chair-curve.jpg",
    badge: "20% off",
    material: "Oak"
  },
  {
    id: 4,
    name: "Olive Three Seat Sofa",
    category: "Sofa",
    price: 1290,
    oldPrice: 1490,
    image: "assets/images/sofa-olive.jpg",
    badge: "Limited",
    material: "Velvet"
  },
  {
    id: 5,
    name: "Luna Linen Sofa",
    category: "Sofa",
    price: 1190,
    oldPrice: null,
    image: "assets/images/sofa-luna.jpg",
    badge: "New",
    material: "Linen"
  },
  {
    id: 6,
    name: "Cloud Modular Sofa",
    category: "Sofa",
    price: 1495,
    oldPrice: 1695,
    image: "assets/images/sofa-cloud.jpg",
    badge: "Studio pick",
    material: "Wool blend"
  },
  {
    id: 7,
    name: "Arden Side Table",
    category: "Table",
    price: 249,
    oldPrice: null,
    image: "assets/images/table-oak.jpg",
    badge: "New",
    material: "Natural oak"
  },
  {
    id: 8,
    name: "Milo Dining Table",
    category: "Table",
    price: 780,
    oldPrice: 890,
    image: "assets/images/dining-room.jpg",
    badge: "12% off",
    material: "Solid ash"
  },
  {
    id: 9,
    name: "Studio Coffee Table",
    category: "Table",
    price: 369,
    oldPrice: null,
    image: "assets/images/living-room.jpg",
    badge: "Bestseller",
    material: "Travertine"
  },
  {
    id: 10,
    name: "Arc Pendant Light",
    category: "Lighting",
    price: 219,
    oldPrice: 260,
    image: "assets/images/lamp-arc.jpg",
    badge: "15% off",
    material: "Brushed brass"
  },
  {
    id: 11,
    name: "Halo Floor Lamp",
    category: "Lighting",
    price: 310,
    oldPrice: null,
    image: "assets/images/bedroom.jpg",
    badge: "New",
    material: "Steel"
  },
  {
    id: 12,
    name: "Aster Table Lamp",
    category: "Lighting",
    price: 145,
    oldPrice: null,
    image: "assets/images/hero.jpg",
    badge: "Studio pick",
    material: "Ceramic"
  }
];

const categories = ["All", ...new Set(products.map((product) => product.category))];
const storageKey = "furnitur-cart";

const productGrid = document.querySelector(".product-grid");
const filterTabs = document.querySelector(".filter-tabs");
const resultCount = document.querySelector(".result-count");
const emptyState = document.querySelector(".empty-state");
const searchInput = document.querySelector("#product-search");
const clearSearchButton = document.querySelector(".clear-search");
const cartCount = document.querySelector(".cart-count");
const cartButton = document.querySelector(".cart-button");
const cartDrawer = document.querySelector(".cart-drawer");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const pageOverlay = document.querySelector(".page-overlay");
const closeCartButton = document.querySelector(".close-cart");
const continueShoppingButton = document.querySelector(".continue-shopping");
const clearCartButton = document.querySelector(".clear-cart");
const toast = document.querySelector(".toast");
const menuButton = document.querySelector(".menu-button");
const mobileNav = document.querySelector(".mobile-nav");

let activeCategory = "All";
let searchTerm = "";
let cart = loadCart();
let toastTimer;

function loadCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem(storageKey));
    if (!Array.isArray(savedCart)) return [];

    return savedCart.filter((item) => {
      return products.some((product) => product.id === item.id) && item.quantity > 0;
    });
  } catch (error) {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(storageKey, JSON.stringify(cart));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function renderFilters() {
  filterTabs.innerHTML = categories
    .map((category) => {
      const isActive = category === activeCategory;
      return `
        <button
          class="filter-button${isActive ? " active" : ""}"
          type="button"
          role="tab"
          aria-selected="${isActive}"
          data-category="${category}"
        >
          ${category}
        </button>
      `;
    })
    .join("");
}

function getFilteredProducts() {
  const normalizedTerm = searchTerm.trim().toLowerCase();

  return products.filter((product) => {
    const categoryMatches = activeCategory === "All" || product.category === activeCategory;
    const searchMatches = product.name.toLowerCase().includes(normalizedTerm);
    return categoryMatches && searchMatches;
  });
}

function productCardTemplate(product) {
  return `
    <article class="product-card">
      <div class="product-media">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <span class="product-badge">${product.badge}</span>
        <div class="product-actions">
          <button class="add-to-cart" type="button" data-add-id="${product.id}">
            Add to cart
          </button>
          <button class="quick-add" type="button" data-add-id="${product.id}" aria-label="Quick add ${product.name}">
            <svg><use href="#icon-plus"></use></svg>
          </button>
        </div>
      </div>
      <div class="product-info">
        <p class="product-meta">
          <span>${product.category}</span>
          <span>${product.material}</span>
        </p>
        <h3>${product.name}</h3>
        <div class="product-price">
          <span>${formatCurrency(product.price)}</span>
          ${product.oldPrice ? `<del>${formatCurrency(product.oldPrice)}</del>` : ""}
        </div>
      </div>
    </article>
  `;
}

function renderProducts() {
  const filteredProducts = getFilteredProducts();
  productGrid.innerHTML = filteredProducts.map(productCardTemplate).join("");
  resultCount.textContent = `${filteredProducts.length} ${filteredProducts.length === 1 ? "piece" : "pieces"}`;
  emptyState.hidden = filteredProducts.length !== 0;
  productGrid.hidden = filteredProducts.length === 0;
}

function setCategory(category) {
  activeCategory = categories.includes(category) ? category : "All";
  renderFilters();
  renderProducts();
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const cartItem = cart.find((item) => item.id === productId);
  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  saveCart();
  renderCart();
  showToast(`${product.name} added to your bag`);
}

function changeQuantity(productId, amount) {
  const cartItem = cart.find((item) => item.id === productId);
  if (!cartItem) return;

  cartItem.quantity += amount;
  if (cartItem.quantity <= 0) {
    cart = cart.filter((item) => item.id !== productId);
  }

  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  renderCart();
}

function cartItemTemplate(item) {
  const product = products.find((productItem) => productItem.id === item.id);
  if (!product) return "";

  return `
    <article class="cart-item">
      <img src="${product.image}" alt="${product.name}">
      <div>
        <h3>${product.name}</h3>
        <p class="cart-item-category">${product.category}</p>
        <span class="cart-item-price">${formatCurrency(product.price)}</span>
        <div class="quantity-control" aria-label="Quantity for ${product.name}">
          <button type="button" data-quantity-id="${product.id}" data-amount="-1" aria-label="Decrease quantity">
            <svg><use href="#icon-minus"></use></svg>
          </button>
          <span>${item.quantity}</span>
          <button type="button" data-quantity-id="${product.id}" data-amount="1" aria-label="Increase quantity">
            <svg><use href="#icon-plus"></use></svg>
          </button>
        </div>
      </div>
      <button class="remove-item" type="button" data-remove-id="${product.id}" aria-label="Remove ${product.name}">
        <svg><use href="#icon-close"></use></svg>
      </button>
    </article>
  `;
}

function renderCart() {
  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => {
    const product = products.find((productItem) => productItem.id === item.id);
    return product ? total + product.price * item.quantity : total;
  }, 0);

  cartItems.innerHTML = cart.map(cartItemTemplate).join("");
  cartCount.textContent = totalQuantity;
  cartTotal.textContent = formatCurrency(totalPrice);
  cartDrawer.classList.toggle("is-empty", cart.length === 0);
}

function openCart() {
  cartDrawer.classList.add("open");
  pageOverlay.classList.add("visible");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  closeCartButton.focus();
}

function closeCart() {
  cartDrawer.classList.remove("open");
  pageOverlay.classList.remove("visible");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 2500);
}

filterTabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  setCategory(button.dataset.category);
});

productGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-id]");
  if (!addButton) return;
  addToCart(Number(addButton.dataset.addId));
});

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value;
  clearSearchButton.classList.toggle("visible", searchTerm.length > 0);
  renderProducts();
});

clearSearchButton.addEventListener("click", () => {
  searchInput.value = "";
  searchTerm = "";
  clearSearchButton.classList.remove("visible");
  renderProducts();
  searchInput.focus();
});

document.querySelector(".reset-filters").addEventListener("click", () => {
  searchInput.value = "";
  searchTerm = "";
  clearSearchButton.classList.remove("visible");
  setCategory("All");
});

document.querySelectorAll("[data-category-link]").forEach((link) => {
  link.addEventListener("click", () => {
    setCategory(link.dataset.categoryLink);
  });
});

cartItems.addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-quantity-id]");
  const removeButton = event.target.closest("[data-remove-id]");

  if (quantityButton) {
    changeQuantity(
      Number(quantityButton.dataset.quantityId),
      Number(quantityButton.dataset.amount)
    );
  }

  if (removeButton) {
    removeFromCart(Number(removeButton.dataset.removeId));
  }
});

cartButton.addEventListener("click", openCart);
closeCartButton.addEventListener("click", closeCart);
continueShoppingButton.addEventListener("click", closeCart);
pageOverlay.addEventListener("click", closeCart);

clearCartButton.addEventListener("click", () => {
  cart = [];
  saveCart();
  renderCart();
  showToast("Your bag has been cleared");
});

document.querySelector(".checkout-button").addEventListener("click", () => {
  showToast("Checkout is ready for the next development step");
});

document.querySelector(".search-jump").addEventListener("click", () => {
  document.querySelector("#collection").scrollIntoView({ behavior: "smooth" });
  window.setTimeout(() => searchInput.focus(), 500);
});

document.querySelector(".account-button").addEventListener("click", () => {
  showToast("Account area coming soon");
});

menuButton.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

mobileNav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    mobileNav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }
});

document.querySelector(".newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = event.currentTarget.querySelector("input");
  showToast(`Thank you - updates will be sent to ${input.value}`);
  event.currentTarget.reset();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
    mobileNav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }
});

renderFilters();
renderProducts();
renderCart();
