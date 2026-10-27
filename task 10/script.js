/* ===== Ariba – shared script ===== */
const ITEMS = [
  { img: "img-01.jpg", title: "Hangers",  cat: "Objects", date: "2020-09-24", views: 16008 },
  { img: "img-02.jpg", title: "Perfumes", cat: "Objects", date: "2020-09-20", views: 12860 },
  { img: "img-03.jpg", title: "Clocks",   cat: "Objects", date: "2020-10-18", views: 9906 },
  { img: "img-04.jpg", title: "Plants",   cat: "Nature",  date: "2020-10-14", views: 16100 },
  { img: "img-05.jpg", title: "Morning",  cat: "Nature",  date: "2020-10-12", views: 12460 },
  { img: "img-06.jpg", title: "Pinky",    cat: "Colors",  date: "2020-10-10", views: 11402 },
  { img: "img-07.jpg", title: "Bus",      cat: "City",    date: "2020-09-16", views: 10900 },
  { img: "img-08.jpg", title: "New York", cat: "City",    date: "2020-09-12", views: 11300 },
  { img: "img-09.jpg", title: "Abstract", cat: "Colors",  date: "2020-09-10", views: 42700 },
  { img: "img-10.jpg", title: "Flowers",  cat: "Nature",  date: "2020-09-08", views: 11402 },
  { img: "img-11.jpg", title: "Rosy",     cat: "Colors",  date: "2020-09-04", views: 32906 },
  { img: "img-12.jpg", title: "Rocki",    cat: "Nature",  date: "2020-08-28", views: 50700 },
  { img: "img-13.jpg", title: "Purple",   cat: "Colors",  date: "2020-08-22", views: 107510 },
  { img: "img-14.jpg", title: "Sea",      cat: "Nature",  date: "2020-08-14", views: 118006 },
  { img: "img-15.jpg", title: "Turtle",   cat: "Nature",  date: "2020-08-09", views: 121300 },
  { img: "img-16.jpg", title: "Peace",    cat: "Nature",  date: "2020-08-03", views: 21204 }
  // Video add karna ho to item mein  video: "meri-video.mp4"  likh do
];

const $ = (s, r = document) => r.querySelector(s);
const safe = (fn) => { try { return fn(); } catch (e) { return null; } };

/* ---------- theme ---------- */
const root = document.documentElement;
const savedTheme = safe(() => localStorage.getItem("ariba-theme"));
if (savedTheme) root.dataset.theme = savedTheme;
const themeBtn = $("#theme-btn");
function paintThemeIcon() {
  if (themeBtn) themeBtn.innerHTML = root.dataset.theme === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}
paintThemeIcon();
if (themeBtn) themeBtn.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  safe(() => localStorage.setItem("ariba-theme", root.dataset.theme));
  paintThemeIcon();
});

