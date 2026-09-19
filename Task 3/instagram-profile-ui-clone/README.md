# Instagram Profile UI Clone

A mobile-style Instagram UI clone built with **only HTML and CSS** (no JavaScript, no frameworks).
This project is my **Internship Task 03**.

- GitHub Repository: https://github.com/aribaamir11/internship-tasks
- Live Demo: `PASTE_YOUR_NETLIFY_OR_VERCEL_LINK_HERE`

---

## Screens

The project has 3 phone screens shown side by side:

| Screen | Name | Active tab in bottom navigation |
|--------|------|---------------------------------|
| 1 | Profile | Profile (person icon) |
| 2 | Home / Feed | Home (house icon) |
| 3 | Explore / Grid | Search (magnifier icon) |

Screen 1 - Profile: profile picture with a blue "+" badge, post / followers / following numbers, bio, Follow / Message / Contact buttons, story highlights, grid / tagged tabs and a 3-column post grid.

Screen 2 - Home / Feed: stories row, a feed post with action icons (red heart, comment, share, save), likes and caption, a second post preview, and a heart notification bubble in the bottom navigation.

Screen 3 - Explore: search bar, category tags (IGTV, Shop, Style, Sports, Music) and a mixed-size image grid.

Shared on all screens: the same status bar (time, Wi-Fi, sound, battery) and the same bottom navigation.

---

## Technologies Used

- HTML5 (semantic tags)
- CSS3 (Flexbox, CSS Grid, gradients, inline SVG icons)

---

## Project Structure

```text
instagram-profile-ui-clone/
├── index.html      -> all 3 screens (the page structure)
├── css/
│   └── style.css   -> all the styling
├── images/
│   └── profile.jpg -> profile picture
└── README.md       -> this file
```

---

## How to Run

1. Download or clone this repository.
2. Open the `index.html` file in any browser.

No installation is needed.

---

## How the Task Requirements Are Met

### 1. Semantic HTML

Semantic tags describe **what the content is**, instead of using many plain `<div>` tags. This makes the code cleaner and easier to read.

| Tag | Where I used it | Why |
|-----|-----------------|-----|
| `<section>` | Each phone screen, profile info, highlights, stories, post grid | A separate part of the page |
| `<header>` | Top bar of each screen, header of each feed post | The top part of a section |
| `<nav>` | Bottom navigation | A group of navigation links |
| `<article>` | Each feed post | One complete, independent post |
| `<main>` | Explore grid (Screen 3) | The main content of the screen |
| `<h1>`, `<h2>` | "Instagram" logo, username | Headings |
| `<a>` | Navigation icons, profile tabs | Links |
| `<button>` | Follow / Message / Contact, post action icons, tags | Clickable actions |
| `<img>` | Profile picture (with `alt` text) | Images |
| `<strong>`, `<p>`, `<span>` | Numbers, bio, small labels | Text |

Each screen is like a separate phone app, so each one has its own `<h1>` logo.

### 2. Flexbox

Flexbox is used when items must be placed in a **row or column** and aligned nicely.

| Where | Class name | What it does |
|-------|-----------|--------------|
| Status bar | `.status-bar` | Time on the left, icons on the right |
| App header | `.app-header` | "Instagram" on the left, icons on the right |
| Profile top | `.profile-top` | Picture and stats side by side |
| Stats | `.profile-stats` | Posts / Followers / Following spread evenly |
| Buttons | `.profile-buttons` | 3 buttons with equal width |
| Highlights and stories | `.highlights`, `.stories` | Circles in one horizontal row |
| Post actions | `.post-actions`, `.left-actions` | 3 icons on the left, save icon on the right |
| Bottom navigation | `.bottom-nav` | 5 icons in one row |
| Search row and tags | `.explore-search`, `.explore-tags` | Search box + scan icon, and tag buttons in a row |

### 3. CSS Grid

CSS Grid is used when items must be placed in **rows and columns like tiles**.

| Where | Class name | What it does |
|-------|-----------|--------------|
| Profile posts | `.profile-posts` | 3-column post grid |
| Explore grid | `.explore-grid` | 3-column grid with one big tile, one wide tile and one tall tile |

---

## CSS Explained (Simple Notes)

### General

| CSS | Meaning |
|-----|---------|
| `* { margin: 0; padding: 0; box-sizing: border-box; }` | Removes default browser spacing. `border-box` means padding and border are included inside the width, so sizes are easy to control. |
| `.screen` | Makes each phone: `width` and `height` set the size, `border` makes the black frame, `border-radius` rounds the corners, `overflow: hidden` hides anything that goes outside the phone. |
| `.instagram-container` | Flex container that puts the 3 phones side by side in the center of the page with a `gap` between them. |

