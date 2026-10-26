# Mubashir Nadeem Portfolio

A modern personal portfolio website built with HTML, CSS, and JavaScript. The design uses a dark neon theme, animated text, starry backgrounds, floating skill icons, project showcase cards, and a contact section.

## Project Structure

```text
portfolio/
├── index.html
├── style.css
├── script.js
├── README.md
└── Assests/
    └── main-avatar.png
```

## External Libraries

The project uses these CDN links in the HTML `<head>`:

```html
<!-- Google Font -->
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<!-- Devicon Skill Icons -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css">

<!-- Font Awesome Contact Icons -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
```

## HTML Notes

HTML is the structure of the website. Each major part of the portfolio is placed inside a `<section>`.

### Navbar

The navbar contains the logo and navigation links.

```html
<header class="navbar">
  <div class="container nav-container">
    <h2 class="logo">Mubashir <span>Nadeem</span></h2>
    <ul class="nav-links">
      <li><a href="#home" class="active">Home</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#skills">Skills</a></li>
      <li><a href="#projects">Projects</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
  </div>
</header>
```

Important points:

- `href="#home"` scrolls to the section with `id="home"`.
- `class="active"` shows the underline on the active navbar link.
- The logo uses `<span>` so only `Nadeem` gets the gradient color.

### Hero Section

The hero section is the first main screen of the website.

It contains:

- Main intro heading
- Animated role text
- Short description
- Two buttons
- Profile/avatar image

The animated role text uses:

```html
<span id="typing-text" class="gradient-text"></span>
```

JavaScript finds this element by `id="typing-text"` and types text into it.

### About Section

The About section explains who you are and what you focus on.

It has two sides:

- Left side: personal introduction
- Right side: education, focus, and mindset cards

This is better than putting skills inside About because Skills already has its own section.

### Skills Section

The Skills section has two sides:

- Left side: skill categories
- Right side: floating technology icons

Skill categories:

- Frontend
- Backend
- Programming
- Database
- Tools

The right side icons come from Devicon. Example:

```html
<i class="devicon-html5-plain colored"></i>
```

### Projects Section

The Projects section uses alternating rows:

- Project 1: card left, details right
- Project 2: details left, card right
- Project 3: card left, details right

The `reverse` class is used to switch sides:

```html
<div class="project-row reverse">
```

Each project includes:

- Image placeholder
- Project title
- GitHub button
- Live Demo button
- Description
- Tech stack tags

Later, replace `Project Image` placeholders with real screenshots.

### Contact Section

The Contact section has:

- Left side: contact text and quick contact buttons
- Right side: contact form
- Footer note at the bottom

Contact buttons use Font Awesome icons:

```html
<i class="fa-solid fa-envelope"></i>
<i class="fa-brands fa-linkedin-in"></i>
<i class="fa-brands fa-github"></i>
<i class="fa-brands fa-whatsapp"></i>
```

## CSS Notes

CSS controls the design, spacing, layout, colors, and animations.

### Reset

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

This removes default browser spacing and makes sizing easier to control.

### Variables

```css
:root {
  --bg: #070707;
  --text: #f5f5f5;
  --muted: #b8c7e5;
  --primary: #8b5cf6;
  --cyan: #38bdf8;
  --gradient: linear-gradient(90deg, #8b5cf6, #ec4899);
  --nav-height: 70px;
}
```

Variables make the CSS easier to update. For example, if you change `--primary`, it updates everywhere that variable is used.

### Container

```css
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 60px;
}
```

This keeps content centered and prevents it from touching the browser edges.

### Section Size

```css
.section {
  min-height: calc(100vh - var(--nav-height));
  padding: 70px 0;
  display: flex;
  align-items: center;
}
```

Important:

- `min-height` makes sections feel full screen.
- `padding` controls top and bottom spacing.
- `align-items: center` vertically centers the content.

If content is too high or too low, adjust the padding:

```css
padding: 90px 0 60px;
```

First value is top spacing. Last value is bottom spacing.

### Sticky Navbar

```css
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
}
```

