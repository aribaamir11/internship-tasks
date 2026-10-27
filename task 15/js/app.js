"use strict";

const products = [
  { id: 1, name: "Nova Lounge Chair", category: "Chair", price: 289, oldPrice: 340, image: "assets/images/chair.png", badge: "New", material: "Boucle" },
  { id: 2, name: "Form Side Chair", category: "Chair", price: 179, oldPrice: 220, image: "assets/images/chair-3.png", badge: "20% off", material: "Oak" },
  { id: 3, name: "Olive Three Seat Sofa", category: "Sofa", price: 1290, oldPrice: 1490, image: "assets/images/sofa.png", badge: "Limited", material: "Velvet" },
  { id: 4, name: "Milo Dining Table", category: "Table", price: 780, oldPrice: 890, image: "assets/images/table.png", badge: "12% off", material: "Solid ash" },
  { id: 5, name: "Arden Side Table", category: "Table", price: 249, oldPrice: null, image: "assets/images/table-2.png", badge: "New", material: "Natural oak" },
  { id: 6, name: "Arc Pendant Light", category: "Lighting", price: 219, oldPrice: 260, image: "assets/images/lighting.png", badge: "15% off", material: "Brushed brass" },
  { id: 7, name: "Halo Floor Lamp", category: "Lighting", price: 310, oldPrice: null, image: "assets/images/lighting-3.png", badge: "New", material: "Steel" },
  { id: 8, name: "Aster Table Lamp", category: "Lighting", price: 145, oldPrice: null, image: "assets/images/lightnig-2.png", badge: "Studio pick", material: "Ceramic" },
  { id: 9, name: "Glow Lantern", category: "Lighting", price: 189, oldPrice: null, image: "assets/images/lighting-4.png", badge: "Bestseller", material: "Glass" },
  { id: 10, name: "Oak Wall Clock", category: "Clock", price: 95, oldPrice: 120, image: "assets/images/clock.png", badge: "Sale", material: "Oak" },
  { id: 11, name: "Round Desk Clock", category: "Clock", price: 69, oldPrice: null, image: "assets/images/clock-2.png", badge: "New", material: "Metal" },
  { id: 12, name: "Terra Flower Pot", category: "Decor", price: 39, oldPrice: null, image: "assets/images/Flower%20pot.png", badge: "Bestseller", material: "Ceramic" }
];

const categories = ["All", ...new Set(products.map((product) => product.category))];
const storageKey = "furnitur-cart";
const wishKey = "furnitur-wishlist";
const freeShipping = 250;

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

const sortSelect = document.querySelector("#sort-select");
const siteHeader = document.querySelector(".site-header");
const toTop = document.querySelector(".to-top");
const shipNote = document.querySelector(".ship-note");
const shipBar = document.querySelector(".ship-bar i");

let sortMode = "featured";
let wishlist = loadWishlist();
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

function loadWishlist() {
  try {
    const saved = JSON.parse(localStorage.getItem(wishKey));
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

function toggleWish(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;
  const has = wishlist.includes(productId);
  wishlist = has ? wishlist.filter((id) => id !== productId) : [...wishlist, productId];
  try { localStorage.setItem(wishKey, JSON.stringify(wishlist)); } catch (error) {}
  renderProducts();
  showToast(has ? `${product.name} removed from favourites` : `${product.name} saved to favourites`);
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

  const list = products.filter((product) => {
    const categoryMatches = activeCategory === "All" || product.category === activeCategory;
    const searchMatches = product.name.toLowerCase().includes(normalizedTerm);
    return categoryMatches && searchMatches;
  });

  if (sortMode === "low") list.sort((a, b) => a.price - b.price);
  if (sortMode === "high") list.sort((a, b) => b.price - a.price);
  if (sortMode === "name") list.sort((a, b) => a.name.localeCompare(b.name));
  return list;
}

function productCardTemplate(product) {
  return `
    <article class="product-card">
      <div class="product-media">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <span class="product-badge">${product.badge}</span>
        <button class="wish-button${wishlist.includes(product.id) ? " active" : ""}" type="button" data-wish-id="${product.id}" aria-label="Save ${product.name} to favourites" aria-pressed="${wishlist.includes(product.id)}">
          <svg><use href="#icon-heart"></use></svg>
        </button>
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

  const left = freeShipping - totalPrice;
  shipNote.textContent = left > 0 ? `Add ${formatCurrency(left)} more for free delivery` : "You have free delivery";
  shipBar.style.width = `${Math.min(100, (totalPrice / freeShipping) * 100)}%`;
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
  const wishButton = event.target.closest("[data-wish-id]");
  if (wishButton) {
    toggleWish(Number(wishButton.dataset.wishId));
    return;
  }
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

sortSelect.addEventListener("change", () => {
  sortMode = sortSelect.value;
  renderProducts();
});

window.addEventListener("scroll", () => {
  siteHeader.classList.toggle("scrolled", window.scrollY > 10);
  toTop.classList.toggle("visible", window.scrollY > 600);
});

toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// Highlight the nav link of the section on screen
const navLinks = document.querySelectorAll(".desktop-nav a");
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
  });
}, { rootMargin: "-40% 0px -55% 0px" });
["top", "collection", "rooms", "story", "journal"].forEach((id) => {
  const el = document.getElementById(id);
  if (el) sectionObserver.observe(el);
});

renderFilters();
renderProducts();
renderCart();