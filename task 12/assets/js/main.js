document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("topNav");
  const toTop = document.getElementById("toTop");

  // Navbar shadow + back-to-top button
  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
    toTop.classList.toggle("show", window.scrollY > 500);
  };
  window.addEventListener("scroll", onScroll);
  onScroll();
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Close mobile menu after clicking a link
  document.querySelectorAll("#mainNav a").forEach(a => a.addEventListener("click", () => {
    const menu = document.getElementById("mainNav");
    if (menu.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(menu).hide();
  }));

  // Typing words in hero
  const words = ["brands", "websites", "apps", "posters"];
  const typed = document.getElementById("typed");
  let w = 0, c = 0, del = false;
  (function tick() {
    const word = words[w];
    c += del ? -1 : 1;
    typed.textContent = word.slice(0, c);
    let delay = del ? 60 : 110;
    if (!del && c === word.length) { del = true; delay = 1400; }
    else if (del && c === 0) { del = false; w = (w + 1) % words.length; delay = 300; }
    setTimeout(tick, delay);
  })();

  // Counting numbers when visible
  const counters = document.querySelectorAll(".count");
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, to = +el.dataset.to;
      let n = 0;
      const step = Math.max(1, Math.round(to / 50));
      const t = setInterval(() => { n = Math.min(to, n + step); el.textContent = n; if (n >= to) clearInterval(t); }, 30);
      io.unobserve(el);
    });
  }, { threshold: .6 });
  counters.forEach(c => io.observe(c));

  // Portfolio filter
  const chips = document.querySelectorAll(".chip");
  chips.forEach(chip => chip.addEventListener("click", () => {
    chips.forEach(x => x.classList.remove("active"));
    chip.classList.add("active");
    const f = chip.dataset.filter;
    document.querySelectorAll(".work").forEach(item => item.classList.toggle("hide", f !== "all" && item.dataset.cat !== f));
  }));

  // Info modal content
  document.getElementById("infoModal").addEventListener("show.bs.modal", e => {
    const b = e.relatedTarget;
    document.getElementById("infoTitle").textContent = b.dataset.title;
    document.getElementById("infoText").textContent = b.dataset.text;
  });

  // Contact form validation
  const form = document.getElementById("contactForm");
  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.querySelectorAll(".form-control").forEach(i => i.classList.toggle("is-invalid", !i.checkValidity()));
      return;
    }
    form.reset();
    form.querySelectorAll(".form-control").forEach(i => i.classList.remove("is-invalid"));
    bootstrap.Toast.getOrCreateInstance(document.getElementById("okToast")).show();
  });
  form.querySelectorAll(".form-control").forEach(i => i.addEventListener("input", () => i.classList.toggle("is-invalid", !i.checkValidity())));
});