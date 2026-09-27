(function () {
  const CA = (document.body.dataset.ca || "0xcomingsoon").trim();
  const XURL = (document.body.dataset.x || "https://x.com/LaughingBull_X").trim();
  const isAddress = /^0x[a-fA-F0-9]{40}$/.test(CA);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll(".ca-text").forEach(function (node) {
    node.textContent = CA;
  });

  document.querySelectorAll("[data-xlink]").forEach(function (node) {
    node.href = XURL;
  });

  document.querySelectorAll(".x-url").forEach(function (node) {
    node.textContent = XURL.replace(/^https?:\/\//, "");
  });

  const swap = document.querySelector("[data-swap]");
  if (swap) {
    swap.href = isAddress
      ? "https://pancakeswap.finance/swap?outputCurrency=" + CA
      : "https://pancakeswap.finance/swap";
  }

  const footerCopy = document.querySelector(".footer-ca");
  if (footerCopy) footerCopy.dataset.label = CA;

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      ok ? resolve() : reject();
    });
  }

  const copyStatus = document.getElementById("copyStatus");

  document.querySelectorAll(".copy-btn").forEach(function (button) {
    button.addEventListener("click", function () {
      copyText(CA).then(function () {
        const label = button.dataset.label || "Copy";
        button.classList.add("is-copied");
        if (!button.classList.contains("footer-ca")) button.textContent = "Copied";
        if (copyStatus) copyStatus.textContent = "Contract copied";
        window.setTimeout(function () {
          button.classList.remove("is-copied");
          if (!button.classList.contains("footer-ca")) button.textContent = label;
          if (copyStatus) copyStatus.textContent = "";
        }, 1600);
      }).catch(function () {
        if (copyStatus) copyStatus.textContent = "Copy failed";
      });
    });
  });

  const intro = document.getElementById("intro");
  function dismissIntro() {
    if (!intro || intro.classList.contains("is-done")) return;
    intro.classList.add("is-done");
    try { sessionStorage.setItem("xn-intro", "1"); } catch (e) {}
    window.setTimeout(function () { intro.remove(); }, 500);
  }
  if (intro && !document.documentElement.classList.contains("skip-intro")) {
    intro.addEventListener("click", dismissIntro);
    if (!reduceMotion) window.setTimeout(dismissIntro, 1700);
    else dismissIntro();
  }

  const header = document.getElementById("header");
  const progress = document.getElementById("scrollProgress");
  const nav = document.getElementById("navLinks");
  const toggle = document.querySelector(".nav-toggle");

  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
    if (!progress) return;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (height > 0 ? (window.scrollY / height) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
  }

  const links = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
  const sections = links
    .map(function (link) { return document.querySelector(link.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-40% 0px -50% 0px" });
    sections.forEach(function (section) { spy.observe(section); });
  }

  const frame = document.getElementById("dexFrame");
  const placeholder = document.getElementById("chartPlaceholder");
  const chartStatus = document.getElementById("chartStatus");
  if (isAddress && frame) {
    frame.src = "https://dexscreener.com/bsc/" + CA + "?embed=1&loadChartSettings=0&trades=0&tabs=0&info=0&chartLeftToolbar=0&chartDefaultOnMobile=1&chartTheme=dark&theme=dark&chartStyle=1&chartType=usd&interval=15";
    frame.hidden = false;
    if (placeholder) placeholder.hidden = true;
    if (chartStatus) {
      chartStatus.textContent = "Live pair";
      chartStatus.classList.add("is-live");
    }
  } else {
    const candles = document.getElementById("candles");
    if (candles) {
      for (var i = 0; i < 42; i += 1) {
        const candle = document.createElement("span");
        const up = Math.random() > 0.46;
        candle.className = "candle" + (up ? " up" : "");
        candle.style.setProperty("--wick", (28 + Math.random() * 68) + "%");
        candle.style.setProperty("--body", (24 + Math.random() * 48) + "%");
        candle.style.animationDelay = (i * 0.025) + "s";
        candles.appendChild(candle);
      }
    }
  }

  const shots = Array.prototype.slice.call(document.querySelectorAll(".shot"));
  const dialog = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbCap = document.getElementById("lbCap");
  let shotIndex = 0;

  function showShot(index) {
    if (!shots.length || !dialog) return;
    shotIndex = (index + shots.length) % shots.length;
    const shot = shots[shotIndex];
    const image = shot.querySelector("img");
    lbImg.src = shot.dataset.full;
    lbImg.alt = image ? image.alt : "";
    lbCap.textContent = shot.dataset.cap || "";
    if (!dialog.open) dialog.showModal();
  }

  shots.forEach(function (shot, index) {
    shot.addEventListener("click", function () { showShot(index); });
  });

  const prev = document.getElementById("lbPrev");
  const next = document.getElementById("lbNext");
  const closeBtn = document.getElementById("lbClose");
  if (prev) prev.addEventListener("click", function () { showShot(shotIndex - 1); });
  if (next) next.addEventListener("click", function () { showShot(shotIndex + 1); });
  if (closeBtn) closeBtn.addEventListener("click", function () { dialog.close(); });
  if (dialog) {
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("keydown", function (event) {
      if (event.key === "ArrowRight") showShot(shotIndex + 1);
      if (event.key === "ArrowLeft") showShot(shotIndex - 1);
    });
  }

  function setupParticles() {
    const canvas = document.getElementById("fx");
    if (!canvas || reduceMotion) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gems = [];
    function seed() {
      gems.length = 0;
      const count = 18;
      for (let i = 0; i < count; i += 1) {
        gems.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          s: 3 + Math.random() * 6,
          v: 0.12 + Math.random() * 0.32,
          a: 0.12 + Math.random() * 0.28,
          r: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.012
        });
      }
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function diamond(x, y, s, rot) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.lineTo(s * 0.72, 0);
      ctx.lineTo(0, s);
      ctx.lineTo(-s * 0.72, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    let running = true;
    function tick() {
      if (!running) return;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      gems.forEach(function (gem) {
        gem.y -= gem.v;
        gem.r += gem.vr;
        if (gem.y < -20) {
          gem.y = window.innerHeight + 20;
          gem.x = Math.random() * window.innerWidth;
        }
        ctx.fillStyle = "rgba(240, 185, 11, " + gem.a + ")";
        diamond(gem.x, gem.y, gem.s, gem.r);
      });
      window.requestAnimationFrame(tick);
    }

    resize();
    seed();
    window.addEventListener("resize", function () {
      resize();
      seed();
    });
    document.addEventListener("visibilitychange", function () {
      const was = running;
      running = !document.hidden;
      if (running && !was) window.requestAnimationFrame(tick);
    });
    window.requestAnimationFrame(tick);
  }

  setupParticles();
})();
