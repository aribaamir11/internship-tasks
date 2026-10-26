const texts = [
  "Frontend Developer",
  "Python Developer",
  "UI Designer",
  "Freelancer"
];

let index = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentText = texts[index];
  const display = document.getElementById("typing-text");

  if (!display) return;

  if (!isDeleting) {
    charIndex++;
    display.textContent = currentText.substring(0, charIndex);
  } else {
    charIndex--;
    display.textContent = currentText.substring(0, charIndex);
  }

  let speed = isDeleting ? 40 : 70;

  if (!isDeleting && charIndex >= currentText.length) {
    speed = 1200;
    isDeleting = true;
  } else if (isDeleting && charIndex <= 0) {
    isDeleting = false;
    index = (index + 1) % texts.length;
    speed = 300;
  }

  setTimeout(typeEffect, speed);
}

typeEffect();

const themeToggle = document.getElementById("theme-toggle");
const themeIcon = themeToggle ? themeToggle.querySelector("i") : null;

function setTheme(theme) {
  const isLight = theme === "light";
  document.body.classList.toggle("light-theme", isLight);

  if (themeIcon) {
    themeIcon.classList.toggle("fa-sun", !isLight);
    themeIcon.classList.toggle("fa-moon", isLight);
  }

  if (themeToggle) {
    const label = isLight ? "Switch to dark mode" : "Switch to light mode";
    themeToggle.setAttribute("aria-label", label);
    themeToggle.setAttribute("title", label);
  }
}

const savedTheme = localStorage.getItem("portfolio-theme");
setTheme(savedTheme || "dark");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("light-theme") ? "dark" : "light";
    localStorage.setItem("portfolio-theme", nextTheme);
    setTheme(nextTheme);
  });
}

const mobileMenu = document.getElementById("mobile-menu");
const navLinks = document.querySelector(".nav-links");
const mobileMenuIcon = document.querySelector(".menu-toggle i");

function closeMobileMenu() {
  if (!navLinks || !mobileMenuIcon || !mobileMenu) return;

  navLinks.classList.remove("mobile-active");
  mobileMenuIcon.classList.remove("fa-xmark");
  mobileMenuIcon.classList.add("fa-bars");
  mobileMenu.setAttribute("aria-label", "Open navigation menu");
}

if (mobileMenu && navLinks && mobileMenuIcon) {
  mobileMenu.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("mobile-active");

    mobileMenuIcon.classList.toggle("fa-bars", !isOpen);
    mobileMenuIcon.classList.toggle("fa-xmark", isOpen);
    mobileMenu.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  });
}

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", closeMobileMenu);
});

const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll(".nav-links a");
let scrollTicking = false;

function updateActiveLink() {
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (window.scrollY >= sectionTop - (sectionHeight / 3)) {
      current = section.getAttribute("id");
    }
  });

  navItems.forEach(item => {
    item.classList.toggle("active", item.getAttribute("href") === `#${current}`);
  });

  scrollTicking = false;
}

window.addEventListener("scroll", () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(updateActiveLink);
    scrollTicking = true;
  }
}, { passive: true });

