/* Comportamentos compartilhados por todas as páginas.
   Ordem de carregamento esperada: mocks-*.js (registram LC.mocks) → main.js */
(function () {
  "use strict";
  var LC = (window.LC = window.LC || {});
  LC.mocks = LC.mocks || {};
  var root = document.documentElement;
  root.classList.remove("no-js");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mockups ---------- */
  // <div data-mock="nome" data-variant="..."></div> → LC.mocks.nome(el, el.dataset)
  // Quando existe render 3D registrado em LC.renders, ele substitui o mock desenhado
  // (data-render escolhe outra imagem; data-live mantém o mock).
  function renderImage(el, r) {
    var img = new Image();
    img.className = "render";
    img.src = LC.assetBase + r.src;
    img.alt = r.alt || "";
    if (r.w) { img.width = r.w; img.height = r.h; }
    img.loading = "lazy"; img.decoding = "async";
    img.setAttribute("data-zoom", "");
    el.innerHTML = "";
    el.appendChild(img);
    el.classList.add("is-render");
    if (r.bg) el.style.setProperty("--render-bg", r.bg);
  }
  function renderMocks(scope) {
    (scope || document).querySelectorAll("[data-mock]:not([data-mock-done])").forEach(function (el) {
      var r = LC.renders && LC.renders[el.dataset.render || el.dataset.mock];
      if (r && !("live" in el.dataset)) { renderImage(el, r); el.setAttribute("data-mock-done", ""); return; }
      var fn = LC.mocks[el.dataset.mock];
      if (!fn) { console.warn("[mock] não registrado:", el.dataset.mock); return; }
      try {
        var out = fn(el, el.dataset);
        if (typeof out === "string") el.innerHTML = out;
        el.setAttribute("data-mock-done", "");
      } catch (err) { console.error("[mock] erro em", el.dataset.mock, err); }
    });
  }
  LC.renderMocks = renderMocks;
  renderMocks();

  /* ---------- Giro 360°: <div data-spin="nome"> (config em LC.spins) ---------- */
  // Sprite com um quadro por ângulo; o mouse (ou o dedo) escolhe o quadro e,
  // parado, o objeto gira sozinho devagar.
  function initSpin(el) {
    var cfg = LC.spins && LC.spins[el.dataset.spin];
    if (!cfg) return;
    var N = cfg.frames, cols = cfg.cols, rows = Math.ceil(N / cols), fps = cfg.fps || 9;
    el.classList.add("spin");
    el.style.setProperty("--spin-ratio", cfg.w + " / " + cfg.h);
    el.style.setProperty("--spin-bg", cfg.bg || "transparent");
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "img");
    el.setAttribute("aria-label", (cfg.alt || "") + ". Passe o mouse, arraste ou use as setas para girar.");
    el.innerHTML =
      '<img class="spin__poster" src="' + LC.assetBase + cfg.poster + '" alt="" width="' + cfg.w + '" height="' + cfg.h + '" loading="lazy" decoding="async">' +
      '<div class="spin__sprite" aria-hidden="true"></div>' +
      '<span class="spin__hint" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 12a9 4 0 1 0 18 0 9 4 0 1 0-18 0"/><path d="M17 8.5l2 .8-.8 2"/></svg>360°</span>';
    var sp = el.querySelector(".spin__sprite");
    sp.style.backgroundSize = (cols * 100) + "% " + (rows * 100) + "%";
    var frame = 0, ready = false, visible = false, hover = false, dragging = false;
    var startX = 0, startF = 0, last = 0, raf = 0, resumeAt = 0;
    function show(f) {
      frame = ((Math.round(f) % N) + N) % N;
      var c = frame % cols, r = Math.floor(frame / cols);
      sp.style.backgroundPosition = (cols > 1 ? c / (cols - 1) * 100 : 0) + "% " + (rows > 1 ? r / (rows - 1) * 100 : 0) + "%";
    }
    function tick(t) {
      raf = 0;
      if (!visible || hover || dragging || reduced) return;
      if (t >= resumeAt && t - last > 1000 / fps) { last = t; show(frame + 1); }
      raf = requestAnimationFrame(tick);
    }
    function sync() { if (ready && visible && !hover && !dragging && !reduced && !raf) raf = requestAnimationFrame(tick); }
    function load() {
      if (sp.dataset.loading) return;
      sp.dataset.loading = "1";
      var img = new Image();
      img.onload = function () { sp.style.backgroundImage = "url(" + img.src + ")"; show(frame); ready = true; el.classList.add("is-ready"); sync(); };
      img.src = LC.assetBase + cfg.sprite;
    }
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { visible = e.isIntersecting; if (visible) load(); sync(); });
    }, { rootMargin: "300px 0px" }).observe(el);
    function grab(x) { startX = x; startF = frame; }
    function move(x) { if (ready) show(startF + (x - startX) / el.clientWidth * N * (cfg.sensitivity || 1)); }
    function release() { resumeAt = performance.now() + 1200; sync(); }
    el.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") { hover = true; grab(e.clientX); } });
    el.addEventListener("pointermove", function (e) { if ((e.pointerType === "mouse" && hover) || dragging) move(e.clientX); });
    el.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") { hover = false; release(); } });
    el.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse") { dragging = true; el.setPointerCapture(e.pointerId); grab(e.clientX); } });
    el.addEventListener("pointerup", function () { if (dragging) { dragging = false; release(); } });
    el.addEventListener("pointercancel", function () { dragging = false; release(); });
    el.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault(); show(frame + (e.key === "ArrowRight" ? 1 : -1)); release();
    });
  }
  document.querySelectorAll("[data-spin]").forEach(initSpin);

  /* ---------- Fotos opcionais: <figure class="ai-slot" data-ai="nome"> ---------- */
  // Exibe assets/img/ai/<nome>.webp se o arquivo existir; sem o arquivo, a figura não aparece.
  document.querySelectorAll(".ai-slot[data-ai]").forEach(function (fig) {
    var img = new Image();
    img.onload = function () {
      img.alt = fig.dataset.alt || "";
      img.setAttribute("data-zoom", "");
      fig.insertBefore(img, fig.firstChild);
      fig.classList.add("is-ready");
    };
    img.src = LC.assetBase + "img/ai/" + fig.dataset.ai + ".webp";
  });

  /* ---------- Divisão de palavras para animação ---------- */
  document.querySelectorAll("[data-split]").forEach(function (el) {
    var i = 0;
    function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          // pontuação colada num elemento anterior (ex.: "</span>,") não pode quebrar sozinha na linha
          var glue = null, prev = n.previousSibling;
          if (prev && prev.nodeType === 1 && /^\S/.test(n.textContent)) {
            glue = document.createElement("span"); glue.style.whiteSpace = "nowrap";
            prev.parentNode.insertBefore(glue, prev); glue.appendChild(prev);
          }
          n.textContent.split(/(\s+)/).forEach(function (part, k) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var w = document.createElement("span"); w.className = "split-word";
            var s = document.createElement("span"); s.textContent = part; s.style.setProperty("--i", i++);
            w.appendChild(s);
            (k === 0 && glue ? glue : frag).appendChild(w);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1 && !n.classList.contains("split-word")) {
          walk(n);
        }
      });
    }
    walk(el);
    if (!el.hasAttribute("data-reveal")) el.setAttribute("data-reveal", "fade");
  });

  /* ---------- Revelação no scroll ---------- */
  var revealEls = document.querySelectorAll("[data-reveal], .skill__bar, [data-count]");
  if ("IntersectionObserver" in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        if (e.target.hasAttribute("data-count")) countUp(e.target);
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  // atraso escalonado para filhos: <div data-stagger> <x data-reveal> ...
  document.querySelectorAll("[data-stagger]").forEach(function (p) {
    var step = parseFloat(p.dataset.stagger) || 0.08;
    p.querySelectorAll(":scope > [data-reveal]").forEach(function (c, i) { c.style.setProperty("--d", (i * step).toFixed(2) + "s"); });
  });

  /* ---------- Contadores ---------- */
  function countUp(el) {
    var to = parseFloat(el.dataset.count), dur = 1400, t0 = null, dec = (el.dataset.count.split(".")[1] || "").length;
    var suffix = el.dataset.suffix || "";
    function tick(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur), v = to * (1 - Math.pow(1 - p, 3));
      el.innerHTML = v.toFixed(dec) + (suffix ? "<sup>" + suffix + "</sup>" : "");
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Palavra rotativa ---------- */
  document.querySelectorAll(".rotator[data-words]").forEach(function (el) {
    var words = el.dataset.words.split("|"), i = 0;
    el.innerHTML = "";
    var cur = document.createElement("span"); cur.textContent = words[0]; el.appendChild(cur);
    // a largura acompanha a palavra atual (anima entre uma e outra)
    function fit(span) { el.style.width = span.getBoundingClientRect().width + "px"; }
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () { fit(cur); });
    window.addEventListener("resize", function () { el.style.width = ""; fit(cur); });
    if (reduced) return;
    setInterval(function () {
      i = (i + 1) % words.length;
      var next = document.createElement("span"); next.textContent = words[i]; next.className = "in";
      el.appendChild(next);
      fit(next);
      cur.classList.add("out");
      requestAnimationFrame(function () { requestAnimationFrame(function () { next.classList.remove("in"); }); });
      var old = cur; cur = next;
      setTimeout(function () { old.remove(); }, 800);
    }, 2200);
  });

  /* ---------- Marquee: duplica a trilha para loop contínuo ---------- */
  document.querySelectorAll(".marquee").forEach(function (m) {
    var t = m.querySelector(".marquee__track");
    if (!t || m.querySelectorAll(".marquee__track").length > 1) return;
    var c = t.cloneNode(true); c.setAttribute("aria-hidden", "true"); m.appendChild(c);
  });

  /* ---------- Navegação: fundo ao rolar, esconde ao descer ---------- */
  var nav = document.querySelector(".nav"), lastY = 0;
  function onScroll() {
    var y = window.scrollY;
    if (nav) {
      nav.classList.toggle("is-scrolled", y > 24);
      nav.classList.toggle("is-hidden", y > 400 && y > lastY + 4);
      if (y < lastY - 4) nav.classList.remove("is-hidden");
    }
    lastY = y;
    parallax();
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Parallax leve: data-parallax="0.15" ---------- */
  var pEls = reduced ? [] : Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  function parallax() {
    var vh = window.innerHeight;
    pEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var k = parseFloat(el.dataset.parallax) || 0.1;
      var off = (r.top + r.height / 2 - vh / 2) * -k;
      el.style.transform = "translate3d(0," + off.toFixed(1) + "px,0)";
    });
  }
  onScroll();

  /* ---------- Inclinação 3D no hover: data-tilt ---------- */
  if (!reduced && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll("[data-tilt]").forEach(function (el) {
      var max = parseFloat(el.dataset.tilt) || 8;
      el.style.transition = "transform .6s cubic-bezier(.16,1,.3,1)";
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = "perspective(1000px) rotateY(" + (x * max) + "deg) rotateX(" + (-y * max) + "deg)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
  }

  /* ---------- Lightbox: <img data-zoom> ---------- */
  var lb = document.createElement("div");
  lb.className = "lightbox"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true");
  lb.innerHTML = '<img alt=""><button type="button" aria-label="Fechar">×</button>';
  document.body.appendChild(lb);
  var lbImg = lb.querySelector("img");
  function closeLb() { lb.classList.remove("is-open"); }
  document.addEventListener("click", function (e) {
    var z = e.target.closest("[data-zoom]");
    if (z) {
      var src = z.dataset.zoom || z.getAttribute("src");
      if (!src) return;
      lbImg.src = src; lbImg.alt = z.getAttribute("alt") || "";
      lb.classList.add("is-open");
      return;
    }
    if (e.target === lb || e.target.closest(".lightbox button")) closeLb();
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLb(); });

  /* ---------- Cursor de marca de registro (desktop) ---------- */
  if (!reduced && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var cur = document.createElement("div");
    cur.className = "cursor"; cur.setAttribute("aria-hidden", "true");
    cur.innerHTML = '<svg viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="22" cy="22" r="9"/><circle cx="22" cy="22" r="3.5" fill="currentColor" stroke="none"/><path d="M22 2v40M2 22h40"/></svg>';
    document.body.appendChild(cur);
    var cx = 0, cy = 0, tx = 0, ty = 0;
    document.addEventListener("mousemove", function (e) { tx = e.clientX; ty = e.clientY; cur.classList.add("is-on"); });
    document.addEventListener("mouseleave", function () { cur.classList.remove("is-on"); });
    document.addEventListener("mouseover", function (e) { cur.classList.toggle("is-hover", !!e.target.closest("a, button, [data-zoom], [data-tilt]")); });
    (function loop() { cx += (tx - cx) * 0.22; cy += (ty - cy) * 0.22; cur.style.transform = "translate3d(" + cx + "px," + cy + "px,0)"; requestAnimationFrame(loop); })();
  }

  /* ---------- Abas / filtros: [data-tabs] > [data-tab=x] + [data-panel=x] ---------- */
  document.querySelectorAll("[data-tabs]").forEach(function (box) {
    var tabs = box.querySelectorAll("[data-tab]"), panels = box.querySelectorAll("[data-panel]");
    tabs.forEach(function (t) {
      t.addEventListener("click", function () {
        var k = t.dataset.tab;
        tabs.forEach(function (x) { x.setAttribute("aria-selected", x === t ? "true" : "false"); });
        panels.forEach(function (p) {
          var cats = (p.dataset.panel || "").split(" ");
          p.hidden = !(k === "all" || cats.indexOf(k) > -1);
        });
      });
    });
  });

  /* ---------- Ano no rodapé ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