This keeps the navbar visible while scrolling.

### Scroll Offset

If a section touches the navbar after clicking a nav link, use:

```css
section {
  scroll-margin-top: var(--nav-height);
}
```

This gives space above each section when jumping through navbar links.

### Gradient Text

```css
.gradient-text {
  background: var(--gradient);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}
```

This makes text show the gradient color instead of a normal solid color.

### Starry Background

The star effect is made with `radial-gradient`.

```css
background-image:
  radial-gradient(circle, rgba(255, 255, 255, 0.65) 1px, transparent 1.5px),
  radial-gradient(circle, rgba(56, 189, 248, 0.4) 1px, transparent 1.5px);
```

The stars move using:

```css
animation: starsMove 18s linear infinite;
```

### Hover Effects

Cards and buttons use hover effects:

```css
transform: translateY(-5px);
```

This moves the element slightly upward when the user hovers.

### Floating Icons

Skill icons float using keyframes:

```css
@keyframes floatUp {
  0%, 100% {
    transform: translateY(18px);
  }

  50% {
    transform: translateY(-18px);
  }
}
```

Different columns use different animations so the movement feels natural.

## JavaScript Notes

JavaScript is used for the typing animation in the Hero section.

Example structure:

```js
const texts = [
  "Frontend Developer",
  "UI Designer",
  "Freelancer"
];
```

This array stores the text that will animate.

```js
let index = 0;
let charIndex = 0;
let isDeleting = false;
```

These variables control:

- Which text is currently active
- Which character is currently being typed
- Whether text is typing or deleting

The main function:

```js
function typeEffect() {
  const currentText = texts[index];
  const display = ``document.getElementById("typing-text");

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
```

How it works:

- It gets the current text from the `texts` array.
- It increases `charIndex` to type letters.
- It decreases `charIndex` to delete letters.
- When one word finishes, it waits, deletes, then moves to the next word.

## Common Things To Edit

### Change Hero Text

Edit this in HTML:

```html
<h1>Hi, I'm Mubashir Nadeem</h1>
```

Edit animated text in `script.js`:

```js
const texts = [
  "Frontend Developer",
  "UI Designer",
  "Freelancer"
];
```

### Change Avatar Image

Edit this path:

```html
<img src="./Assests/main-avatar.png" alt="Mubashir Nadeem">
```

If your folder is named `Assets`, use:

```html
<img src="./Assets/main-avatar.png" alt="Mubashir Nadeem">
```

### Change Contact Links

Update these values:

```html
mailto:your.email@example.com
https://linkedin.com/in/yourusername
https://github.com/yourusername
https://wa.me/923000000000
```

For WhatsApp, use country code without `+`.

Example for Pakistan:

```html
https://wa.me/923001234567
```

### Change Project Details

Each project has:

```html
<h3>Project Title</h3>
<p>Project description...</p>
<div class="tech-stack">
  <span>HTML</span>
  <span>CSS</span>
  <span>JavaScript</span>
</div>
```

Update:

- Project title
- Screenshot image
- GitHub link
- Live demo link
- Description
- Tech stack

## Best Practices

- Keep only real skills that you can explain.
- Use real project screenshots instead of placeholders.
- Keep descriptions short and clear.
- Use `min-height` instead of fixed `height` so sections do not break on smaller screens.
- Add responsive media queries at the end of the CSS.
- Keep section IDs and navbar links matching.

## Future Improvements

- Add responsive design for mobile and tablet.
- Add real project screenshots.
- Connect contact form using Formspree, EmailJS, or backend API.
- Add active navbar link update on scroll.
- Add subtle scroll reveal animations.
- Add a downloadable resume button.

## Quick Revision Summary

HTML gives the website structure.

CSS gives the website design, spacing, colors, layout, and animations.

JavaScript adds the typing animation.

The main layout pattern is:

```text
Navbar
Hero
About
Skills
Projects
Contact
Footer
```

The portfolio uses a consistent dark neon theme with glass-style cards, gradient accents, starry backgrounds, and smooth hover animations.