### Flexbox properties I used

| Property | Meaning |
|----------|---------|
| `display: flex` | Turns on Flexbox. Children are placed in a row. |
| `flex-direction: column` | Places children from top to bottom instead. |
| `justify-content` | Aligns items **along the row** (`space-between` = push to both ends, `center` = middle, `space-around` = equal space around). |
| `align-items: center` | Aligns items **up and down** in the middle. |
| `gap` | Space between the items. |
| `flex: 1` | The item grows to take the free space. That is why the 3 buttons have equal width. |
| `flex-shrink: 0` | The item is not allowed to shrink (used for tags and the profile picture). |

### Grid properties I used

| Property | Meaning |
|----------|---------|
| `display: grid` | Turns on CSS Grid. |
| `grid-template-columns: repeat(3, 1fr)` | Makes 3 equal columns. `1fr` means one equal share of the space. |
| `grid-auto-rows: 62px` | Every row is 62px tall. |
| `gap: 2px` | The thin white line between the tiles. |
| `grid-column: span 2` | The tile becomes 2 columns wide. |
| `grid-row: span 2` | The tile becomes 2 rows tall. |

In the Explore grid: `.tile-2` is big (2 columns and 2 rows), `.tile-7` is wide (2 columns) and `.tile-8` is tall (2 rows).

### Positioning

| CSS | Where used | Meaning |
|-----|-----------|---------|
| `position: relative` on the parent, `position: absolute` on the child | Blue "+" badge, red notification dots, heart bubble | The small item can be placed exactly on a corner of its parent using `top`, `right`, `bottom`, `left`. |
| `position: absolute; bottom: 0` | `.bottom-nav` | Keeps the navigation fixed at the bottom of the phone. |
| `z-index: 10` | `.bottom-nav` | Keeps the navigation above the images. |

### Styling the small parts

| Part | How it is made |
|------|----------------|
| Round circles (profile picture, stories, highlights) | `border-radius: 50%` on an element with equal width and height |
| Gradient pink images and posts | `background: linear-gradient(135deg, color1, color2, color3)` |
| Icons | Inline `<svg>`. In CSS: `fill: none` (empty inside), `stroke: currentColor` (line takes the text color), `stroke-width` (line thickness), `stroke-linecap: round` (round line ends) |
| Filled red heart | `.action-icon.liked svg` sets `fill` and `stroke` to red |
| Active navigation icon | `.nav-item.active` is darker and its icon line is thicker (`stroke-width: 2.4`) |
| Story ring with white gap | A white `border` plus `box-shadow: 0 0 0 1.5px #f06b9c` makes the pink outer ring |
| Heart notification bubble | `.reaction-bubble` is a red rounded box. `::after` with transparent left and right borders and a red top border makes the small triangle pointer |
| Different shades of tiles | Classes like `.post-2` and `.tile-3` give each tile its own gradient |

### Class names used more than once

- `.notification-icon` and `.notification-dot` are used in the headers of Screen 1 and Screen 2, so the same code is reused.
- `.top-bar`, `.status-bar`, `.bottom-nav` and `.nav-item` are shared by all 3 screens, so the status bar and navigation look the same everywhere.

---

## Possible Viva Questions

Why did you use Flexbox and Grid both?
Flexbox is best for one direction (a row or a column), like headers, buttons and navigation. Grid is best for rows and columns together, like the photo grids.

**What is the difference between `<section>` and `<div>`?**
`<section>` tells the browser and the developer that this is a meaningful part of the page. `<div>` has no meaning, it is only a box.

**Why `<article>` for a post?**
A post is complete on its own, so it fits `<article>`.

**What does `box-sizing: border-box` do?**
Padding and border are counted inside the width and height, so the element does not become bigger than expected.

**How is the notification badge placed on the icon?**
The parent has `position: relative` and the badge has `position: absolute`, so it is placed relative to the parent.

**Why SVG icons and not text symbols?**
Text symbols look different in different fonts and sizes. SVG icons look the same everywhere and are easy to color and resize with CSS.

**How is the bottom navigation the same on all screens?**
All 3 screens use the same `.bottom-nav` and `.nav-item` classes. Only the `active` class moves to a different icon.

---

## Author
Ariba Amir
Internship Task 03 - Instagram Profile UI Clone