/* ---------- mobile menu + footer year + back to top ---------- */
const menuBtn = $("#menu-btn"), nav = $("#nav");
if (menuBtn) menuBtn.addEventListener("click", () => nav.classList.toggle("open"));
const yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();
const toTop = $("#to-top");
if (toTop) {
  window.addEventListener("scroll", () => toTop.classList.toggle("show", window.scrollY > 500));
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ---------- gallery (photos + videos pages) ---------- */
const grid = $("#grid");
if (grid) {
  const isVideo = document.body.dataset.type === "video";
  const PER_PAGE = 8;
  const state = { q: "", cat: "All", sort: "new", page: 1, list: [] };
  const likes = new Set(safe(() => JSON.parse(localStorage.getItem("ariba-likes-" + document.body.dataset.type))) || []);
  const saveLikes = () => safe(() => localStorage.setItem("ariba-likes-" + document.body.dataset.type, JSON.stringify([...likes])));
  const fmtDate = (d) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  // category chips
  const chips = $("#chips");
  ["All", ...new Set(ITEMS.map((i) => i.cat))].forEach((c) => {
    const b = document.createElement("button");
    b.className = "chip" + (c === "All" ? " on" : "");
    b.textContent = c;
    b.addEventListener("click", () => {
      state.cat = c; state.page = 1;
      chips.querySelectorAll(".chip").forEach((x) => x.classList.toggle("on", x === b));
      render();
    });
    chips.appendChild(b);
  });

  $("#search-form").addEventListener("submit", (e) => e.preventDefault());
  $("#search-input").addEventListener("input", (e) => { state.q = e.target.value.trim().toLowerCase(); state.page = 1; render(); });
  $("#sort").addEventListener("change", (e) => { state.sort = e.target.value; state.page = 1; render(); });

  function render() {
    let list = ITEMS.filter((i) =>
      (state.cat === "All" || i.cat === state.cat) &&
      (!state.q || i.title.toLowerCase().includes(state.q) || i.cat.toLowerCase().includes(state.q)));
    if (state.sort === "new") list.sort((a, b) => b.date.localeCompare(a.date));
    if (state.sort === "views") list.sort((a, b) => b.views - a.views);
    if (state.sort === "az") list.sort((a, b) => a.title.localeCompare(b.title));
    state.list = list;

    const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
    if (state.page > pages) state.page = pages;
    const slice = list.slice((state.page - 1) * PER_PAGE, state.page * PER_PAGE);
    $("#count").textContent = list.length + " results";

    grid.innerHTML = "";
    if (!slice.length) grid.innerHTML = '<div class="empty"><i class="fas fa-search fa-2x"></i><p>Kuch nahi mila, kuch aur search karo.</p></div>';
    slice.forEach((item, idx) => {
      const liked = likes.has(item.img);
      const card = document.createElement("article");
      card.className = "card";
      card.style.animationDelay = idx * 50 + "ms";
      card.innerHTML = `
        <div class="thumb">
          <img src="${item.img}" alt="${item.title}" loading="lazy">
          <span class="tag">${item.cat}</span>
          <div class="overlay"><i class="fas ${isVideo ? "fa-play" : "fa-expand"}"></i></div>
          ${isVideo ? '<span class="play-badge"><i class="fas fa-play"></i></span>' : ""}
        </div>
        <div class="card-body">
          <h3>${item.title}</h3>
          <div class="meta">
            <span>${fmtDate(item.date)} · ${item.views.toLocaleString()} views</span>
            <button class="like ${liked ? "liked" : ""}" aria-label="Like"><i class="${liked ? "fas" : "far"} fa-heart"></i></button>
          </div>
        </div>`;
      card.querySelector(".thumb").addEventListener("click", () => openLightbox(item));
      card.querySelector(".like").addEventListener("click", (e) => {
        const btn = e.currentTarget;
        likes.has(item.img) ? likes.delete(item.img) : likes.add(item.img);
        saveLikes();
        const on = likes.has(item.img);
        btn.classList.toggle("liked", on);
        btn.innerHTML = `<i class="${on ? "fas" : "far"} fa-heart"></i>`;
      });
      grid.appendChild(card);
    });
    renderPager(pages);
  }

  function renderPager(pages) {
    const p = $("#pager");
    p.innerHTML = "";
    const add = (label, page, opts = {}) => {
      const b = document.createElement("button");
      b.innerHTML = label;
      if (opts.on) b.classList.add("on");
      if (opts.disabled) b.disabled = true;
      b.addEventListener("click", () => { state.page = page; render(); window.scrollTo({ top: grid.offsetTop - 160, behavior: "smooth" }); });
      p.appendChild(b);
    };
    if (pages <= 1) return;
    add('<i class="fas fa-chevron-left"></i>', state.page - 1, { disabled: state.page === 1 });
    for (let i = 1; i <= pages; i++) add(i, i, { on: i === state.page });
    add('<i class="fas fa-chevron-right"></i>', state.page + 1, { disabled: state.page === pages });
  }

  /* lightbox */
  const lb = $("#lightbox"), lbBody = $("#lb-body");
  let current = 0;
  function show() {
    const item = state.list[current];
    if (!item) return;
    const media = isVideo
      ? `<video src="${item.video || "hero.mp4"}" poster="${item.img}" controls autoplay></video>`
      : `<img src="${item.img}" alt="${item.title}">`;
    lbBody.innerHTML = `${media}<h3>${item.title}</h3><p>${item.cat} · ${fmtDate(item.date)} · ${item.views.toLocaleString()} views</p>`;
  }
  function openLightbox(item) { current = state.list.indexOf(item); show(); lb.classList.add("open"); document.body.style.overflow = "hidden"; }
  function closeLightbox() { lb.classList.remove("open"); lbBody.innerHTML = ""; document.body.style.overflow = ""; }
  function step(d) { current = (current + d + state.list.length) % state.list.length; show(); }
  $("#lb-close").addEventListener("click", closeLightbox);
  $("#lb-prev").addEventListener("click", () => step(-1));
  $("#lb-next").addEventListener("click", () => step(1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  // hero video play/pause (videos page)
  const hv = $("#hero-video"), ht = $("#hero-toggle");
  if (hv && ht) ht.addEventListener("click", () => {
    hv.paused ? hv.play() : hv.pause();
    ht.innerHTML = hv.paused ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';
  });

  render();
}

/* ---------- about page: count-up numbers ---------- */
document.querySelectorAll("[data-count]").forEach((el) => {
  const target = +el.dataset.count;
  const io = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    io.disconnect();
    const t0 = performance.now();
    (function tick(t) {
      const k = Math.min((t - t0) / 1200, 1);
      el.textContent = Math.floor(target * k).toLocaleString() + (k === 1 ? "+" : "");
      if (k < 1) requestAnimationFrame(tick);
    })(t0);
  });
  io.observe(el);
});

/* ---------- contact form ---------- */
const form = $("#contact-form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll(".field").forEach((f) => {
      const input = f.querySelector("input, textarea");
      if (!input) return;
      let bad = !input.value.trim();
      if (input.type === "email") bad = !/^\S+@\S+\.\S+$/.test(input.value);
      f.classList.toggle("bad", bad);
      if (bad) ok = false;
    });
    if (!ok) return;
    form.reset();
    $("#success").classList.add("show");
    setTimeout(() => $("#success").classList.remove("show"), 5000);
  });
}