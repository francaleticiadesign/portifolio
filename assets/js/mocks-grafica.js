/* Mockups da trilha gráfica: embalagens, catálogos, PDV e pré-impressão.
   Cada função recebe (el, dataset) e devolve uma string HTML/SVG.
   Depende de mocks-core.js (window.LC). */
(function () {
  "use strict";
  var LC = (window.LC = window.LC || {});
  var M = (LC.mocks = LC.mocks || {});
  var REDUCED = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  /* ---------- utilidades ---------- */
  var seq = 0;
  function uid(p) { seq += 1; return "gr" + p + seq; }

  var FAM = {
    d: "Bricolage Grotesque, Helvetica Neue, Arial, sans-serif",
    b: "Instrument Sans, Helvetica Neue, Arial, sans-serif",
    s: "Instrument Serif, Georgia, serif",
    m: "JetBrains Mono, ui-monospace, monospace"
  };

  // texto SVG: o = { f: d|b|s|m, w: peso, c: cor, a: âncora, ls: espaçamento, i: itálico, op: opacidade, x: atributos extras }
  function tx(x, y, s, size, o) {
    o = o || {};
    var a = ' font-family="' + FAM[o.f || "b"] + '" font-size="' + size + '"';
    if (o.w) a += ' font-weight="' + o.w + '"';
    a += ' fill="' + (o.c || "currentColor") + '"';
    if (o.a) a += ' text-anchor="' + o.a + '"';
    if (o.ls != null) a += ' letter-spacing="' + o.ls + '"';
    if (o.i) a += ' font-style="italic"';
    if (o.op != null) a += ' opacity="' + o.op + '"';
    if (o.x) a += " " + o.x;
    return '<text x="' + x + '" y="' + y + '"' + a + ">" + s + "</text>";
  }
  // várias linhas de texto com entrelinha fixa
  function lines(x, y, arr, size, lh, o) {
    return arr.map(function (s, i) { return tx(x, +(y + i * lh).toFixed(1), s, size, o); }).join("");
  }
  function rng(seed) {
    var s = seed || 1;
    return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  }
  function f2(n) { return +n.toFixed(2); }

  // brilho que percorre uma área (simula verniz localizado / hot stamping)
  function sheen(id, dur, delay) {
    var anim = REDUCED ? "" :
      '<animateTransform attributeName="gradientTransform" type="translate" values="-1.2 0;1.2 0;1.2 0" keyTimes="0;.55;1" dur="' + (dur || 5) + 's" begin="' + (delay || 0) + 's" repeatCount="indefinite"/>';
    return '<linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2=".35">' +
      '<stop offset=".30" stop-color="#fff" stop-opacity="0"/><stop offset=".46" stop-color="#fff" stop-opacity=".55"/>' +
      '<stop offset=".5" stop-color="#fff" stop-opacity=".9"/><stop offset=".54" stop-color="#fff" stop-opacity=".55"/>' +
      '<stop offset=".70" stop-color="#fff" stop-opacity="0"/>' + anim + "</linearGradient>";
  }

  // sombreamento cilíndrico (potes, garrafas, frascos)
  function cylGrad(id, k) {
    k = k || 1;
    return '<linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0" stop-color="#000" stop-opacity="' + (.34 * k) + '"/>' +
      '<stop offset=".12" stop-color="#000" stop-opacity="' + (.08 * k) + '"/>' +
      '<stop offset=".27" stop-color="#fff" stop-opacity="' + (.42 * k) + '"/>' +
      '<stop offset=".36" stop-color="#fff" stop-opacity="0"/>' +
      '<stop offset=".72" stop-color="#000" stop-opacity="' + (.04 * k) + '"/>' +
      '<stop offset=".9" stop-color="#000" stop-opacity="' + (.2 * k) + '"/>' +
      '<stop offset="1" stop-color="#000" stop-opacity="' + (.4 * k) + '"/></linearGradient>';
  }

  /* ---------- Código de barras EAN-13 (codificação real, prefixo 789) ---------- */
  var EAN_L = ["0001101", "0011001", "0010011", "0111101", "0100011", "0110001", "0101111", "0111011", "0110111", "0001011"];
  var EAN_G = ["0100111", "0110011", "0011011", "0100001", "0011101", "0111001", "0000101", "0010001", "0001001", "0010111"];
  var EAN_R = ["1110010", "1100110", "1101100", "1000010", "1011100", "1001110", "1010000", "1000100", "1001000", "1110100"];
  var EAN_P = ["LLLLLL", "LLGLGG", "LLGGLG", "LLGGGL", "LGLLGG", "LGGLLG", "LGGGLL", "LGLGLG", "LGLGGL", "LGGLGL"];
  function eanDigits(seed) {
    var r = rng(seed * 7 + 3), d = [7, 8, 9], sum = 0;
    while (d.length < 12) d.push(Math.floor(r() * 10));
    d.forEach(function (v, i) { sum += v * (i % 2 ? 3 : 1); });
    d.push((10 - (sum % 10)) % 10);
    return d;
  }
  // desenha em (x,y) com largura w e barras de altura h; o texto ocupa ~9 módulos abaixo
  function ean(x, y, w, h, seed, color) {
    var d = eanDigits(seed || 1), par = EAN_P[d[0]], bits = "101", i;
    for (i = 1; i < 7; i++) bits += (par[i - 1] === "L" ? EAN_L : EAN_G)[d[i]];
    bits += "01010";
    for (i = 7; i < 13; i++) bits += EAN_R[d[i]];
    bits += "101";
    var m = w / 102, ox = x + 7 * m, out = "";
    for (i = 0; i < 95; i++) {
      if (bits[i] !== "1") continue;
      var guard = i < 3 || (i >= 45 && i < 50) || i >= 92;
      out += '<rect x="' + f2(ox + i * m) + '" y="' + y + '" width="' + f2(m + .05) + '" height="' + f2(h + (guard ? 5 * m : 0)) + '"/>';
    }
    var fs = f2(9 * m), ty = f2(y + h + 8.6 * m), txt = "";
    txt += tx(f2(x + 3 * m), ty, d[0], fs, { f: "m", a: "middle", c: color });
    for (i = 1; i < 7; i++) txt += tx(f2(ox + (3 + (i - 1) * 7 + 3.5) * m), ty, d[i], fs, { f: "m", a: "middle", c: color });
    for (i = 7; i < 13; i++) txt += tx(f2(ox + (50 + (i - 7) * 7 + 3.5) * m), ty, d[i], fs, { f: "m", a: "middle", c: color });
    return '<g fill="' + color + '">' + out + "</g>" + txt;
  }
  function eanSvg(w, h, seed, color, label) {
    var m = w / 102;
    return '<svg viewBox="0 0 ' + w + " " + f2(h + 10 * m) + '" aria-hidden="true">' + ean(0, 0, w, h, seed, color || "#111") + "</svg>";
  }
  LC.ean = eanSvg;

  /* ---------- Produtos ilustrados (centrados em 0,0; cabem em ±100 × ±70) ---------- */
  function prodDefs(id) {
    return '<linearGradient id="' + id + 'gb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#666e78"/><stop offset=".2" stop-color="#2e3339"/><stop offset=".72" stop-color="#16181c"/><stop offset="1" stop-color="#0a0b0d"/></linearGradient>' +
      '<linearGradient id="' + id + 'gh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0f1113"/><stop offset=".45" stop-color="#3d434a"/><stop offset="1" stop-color="#0d0e10"/></linearGradient>' +
      '<radialGradient id="' + id + 'gr" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#f6f7f8"/><stop offset=".55" stop-color="#9aa1aa"/><stop offset="1" stop-color="#454a52"/></radialGradient>' +
      '<linearGradient id="' + id + 'fb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#555c65"/><stop offset=".5" stop-color="#2b2f35"/><stop offset="1" stop-color="#15171a"/></linearGradient>' +
      '<linearGradient id="' + id + 'mt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3f4f6"/><stop offset=".5" stop-color="#a9afb7"/><stop offset="1" stop-color="#686e77"/></linearGradient>';
  }
  function gunShape(id, acc, uv) {
    var grip = "";
    for (var y = 98; y <= 150; y += 8) grip += '<path d="M' + f2(111 + (y - 78) * .06) + " " + y + "H" + f2(146 + (y - 78) * .08) + '"/>';
    var clip = '<clipPath id="' + id + 'gc"><rect x="46" y="32" width="138" height="52" rx="26"/><path d="M108 78h36l8 78q1 10-9 10h-20q-10 0-10-10z"/><circle cx="17" cy="58" r="16"/></clipPath>';
    return (uv ? "<defs>" + clip + sheen(id + "uv", 4.8, .6) + "</defs>" : "") +
      '<path d="M108 78h36l8 78q1 10-9 10h-20q-10 0-10-10z" fill="url(#' + id + 'gh)"/>' +
      '<g stroke="#000" stroke-opacity=".45" stroke-width="1.4">' + grip + "</g>" +
      '<rect x="46" y="32" width="138" height="52" rx="26" fill="url(#' + id + 'gb)"/>' +
      '<rect x="64" y="32" width="6" height="52" fill="' + acc + '"/>' +
      '<rect x="58" y="37" width="110" height="6" rx="3" fill="#fff" opacity=".22"/>' +
      '<circle cx="171" cy="58" r="17" fill="#0a0b0c" stroke="#3b4047" stroke-width="2"/>' +
      '<circle cx="171" cy="58" r="11" fill="none" stroke="' + acc + '" stroke-width="2.4" stroke-dasharray="4 2.6"/>' +
      '<circle cx="171" cy="58" r="3" fill="' + acc + '"/>' +
      '<rect x="33" y="40" width="18" height="36" rx="6" fill="#24272c"/>' +
      '<rect x="20" y="51" width="16" height="14" fill="#7d848d"/><rect x="20" y="51" width="16" height="4" fill="#c9ced4"/>' +
      '<circle cx="17" cy="58" r="16" fill="url(#' + id + 'gr)"/>' +
      '<rect x="120" y="157" width="18" height="4" rx="2" fill="' + acc + '"/>' +
      (uv ? '<rect x="0" y="20" width="200" height="150" fill="url(#' + id + 'uv)" clip-path="url(#' + id + 'gc)" opacity=".55"/>' : "");
  }
  var PROD = {
    gun: function (id, acc, uv) { return '<g transform="translate(-97,-99)">' + gunShape(id, acc, uv) + "</g>"; },
    mini: function (id, acc) {
      return '<g transform="translate(-60,-62) scale(.62)">' + gunShape(id, acc) + "</g>";
    },
    neck: function (id, acc) {
      return '<path d="M-72 -34C-72 62 72 62 72 -34" fill="none" stroke="#121417" stroke-width="40" stroke-linecap="round"/>' +
        '<path d="M-72 -34C-72 62 72 62 72 -34" fill="none" stroke="url(#' + id + 'fb)" stroke-width="32" stroke-linecap="round"/>' +
        '<path d="M-80 -30C-80 50 -20 60 0 60" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="3" stroke-linecap="round"/>' +
        '<circle cx="-40" cy="24" r="16" fill="' + acc + '" opacity=".22"/><circle cx="40" cy="24" r="16" fill="' + acc + '" opacity=".22"/>' +
        '<circle cx="-72" cy="-38" r="20" fill="#1b1e22"/><circle cx="-72" cy="-38" r="13" fill="' + acc + '"/><circle cx="-76" cy="-42" r="4" fill="#fff" opacity=".5"/>' +
        '<circle cx="72" cy="-38" r="20" fill="#1b1e22"/><circle cx="72" cy="-38" r="13" fill="' + acc + '"/><circle cx="68" cy="-42" r="4" fill="#fff" opacity=".5"/>' +
        '<rect x="-16" y="46" width="32" height="10" rx="5" fill="#0c0d0f"/><circle cx="-7" cy="51" r="2.2" fill="' + acc + '"/><circle cx="1" cy="51" r="2.2" fill="#5d646d"/><circle cx="9" cy="51" r="2.2" fill="#5d646d"/>';
    },
    eye: function (id, acc) {
      return '<rect x="-100" y="-10" width="200" height="20" rx="10" fill="#121417"/>' +
        '<path d="M-86 -40h172a12 12 0 0 1 12 12v40c0 18-14 30-32 30H24c-10 0-14-14-24-14s-14 14-24 14h-50c-18 0-32-12-32-30v-40a12 12 0 0 1 12-12z" fill="url(#' + id + 'fb)"/>' +
        '<ellipse cx="-42" cy="2" rx="30" ry="20" fill="#3a4047"/><ellipse cx="42" cy="2" rx="30" ry="20" fill="#3a4047"/>' +
        '<ellipse cx="-42" cy="2" rx="18" ry="11" fill="none" stroke="' + acc + '" stroke-width="2" opacity=".85"/><ellipse cx="42" cy="2" rx="18" ry="11" fill="none" stroke="' + acc + '" stroke-width="2" opacity=".85"/>' +
        '<rect x="-14" y="-36" width="28" height="8" rx="4" fill="' + acc + '"/>' +
        '<path d="M-80 -34h160" stroke="#fff" stroke-opacity=".16" stroke-width="3" stroke-linecap="round"/>';
    },
    pillow: function (id, acc) {
      var nodes = [[-34, -18], [34, -18], [-34, 20], [34, 20]].map(function (p) {
        return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="22" fill="' + acc + '" opacity=".18"/><circle cx="' + p[0] + '" cy="' + p[1] + '" r="14" fill="#1d2024"/><circle cx="' + p[0] + '" cy="' + p[1] + '" r="9" fill="' + acc + '" opacity=".85"/><circle cx="' + (p[0] - 3) + '" cy="' + (p[1] - 3) + '" r="3" fill="#fff" opacity=".5"/>';
      }).join("");
      return '<rect x="-112" y="-12" width="20" height="24" rx="6" fill="#121417"/><rect x="92" y="-12" width="20" height="24" rx="6" fill="#121417"/>' +
        '<rect x="-98" y="-56" width="196" height="112" rx="48" fill="url(#' + id + 'fb)"/>' +
        '<rect x="-86" y="-44" width="172" height="88" rx="38" fill="none" stroke="#fff" stroke-opacity=".16" stroke-dasharray="3 4"/>' + nodes;
    },
    roller: function (id, acc) {
      return '<path d="M-74 52L22 -12" stroke="#16181b" stroke-width="16" stroke-linecap="round"/>' +
        '<path d="M-74 52L22 -12" stroke="url(#' + id + 'mt)" stroke-width="10" stroke-linecap="round" opacity=".55"/>' +
        '<path d="M22 -12l14 -24M22 -12l30 6" stroke="#9aa1aa" stroke-width="4" stroke-linecap="round"/>' +
        '<g transform="translate(52 -26) rotate(-34)"><rect x="-34" y="-17" width="68" height="34" rx="17" fill="url(#' + id + 'mt)"/>' +
        '<rect x="-30" y="-12" width="60" height="6" rx="3" fill="#fff" opacity=".6"/>' +
        '<rect x="-34" y="-17" width="68" height="34" rx="17" fill="' + acc + '" opacity=".25"/></g>' +
        '<circle cx="-50" cy="36" r="3" fill="' + acc + '"/>';
    }
  };
  function prod(kind, id, acc, x, y, s, uv) {
    return '<g transform="translate(' + x + " " + y + ") scale(" + s + ')">' + PROD[kind](id, acc, uv) + "</g>";
  }

  /* ---------- ícones de interface (HTML) ---------- */
  var ICO = {
    speed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 16a8 8 0 1 1 16 0"/><path d="M12 16l4-5"/><circle cx="12" cy="16" r="1.4" fill="currentColor"/></svg>',
    battery: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21 10v4"/><path d="M6 10h6v4H6z" fill="currentColor"/></svg>',
    usb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="4" y="8" width="16" height="8" rx="4"/><path d="M9 12h6"/></svg>',
    quiet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M17 9.5l4 5M21 9.5l-4 5"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 20V6M16 20V6M5 9l3-4 3 4M13 9l3-4 3 4M4 21h16"/></svg>',
    glass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7 3h10l-1 8a4 4 0 0 1-8 0zM12 15v5M8 21h8"/><path d="M11 3l1.5 3-2 2 1.5 3"/></svg>',
    dry: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 12a9 9 0 0 1 18 0zM12 12v6a2 2 0 0 0 4 0"/><path d="M7 4l1 2M17 4l-1 2"/></svg>',
    recycle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 5l3-2 3 5M18 10l2 4-3 5h-4M8 19H4l-1-3 3-5"/><path d="M15 8h-3M17 19l-1.5-2.5M6 11l2.8 0"/></svg>'
  };
  var TIPS = {
    ball: '<svg viewBox="0 0 40 40"><rect x="17" y="24" width="6" height="14" fill="#7d848d"/><circle cx="20" cy="15" r="11" fill="#d9dde2"/><circle cx="16" cy="11" r="3.5" fill="#fff"/></svg>',
    flat: '<svg viewBox="0 0 40 40"><rect x="17" y="20" width="6" height="18" fill="#7d848d"/><rect x="6" y="8" width="28" height="13" rx="6" fill="#d9dde2"/><rect x="9" y="10" width="14" height="3" rx="1.5" fill="#fff"/></svg>',
    bullet: '<svg viewBox="0 0 40 40"><rect x="17" y="24" width="6" height="14" fill="#7d848d"/><path d="M11 25L20 4l9 21z" fill="#d9dde2"/><path d="M15 21l5-12" stroke="#fff" stroke-width="2"/></svg>',
    fork: '<svg viewBox="0 0 40 40"><rect x="17" y="26" width="6" height="12" fill="#7d848d"/><path d="M10 10v8a10 10 0 0 0 20 0v-8" fill="none" stroke="#d9dde2" stroke-width="6" stroke-linecap="round"/><circle cx="10" cy="9" r="5" fill="#d9dde2"/><circle cx="30" cy="9" r="5" fill="#d9dde2"/></svg>'
  };

  /* ---------- YDH: caixa 3D do massageador ---------- */
  M["ydh-box"] = function (el, d) {
    var acc = d.accent || "#2de1c2", id = uid("yb");
    var gun = '<svg viewBox="-6 10 206 166" aria-hidden="true"><defs>' + prodDefs(id) +
      '<radialGradient id="' + id + 'glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="' + acc + '" stop-opacity=".45"/><stop offset="1" stop-color="' + acc + '" stop-opacity="0"/></radialGradient></defs>' +
      '<ellipse cx="100" cy="92" rx="100" ry="76" fill="url(#' + id + 'glow)"/>' +
      '<ellipse cx="128" cy="170" rx="34" ry="4" fill="#000" opacity=".5"/>' + gunShape(id, acc, true) + "</svg>";
    var front =
      '<div class="gr-yb__f gr-yb__front">' +
        '<div class="gr-yb__bar"><span class="gr-yb__logo">YDH<i></i></span><span>Wellness · Tech</span></div>' +
        '<div class="gr-yb__art">' + gun + "</div>" +
        '<div class="gr-yb__name">PULSE<span>PRO</span></div>' +
        '<div class="gr-yb__sub">Massageador percussivo</div>' +
        '<ul class="gr-yb__feats">' +
          "<li>" + ICO.speed + "<span>6 níveis</span></li>" +
          "<li>" + ICO.battery + "<span>Até 4 h</span></li>" +
          "<li>" + ICO.usb + "<span>USB-C</span></li>" +
          "<li>" + ICO.quiet + "<span>Silencioso</span></li>" +
        "</ul>" +
      "</div>";
    var tip = function (k, n, t) { return "<li>" + TIPS[k] + "<span><b>" + n + "</b>" + t + "</span></li>"; };
    var back =
      '<div class="gr-yb__f gr-yb__back">' +
        '<div class="gr-yb__bar"><span class="gr-yb__logo">YDH<i></i></span><span>Pulse Pro</span></div>' +
        '<b class="gr-yb__h">4 ponteiras.<br><span>Um alvo para cada músculo.</span></b>' +
        '<ul class="gr-yb__tips">' + tip("ball", "Esférica", "Grandes grupos") + tip("flat", "Plana", "Áreas densas") + tip("bullet", "Cônica", "Pontos de tensão") + tip("fork", "Garfo", "Coluna e pescoço") + "</ul>" +
        '<div class="gr-yb__how"><b>Como usar</b><ol><li>Encaixe a ponteira</li><li>Ligue no nível 1</li><li>Deslize 60 s por região</li></ol></div>' +
        "<small>Leia o manual antes de usar. Não aplique sobre ossos, articulações ou lesões.</small>" +
      "</div>";
    var right =
      '<div class="gr-yb__f gr-yb__right">' +
        "<b>Especificações</b>" +
        "<dl><div><dt>Velocidade</dt><dd>1.800 a 3.200 rpm</dd></div><div><dt>Amplitude</dt><dd>10 mm</dd></div><div><dt>Bateria</dt><dd>2.500 mAh</dd></div><div><dt>Recarga</dt><dd>USB-C · 3 h</dd></div><div><dt>Peso</dt><dd>650 g</dd></div></dl>" +
        "<b>Conteúdo</b>" +
        "<ul><li>1 massageador</li><li>4 ponteiras</li><li>1 cabo USB-C</li><li>1 estojo</li><li>Manual</li></ul>" +
        '<div class="gr-yb__sym">' + ICO.up + ICO.glass + ICO.dry + ICO.recycle + "</div>" +
      "</div>";
    var left =
      '<div class="gr-yb__f gr-yb__left"><span class="gr-yb__vert">PULSE<em>PRO</em></span><div class="gr-yb__bc">' + eanSvg(84, 30, 11) + "</div></div>";
    var lid = '<div class="gr-yb__f gr-yb__lid"><span class="gr-yb__logo">YDH<i></i></span><small>Pulse Pro · Massageador percussivo</small></div>';
    var base = '<div class="gr-yb__f gr-yb__base"></div>';
    return (
      '<div class="gr-yb-scene" role="img" aria-label="Caixa 3D do massageador percussivo YDH Pulse Pro: frente com ilustração do produto em verniz localizado, laterais com especificações e código de barras">' +
        '<div class="gr-yb" style="--acc:' + acc + '">' + front + back + right + left + lid + base + "</div>" +
        '<div class="gr-yb__shadow"></div>' +
      "</div>"
    );
  };

  /* ---------- YDH: catálogo aberto (spread) ---------- */
  M["ydh-catalog"] = function () {
    var id = uid("yc"), acc = "#2de1c2";
    var L = "M70 56Q330 44 600 62L600 724Q330 712 70 720Z", R = "M600 62Q870 44 1130 56L1130 720Q870 712 600 724Z";
    var cards = [
      ["gun", "Pulse Pro", "YD-MP01", "6 níveis · 4 ponteiras", "Cx. master c/ 10 un.", .44, 1],
      ["mini", "Pulse Mini", "YD-MP02", "4 níveis · cabe na bolsa", "Cx. master c/ 20 un.", .62, 0],
      ["neck", "Massageador Cervical", "YD-MC03", "Calor + vibração", "Cx. master c/ 12 un.", .4, 0],
      ["eye", "Massageador Ocular", "YD-MO04", "Compressão a ar + calor", "Cx. master c/ 12 un.", .4, 0],
      ["pillow", "Almofada Shiatsu", "YD-AS05", "4 nódulos rotativos", "Cx. master c/ 8 un.", .38, 0],
      ["roller", "Massageador Facial", "YD-MF06", "Rolo com microvibração", "Cx. master c/ 24 un.", .46, 0]
    ].map(function (c, i) {
      var x = 640 + (i % 2) * 240, y = 172 + Math.floor(i / 2) * 170;
      return '<g transform="translate(' + x + " " + y + ')">' +
        '<rect width="220" height="96" rx="10" fill="url(#' + id + 'card)"/>' +
        '<ellipse cx="110" cy="84" rx="62" ry="5" fill="#000" opacity=".12"/>' +
        prod(c[0], id, acc, 110, 48, c[5]) +
        (c[6] ? '<rect x="10" y="10" width="44" height="16" rx="8" fill="#121417"/>' + tx(32, 21.5, "NOVO", 8, { f: "m", c: acc, a: "middle", ls: 1 }) : "") +
        tx(0, 118, c[1], 13.5, { f: "d", w: 700, c: "#121417", ls: -.3 }) +
        tx(220, 118, c[2], 8.5, { f: "m", c: "#7a8189", a: "end" }) +
        '<circle cx="4" cy="132" r="2.4" fill="' + acc + '"/>' + tx(12, 135, c[3], 10, { c: "#3a4047" }) +
        '<circle cx="4" cy="148" r="2.4" fill="#b7bcc2"/>' + tx(12, 151, c[4], 10, { c: "#3a4047" }) +
        "</g>";
    }).join("");
    var feats = [
      ["Motor silencioso", ["Potência para usar em", "casa ou no trabalho."]],
      ["Bateria que dura", ["Recarga USB-C e até", "4 h de uso contínuo."]],
      ["4 ponteiras", ["Uma para cada grupo", "muscular e intensidade."]]
    ].map(function (f, i) {
      var x = 100 + i * 162;
      return '<circle cx="' + (x + 12) + '" cy="512" r="12" fill="none" stroke="' + acc + '" stroke-width="1.6"/>' +
        tx(x + 12, 516, "0" + (i + 1), 8.5, { f: "m", c: "#121417", a: "middle" }) +
        tx(x, 548, f[0], 13, { f: "d", w: 700, c: "#121417", ls: -.2 }) +
        lines(x, 566, f[1], 10, 14, { c: "#5a6068" });
    }).join("");
    var tabs = [["Massagem", acc, 120], ["Áudio", "#ffc23d", 214], ["Energia", "#9b8cff", 308]].map(function (t, i) {
      return '<path d="M1128 ' + t[2] + "h14a6 6 0 0 1 6 6v78a6 6 0 0 1-6 6h-14z\" fill=\"" + t[1] + '"' + (i ? ' opacity=".9"' : "") + "/>" +
        tx(1139, t[2] + 45, t[0], 8, { f: "m", c: "#121417", a: "middle", ls: 1, x: 'transform="rotate(90 1139 ' + (t[2] + 45) + ')"' });
    }).join("");
    var streaks = "";
    for (var i = 0; i < 9; i++) streaks += '<path d="M' + (220 + i * 46) + " 470L" + (420 + i * 46) + ' 40" stroke="' + acc + '" stroke-opacity="' + (.05 + (i % 3) * .03) + '" stroke-width="1"/>';
    return (
      '<svg viewBox="0 0 1200 770" role="img" aria-label="Catálogo de produtos YDH aberto: página de abertura com o massageador Pulse Pro e página de linha com seis massageadores, códigos e quantidade por caixa master">' +
      "<defs>" + prodDefs(id) +
        '<filter id="' + id + 'sh" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="22" stdDeviation="20" flood-color="#000" flood-opacity=".32"/></filter>' +
        '<clipPath id="' + id + 'cl"><path d="' + L + '"/></clipPath>' +
        '<linearGradient id="' + id + 'img" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0d1214"/><stop offset=".6" stop-color="#132a2c"/><stop offset="1" stop-color="#0b3b38"/></linearGradient>' +
        '<radialGradient id="' + id + 'glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="' + acc + '" stop-opacity=".5"/><stop offset="1" stop-color="' + acc + '" stop-opacity="0"/></radialGradient>' +
        '<linearGradient id="' + id + 'gl" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset=".7" stop-color="#000" stop-opacity=".06"/><stop offset="1" stop-color="#000" stop-opacity=".26"/></linearGradient>' +
        '<linearGradient id="' + id + 'gr2" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".25" stop-color="#000" stop-opacity=".04"/><stop offset=".4" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
        '<linearGradient id="' + id + 'card" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1f3f4"/><stop offset="1" stop-color="#e2e6e9"/></linearGradient>' +
      "</defs>" +
      '<ellipse cx="600" cy="736" rx="560" ry="18" fill="#000" opacity=".25" filter="url(#' + id + 'sh)"/>' +
      '<g filter="url(#' + id + 'sh)">' +
        '<path d="M64 60Q330 48 600 66L600 728Q330 716 64 724Z" fill="#e7e4dd"/><path d="M1136 60Q870 48 600 66L600 728Q870 716 1136 724Z" fill="#e7e4dd"/>' +
        '<path d="' + L + '" fill="#fbfaf7"/><path d="' + R + '" fill="#fbfaf7"/>' +
      "</g>" +
      // página esquerda
      '<g clip-path="url(#' + id + 'cl)">' +
        '<rect x="60" y="40" width="545" height="432" fill="url(#' + id + 'img)"/>' + streaks +
        '<ellipse cx="452" cy="320" rx="220" ry="160" fill="url(#' + id + 'glow)"/>' +
        '<ellipse cx="476" cy="440" rx="96" ry="9" fill="#000" opacity=".45"/>' +
        prod("gun", id, acc, 452, 336, 1.3, true) +
        tx(100, 104, "LINHA WELLNESS", 11, { f: "m", c: acc, ls: 2 }) +
        tx(100, 152, "Recuperação", 46, { f: "d", w: 800, c: "#fff", ls: -1.8 }) +
        tx(100, 196, "que cabe na", 46, { f: "d", w: 800, c: "#fff", ls: -1.8 }) +
        tx(100, 244, "sua rotina.", 50, { f: "s", i: 1, c: acc, ls: -1 }) +
        '<rect x="100" y="404" width="132" height="34" rx="17" fill="none" stroke="#fff" stroke-opacity=".4"/>' + tx(166, 425, "PULSE PRO →", 10, { f: "m", c: "#fff", a: "middle", ls: 1 }) +
        feats +
        '<path d="M100 650H570" stroke="#d9dcdf"/>' +
        tx(100, 690, "02", 11, { f: "m", c: "#121417" }) + tx(570, 690, "YDH · CATÁLOGO DE PRODUTOS", 8.5, { f: "m", c: "#7a8189", a: "end", ls: 1 }) +
      "</g>" +
      // página direita
      tx(640, 106, "MASSAGEM &amp; BEM-ESTAR", 10, { f: "m", c: "#0e9f88", ls: 2 }) +
      tx(640, 146, "Massageadores", 38, { f: "d", w: 800, c: "#121417", ls: -1.4 }) +
      tx(1100, 146, "6 itens", 10, { f: "m", c: "#7a8189", a: "end" }) +
      cards +
      '<path d="M640 692H1100" stroke="#d9dcdf"/>' +
      tx(640, 712, "Venda em caixa master · consulte cores disponíveis", 8.5, { f: "m", c: "#7a8189" }) + tx(1100, 712, "03", 11, { f: "m", c: "#121417", a: "end" }) +
      tabs +
      // dobra central
      '<rect x="520" y="40" width="80" height="700" fill="url(#' + id + 'gl)" clip-path="url(#' + id + 'cl)"/>' +
      '<path d="' + R + '" fill="url(#' + id + 'gr2)"/>' +
      '<path d="M600 62V724" stroke="#000" stroke-opacity=".18"/>' +
      "</svg>"
    );
  };

  /* ---------- YDH: família de caixas (desdobramento da linha) ---------- */
  M["ydh-family"] = function () {
    var id = uid("yf");
    var items = [
      { k: "gun", n: "PULSE", n2: "PRO", sub: "Massageador percussivo", cat: "Percussão", acc: "#2de1c2", w: 210, h: 262, s: .78, x: 70 },
      { k: "neck", n: "NECK", n2: "RELAX", sub: "Massageador cervical", cat: "Cervical", acc: "#ff7a59", w: 236, h: 200, s: .7, x: 340 },
      { k: "eye", n: "EYE", n2: "CALM", sub: "Massageador ocular", cat: "Olhos", acc: "#a597ff", w: 214, h: 168, s: .72, x: 636 },
      { k: "pillow", n: "SHIATSU", n2: "", sub: "Almofada massageadora", cat: "Costas", acc: "#ffc23d", w: 214, h: 228, s: .68, x: 910 }
    ];
    var base = 470, dx = 44, dy = -26, defs = "", body = "", refl = "";
    items.forEach(function (it, i) {
      var x = it.x, y = base - it.h, w = it.w, h = it.h, gid = id + "b" + i;
      var face =
        '<rect width="' + w + '" height="' + h + '" fill="url(#' + id + 'face)"/>' +
        '<rect width="' + w + '" height="' + h + '" fill="url(#' + id + 'lit)"/>' +
        tx(14, 24, "YDH", 15, { f: "d", w: 800, c: "#fff", ls: -.5 }) + '<circle cx="54" cy="19" r="3" fill="' + it.acc + '"/>' +
        tx(w - 14, 23, it.cat.toUpperCase(), 7.5, { f: "m", c: it.acc, a: "end", ls: 1.2 }) +
        '<ellipse cx="' + w / 2 + '" cy="' + (h * .46) + '" rx="' + (w * .4) + '" ry="' + (h * .26) + '" fill="url(#' + id + 'g' + i + ')"/>' +
        prod(it.k, gid, it.acc, w / 2, h * .46, it.s * Math.min(1, h / 230)) +
        tx(14, h - 40, it.n + (it.n2 ? ' <tspan fill="none" stroke="' + it.acc + '" stroke-width="1">' + it.n2 + "</tspan>" : ""), 22, { f: "d", w: 800, c: "#fff", ls: -.6 }) +
        tx(14, h - 24, it.sub, 9, { c: "#a9b0b8" }) +
        '<rect y="' + (h - 7) + '" width="' + w + '" height="7" fill="' + it.acc + '"/>';
      defs += prodDefs(gid) +
        '<radialGradient id="' + id + "g" + i + '" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="' + it.acc + '" stop-opacity=".38"/><stop offset="1" stop-color="' + it.acc + '" stop-opacity="0"/></radialGradient>';
      var obj =
        // lateral direita (paralelogramo)
        '<path d="M' + (x + w) + " " + y + "l" + dx + " " + dy + "v" + h + "l" + (-dx) + " " + (-dy) + 'z" fill="#0c0d0f"/>' +
        '<path d="M' + (x + w) + " " + y + "l" + dx + " " + dy + "v" + h + "l" + (-dx) + " " + (-dy) + 'z" fill="' + it.acc + '" opacity=".12"/>' +
        '<g transform="matrix(1 ' + f2(dy / dx) + " 0 1 " + (x + w) + " " + y + ')">' +
          tx(dx / 2 + 3, h / 2, it.n, 13, { f: "d", w: 800, c: it.acc, a: "middle", x: 'transform="rotate(90 ' + (dx / 2 + 3) + " " + h / 2 + ')"' }) + "</g>" +
        // tampa
        '<path d="M' + x + " " + y + "l" + dx + " " + dy + "h" + w + "l" + (-dx) + " " + (-dy) + 'z" fill="#41474f"/>' +
        '<path d="M' + x + " " + y + "l" + dx + " " + dy + "h" + w + "l" + (-dx) + " " + (-dy) + 'z" fill="' + it.acc + '" opacity=".08"/>' +
        '<path d="M' + (x + w * .5) + " " + y + "l" + dx + " " + dy + '" stroke="#000" stroke-opacity=".35"/>' +
        // frente
        '<g transform="translate(' + x + " " + y + ')">' + face + "</g>";
      body += '<g id="' + id + "o" + i + '">' + obj + "</g>";
      refl += '<use href="#' + id + "o" + i + '"/>';
    });
    return (
      '<svg viewBox="0 130 1200 450" role="img" aria-label="Família de caixas YDH: quatro formatos diferentes com a mesma grade de layout e uma cor de acento por categoria de produto">' +
      "<defs>" + defs +
        '<linearGradient id="' + id + 'face" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22262b"/><stop offset="1" stop-color="#121417"/></linearGradient>' +
        '<linearGradient id="' + id + 'lit" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".15"/></linearGradient>' +
        '<linearGradient id="' + id + 'rf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
        '<mask id="' + id + 'mk" maskUnits="userSpaceOnUse" x="0" y="470" width="1200" height="150"><rect x="0" y="470" width="1200" height="150" fill="url(#' + id + 'rf)"/></mask>' +
        '<filter id="' + id + 'bl" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="8"/></filter>' +
      "</defs>" +
      items.map(function (it) { return '<ellipse cx="' + (it.x + it.w / 2 + 12) + '" cy="' + (base + 4) + '" rx="' + (it.w / 2 + 16) + '" ry="10" fill="#000" opacity=".55" filter="url(#' + id + 'bl)"/>'; }).join("") +
      tx(70, 166, "MESMA GRADE · QUATRO FORMATOS · UMA COR POR CATEGORIA", 10, { f: "m", c: "#8f969e", ls: 1.6 }) +
      tx(1130, 166, "PERCUSSÃO · CERVICAL · OLHOS · COSTAS", 10, { f: "m", c: "#5d646d", a: "end", ls: 1.4 }) +
      body +
      '<g mask="url(#' + id + 'mk)"><g transform="translate(0 ' + (base * 2) + ') scale(1 -1)">' + refl + "</g></g>" +
      "</svg>"
    );
  };

  /* ---------- Vial Laticínios: sistema de cor por sabor ---------- */
  var VIAL_NAVY = "#13315c";
  var VIAL = {
    natural: { n: "Natural", c: "#1f5aa6", d: "#123c73", l: "#dce8f6", f: "milk", p: "2945 C" },
    morango: { n: "Morango", c: "#e0354f", d: "#a51e35", l: "#fbd5dc", f: "strawberry", p: "1925 C" },
    pessego: { n: "Pêssego", c: "#f08a24", d: "#b85e0c", l: "#fde3c6", f: "peach", p: "1495 C" },
    coco: { n: "Coco", c: "#12a39b", d: "#0b6d68", l: "#cdeeea", f: "coconut", p: "7710 C" },
    ameixa: { n: "Ameixa", c: "#7a2c78", d: "#511a50", l: "#ecd6eb", f: "plum", p: "2425 C" }
  };
  LC.vialFlavors = VIAL;

  function fruitDefs(id) {
    return '<radialGradient id="' + id + 'fs" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#ff7a86"/><stop offset=".6" stop-color="#e2233f"/><stop offset="1" stop-color="#a50f27"/></radialGradient>' +
      '<radialGradient id="' + id + 'fp" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#ffd89a"/><stop offset=".5" stop-color="#f7953a"/><stop offset="1" stop-color="#d94b2b"/></radialGradient>' +
      '<radialGradient id="' + id + 'fa" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#c46ac0"/><stop offset=".55" stop-color="#7a2c78"/><stop offset="1" stop-color="#3f1240"/></radialGradient>' +
      '<radialGradient id="' + id + 'fc" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#9a6a43"/><stop offset="1" stop-color="#4a2c16"/></radialGradient>' +
      '<radialGradient id="' + id + 'fm" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#f1f5fa"/><stop offset="1" stop-color="#c9d7e8"/></radialGradient>';
  }
  function fruit(kind, id, x, y, s) {
    var g = "";
    if (kind === "strawberry") {
      var seeds = [[-10, -6], [0, -9], [10, -6], [-14, 4], [-4, 2], [6, 3], [14, 5], [-8, 13], [2, 12], [9, 16], [0, 22]].map(function (p) {
        return '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="1.4" ry="2.2" fill="#ffe08a"/>';
      }).join("");
      g = '<path d="M0 32C-22 20-30 0-26-10C-22-22-8-22 0-16C8-22 22-22 26-10C30 0 22 20 0 32Z" fill="url(#' + id + 'fs)"/>' + seeds +
        '<path d="M0-15L-16-24L-6-18L-12-30L0-21L12-30L6-18L16-24Z" fill="#3c9a3a"/><path d="M0-20V-30" stroke="#2f7a2d" stroke-width="3" stroke-linecap="round"/>' +
        '<ellipse cx="-12" cy="-6" rx="5" ry="8" fill="#fff" opacity=".28" transform="rotate(25 -12 -6)"/>';
    } else if (kind === "peach") {
      g = '<circle r="27" fill="url(#' + id + 'fp)"/><path d="M-2-26C-10-10-8 10 2 26" fill="none" stroke="#c4542c" stroke-width="2" opacity=".55"/>' +
        '<path d="M0-26C8-40 26-40 30-30C22-24 8-22 0-26Z" fill="#4f9a3c"/><ellipse cx="-11" cy="-9" rx="6" ry="9" fill="#fff" opacity=".3" transform="rotate(30 -11 -9)"/>';
    } else if (kind === "plum") {
      g = '<ellipse rx="24" ry="27" fill="url(#' + id + 'fa)"/><path d="M0-25C4-34 10-38 14-40" stroke="#5a3a1a" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
        '<path d="M10-36C20-44 32-38 30-30C22-30 14-30 10-36Z" fill="#4f9a3c"/><ellipse cx="-9" cy="-10" rx="5" ry="9" fill="#fff" opacity=".3" transform="rotate(25 -9 -10)"/>';
    } else if (kind === "coconut") {
      g = '<circle r="27" fill="url(#' + id + 'fc)"/><circle r="27" fill="none" stroke="#2f1a0b" stroke-width="2" stroke-dasharray="1 3"/>' +
        '<circle r="20" fill="#fffaf0"/><circle r="20" fill="none" stroke="#efe3cc" stroke-width="3"/><ellipse cx="-6" cy="-6" rx="7" ry="5" fill="#fff"/>';
    } else {
      g = '<path d="M0-30C12-12 22 0 22 11A22 22 0 0 1-22 11C-22 0-12-12 0-30Z" fill="url(#' + id + 'fm)" stroke="#b9cbe0" stroke-width="1"/>' +
        '<ellipse cx="-8" cy="6" rx="4" ry="8" fill="#fff" transform="rotate(20 -8 6)"/>' +
        '<circle cx="22" cy="-16" r="5" fill="#fff" stroke="#b9cbe0"/><circle cx="-24" cy="-10" r="3.5" fill="#fff" stroke="#b9cbe0"/>';
    }
    return '<g transform="translate(' + x + " " + y + ") scale(" + s + ')">' + g + "</g>";
  }
  function vialBadge(cx, cy, rx, fs) {
    var ry = rx / 2;
    return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + VIAL_NAVY + '"/>' +
      '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + (rx - 3) + '" ry="' + (ry - 3) + '" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width=".8"/>' +
      tx(cx, f2(cy + fs * .3), "Vial", fs, { f: "s", i: 1, c: "#fff", a: "middle" });
  }

  function vialCup(id, k, cx, by) {
    var fl = VIAL[k], top = by - 140, c = id + "c" + k;
    var body = "M" + (cx - 64) + " " + top + "L" + (cx - 48) + " " + (by - 8) + "A48 8 0 0 0 " + (cx + 48) + " " + (by - 8) + "L" + (cx + 64) + " " + top + "Z";
    return '<g><clipPath id="' + c + '"><path d="' + body + '"/></clipPath>' +
      '<path d="' + body + '" fill="#fbfaf6"/>' +
      '<g clip-path="url(#' + c + ')">' +
        '<path d="M' + (cx - 80) + " " + (top + 66) + "C" + (cx - 30) + " " + (top + 48) + " " + (cx + 20) + " " + (top + 84) + " " + (cx + 80) + " " + (top + 60) + "V" + (by + 4) + "H" + (cx - 80) + 'Z" fill="' + fl.c + '"/>' +
        '<path d="M' + (cx - 80) + " " + (top + 60) + "C" + (cx - 30) + " " + (top + 42) + " " + (cx + 20) + " " + (top + 78) + " " + (cx + 80) + " " + (top + 54) + '" fill="none" stroke="' + fl.c + '" stroke-opacity=".35" stroke-width="2"/>' +
        vialBadge(cx, top + 26, 27, 18) +
        tx(cx, top + 53, "IOGURTE", 7.5, { w: 700, c: VIAL_NAVY, a: "middle", ls: 2 }) +
        tx(cx, top + 100, fl.n, fl.n.length > 6 ? 17 : 19, { f: "d", w: 800, c: "#fff", a: "middle", ls: -.5 }) +
        fruit(fl.f, id, cx - 20, top + 120, .42) +
        tx(cx + 22, top + 124, "170 g", 8, { f: "m", c: "#fff", a: "middle" }) +
        '<rect x="' + (cx - 70) + '" y="' + (top - 2) + '" width="140" height="146" fill="url(#' + id + 'cyl)"/>' +
      "</g>" +
      '<ellipse cx="' + cx + '" cy="' + top + '" rx="67" ry="13" fill="url(#' + id + 'foil)"/>' +
      '<ellipse cx="' + cx + '" cy="' + top + '" rx="55" ry="9.5" fill="' + fl.c + '" opacity=".92"/>' +
      '<ellipse cx="' + cx + '" cy="' + top + '" rx="44" ry="7" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1"/>' +
      '<path d="M' + (cx - 64) + " " + (top - 3) + "l-15-5q-5 7 3 13z\" fill=\"url(#" + id + 'foil)"/>' +
      '<ellipse cx="' + (cx - 14) + '" cy="' + (top - 4) + '" rx="26" ry="3" fill="#fff" opacity=".45"/>' +
      "</g>";
  }

  function vialBottle(id, k, cx, by) {
    var fl = VIAL[k], top = by - 330, c = id + "b" + k;
    var p = "M" + (cx - 20) + " " + (top + 56) + "C" + (cx - 22) + " " + (top + 80) + " " + (cx - 66) + " " + (top + 86) + " " + (cx - 66) + " " + (top + 122) +
      "V" + (by - 26) + "Q" + (cx - 66) + " " + by + " " + (cx - 40) + " " + by + "H" + (cx + 40) + "Q" + (cx + 66) + " " + by + " " + (cx + 66) + " " + (by - 26) +
      "V" + (top + 122) + "C" + (cx + 66) + " " + (top + 86) + " " + (cx + 22) + " " + (top + 80) + " " + (cx + 20) + " " + (top + 56) + "Z";
    var ridges = "";
    for (var x = cx - 20; x <= cx + 20; x += 4) ridges += '<path d="M' + x + " " + (top + 6) + "V" + (top + 34) + '"/>';
    return '<g><clipPath id="' + c + '"><path d="' + p + '"/></clipPath>' +
      '<rect x="' + (cx - 20) + '" y="' + (top + 38) + '" width="40" height="22" fill="#f4f2ec"/>' +
      '<rect x="' + (cx - 26) + '" y="' + (top + 34) + '" width="52" height="7" rx="2" fill="' + fl.d + '"/>' +
      '<path d="' + p + '" fill="#f7f6f1"/>' +
      '<g clip-path="url(#' + c + ')">' +
        '<rect x="' + (cx - 70) + '" y="' + (top + 92) + '" width="140" height="240" fill="' + fl.c + '"/>' +
        '<path d="M' + (cx - 80) + " " + (top + 150) + "C" + (cx - 30) + " " + (top + 130) + " " + (cx + 30) + " " + (top + 172) + " " + (cx + 80) + " " + (top + 146) +
          "V" + (top + 204) + "C" + (cx + 30) + " " + (top + 226) + " " + (cx - 30) + " " + (top + 190) + " " + (cx - 80) + " " + (top + 212) + 'Z" fill="#fbfaf6"/>' +
        vialBadge(cx, top + 122, 38, 26) +
        tx(cx, top + 176, "BEBIDA LÁCTEA", 9, { w: 700, c: VIAL_NAVY, a: "middle", ls: 1.6 }) +
        tx(cx, top + 194, "fermentada", 15, { f: "s", i: 1, c: VIAL_NAVY, a: "middle" }) +
        tx(cx, top + 252, fl.n, 27, { f: "d", w: 800, c: "#fff", a: "middle", ls: -.8 }) +
        fruit(fl.f, id, cx, top + 284, .8) +
        tx(cx, by - 14, "900 g", 10, { f: "m", c: "#fff", a: "middle", ls: .5 }) +
        '<path d="M' + (cx - 70) + " " + (top + 92) + "H" + (cx + 70) + '" stroke="#fff" stroke-opacity=".5"/>' +
        '<rect x="' + (cx - 70) + '" y="' + top + '" width="140" height="335" fill="url(#' + id + 'cyl)"/>' +
      "</g>" +
      '<rect x="' + (cx - 24) + '" y="' + top + '" width="48" height="36" rx="5" fill="' + fl.d + '"/>' +
      '<g stroke="#000" stroke-opacity=".22" stroke-width="1.2">' + ridges + "</g>" +
      '<rect x="' + (cx - 24) + '" y="' + top + '" width="48" height="36" rx="5" fill="url(#' + id + 'cyl)"/>' +
      '<ellipse cx="' + cx + '" cy="' + (top + 1.5) + '" rx="23" ry="3.5" fill="' + fl.c + '"/>' +
      "</g>";
  }

  function vialRequeijao(id, cx, by) {
    var top = by - 104, c = id + "rq";
    var body = "M" + (cx - 62) + " " + top + "V" + (by - 8) + "A62 9 0 0 0 " + (cx + 62) + " " + (by - 8) + "V" + top + "Z";
    return '<g><clipPath id="' + c + '"><path d="' + body + '"/></clipPath>' +
      '<path d="' + body + '" fill="#fbfaf6"/>' +
      '<g clip-path="url(#' + c + ')">' +
        tx(cx, top + 36, "Requeijão", 25, { f: "s", i: 1, c: VIAL_NAVY, a: "middle" }) +
        tx(cx, top + 52, "CREMOSO", 8, { w: 700, c: "#b8892c", a: "middle", ls: 3 }) +
        '<rect x="' + (cx - 70) + '" y="' + (top + 60) + '" width="140" height="60" fill="' + VIAL_NAVY + '"/>' +
        '<path d="M' + (cx - 70) + " " + (top + 60) + "H" + (cx + 70) + '" stroke="#d9a33a" stroke-width="2"/>' +
        '<ellipse cx="' + cx + '" cy="' + (top + 80) + '" rx="24" ry="11" fill="#fbfaf6"/>' +
        tx(cx, top + 85, "Vial", 15, { f: "s", i: 1, c: VIAL_NAVY, a: "middle" }) +
        tx(cx + 46, top + 84, "200 g", 7.5, { f: "m", c: "#fff", a: "middle" }) +
        tx(cx - 46, top + 84, "TRADICIONAL", 5.5, { f: "m", c: "#d9a33a", a: "middle", ls: .6 }) +
        '<rect x="' + (cx - 70) + '" y="' + (top - 2) + '" width="140" height="110" fill="url(#' + id + 'cyl)"/>' +
      "</g>" +
      '<rect x="' + (cx - 64) + '" y="' + (top - 16) + '" width="128" height="17" fill="#1b4174"/>' +
      '<rect x="' + (cx - 64) + '" y="' + (top - 16) + '" width="128" height="17" fill="url(#' + id + 'cyl)"/>' +
      '<ellipse cx="' + cx + '" cy="' + (top - 16) + '" rx="64" ry="11" fill="#24508c"/>' +
      '<ellipse cx="' + cx + '" cy="' + (top - 16) + '" rx="50" ry="8" fill="none" stroke="#fff" stroke-opacity=".18"/>' +
      '<ellipse cx="' + (cx - 16) + '" cy="' + (top - 19) + '" rx="24" ry="2.5" fill="#fff" opacity=".25"/>' +
      "</g>";
  }

  /* ---------- Vial: linha de produtos ---------- */
  M["vial-line"] = function () {
    var id = uid("vl"), base = 500;
    var items = [
      ["bottle", "morango", 160, 74], ["bottle", "pessego", 320, 74],
      ["cup", "natural", 500, 70], ["cup", "morango", 640, 70], ["cup", "coco", 780, 70], ["cup", "ameixa", 920, 70],
      ["rq", "", 1075, 68]
    ];
    var objs = "", uses = "", shadows = "";
    items.forEach(function (it, i) {
      var g = it[0] === "bottle" ? vialBottle(id, it[1], it[2], base) : it[0] === "cup" ? vialCup(id, it[1], it[2], base) : vialRequeijao(id, it[2], base);
      objs += '<g id="' + id + "o" + i + '">' + g + "</g>";
      uses += '<use href="#' + id + "o" + i + '"/>';
      shadows += '<ellipse cx="' + it[2] + '" cy="' + (base - 1) + '" rx="' + it[3] + '" ry="7" fill="#1b2a3a" opacity=".38" filter="url(#' + id + 'bl)"/>';
    });
    var legend = ["natural", "morango", "pessego", "coco", "ameixa"].map(function (k, i) {
      var x = 360 + i * 156, fl = VIAL[k];
      return '<circle cx="' + x + '" cy="598" r="8" fill="' + fl.c + '"/>' + tx(x + 15, 602, fl.n, 12.5, { f: "d", w: 700, c: "#13212f" }) +
        tx(x + 15, 617, "PANTONE " + fl.p, 8.5, { f: "m", c: "#5d6b78" });
    }).join("");
    return (
      '<svg viewBox="0 118 1200 522" role="img" aria-label="Linha de embalagens Vial Laticínios: duas garrafas de bebida láctea, quatro potes de iogurte e um requeijão, cada sabor com sua cor: Natural azul, Morango vermelho, Pêssego laranja, Coco verde-água e Ameixa roxo">' +
      "<defs>" + fruitDefs(id) + cylGrad(id + "cyl") +
        '<linearGradient id="' + id + 'foil" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f7f8f9"/><stop offset=".45" stop-color="#c3c8ce"/><stop offset=".7" stop-color="#eef0f2"/><stop offset="1" stop-color="#a6adb5"/></linearGradient>' +
        '<linearGradient id="' + id + 'wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9eff5"/><stop offset="1" stop-color="#d3dee8"/></linearGradient>' +
        '<linearGradient id="' + id + 'floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9d5e0"/><stop offset=".08" stop-color="#eef2f6"/><stop offset="1" stop-color="#f7f9fb"/></linearGradient>' +
        '<radialGradient id="' + id + 'spot" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>' +
        '<linearGradient id="' + id + 'rf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".3"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
        '<mask id="' + id + 'mk" maskUnits="userSpaceOnUse" x="0" y="' + base + '" width="1200" height="140"><rect x="0" y="' + base + '" width="1200" height="140" fill="url(#' + id + 'rf)"/></mask>' +
        '<filter id="' + id + 'bl" x="-30%" y="-200%" width="160%" height="500%"><feGaussianBlur stdDeviation="5"/></filter>' +
      "</defs>" +
      '<rect width="1200" height="' + base + '" fill="url(#' + id + 'wall)"/>' +
      '<ellipse cx="600" cy="330" rx="520" ry="230" fill="url(#' + id + 'spot)"/>' +
      '<rect y="' + base + '" width="1200" height="140" fill="url(#' + id + 'floor)"/>' +
      tx(40, 148, "LINHA VIAL · DESDOBRAMENTO POR SABOR", 10, { f: "m", c: "#5d6b78", ls: 1.5 }) +
      tx(1160, 148, "IOGURTE 170 g · BEBIDA LÁCTEA 900 g · REQUEIJÃO 200 g", 10, { f: "m", c: "#5d6b78", a: "end", ls: 1 }) +
      shadows +
      '<g mask="url(#' + id + 'mk)"><g transform="translate(0 ' + base * 2 + ') scale(1 -1)">' + uses + "</g></g>" +
      objs +
      tx(40, 602, "SISTEMA DE COR", 10, { f: "m", c: "#13212f", ls: 1.5 }) + tx(40, 617, "1 cor por sabor", 9, { f: "m", c: "#5d6b78" }) +
      legend +
      "</svg>"
    );
  };

  /* ---------- Vial: rótulo envolvente planificado sobre a faca ---------- */
  M["vial-label"] = function (el, d) {
    var id = uid("vlb"), fl = VIAL[d.flavor || "morango"];
    var cx = 600, cy = 1300, R2 = 1180, R1 = 900, A = 26;
    function P(t, r) { var a = t * Math.PI / 180; return f2(cx + r * Math.sin(a)) + " " + f2(cy - r * Math.cos(a)); }
    function sector(r1, r2, a1, a2) {
      return "M" + P(a1, r2) + "A" + r2 + " " + r2 + " 0 0 1 " + P(a2, r2) + "L" + P(a2, r1) + "A" + r1 + " " + r1 + " 0 0 0 " + P(a1, r1) + "Z";
    }
    function at(t, inner) { return '<g transform="rotate(' + t + " " + cx + " " + cy + ')">' + inner + "</g>"; }
    function arc(r, a1, a2) { return "M" + P(a1, r) + "A" + r + " " + r + " 0 0 1 " + P(a2, r); }

    var rows = [
      ["Valor energético (kcal)", "106", "180", "9"], ["Carboidratos totais (g)", "19", "32", "11"], ["Açúcares totais (g)", "18", "31", ""],
      ["Açúcares adicionados (g)", "15", "26", "52"], ["Proteínas (g)", "3,0", "5,1", "10"], ["Gorduras totais (g)", "2,0", "3,4", "5"],
      ["Gorduras saturadas (g)", "1,3", "2,2", "11"], ["Sódio (mg)", "45", "77", "4"]
    ];
    var tbl = '<rect x="516" y="140" width="168" height="236" fill="#fff" stroke="#111" stroke-width="1.2"/>' +
      tx(522, 156, "INFORMAÇÃO NUTRICIONAL", 9.2, { w: 700, c: "#111" }) +
      '<path d="M516 162H684" stroke="#111"/>' +
      tx(522, 173, "Porções por embalagem: 1", 6.8, { c: "#111" }) + tx(522, 183, "Porção: 170 g (1 pote)", 6.8, { c: "#111" }) +
      '<path d="M516 189H684" stroke="#111" stroke-width="3"/>' +
      tx(616, 201, "100 g", 6.8, { w: 700, c: "#111", a: "end" }) + tx(650, 201, "170 g", 6.8, { w: 700, c: "#111", a: "end" }) + tx(680, 201, "%VD*", 6.8, { w: 700, c: "#111", a: "end" }) +
      '<path d="M516 206H684" stroke="#111"/>' +
      rows.map(function (r, i) {
        var y = 218 + i * 17;
        return tx(522, y, r[0], 6.6, { c: "#111" }) + tx(616, y, r[1], 6.6, { c: "#111", a: "end" }) + tx(650, y, r[2], 6.6, { c: "#111", a: "end" }) + tx(680, y, r[3], 6.6, { c: "#111", a: "end" }) +
          '<path d="M516 ' + (y + 5) + 'H684" stroke="#111" stroke-width=".5"/>';
      }).join("") +
      lines(522, 358, ["*Percentual de valores diários fornecidos", "pela porção."], 5.8, 8, { c: "#111" });

    var ingr = lines(526, 154, [
      "<tspan font-weight='700'>INGREDIENTES:</tspan> leite integral",
      "e/ou leite reconstituído, açúcar,",
      "preparado de morango (água,",
      "açúcar, morango, amido",
      "modificado, aromatizante, corante",
      "natural carmim) e fermento lácteo.",
      "<tspan font-weight='700'>ALÉRGICOS: CONTÉM LEITE</tspan>",
      "<tspan font-weight='700'>E DERIVADOS. CONTÉM LACTOSE.</tspan>",
      "<tspan font-weight='700'>NÃO CONTÉM GLÚTEN.</tspan>"
    ], 7.2, 11, { c: "#2a2f36" }) +
      tx(600, 324, "CONSERVAR ENTRE 1 °C E 10 °C", 7.5, { f: "m", c: "#fff", a: "middle", ls: .5 }) +
      tx(600, 338, "Após aberto, consumir em até 2 dias.", 7.2, { c: "#fff", a: "middle" });

    var lupa = '<rect x="560" y="146" width="80" height="58" fill="#fff" stroke="#111" stroke-width="2"/>' +
      '<circle cx="577" cy="166" r="7" fill="none" stroke="#111" stroke-width="2.2"/><path d="M582 171l6 6" stroke="#111" stroke-width="3" stroke-linecap="round"/>' +
      tx(594, 163, "ALTO EM", 7, { w: 700, c: "#111" }) + '<rect x="564" y="180" width="72" height="20" fill="#111"/>' +
      tx(600, 188.5, "AÇÚCAR", 7, { w: 700, c: "#fff", a: "middle" }) + tx(600, 197, "ADICIONADO", 7, { w: 700, c: "#fff", a: "middle" }) +
      tx(600, 230, "Contém fermento lácteo vivo", 7, { c: "#2a2f36", a: "middle" }) +
      '<rect x="552" y="318" width="96" height="34" fill="#fff" stroke="#111" stroke-dasharray="2 2"/>' +
      tx(600, 332, "LOTE · VAL.", 7, { f: "m", c: "#111", a: "middle" }) + tx(600, 344, "área sem verniz", 6.4, { f: "m", c: "#666", a: "middle" });

    var code = '<rect x="548" y="146" width="104" height="72" fill="#fff"/>' + ean(554, 152, 92, 46, 23, "#111") +
      tx(600, 236, "SAC 0800 000 0000", 6.8, { f: "m", c: "#2a2f36", a: "middle" }) + tx(600, 247, "Indústria Brasileira", 6.8, { c: "#2a2f36", a: "middle" }) +
      '<path d="M600 312l9 15h-18z" fill="none" stroke="#fff" stroke-width="1.6"/>' + tx(600, 326, "5", 7, { w: 700, c: "#fff", a: "middle" }) + tx(600, 340, "PP", 7, { w: 700, c: "#fff", a: "middle" });

    var front = vialBadge(600, 184, 56, 38) +
      tx(600, 236, "IOGURTE INTEGRAL", 12, { w: 700, c: VIAL_NAVY, a: "middle", ls: 3 }) +
      tx(600, 254, "com preparado de fruta", 13, { f: "s", i: 1, c: VIAL_NAVY, a: "middle" }) +
      tx(600, 370, fl.n, 46, { f: "d", w: 800, c: "#fff", a: "middle", ls: -1.6 });
    var fruitG = '<circle cx="600" cy="290" r="44" fill="#fff" opacity=".9"/>' + fruit(fl.f, id, 600, 290, 1.25) +
      tx(600, 384, "170 g", 13, { f: "m", c: "#fff", a: "middle", w: 500 });

    var cutC = "#e6007e";
    var dim = '<g stroke="#121212" stroke-width=".8" fill="none" opacity=".6">' +
        '<path d="' + arc(R2 + 34, -A, A) + '"/><path d="M' + P(-A, R2 + 28) + "L" + P(-A, R2 + 40) + "M" + P(A, R2 + 28) + "L" + P(A, R2 + 40) + '"/>' +
        '<path d="' + arc(R1 - 34, -A, A) + '"/><path d="M' + P(-A, R1 - 28) + "L" + P(-A, R1 - 40) + "M" + P(A, R1 - 28) + "L" + P(A, R1 - 40) + '"/>' +
        '<path d="M' + P(-A - 2.4, R1) + "L" + P(-A - 2.4, R2) + '"/>' +
      "</g>" +
      '<rect x="534" y="78" width="132" height="16" fill="#f8f7f3"/>' + tx(600, 90, "ARCO MAIOR 286 mm", 9, { f: "m", c: "#121212", a: "middle", ls: 1 }) +
      '<rect x="540" y="430" width="120" height="16" fill="#f8f7f3"/>' + tx(600, 442, "ARCO MENOR 218 mm", 9, { f: "m", c: "#121212", a: "middle", ls: 1 }) +
      at(-A - 3.6, tx(cx, cy - (R1 + R2) / 2, "ALTURA 62 mm", 9, { f: "m", c: "#121212", a: "middle", ls: 1, x: 'transform="rotate(-90 ' + cx + " " + (cy - (R1 + R2) / 2) + ')"' }));

    var sw = [["C", "#00a0e3"], ["M", "#e6007e"], ["Y", "#ffd600"], ["K", "#121212"], ["P " + fl.p, fl.c], ["P 2955 C", VIAL_NAVY], ["BRANCO", "#ffffff"]].map(function (s, i) {
      var x = 40 + i * 74;
      return '<rect x="' + x + '" y="540" width="64" height="24" fill="' + s[1] + '" stroke="#121212" stroke-opacity=".2"/>' + tx(x, 578, s[0], 8.5, { f: "m", c: "#121212" });
    }).join("");

    return (
      '<svg viewBox="0 0 1200 600" role="img" aria-label="Rótulo envolvente planificado do pote de iogurte Vial sabor ' + fl.n + ' sobre a faca, com tabela nutricional, ingredientes, lupa frontal, código de barras, área de sobreposição, sangria e margem de segurança">' +
      "<defs>" + fruitDefs(id) +
        '<clipPath id="' + id + 'cl"><path d="' + sector(R1 - 12, R2 + 12, -A - .7, A + .7) + '"/></clipPath>' +
        '<pattern id="' + id + 'h" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0v7" stroke="' + cutC + '" stroke-width="1.2" opacity=".6"/></pattern>' +
        '<filter id="' + id + 'sh" x="-5%" y="-10%" width="110%" height="130%"><feDropShadow dx="0" dy="10" stdDeviation="12" flood-opacity=".14"/></filter>' +
      "</defs>" +
      '<rect width="1200" height="600" fill="#f8f7f3"/>' +
      tx(40, 46, "Rótulo planificado", 22, { f: "d", w: 800, c: "#121212", ls: -.6 }) +
      tx(40, 66, "POTE 170 g · " + fl.n.toUpperCase() + " · FLEXOGRAFIA · BOPP BRANCO", 9.5, { f: "m", c: "#6b655c", ls: 1 }) +
      '<g font-family="' + FAM.m + '" font-size="9" fill="#121212">' +
        '<path d="M900 30h26" stroke="' + cutC + '" stroke-width="1.6"/><text x="934" y="33">FACA</text>' +
        '<path d="M1000 30h26" stroke="' + cutC + '" stroke-dasharray="3 3"/><text x="1034" y="33">SANGRIA 3 mm</text>' +
        '<path d="M900 50h26" stroke="#00a0e3" stroke-dasharray="5 3"/><text x="934" y="53">SEGURANÇA</text>' +
        '<rect x="1000" y="44" width="26" height="12" fill="url(#' + id + 'h)" stroke="' + cutC + '" stroke-width=".6"/><text x="1034" y="53">SOBREPOSIÇÃO</text>' +
      "</g>" +
      dim +
      '<path d="' + sector(R1 - 12, R2 + 12, -A - .7, A + .7) + '" fill="#fff" filter="url(#' + id + 'sh)"/>' +
      '<g clip-path="url(#' + id + 'cl)">' +
        '<path d="' + sector(R1 - 12, R2 + 12, -A - 1, A + 1) + '" fill="#fbfaf6"/>' +
        '<path d="' + sector(R1 - 12, R1 + 108, -A - 1, A + 1) + '" fill="' + fl.c + '"/>' +
        '<path d="' + sector(R1 + 108, R1 + 113, -A - 1, A + 1) + '" fill="' + fl.l + '"/>' +
        '<path d="' + sector(R2 - 8, R2 + 12, -A - 1, A + 1) + '" fill="' + VIAL_NAVY + '"/>' +
        at(-19, tbl) + at(-8.5, ingr) + at(0, front) + at(7, fruitG) + at(13.2, lupa) + at(19.5, code) +
      "</g>" +
      '<path d="' + sector(R1, R2, A - 3, A) + '" fill="url(#' + id + 'h)"/>' +
      at(A - 1.5, tx(cx, cy - (R1 + R2) / 2, "SOBREPOSIÇÃO 6 mm · SEM TINTA", 7.5, { f: "m", c: cutC, a: "middle", x: 'transform="rotate(90 ' + cx + " " + (cy - (R1 + R2) / 2) + ')"' })) +
      '<path d="' + sector(R1 - 12, R2 + 12, -A - .7, A + .7) + '" fill="none" stroke="' + cutC + '" stroke-width=".8" stroke-dasharray="3 3"/>' +
      '<path d="' + sector(R1 + 16, R2 - 16, -A + 1, A - 3.6) + '" fill="none" stroke="#00a0e3" stroke-width=".9" stroke-dasharray="6 4"/>' +
      '<path d="' + sector(R1, R2, -A, A) + '" fill="none" stroke="' + cutC + '" stroke-width="1.6"/>' +
      sw +
      reg(1140, 556, 7) +
      "</svg>"
    );
  };

  // marca de registro desenhada direto no SVG
  function reg(x, y, r, c) {
    c = c || "#121212";
    return '<g stroke="' + c + '" stroke-width=".9" fill="none"><circle cx="' + x + '" cy="' + y + '" r="' + r + '"/><path d="M' + x + " " + (y - r * 2) + "V" + (y + r * 2) + "M" + (x - r * 2) + " " + y + "H" + (x + r * 2) + '"/></g>' +
      '<path d="M' + x + " " + (y - r) + "A" + r + " " + r + " 0 0 1 " + x + " " + (y + r) + 'Z" fill="' + c + '"/>';
  }
  // rótulo de chamada (pílula com ponto)
  function pin(x, y, label, o) {
    o = o || {};
    var w = label.length * 6.2 + 26;
    var bx = o.end ? x - w : x;
    return '<g><rect x="' + bx + '" y="' + (y - 11) + '" width="' + w + '" height="22" rx="11" fill="' + (o.bg || "#121212") + '"/>' +
      '<circle cx="' + (bx + 11) + '" cy="' + y + '" r="3" fill="' + (o.dot || "#ff4f1f") + '"/>' +
      tx(bx + 19, y + 3.4, label, 9.5, { f: "m", c: o.c || "#f2eee6", ls: .6 }) + "</g>";
  }

  /* ---------- Planet Gourmet: kit delivery com hot stamping ---------- */
  M["planet-box"] = function () {
    var id = uid("pg"), gold = "url(#" + id + "gold)", shine = "url(#" + id + "shine)";
    var kraft = 'filter="url(#' + id + 'kr)"';
    function planet(x, y, r, fill, ring) {
      return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + fill + '"/>' +
        '<ellipse cx="' + x + '" cy="' + y + '" rx="' + f2(r * 1.6) + '" ry="' + f2(r * .44) + '" fill="none" stroke="' + (ring || fill) + '" stroke-width="' + f2(Math.max(1.2, r * .13)) + '" transform="rotate(-18 ' + x + " " + y + ')"/>';
    }
    function lidLogo(fill) {
      return planet(118, 86, 30, fill) +
        tx(170, 94, "Planet", 54, { f: "s", i: 1, c: fill, ls: -1 }) +
        tx(174, 120, "GOURMET", 13, { f: "m", c: fill, ls: 8.5 });
    }
    function bandLogo(fill) {
      return planet(170, 432, 15, fill) + tx(196, 442, "Planet", 34, { f: "s", i: 1, c: fill, ls: -.6 }) + tx(198, 462, "GOURMET", 9, { f: "m", c: fill, ls: 5.4 });
    }
    var orbits = "";
    [[70, 28], [118, 46], [168, 66], [214, 84]].forEach(function (o) {
      orbits += '<ellipse cx="195" cy="85" rx="' + o[0] + '" ry="' + o[1] + '" fill="none"/>';
    });
    // sacola: borda superior serrilhada
    var zig = "M130 266";
    for (var x = 130; x < 380; x += 8) zig += "L" + (x + 4) + " 259L" + (x + 8) + " 266";
    zig += "V600H130Z";
    var jx = 1068, jb = 622, jt = jb - 150;
    var jar = "M" + (jx - 50) + " " + (jt + 30) + "Q" + (jx - 56) + " " + (jt + 30) + " " + (jx - 56) + " " + (jt + 44) + "V" + (jb - 14) + "Q" + (jx - 56) + " " + jb + " " + (jx - 42) + " " + jb +
      "H" + (jx + 42) + "Q" + (jx + 56) + " " + jb + " " + (jx + 56) + " " + (jb - 14) + "V" + (jt + 44) + "Q" + (jx + 56) + " " + (jt + 30) + " " + (jx + 50) + " " + (jt + 30) + "Z";
    var specks = "", r = rng(5);
    for (var i = 0; i < 40; i++) specks += '<circle cx="' + f2(jx - 46 + r() * 92) + '" cy="' + f2(jt + 50 + r() * 92) + '" r="' + f2(.8 + r() * 1.6) + '" fill="#a9c36a" opacity=".5"/>';
    var lidR = "";
    for (x = jx - 46; x <= jx + 46; x += 4) lidR += '<path d="M' + x + " " + (jt + 4) + "V" + (jt + 28) + '"/>';
    return (
      '<svg viewBox="0 0 1200 720" role="img" aria-label="Kit de delivery Planet Gourmet em kraft: sacola com faixa preta e logotipo em hot stamping dourado, caixa de transporte com tampa em hot stamping e verniz localizado, lacre de segurança e pote de molho artesanal com rótulo">' +
      "<defs>" +
        '<linearGradient id="' + id + 'gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7d5a1f"/><stop offset=".22" stop-color="#d9b25a"/><stop offset=".42" stop-color="#fff0b8"/><stop offset=".58" stop-color="#c99a3c"/><stop offset=".8" stop-color="#8a6526"/><stop offset="1" stop-color="#e6c56e"/></linearGradient>' +
        sheen(id + "shine", 4.2, 0) + sheen(id + "uv", 6, 1.4) +
        '<filter id="' + id + 'kr" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4" result="n"/>' +
          '<feColorMatrix in="n" type="matrix" values="0 0 0 0 .3  0 0 0 0 .18  0 0 0 0 .08  0 0 0 .42 0" result="c"/><feComposite in="c" in2="SourceGraphic" operator="in" result="t"/>' +
          '<feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="t"/></feMerge></filter>' +
        '<linearGradient id="' + id + 'wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a221c"/><stop offset="1" stop-color="#16120f"/></linearGradient>' +
        '<radialGradient id="' + id + 'spot" cx=".5" cy=".45" r=".5"><stop offset="0" stop-color="#5a4430" stop-opacity=".75"/><stop offset="1" stop-color="#5a4430" stop-opacity="0"/></radialGradient>' +
        '<linearGradient id="' + id + 'floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d0b09"/><stop offset=".15" stop-color="#1d1814"/><stop offset="1" stop-color="#110e0b"/></linearGradient>' +
        '<linearGradient id="' + id + 'bagL" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient>' +
        '<linearGradient id="' + id + 'frL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".06"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>' +
        '<linearGradient id="' + id + 'pesto" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6d8c34"/><stop offset="1" stop-color="#2c4314"/></linearGradient>' +
        cylGrad(id + "cyl", .9) +
        '<filter id="' + id + 'bl" x="-30%" y="-200%" width="160%" height="500%"><feGaussianBlur stdDeviation="9"/></filter>' +
        '<clipPath id="' + id + 'jc"><path d="' + jar + '"/></clipPath>' +
      "</defs>" +
      '<rect width="1200" height="720" fill="url(#' + id + 'wall)"/>' +
      '<ellipse cx="640" cy="330" rx="560" ry="330" fill="url(#' + id + 'spot)"/>' +
      '<rect y="574" width="1200" height="146" fill="url(#' + id + 'floor)"/>' +
      // sombras de contato
      '<ellipse cx="290" cy="602" rx="190" ry="14" fill="#000" opacity=".7" filter="url(#' + id + 'bl)"/>' +
      '<path d="M462 566H870L992 436L976 430L860 560H470Z" fill="#000" opacity=".75" filter="url(#' + id + 'bl)"/>' +
      '<ellipse cx="' + jx + '" cy="' + (jb + 2) + '" rx="72" ry="9" fill="#000" opacity=".75" filter="url(#' + id + 'bl)"/>' +

      // ---- sacola ----
      '<path d="M180 268C180 150 330 150 330 268" fill="none" stroke="#6e4b2a" stroke-width="7"/>' +
      '<path d="M380 260L436 272V592L380 600Z" fill="#8f6640" ' + kraft + "/>" +
      '<path d="M380 260L408 296L436 272Z" fill="#6e4b2a"/><path d="M408 296V596" stroke="#6e4b2a" stroke-width="1.2"/>' +
      '<path d="M192 284C192 170 318 170 318 284" fill="none" stroke="#a87a4a" stroke-width="8"/>' +
      '<path d="M192 284C192 170 318 170 318 284" fill="none" stroke="#d1a574" stroke-width="3" stroke-dasharray="4 4"/>' +
      '<path d="' + zig + '" fill="#c69c6b" ' + kraft + "/>" +
      '<path d="' + zig + '" fill="url(#' + id + 'bagL)"/>' +
      '<path d="M130 290H380" stroke="#000" stroke-opacity=".12"/>' +
      '<rect x="130" y="384" width="250" height="104" fill="#15110d"/>' +
      bandLogo(gold) + bandLogo(shine) +
      tx(255, 540, "Gastronomia para levar", 19, { f: "s", i: 1, c: "#2a1d12", a: "middle" }) +
      tx(255, 562, "PRODUTOS ARTESANAIS", 8.5, { f: "m", c: "#2a1d12", a: "middle", ls: 2.5, op: .8 }) +

      // ---- caixa de transporte ----
      '<path d="M860 330L980 200V430L860 560Z" fill="#9a6e43" ' + kraft + "/>" +
      '<path d="M860 330L980 200V242L860 372Z" fill="#a97c4f"/>' +
      '<path d="M860 372L980 242" stroke="#000" stroke-opacity=".3" stroke-width="2"/>' +
      '<g transform="matrix(.706 -.765 0 1 860 330)">' +
        planet(85, 150, 18, "#1c140d") + tx(85, 196, "GOURMET", 8, { f: "m", c: "#1c140d", a: "middle", ls: 3 }) +
        '<path d="M0 100H170" stroke="#3a2a1a" stroke-dasharray="2 3" opacity=".7"/>' + tx(10, 94, "ABRA AQUI →", 7.5, { f: "m", c: "#2a1d12", ls: 1 }) +
      "</g>" +
      '<path d="M470 330H860V560H470Z" fill="#bf9160" ' + kraft + "/>" +
      '<path d="M470 330H860V560H470Z" fill="url(#' + id + 'frL)"/>' +
      '<rect x="470" y="330" width="390" height="42" fill="#c99c6b" ' + kraft + "/>" +
      '<path d="M470 372H860" stroke="#000" stroke-opacity=".32" stroke-width="2.5"/>' +
      tx(492, 356, "FEITO À MÃO", 8.5, { f: "m", c: "#3b2a1a", ls: 1.6 }) + tx(840, 356, "ENTREGUE COM CUIDADO", 8.5, { f: "m", c: "#3b2a1a", ls: 1.6, a: "end" }) +
      planet(510, 418, 13, "#1c140d") +
      tx(498, 470, "Feito para", 30, { f: "s", i: 1, c: "#22170e" }) + tx(498, 502, "chegar perfeito.", 30, { f: "s", i: 1, c: "#22170e" }) +
      icoG("up", 756, 412, 1.3, "#22170e") + icoG("glass", 796, 412, 1.3, "#22170e") +
      tx(796, 466, "ESTE LADO PARA CIMA · FRÁGIL", 6.5, { f: "m", c: "#22170e", a: "middle", ls: .6 }) +
      tx(498, 540, "CAIXA DE TRANSPORTE · MANTER NA HORIZONTAL", 7.5, { f: "m", c: "#3b2a1a", ls: 1.2 }) +
      '<path d="M470 330H860" stroke="#e8c99a" stroke-width="1.5"/>' +
      // tampa (topo)
      '<path d="M470 330L590 200H980L860 330Z" fill="#d2a874" ' + kraft + "/>" +
      '<g transform="matrix(1 0 -.706 .765 590 200)">' +
        '<g stroke="#fff" stroke-opacity=".16" stroke-width="2.4">' + orbits + "</g>" +
        '<g stroke="url(#' + id + 'uv)" stroke-width="2.4">' + orbits + "</g>" +
        lidLogo(gold) + lidLogo(shine) +
        '<rect x="176" y="128" width="40" height="42" fill="#15110d"/><path d="M176 131H216M176 167H216" stroke="' + gold + '" stroke-width="1.2"/>' +
      "</g>" +
      '<path d="M860 330L980 200" stroke="#e8c99a" stroke-width="1.2" opacity=".7"/>' +
      // lacre (frente)
      '<rect x="645" y="330" width="40" height="78" fill="#15110d"/>' +
      '<path d="M645 404l5 6 5-6 5 6 5-6 5 6 5-6 5 6 5-6V330H645Z" fill="#15110d"/>' +
      '<path d="M645 334H685M645 398H685" stroke="' + gold + '" stroke-width="1.2"/>' +
      tx(665, 366, "LACRE", 7.5, { f: "m", c: gold, a: "middle", ls: 1 }) + planet(665, 382, 5, gold) +

      // ---- pote de molho ----
      '<path d="' + jar + '" fill="#2b3a1a" opacity=".55"/>' +
      '<g clip-path="url(#' + id + 'jc)">' +
        '<rect x="' + (jx - 60) + '" y="' + (jt + 46) + '" width="120" height="110" fill="url(#' + id + 'pesto)"/>' + specks +
        '<rect x="' + (jx - 60) + '" y="' + (jt + 62) + '" width="120" height="58" fill="#c69c6b" ' + kraft + "/>" +
        '<rect x="' + (jx - 60) + '" y="' + (jt + 78) + '" width="120" height="24" fill="#15110d"/>' +
        planet(jx, jt + 71, 4.5, gold) +
        tx(jx, jt + 97, "Pesto", 22, { f: "s", i: 1, c: gold, a: "middle" }) +
        tx(jx, jt + 112, "MOLHO ARTESANAL", 6.5, { f: "m", c: "#22170e", a: "middle", ls: 1.4 }) +
        '<rect x="' + (jx - 60) + '" y="' + (jt + 20) + '" width="120" height="140" fill="url(#' + id + 'cyl)"/>' +
        '<rect x="' + (jx - 42) + '" y="' + (jt + 44) + '" width="7" height="96" rx="3.5" fill="#fff" opacity=".28"/>' +
      "</g>" +
      '<rect x="' + (jx - 48) + '" y="' + jt + '" width="96" height="30" rx="4" fill="' + gold + '"/>' +
      '<g stroke="#5a3f12" stroke-opacity=".35">' + lidR + "</g>" +
      '<rect x="' + (jx - 48) + '" y="' + jt + '" width="96" height="30" rx="4" fill="' + shine + '"/>' +
      '<rect x="' + (jx - 48) + '" y="' + jt + '" width="96" height="30" rx="4" fill="url(#' + id + 'cyl)"/>' +
      tx(jx, jt + 136, "180 g", 7, { f: "m", c: "#e9dfcf", a: "middle", op: .9 }) +

      // ---- chamadas ----
      '<g stroke="#d9b25a" stroke-width="1" fill="none" opacity=".85"><path d="M648 268L600 154H470"/><path d="M862 231L928 162H1100"/><path d="M665 412V640H600"/><path d="M300 520L240 640H130"/><path d="' + "M" + (jx + 40) + " " + (jt + 92) + "L1150 520V640" + '"/></g>' +
      '<g fill="#d9b25a"><circle cx="648" cy="268" r="3.5"/><circle cx="862" cy="231" r="3.5"/><circle cx="665" cy="412" r="3.5"/><circle cx="300" cy="520" r="3.5"/><circle cx="' + (jx + 40) + '" cy="' + (jt + 92) + '" r="3.5"/></g>' +
      tx(470, 146, "HOT STAMPING OURO", 10, { f: "m", c: "#efe4d2", ls: 1.4 }) +
      tx(1100, 154, "VERNIZ UV LOCALIZADO", 10, { f: "m", c: "#efe4d2", ls: 1.4, a: "end" }) +
      tx(600, 660, "LACRE DE SEGURANÇA", 10, { f: "m", c: "#efe4d2", ls: 1.4, a: "end" }) +
      tx(130, 660, "KRAFT + 1 COR", 10, { f: "m", c: "#efe4d2", ls: 1.4 }) +
      tx(1150, 660, "RÓTULO DO POTE", 10, { f: "m", c: "#efe4d2", ls: 1.4, a: "end" }) +
      "</svg>"
    );
  };

  /* ---------- Hortifruti Mais Sabor: gôndola com régua de preço ---------- */
  M["hortifruti-pdv"] = function () {
    var id = uid("hf"), G = "#1f7a3a", Y = "#ffd23f", RED = "#e2231a";
    var P = {
      tomate: ["#ff7a5c", "#d7261b", "#9b130b"], laranja: ["#ffc874", "#f28a1a", "#c25a05"], maca: ["#ff8a7a", "#cf1d36", "#7f0b1d"],
      batata: ["#ecd09d", "#c39a63", "#8c6a3c"], cereja: ["#ff7a5c", "#e0301f", "#9b130b"]
    };
    var defs = Object.keys(P).map(function (k) {
      return '<radialGradient id="' + id + k + '" cx=".36" cy=".3" r=".75"><stop offset="0" stop-color="' + P[k][0] + '"/><stop offset=".55" stop-color="' + P[k][1] + '"/><stop offset="1" stop-color="' + P[k][2] + '"/></radialGradient>';
    }).join("");

    function mound(x, w, yb, kind, seed) {
      var r = rng(seed), out = "", rad = kind === "batata" ? 20 : kind === "laranja" ? 21 : 19;
      for (var j = 3; j >= 0; j--) {
        var y = yb - 14 - j * 21, m = 16 + j * 16, rr = rad * (1 - j * .05), step = rr * 1.72;
        for (var cx = x + m + (j % 2) * step / 2; cx < x + w - m; cx += step) {
          var px = f2(cx + (r() - .5) * 6), py = f2(y + (r() - .5) * 6), s = f2(rr * (.92 + r() * .14));
          if (kind === "batata") {
            out += '<ellipse cx="' + px + '" cy="' + py + '" rx="' + f2(s * 1.12) + '" ry="' + f2(s * .78) + '" transform="rotate(' + Math.round((r() - .5) * 50) + " " + px + " " + py + ')" fill="url(#' + id + 'batata)"/>' +
              '<circle cx="' + f2(px + s * .3) + '" cy="' + f2(py - s * .1) + '" r="1.2" fill="#6e5230"/>';
          } else {
            out += '<circle cx="' + px + '" cy="' + py + '" r="' + s + '" fill="url(#' + id + kind + ')"/>';
            if (kind === "tomate") out += '<path d="M' + px + " " + f2(py - s * .8) + "l-6 -1 4 3-3 4 5-3 5 3-3-4 4-3z\" fill=\"#3f8f2f\"/>";
            if (kind === "maca") out += '<path d="M' + px + " " + f2(py - s * .7) + "q1-6 4-8\" stroke=\"#5a3a1a\" stroke-width=\"2\" fill=\"none\"/><ellipse cx=\"" + f2(px + s * .35) + '" cy="' + f2(py + s * .2) + '" rx="' + f2(s * .35) + '" ry="' + f2(s * .5) + '" fill="#ffd24d" opacity=".35"/>';
            if (kind === "laranja") out += '<circle cx="' + f2(px - s * .2) + '" cy="' + f2(py - s * .55) + '" r="1.6" fill="#a8520a"/>';
          }
        }
      }
      return out;
    }
    function crate(x, w, yb) {
      return '<rect x="' + x + '" y="' + yb + '" width="' + w + '" height="40" fill="url(#' + id + 'wood)"/>' +
        '<path d="M' + x + " " + (yb + 13) + "h" + w + "M" + x + " " + (yb + 27) + "h" + w + '" stroke="#6e4a22" stroke-opacity=".55" stroke-width="1.4"/>' +
        '<rect x="' + (x + w / 2 - 24) + '" y="' + (yb + 15) + '" width="48" height="10" rx="5" fill="#3a2614"/>' +
        '<g fill="#5b3c1c"><circle cx="' + (x + 8) + '" cy="' + (yb + 7) + '" r="1.6"/><circle cx="' + (x + w - 8) + '" cy="' + (yb + 7) + '" r="1.6"/><circle cx="' + (x + 8) + '" cy="' + (yb + 33) + '" r="1.6"/><circle cx="' + (x + w - 8) + '" cy="' + (yb + 33) + '" r="1.6"/></g>';
    }
    function tag(cx, y, name, unit, price, was) {
      var x = cx - 64, off = !!was, p = price.split(",");
      return '<g filter="url(#' + id + 'tsh)">' +
        '<rect x="' + x + '" y="' + y + '" width="128" height="76" rx="3" fill="' + (off ? Y : "#fff") + '"/>' +
        '<rect x="' + x + '" y="' + y + '" width="128" height="15" rx="3" fill="' + (off ? RED : G) + '"/>' +
        tx(cx, y + 11, off ? "OFERTA" : "MAIS SABOR", 8, { f: off ? "d" : "m", w: off ? 800 : 400, c: "#fff", a: "middle", ls: off ? 2 : 1.6 }) +
        tx(x + 8, y + 30, name, 9.5, { w: 700, c: "#1a1a1a" }) +
        tx(x + 8, y + 42, unit, 7.5, { f: "m", c: "#555" }) +
        (off ? tx(x + 8, y + 56, "de R$ " + was, 8, { f: "m", c: "#555", x: 'text-decoration="line-through"' }) + '<path d="M' + (x + 8) + " " + (y + 53) + "h56\" stroke=\"#555\"/>" : "") +
        '<text x="' + (x + 120) + '" y="' + (y + 68) + '" text-anchor="end" font-family="' + FAM.d + '" font-weight="800" fill="' + (off ? RED : "#1a1a1a") + '">' +
          '<tspan font-size="10">R$ </tspan><tspan font-size="32" letter-spacing="-1">' + p[0] + '</tspan><tspan font-size="14" dy="-14">,' + p[1] + "</tspan></text>" +
        "</g>";
    }
    function tray(cx, y) {
      var r = rng(cx), toms = "";
      for (var i = 0; i < 14; i++) {
        var a = (i % 7), row = Math.floor(i / 7);
        toms += '<circle cx="' + f2(cx - 39 + a * 13 + row * 6 + (r() - .5) * 3) + '" cy="' + f2(y - 4 + row * 7 + (r() - .5) * 3) + '" r="7.5" fill="url(#' + id + 'cereja)"/>';
      }
      return '<path d="M' + (cx - 52) + " " + (y - 6) + "Q" + cx + " " + (y - 30) + " " + (cx + 52) + " " + (y - 6) + '" fill="#fff" opacity=".18"/>' + toms +
        '<path d="M' + (cx - 58) + " " + y + "H" + (cx + 58) + "L" + (cx + 48) + " " + (y + 32) + "H" + (cx - 48) + 'Z" fill="#1b1b1b"/>' +
        '<path d="M' + (cx - 58) + " " + y + "H" + (cx + 58) + '" stroke="#444" stroke-width="2"/>' +
        '<path d="M' + (cx - 46) + " " + (y - 16) + "Q" + cx + " " + (y - 30) + " " + (cx + 40) + " " + (y - 14) + '" stroke="#fff" stroke-opacity=".55" stroke-width="2" fill="none"/>' +
        '<rect x="' + (cx - 38) + '" y="' + (y + 6) + '" width="76" height="22" rx="2" fill="#fff"/><rect x="' + (cx - 38) + '" y="' + (y + 6) + '" width="20" height="22" rx="2" fill="' + G + '"/>' +
        '<circle cx="' + (cx - 28) + '" cy="' + (y + 17) + '" r="5" fill="' + Y + '"/>' +
        tx(cx - 14, y + 15, "Mais Sabor", 7, { w: 700, c: G }) + tx(cx - 14, y + 24, "Tomate cereja 300 g", 5.6, { c: "#333" });
    }
    function bag(cx, y, rot) {
      var r = rng(cx + 3), leaves = "", greens = ["#4f9a3c", "#7cb83a", "#2f7a2d", "#9fd15a", "#8a2f5a"];
      for (var i = 0; i < 18; i++) leaves += '<ellipse cx="' + f2(cx - 36 + r() * 72) + '" cy="' + f2(y + 64 + r() * 46) + '" rx="' + f2(8 + r() * 8) + '" ry="' + f2(5 + r() * 5) + '" transform="rotate(' + Math.round(r() * 180) + " " + f2(cx) + " " + f2(y + 88) + ')" fill="' + greens[i % 5] + '"/>';
      var crimp = function (yy) { var s = "M" + (cx - 46) + " " + yy; for (var k = 0; k < 23; k++) s += "l2 -3 2 3"; return '<path d="' + s + '" stroke="#cfd8cc" fill="none"/>'; };
      return '<g transform="rotate(' + rot + " " + cx + " " + (y + 60) + ')">' +
        '<rect x="' + (cx - 46) + '" y="' + y + '" width="92" height="124" rx="8" fill="#e9f3e4" opacity=".92"/>' +
        '<clipPath id="' + id + "bg" + cx + '"><rect x="' + (cx - 46) + '" y="' + y + '" width="92" height="124" rx="8"/></clipPath>' +
        '<g clip-path="url(#' + id + "bg" + cx + ')">' + leaves +
          '<path d="M' + (cx - 46) + " " + (y + 10) + "H" + (cx + 46) + "V" + (y + 58) + "Q" + cx + " " + (y + 70) + " " + (cx - 46) + " " + (y + 58) + 'Z" fill="' + G + '"/>' +
          '<rect x="' + (cx - 46) + '" y="' + y + '" width="92" height="124" fill="url(#' + id + 'film)"/>' +
        "</g>" +
        '<rect x="' + (cx - 46) + '" y="' + y + '" width="92" height="10" fill="#dfe8db"/><rect x="' + (cx - 46) + '" y="' + (y + 114) + '" width="92" height="10" fill="#dfe8db"/>' +
        crimp(y + 9) + crimp(y + 117) +
        '<circle cx="' + cx + '" cy="' + (y + 22) + '" r="7" fill="' + Y + '"/><path d="M' + (cx - 3) + " " + (y + 25) + "q3-8 7-6-1 6-7 6z\" fill=\"" + G + '"/>' +
        tx(cx, y + 42, "Mix de folhas", 11, { f: "s", i: 1, c: "#fff", a: "middle" }) + tx(cx, y + 53, "MAIS SABOR · 200 g", 6, { f: "m", c: Y, a: "middle", ls: .6 }) +
        '<path d="M' + (cx - 30) + " " + (y + 14) + "V" + (y + 110) + '" stroke="#fff" stroke-opacity=".35" stroke-width="4"/>' +
        "</g>";
    }
    var star = "", n = 18;
    for (var i = 0; i < n * 2; i++) {
      var a = Math.PI * i / n, rr = i % 2 ? 34 : 42;
      star += (i ? "L" : "M") + f2(640 + rr * Math.cos(a)) + " " + f2(400 + rr * Math.sin(a));
    }
    var produce = function (x, kind) { return '<circle cx="' + x[0] + '" cy="' + x[1] + '" r="' + x[2] + '" fill="url(#' + id + kind + ')"/>'; };
    return (
      '<svg viewBox="0 0 1200 780" role="img" aria-label="Ponto de venda Hortifruti Mais Sabor: testeira da gôndola, caixotes de tomate, laranja, maçã e batata com régua de preço e etiquetas de oferta, wobbler, embalagens de marca própria e cartaz da Quarta Verde">' +
      "<defs>" + defs +
        '<linearGradient id="' + id + 'wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d3a46a"/><stop offset="1" stop-color="#a87a45"/></linearGradient>' +
        '<linearGradient id="' + id + 'green" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#25904a"/><stop offset="1" stop-color="#17602c"/></linearGradient>' +
        '<linearGradient id="' + id + 'rail" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2f4f5"/><stop offset=".5" stop-color="#c9ced3"/><stop offset="1" stop-color="#9aa1a8"/></linearGradient>' +
        '<linearGradient id="' + id + 'back" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b2a20"/><stop offset="1" stop-color="#2c3d31"/></linearGradient>' +
        '<linearGradient id="' + id + 'film" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".25"/><stop offset=".3" stop-color="#fff" stop-opacity="0"/><stop offset=".8" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity=".1"/></linearGradient>' +
        '<filter id="' + id + 'tsh" x="-10%" y="-10%" width="120%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity=".3"/></filter>' +
        '<filter id="' + id + 'psh" x="-10%" y="-10%" width="130%" height="130%"><feDropShadow dx="0" dy="12" stdDeviation="12" flood-opacity=".25"/></filter>' +
        '<pattern id="' + id + 'tile" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0H0V60" fill="none" stroke="#000" stroke-opacity=".05"/></pattern>' +
      "</defs>" +
      '<rect width="1200" height="780" fill="#efe8da"/><rect width="1200" height="720" fill="url(#' + id + 'tile)"/>' +
      '<rect y="720" width="1200" height="60" fill="#d6ccba"/>' +
      // gôndola
      '<rect x="60" y="140" width="840" height="560" fill="url(#' + id + 'back)"/>' +
      '<rect x="50" y="130" width="12" height="592" fill="url(#' + id + 'rail)"/><rect x="898" y="130" width="12" height="592" fill="url(#' + id + 'rail)"/>' +
      // testeira
      '<rect x="44" y="40" width="872" height="96" rx="4" fill="url(#' + id + 'green)"/>' +
      '<rect x="44" y="128" width="872" height="8" fill="' + Y + '"/>' +
      '<circle cx="104" cy="86" r="32" fill="' + Y + '"/><path d="M90 98q4-30 32-30-2 30-32 30z" fill="' + G + '"/><path d="M92 96l18-18" stroke="' + Y + '" stroke-width="2"/>' +
      tx(150, 94, "Mais Sabor", 40, { f: "d", w: 800, c: "#fff", ls: -1.4 }) +
      tx(152, 116, "HORTIFRUTI", 11, { f: "m", c: Y, ls: 4.5 }) +
      tx(886, 98, "Fresquinho todo dia", 34, { f: "s", i: 1, c: "#fff", a: "end" }) +
      // nível superior
      mound(72, 264, 290, "tomate", 3) + crate(72, 264, 290) +
      mound(348, 264, 290, "laranja", 7) + crate(348, 264, 290) +
      mound(624, 264, 290, "maca", 11) + crate(624, 264, 290) +
      '<rect x="56" y="330" width="848" height="20" fill="url(#' + id + 'rail)"/>' +
      tag(204, 338, "TOMATE ITALIANO", "kg", "7,49") + tag(480, 338, "LARANJA PERA", "kg", "3,99", "5,99") + tag(756, 338, "MAÇÃ GALA", "kg", "9,90") +
      // wobbler
      '<path d="M612 342L628 372" stroke="#cfd6db" stroke-width="3"/>' +
      '<g filter="url(#' + id + 'tsh)"><path d="' + star + 'Z" fill="' + RED + '"/><circle cx="640" cy="400" r="30" fill="' + Y + '"/></g>' +
      tx(640, 396, "OFERTA", 10, { f: "d", w: 800, c: RED, a: "middle", ls: .5 }) + tx(640, 412, "da semana", 12, { f: "s", i: 1, c: "#1a1a1a", a: "middle" }) +
      // nível inferior
      mound(72, 264, 560, "batata", 5) + crate(72, 264, 560) +
      '<rect x="348" y="560" width="540" height="40" fill="#e9e4da"/><path d="M348 560H888" stroke="#fff" stroke-width="2"/><path d="M348 600H888" stroke="#000" stroke-opacity=".2"/>' +
      '<g transform="translate(430 520) scale(1.28) translate(-430 -520)">' + tray(430, 520) + "</g>" +
      '<g transform="translate(580 520) scale(1.28) translate(-580 -520)">' + tray(580, 520) + "</g>" +
      bag(722, 432, -4) + bag(832, 432, 3) +
      '<rect x="56" y="600" width="848" height="20" fill="url(#' + id + 'rail)"/>' +
      tag(204, 608, "BATATA LAVADA", "kg", "4,49") + tag(483, 608, "TOMATE CEREJA", "bandeja 300 g", "5,99") + tag(733, 608, "MIX DE FOLHAS", "pacote 200 g", "6,49", "7,99") +
      // rodapé da gôndola
      '<rect x="44" y="690" width="872" height="34" fill="#17602c"/>' + tx(480, 712, "MAIS SABOR · HORTIFRUTI", 9, { f: "m", c: Y, a: "middle", ls: 4 }) +
      // cartaz pendurado
      '<path d="M960 0L975 150M1120 0L1105 150" stroke="#9a9286" stroke-width="1.2"/>' +
      '<g filter="url(#' + id + 'psh)">' +
        '<rect x="940" y="150" width="200" height="480" fill="' + G + '"/>' +
        '<rect x="940" y="574" width="200" height="56" fill="' + Y + '"/>' +
      "</g>" +
      '<rect x="940" y="146" width="200" height="8" fill="#d9dde0"/><rect x="940" y="626" width="200" height="8" fill="#d9dde0"/>' +
      tx(956, 196, "TODA QUARTA", 10, { f: "m", c: Y, ls: 2.5 }) +
      tx(954, 250, "Quarta", 50, { f: "d", w: 800, c: "#fff", ls: -2 }) +
      tx(956, 306, "Verde", 66, { f: "s", i: 1, c: Y, ls: -1 }) +
      produce([1000, 400, 34], "laranja") + produce([1064, 386, 30], "maca") + produce([1040, 438, 28], "tomate") +
      '<ellipse cx="984" cy="452" rx="26" ry="18" fill="#7cb83a"/><path d="M962 452q22-10 44 0" stroke="#4a7d1c" stroke-width="2" fill="none"/>' +
      '<path d="M1080 350q24-6 34 14-22 8-34-14z" fill="#3f8f2f"/>' +
      lines(956, 500, ["Frutas, legumes e", "verduras com preço", "especial toda quarta."], 13.5, 18, { c: "#fff" }) +
      tx(1040, 610, "Mais Sabor", 22, { f: "d", w: 800, c: G, a: "middle", ls: -.8 }) +
      // chamadas
      pin(44, 22, "TESTEIRA") + pin(72, 436, "RÉGUA DE PREÇO") + pin(594, 444, "WOBBLER", { end: 1 }) + pin(362, 452, "MARCA PRÓPRIA") + pin(1140, 666, "CARTAZ 30 × 70 cm", { end: 1 }) +
      "</svg>"
    );
  };

  // ícone da biblioteca ICO desenhado como grupo SVG (sem <svg> aninhado)
  function icoG(key, x, y, s, color) {
    var inner = ICO[key].replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
    return '<g transform="translate(' + x + " " + y + ") scale(" + s + ')" color="' + color + '" fill="none" stroke="currentColor" stroke-width="1.6">' + inner + "</g>";
  }

  // QR code ilustrativo (padrão de módulos com os três marcadores)
  function qr(x, y, size, seed, color, bg) {
    var n = 21, m = size / n, r = rng(seed), out = "";
    function finder(i, j) {
      return '<rect x="' + f2(x + i * m) + '" y="' + f2(y + j * m) + '" width="' + f2(7 * m) + '" height="' + f2(7 * m) + '" fill="' + color + '"/>' +
        '<rect x="' + f2(x + (i + 1) * m) + '" y="' + f2(y + (j + 1) * m) + '" width="' + f2(5 * m) + '" height="' + f2(5 * m) + '" fill="' + bg + '"/>' +
        '<rect x="' + f2(x + (i + 2) * m) + '" y="' + f2(y + (j + 2) * m) + '" width="' + f2(3 * m) + '" height="' + f2(3 * m) + '" fill="' + color + '"/>';
    }
    for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) {
      var inF = (i < 8 && j < 8) || (i > 12 && j < 8) || (i < 8 && j > 12);
      if (!inF && r() > .52) out += '<rect x="' + f2(x + i * m) + '" y="' + f2(y + j * m) + '" width="' + f2(m + .1) + '" height="' + f2(m + .1) + '"/>';
    }
    return '<rect x="' + f2(x - m) + '" y="' + f2(y - m) + '" width="' + f2(size + 2 * m) + '" height="' + f2(size + 2 * m) + '" fill="' + bg + '"/>' +
      '<g fill="' + color + '">' + out + "</g>" + finder(0, 0) + finder(14, 0) + finder(0, 14);
  }

  /* ---------- Deep Saúde: impressos institucionais ---------- */
  M["deep-print"] = function () {
    var id = uid("dp"), S = "#6E775D", T = "#CB8461", C = "#F8F6F3", K = "#2B2926";
    function stars(list, color) {
      return list.map(function (s) { return tx(s[0], s[1], "✦", s[2], { c: color, op: s[3] || .7 }); }).join("");
    }
    var tags = ["Ansiedade", "Depressão", "TCC", "Autoestima", "Luto", "Casais"];
    var pills = tags.map(function (t, i) {
      var x = 14 + (i % 2) * 60, y = 70 + Math.floor(i / 2) * 26, w = 54;
      return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="18" rx="9" fill="none" stroke="' + S + '"/>' + tx(x + w / 2, y + 12.4, t, 7.6, { c: S, a: "middle", w: 600 });
    }).join("");
    var steps = [["Responda 7", "perguntas rápidas."], ["Veja as especialistas", "ideais para você."], ["Agende a sua", "sessão."]].map(function (s, i) {
      var y = 96 + i * 66;
      return '<circle cx="24" cy="' + y + '" r="11" fill="' + T + '"/>' + tx(24, y + 4, i + 1, 10, { f: "d", w: 700, c: "#fff", a: "middle" }) +
        lines(42, y - 2, s, 8.4, 12, { c: C });
    }).join("");
    var folder =
      '<ellipse cx="660" cy="600" rx="230" ry="14" fill="#5a4c3c" opacity=".35" filter="url(#' + id + 'bl)"/>' +
      '<g transform="translate(450 180) skewY(8)"><rect width="140" height="400" fill="' + C + '"/>' +
        stars([[16, 42, 16, 1]], T) +
        lines(14, 84, ["Cuidar da sua", "saúde mental é", "um ato de"], 19, 22, { f: "s", c: S }) +
        tx(14, 150, "amor-próprio.", 19, { f: "s", i: 1, c: T }) +
        lines(14, 182, ["Na Deep Saúde você", "encontra psicólogas", "especialistas para", "cada momento."], 8.2, 12, { c: K, op: .8 }) +
        '<path d="M0 400V330A70 70 0 0 1 140 330V400Z" fill="' + T + '" opacity=".9"/>' +
        '<path d="M30 400V350A40 40 0 0 1 110 350V400Z" fill="' + S + '"/>' +
        '<rect width="140" height="400" fill="url(#' + id + 'p1)"/>' +
      "</g>" +
      '<g transform="translate(590 199.7) skewY(-8)"><rect width="140" height="400" fill="' + S + '"/>' +
        tx(14, 52, "Como funciona", 19, { f: "s", c: C }) + steps +
        stars([[110, 330, 14], [90, 360, 9], [118, 372, 7]], C) +
        '<rect width="140" height="400" fill="url(#' + id + 'p2)"/>' +
      "</g>" +
      '<g transform="translate(730 180) skewY(8)"><rect width="140" height="400" fill="' + C + '"/>' +
        tx(14, 52, "Especialidades", 18, { f: "s", c: S }) + pills +
        '<circle cx="110" cy="250" r="44" fill="' + T + '" opacity=".25"/><circle cx="96" cy="262" r="26" fill="' + S + '" opacity=".25"/>' +
        stars([[24, 240, 12, 1]], T) +
        tx(14, 360, "Deep Saúde", 17, { f: "s", c: S }) + tx(14, 376, "DEEPSAUDE.COM", 6.8, { f: "m", c: K, ls: 1.2, op: .7 }) +
        '<rect width="140" height="400" fill="url(#' + id + 'p3)"/>' +
      "</g>";

    var roll =
      '<ellipse cx="1010" cy="666" rx="140" ry="10" fill="#5a4c3c" opacity=".45" filter="url(#' + id + 'bl)"/>' +
      '<g filter="url(#' + id + 'sh)"><rect x="910" y="58" width="200" height="586" fill="' + S + '"/></g>' +
      '<rect x="906" y="52" width="208" height="8" rx="4" fill="url(#' + id + 'al)"/>' +
      tx(930, 104, "Deep Saúde", 24, { f: "s", c: C }) + stars([[1080, 102, 14, 1]], T) +
      stars([[1074, 170, 10], [940, 340, 12], [1086, 300, 8], [1000, 160, 7]], C) +
      lines(930, 214, ["Encontre", "uma especialista"], 28, 32, { f: "s", c: C }) +
      tx(930, 278, "ideal para si.", 28, { f: "s", i: 1, c: "#f2c4a6" }) +
      '<clipPath id="' + id + 'rc"><rect x="910" y="58" width="200" height="586"/></clipPath>' +
      '<g clip-path="url(#' + id + 'rc)"><circle cx="1084" cy="420" r="78" fill="' + T + '"/><circle cx="1036" cy="452" r="44" fill="' + C + '" opacity=".18"/></g>' +
      '<path d="M940 470c10-40 40-60 70-60-6 34-34 58-70 60z" fill="' + C + '" opacity=".55"/><path d="M944 466l56-44" stroke="' + S + '" stroke-width="1.5"/>' +
      '<rect x="910" y="486" width="200" height="158" fill="' + C + '"/>' +
      lines(928, 516, ["Responda 7 perguntas", "e encontre a sua."], 15, 18, { f: "s", c: K }) +
      '<rect x="928" y="550" width="164" height="28" rx="14" fill="' + S + '"/>' + tx(1010, 568, "Encontrar a minha especialista", 8.4, { c: "#fff", a: "middle", w: 600 }) +
      qr(1050, 592, 42, 9, K, C) + tx(928, 620, "DEEPSAUDE.COM", 8.5, { f: "m", c: K, ls: 1.4 }) + tx(928, 634, "Aponte a câmera", 7.6, { c: K, op: .7 }) +
      '<rect x="900" y="644" width="220" height="14" rx="4" fill="url(#' + id + 'al)"/>' +
      '<path d="M914 658l-14 12M1106 658l14 12" stroke="#8d939a" stroke-width="5" stroke-linecap="round"/>';

    var cards =
      '<g transform="translate(56 268) rotate(-8)" filter="url(#' + id + 'sh)">' +
        '<rect width="300" height="168" rx="4" fill="' + C + '"/><rect width="8" height="168" fill="' + T + '"/>' +
        tx(26, 40, "ATENDIMENTO", 8, { f: "m", c: S, ls: 2 }) +
        tx(26, 74, "Encontre a especialista", 20, { f: "s", c: K }) + tx(26, 98, "ideal para si.", 20, { f: "s", i: 1, c: T }) +
        tx(26, 124, "deepsaude.com", 8.6, { f: "m", c: K }) + tx(26, 138, "@deepsaudepsicologia", 8.6, { f: "m", c: K }) +
        qr(236, 100, 44, 4, S, C) +
      "</g>" +
      '<g transform="translate(150 452) rotate(5)" filter="url(#' + id + 'sh)">' +
        '<rect width="300" height="168" rx="4" fill="' + S + '"/>' +
        '<path d="M300 168H200A100 100 0 0 1 300 68Z" fill="' + T + '"/>' +
        '<path d="M300 168H244A56 56 0 0 1 300 112Z" fill="' + C + '" opacity=".2"/>' +
        tx(28, 82, "Deep Saúde", 38, { f: "s", c: C, ls: -.5 }) + stars([[196, 54, 15, 1]], "#f2c4a6") +
        tx(30, 106, "Saúde mental com especialistas", 10, { c: C, op: .85 }) +
        tx(30, 146, "DEEPSAUDE.COM", 8, { f: "m", c: C, ls: 1.6, op: .8 }) +
        '<rect width="300" height="168" rx="4" fill="url(#' + id + 'cg)"/>' +
      "</g>";

    return (
      '<svg viewBox="0 0 1200 700" role="img" aria-label="Impressos institucionais Deep Saúde nas cores sálvia, terracota e creme: cartões de visita frente e verso, folder de três dobras e banner roll-up com chamada para o quiz de especialistas e QR code">' +
      "<defs>" +
        '<filter id="' + id + 'sh" x="-15%" y="-15%" width="130%" height="140%"><feDropShadow dx="0" dy="16" stdDeviation="14" flood-color="#3b3024" flood-opacity=".28"/></filter>' +
        '<filter id="' + id + 'bl" x="-30%" y="-200%" width="160%" height="500%"><feGaussianBlur stdDeviation="9"/></filter>' +
        '<linearGradient id="' + id + 'p1" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset="1" stop-color="#000" stop-opacity=".05"/></linearGradient>' +
        '<linearGradient id="' + id + 'p2" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset="1" stop-color="#000" stop-opacity=".06"/></linearGradient>' +
        '<linearGradient id="' + id + 'p3" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".04"/><stop offset="1" stop-color="#fff" stop-opacity=".15"/></linearGradient>' +
        '<linearGradient id="' + id + 'al" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9ecef"/><stop offset=".5" stop-color="#b9bfc6"/><stop offset="1" stop-color="#868d95"/></linearGradient>' +
        '<linearGradient id="' + id + 'cg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
        '<linearGradient id="' + id + 'bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#efe9df"/><stop offset="1" stop-color="#e3dace"/></linearGradient>' +
      "</defs>" +
      '<rect width="1200" height="700" fill="url(#' + id + 'bg)"/>' +
      stars([[80, 90, 18, .5], [400, 70, 12, .4], [860, 120, 10, .4], [60, 640, 12, .35], [520, 660, 9, .3]], T) +
      folder + roll + cards +
      pin(56, 226, "CARTÃO 9 × 5 cm · FRENTE E VERSO") + pin(450, 150, "FOLDER A4 · 3 DOBRAS") + pin(1110, 30, "ROLL-UP 80 × 200 cm", { end: 1 }) +
      "</svg>"
    );
  };

  /* ---------- Ficha de aprovação gráfica (pré-impressão) ---------- */
  M["print-spec-sheet"] = function () {
    var id = uid("ps"), acc = "#2de1c2", cut = "#e6007e", crease = "#e6007e", s = .86;
    var x0 = 92, yb = 300; // origem do corpo da caixa (mm → px pela escala s)
    function X(mm) { return f2(x0 + mm * s); }
    function Y(mm) { return f2(yb + mm * s); }
    var per = "M0 8L15 0L17 -60Q18 -70 28 -70H110L119 -4V-104H122Q122 -124 142 -124H346Q366 -124 366 -104H369V-4L378 -70H460Q470 -70 471 -60L473 0H723V310" +
      "V414H720Q720 434 700 434H496Q476 434 476 414H473V314L464 380H382Q372 380 371 372L369 310H119L118 314L110 380H28Q18 380 17 370L15 310L0 302Z";
    var creases = "M15 0V310M119 0V310M369 0V310M473 0V310M119 0H369M122 -104H366M15 0H119M369 0H473M15 310H119M369 310H473M473 310H723M476 414H720";
    var nss = 'vector-effect="non-scaling-stroke"';
    // arte do corpo (em mm, com 3 mm de sangria nas bordas externas)
    var art =
      '<rect x="119" y="-107" width="250" height="107" fill="#1b1e22"/>' +
      tx(244, -44, "YDH", 34, { f: "d", w: 800, c: "url(#" + id + "silver)", a: "middle", ls: -1 }) +
      tx(244, -24, "PULSE PRO", 8, { f: "m", c: "#9aa1aa", a: "middle", ls: 3 }) +
      '<rect x="119" y="0" width="250" height="313" fill="url(#' + id + 'gph)"/>' +
      '<ellipse cx="244" cy="128" rx="110" ry="86" fill="url(#' + id + 'glow)"/>' +
      prod("gun", id, acc, 244, 128, 1.05) +
      tx(131, 22, "YDH", 15, { f: "d", w: 800, c: "url(#" + id + "silver)" }) + tx(357, 21, "WELLNESS · TECH", 6.5, { f: "m", c: "#9aa1aa", a: "end", ls: 1 }) +
      tx(131, 244, "PULSE", 44, { f: "d", w: 800, c: "#fff", ls: -1.5 }) + tx(268, 244, "PRO", 44, { f: "d", w: 800, c: "none", x: 'stroke="' + acc + '" stroke-width="1"' }) +
      tx(132, 262, "Massageador percussivo", 10, { c: "#a9b0b8" }) +
      [0, 1, 2, 3].map(function (i) { return '<circle cx="' + (140 + i * 30) + '" cy="284" r="8" fill="none" stroke="' + acc + '"/>'; }).join("") +
      '<rect x="119" y="302" width="250" height="11" fill="' + acc + '"/>' +
      '<rect x="12" y="-3" width="107" height="316" fill="#e9ebee"/>' +
      '<rect x="12" y="-3" width="4" height="316" fill="#fff"/>' +
      [0, 1, 2, 3, 4, 5, 6].map(function (i) { return '<rect x="30" y="' + (40 + i * 14) + '" width="' + (i % 3 ? 74 : 50) + '" height="4" fill="#9aa1aa"/>'; }).join("") +
      '<rect x="369" y="-3" width="104" height="316" fill="#121417"/>' +
      tx(421, 160, "PULSE PRO", 26, { f: "d", w: 800, c: acc, a: "middle", x: 'transform="rotate(-90 421 160)"' }) +
      '<rect x="384" y="244" width="74" height="46" fill="#fff"/>' + ean(388, 248, 66, 30, 11, "#111") +
      '<rect x="473" y="-3" width="253" height="316" fill="#16181b"/>' +
      tx(493, 50, "4 ponteiras.", 22, { f: "d", w: 800, c: "#fff", ls: -.6 }) + tx(493, 72, "Um alvo para cada músculo.", 12, { c: acc }) +
      [0, 1, 2, 3].map(function (i) { return '<circle cx="' + (513 + i * 54) + '" cy="130" r="20" fill="#2a2e34"/><circle cx="' + (513 + i * 54) + '" cy="126" r="8" fill="#d9dde2"/>'; }).join("") +
      [0, 1, 2, 3, 4].map(function (i) { return '<rect x="493" y="' + (190 + i * 14) + '" width="' + (i % 2 ? 170 : 200) + '" height="4" fill="#4a5058"/>'; }).join("");
    // ampliação do canto (sangria e segurança)
    var zx = 336, zy = 618, zr = 46, cx1 = zx - 16, cy1 = zy + 8;
    var zoom =
      '<clipPath id="' + id + 'zc"><circle cx="' + zx + '" cy="' + zy + '" r="' + zr + '"/></clipPath>' +
      '<circle cx="' + zx + '" cy="' + zy + '" r="' + zr + '" fill="#fff"/>' +
      '<g clip-path="url(#' + id + 'zc)">' +
        '<rect x="' + (cx1 - 14) + '" y="' + (zy - 60) + '" width="120" height="' + (cy1 - zy + 74) + '" fill="#1b1e22"/>' +
        '<rect x="' + (cx1 - 14) + '" y="' + (cy1 - 10) + '" width="120" height="24" fill="' + acc + '"/>' +
        '<path d="M' + cx1 + " " + (zy - 60) + "V" + cy1 + "H" + (zx + 60) + '" fill="none" stroke="' + cut + '" stroke-width="2"/>' +
        '<path d="M' + (cx1 + 14) + " " + (zy - 60) + "V" + (cy1 - 16) + "H" + (zx + 60) + '" fill="none" stroke="#00a0e3" stroke-width="1.5" stroke-dasharray="4 3"/>' +
        '<path d="M' + (cx1 - 14) + " " + (zy - 60) + "V" + (cy1 + 14) + "H" + (zx + 60) + '" fill="none" stroke="' + cut + '" stroke-width="1" stroke-dasharray="3 3"/>' +
      "</g>" +
      '<circle cx="' + zx + '" cy="' + zy + '" r="' + zr + '" fill="none" stroke="#121212" stroke-width="1.4"/>' +
      '<path d="M' + (zx - 40) + " " + (zy - 24) + "L" + f2(+X(119) + 8) + " " + f2(+Y(310) + 4) + '" stroke="#121212" stroke-dasharray="2 3"/>' +
      '<circle cx="' + X(119) + '" cy="' + Y(310) + '" r="8" fill="none" stroke="#121212"/>' +
      tx(zx - 54, zy + 2, "AMPLIAÇÃO", 7.6, { f: "m", c: "#6b655c", a: "end", ls: .8 }) +
      tx(zx - 54, zy + 13, "DO CANTO", 7.6, { f: "m", c: "#6b655c", a: "end", ls: .8 });
    function num(n, x, y) {
      return '<circle cx="' + x + '" cy="' + y + '" r="10" fill="#121212"/>' + tx(x, y + 3.6, n, 10, { f: "m", c: "#fff", a: "middle", w: 500 });
    }
    var dims = '<g stroke="#121212" stroke-width=".8" fill="none">' +
      '<path d="M' + X(15) + " " + Y(452) + "H" + X(723) + "M" + X(15) + " " + Y(446) + "V" + Y(458) + "M" + X(119) + " " + Y(446) + "V" + Y(458) + "M" + X(369) + " " + Y(446) + "V" + Y(458) + "M" + X(473) + " " + Y(446) + "V" + Y(458) + "M" + X(723) + " " + Y(446) + "V" + Y(458) + '"/>' +
      '<path d="M' + X(-14) + " " + Y(0) + "V" + Y(310) + "M" + X(-19) + " " + Y(0) + "H" + X(-9) + "M" + X(-19) + " " + Y(310) + "H" + X(-9) + '"/></g>' +
      '<g font-family="' + FAM.m + '" font-size="9" fill="#121212" text-anchor="middle">' +
        '<rect x="' + X(48) + '" y="' + Y(446) + '" width="40" height="12" fill="#fff"/><text x="' + X(67) + '" y="' + f2(+Y(452) + 3.5) + '">104</text>' +
        '<rect x="' + X(225) + '" y="' + Y(446) + '" width="40" height="12" fill="#fff"/><text x="' + X(244) + '" y="' + f2(+Y(452) + 3.5) + '">250</text>' +
        '<rect x="' + X(402) + '" y="' + Y(446) + '" width="40" height="12" fill="#fff"/><text x="' + X(421) + '" y="' + f2(+Y(452) + 3.5) + '">104</text>' +
        '<rect x="' + X(576) + '" y="' + Y(446) + '" width="40" height="12" fill="#fff"/><text x="' + X(598) + '" y="' + f2(+Y(452) + 3.5) + '">250</text>' +
        '<text transform="rotate(-90 ' + X(-18) + " " + Y(155) + ')" x="' + X(-18) + '" y="' + Y(155) + '">310 mm</text>' +
      "</g>";
    // miniaturas das separações
    function mini(mode, x, y) {
      var w = 170, h = 118, pw = 72, ph = 90, px = x + (w - pw) / 2, py = y + (h - ph) / 2, k = pw / 250, out = "";
      var g = function (inner) { return '<g transform="translate(' + px + " " + py + ") scale(" + f2(k) + ')">' + inner + "</g>"; };
      if (mode === "cmyk") out = g('<rect width="250" height="310" fill="#1b1e22"/>' + prod("gun", id, acc, 125, 128, 1.05) + tx(12, 244, "PULSE", 44, { f: "d", w: 800, c: "#fff" }) + tx(12, 22, "YDH", 15, { f: "d", w: 800, c: "#c9ced4" }) + '<rect y="300" width="250" height="10" fill="' + acc + '"/>');
      if (mode === "pms") out = g('<rect width="250" height="310" fill="none" stroke="#ddd" stroke-width="3"/><rect x="45" y="32" width="8" height="52" fill="' + acc + '" transform="translate(28 44)"/>' + tx(149, 244, "PRO", 44, { f: "d", w: 800, c: "none", x: 'stroke="' + acc + '" stroke-width="3"' }) + [0, 1, 2, 3].map(function (i) { return '<circle cx="' + (21 + i * 30) + '" cy="284" r="8" fill="none" stroke="' + acc + '" stroke-width="3"/>'; }).join("") + '<rect y="300" width="250" height="10" fill="' + acc + '"/>');
      if (mode === "k") out = g('<rect width="250" height="310" fill="none" stroke="#ddd" stroke-width="3"/>' + tx(12, 244, "PULSE", 44, { f: "d", w: 800, c: "#111" }) + tx(13, 262, "Massageador percussivo", 10, { c: "#111" }) + tx(238, 21, "WELLNESS · TECH", 6.5, { f: "m", c: "#111", a: "end" }));
      if (mode === "uv") out = g('<rect width="250" height="310" fill="none" stroke="#ddd" stroke-width="3"/><g transform="translate(28 29) scale(1.05)" fill="#5b5f66"><rect x="46" y="32" width="138" height="52" rx="26"/><path d="M108 78h36l8 78q1 10-9 10h-20q-10 0-10-10z"/><circle cx="17" cy="58" r="16"/></g>');
      if (mode === "hot") out = g('<rect width="250" height="310" fill="none" stroke="#ddd" stroke-width="3"/>' + tx(12, 22, "YDH", 15, { f: "d", w: 800, c: "url(#" + id + "silver)" }) + tx(125, 170, "YDH", 80, { f: "d", w: 800, c: "#8d949c", a: "middle" }) + tx(125, 206, "TAMPA + FRENTE", 13, { f: "m", c: "#8d949c", a: "middle" }));
      if (mode === "faca") out = '<g transform="translate(' + (x + 14) + " " + (y + 5) + ') scale(.196)"><path d="' + per + '" fill="none" stroke="' + cut + '" stroke-width="5" transform="translate(0 124)"/><path d="' + creases + '" fill="none" stroke="' + cut + '" stroke-width="4" stroke-dasharray="14 10" transform="translate(0 124)"/></g>';
      return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" fill="#fff" stroke="#121212" stroke-opacity=".14"/>' + out;
    }
    var seps = [["cmyk", "ARTE · CMYK"], ["pms", "PANTONE 3262 C"], ["k", "PRETO 100K · TEXTOS"], ["uv", "VERNIZ UV LOCALIZADO"], ["hot", "HOT STAMPING · 877 C"], ["faca", "FACA · ESPECIAL · OVERPRINT"]];
    var sepG = seps.map(function (sp, i) {
      var x = 790 + (i % 2) * 186, y = 206 + Math.floor(i / 2) * 150;
      return mini(sp[0], x, y) + tx(x, y + 134, sp[1], 8.4, { f: "m", c: "#121212", ls: .6 }) + tx(x + 170, y + 134, "0" + (i + 1), 8.4, { f: "m", c: "#8f887d", a: "end" });
    }).join("");
    var inks = [["C", "#00a0e3", "Ciano"], ["M", "#e6007e", "Magenta"], ["Y", "#ffd600", "Amarelo"], ["K", "#121212", "Preto"], ["3262 C", acc, "Pantone"], ["877 C", "url(#" + id + "silver)", "Metálico"]].map(function (c, i) {
      var x = 790 + i * 60;
      return '<rect x="' + x + '" y="676" width="52" height="34" rx="3" fill="' + c[1] + '"/>' + tx(x, 724, c[0], 8.6, { f: "m", c: "#121212", w: 500 }) + tx(x, 735, c[2], 7.4, { c: "#6b655c" });
    }).join("");
    var head = [["CLIENTE", "YDH"], ["PEÇA", "Caixa cartucho Pulse Pro"], ["FORMATO", "250 × 104 × 310 mm"], ["VERSÃO", "v04 · final"],
      ["PROCESSO", "Offset 4 cores + 1 Pantone"], ["SUBSTRATO", "Cartão triplex 300 g/m²"], ["ACABAMENTO", "Lam. fosca · UV · hot stamp."], ["LINEATURA", "175 lpi · perfil da gráfica"]].map(function (c, i) {
      var x = 560 + (i % 4) * 147, y = 58 + Math.floor(i / 4) * 44;
      return '<rect x="' + x + '" y="' + y + '" width="147" height="44" fill="none" stroke="#121212" stroke-opacity=".18"/>' +
        tx(x + 8, y + 15, c[0], 7.2, { f: "m", c: "#8f887d", ls: 1 }) + tx(x + 8, y + 33, c[1], c[1].length > 22 ? 9 : 10.5, { w: 600, c: "#121212" });
    }).join("");
    var legend = [["1", "Faca: corte · cor especial em overprint"], ["2", "Vinco · linha tracejada"], ["3", "Sangria de 3 mm"], ["4", "Margem de segurança de 5 mm"], ["5", "Verniz UV localizado · positivo"], ["6", "Hot stamping prata · Pantone 877 C"]].map(function (l, i) {
      var x = 54 + (i % 2) * 262, y = 776 + Math.floor(i / 2) * 22;
      return num(l[0], x + 8, y - 3) + tx(x + 24, y + 1, l[1], 9.4, { c: "#2b2926" });
    }).join("");
    var cbar = ["#00a0e3", "#e6007e", "#ffd600", "#121212", "#4cc1ee", "#ee5aa8", "#ffe14d", "#555", "#99d9f5", "#f5a3cd", "#ffec8c", "#999", "#2e3192", "#e6262a", "#00a651", "#c8c8c8", "#ffffff", "#666"].map(function (c, i) {
      return '<rect x="' + (54 + i * 22) + '" y="846" width="22" height="12" fill="' + c + '" stroke="#121212" stroke-opacity=".12"/>';
    }).join("");
    var sig = function (x, d) { return '<path d="' + d + '" transform="translate(' + x + ' 0)" fill="none" stroke="#24408e" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>'; };
    var approvals = [["DESIGNER", "M8 784c8-20 16-22 14-6s10-14 18-10-4 14 6 10 12-8 22-4 14-6 22 0"], ["MARKETING", "M6 786c12-4 10-24 20-16s-2 18 8 14 14-14 20-8 4 10 14 6 10-4 24-2"], ["GRÁFICA", "M10 782c6-14 22-12 18 0s14-10 20-4-6 8 6 8 18-14 30-6"]].map(function (a, i) {
      var x = 794 + i * 118;
      return sig(x, a[1]) + '<path d="M' + x + " 796H" + (x + 104) + '" stroke="#121212" stroke-opacity=".5"/>' +
        tx(x, 810, a[0], 7.6, { f: "m", c: "#121212", ls: 1 }) + tx(x, 824, "Data ___/___", 7.6, { f: "m", c: "#8f887d" });
    }).join("");
    return (
      '<svg viewBox="0 0 1200 900" role="img" aria-label="Ficha de aprovação gráfica da caixa cartucho YDH Pulse Pro: faca planificada com arte, vincos, cotas, sangria de 3 mm e margem de segurança, separações de CMYK, Pantone, preto, verniz UV, hot stamping e faca, tintas, assinaturas e carimbo de aprovado">' +
      "<defs>" + prodDefs(id) +
        '<filter id="' + id + 'sh" x="-5%" y="-5%" width="110%" height="115%"><feDropShadow dx="0" dy="18" stdDeviation="20" flood-color="#000" flood-opacity=".22"/></filter>' +
        '<filter id="' + id + 'st" x="-10%" y="-20%" width="120%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="2" seed="8" result="n"/>' +
          '<feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -3 0 0 0 2.35" result="m"/><feComposite in="SourceGraphic" in2="m" operator="in"/></filter>' +
        '<linearGradient id="' + id + 'gph" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22262b"/><stop offset="1" stop-color="#121417"/></linearGradient>' +
        '<radialGradient id="' + id + 'glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="' + acc + '" stop-opacity=".35"/><stop offset="1" stop-color="' + acc + '" stop-opacity="0"/></radialGradient>' +
        '<linearGradient id="' + id + 'silver" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8d949c"/><stop offset=".4" stop-color="#f4f6f8"/><stop offset=".6" stop-color="#b3b9c0"/><stop offset="1" stop-color="#e6e9ec"/></linearGradient>' +
        '<pattern id="' + id + 'gl" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0v6" stroke="#8f887d" stroke-width="1" opacity=".5"/></pattern>' +
      "</defs>" +
      '<g filter="url(#' + id + 'sh)"><rect x="30" y="24" width="1140" height="852" rx="4" fill="#fff"/></g>' +
      // marcas de corte e registro da folha
      '<g stroke="#121212" stroke-width=".8"><path d="M30 10V18M16 24H24M1170 10V18M1176 24H1184M30 882V890M16 876H24M1170 882V890M1176 876H1184"/></g>' +
      reg(42, 450, 4.5) + reg(1158, 450, 4.5) + reg(600, 36, 4.5) +
      // cabeçalho
      tx(54, 84, "Ficha de aprovação gráfica", 26, { f: "d", w: 800, c: "#121212", ls: -.8 }) +
      tx(54, 106, "PROVA DE LAYOUT · CONFERIR ANTES DA PROVA DE COR CONTRATUAL", 8.6, { f: "m", c: "#8f887d", ls: 1 }) +
      '<rect x="54" y="120" width="150" height="20" rx="10" fill="#121212"/>' + tx(129, 133.5, "JOB YDH · PULSE PRO", 8.4, { f: "m", c: "#f2eee6", a: "middle", ls: .8 }) +
      head +
      '<path d="M54 160H1146" stroke="#121212" stroke-opacity=".3"/>' +
      tx(54, 182, "FACA PLANIFICADA · ESCALA REDUZIDA · MEDIDAS EM mm", 8.4, { f: "m", c: "#121212", ls: 1 }) +
      tx(790, 182, "SEPARAÇÕES", 8.4, { f: "m", c: "#121212", ls: 1 }) +
      '<path d="M766 172V740" stroke="#121212" stroke-opacity=".14"/>' +
      // desenho técnico
      '<g transform="translate(' + x0 + " " + yb + ") scale(" + s + ')">' +
        '<path d="M0 8L15 0V310L0 302Z" fill="url(#' + id + 'gl)"/>' +
        art +
        '<path d="' + creases + '" fill="none" stroke="' + crease + '" stroke-width="1.1" stroke-dasharray="6 4" ' + nss + "/>" +
        '<path d="' + per + '" fill="none" stroke="' + cut + '" stroke-width="1.6" ' + nss + "/>" +
        '<rect x="124" y="5" width="240" height="300" fill="none" stroke="#00a0e3" stroke-width="1" stroke-dasharray="5 3" ' + nss + "/>" +
        tx(7, 160, "COLA", 7, { f: "m", c: "#6b655c", a: "middle", x: 'transform="rotate(-90 7 160)"' }) +
        tx(67, -30, "ABA", 8, { f: "m", c: "#8f887d", a: "middle" }) + tx(421, -30, "ABA", 8, { f: "m", c: "#8f887d", a: "middle" }) +
        tx(598, 380, "FUNDO", 8, { f: "m", c: "#8f887d", a: "middle" }) + tx(244, -112, "LINGUETA", 7, { f: "m", c: "#8f887d", a: "middle" }) +
      "</g>" +
      dims + zoom +
      num(1, X(738), Y(150)) + '<path d="M' + X(724) + " " + Y(150) + "H" + f2(+X(738) - 10) + '" stroke="#121212"/>' +
      num(2, X(473), Y(150)) +
      num(4, X(150), Y(52)) +
      num(5, X(244), Y(70)) +
      num(6, X(300), Y(-64)) +
      num(3, zx + 38, zy + 36) +
      sepG +
      tx(790, 664, "TINTAS", 8.4, { f: "m", c: "#121212", ls: 1 }) + inks +
      '<path d="M54 748H1146" stroke="#121212" stroke-opacity=".3"/>' +
      legend + approvals +
      // carimbo
      '<g transform="rotate(-8 616 236)" filter="url(#' + id + 'st)">' +
        '<rect x="506" y="198" width="220" height="76" rx="10" fill="none" stroke="#d23a2a" stroke-width="4"/>' +
        '<rect x="514" y="206" width="204" height="60" rx="6" fill="none" stroke="#d23a2a" stroke-width="1.5"/>' +
        tx(616, 242, "APROVADO", 34, { f: "d", w: 800, c: "#d23a2a", a: "middle", ls: 1 }) +
        tx(616, 259, "PARA PRODUÇÃO · v04", 9, { f: "m", c: "#d23a2a", a: "middle", ls: 2 }) +
      "</g>" +
      cbar + tx(1146, 856, "BARRA DE CONTROLE · REGISTRO", 7.6, { f: "m", c: "#8f887d", a: "end", ls: 1 }) +
      "</svg>"
    );
  };
})();
