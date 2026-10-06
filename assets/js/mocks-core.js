/* Mockups compartilhados (identidade do portfólio + peças do hero).
   Cada função recebe (el, dataset) e devolve uma string HTML/SVG. */
(function () {
  "use strict";
  var LC = (window.LC = window.LC || {});
  var M = (LC.mocks = LC.mocks || {});

  /* raiz de assets/ resolvida a partir deste script (funciona em qualquer subpasta) */
  LC.assetBase = new URL("../", (document.currentScript && document.currentScript.src) || location.href).href;

  /* giros 360° (sprite com um quadro por ângulo; ver initSpin em main.js) */
  LC.spins = LC.spins || {};
  var SP = LC.spins;
  SP["home-lc"] = { sprite: "img/spin/home-lc.webp", poster: "img/spin/home-lc-0.webp", frames: 40, cols: 8, w: 800, h: 800, bg: "#f2eee6", fps: 7, alt: "Caixa de embalagem laranja com a marca Leticia Costa girando, com um celular encostado mostrando uma agenda e outro sobre a mesa com um post" };
  SP["ydh-box"] = { sprite: "img/spin/ydh-box.webp", poster: "img/spin/ydh-box-0.webp", frames: 40, cols: 8, w: 800, h: 800, bg: "#141518", alt: "Caixa do massageador YDH Pulse Pro girando: frente com o produto, lateral de especificações, verso com as ponteiras e lateral com código de barras" };
  SP["vial-cup"] = { sprite: "img/spin/vial-cup.webp", poster: "img/spin/vial-cup-0.webp", frames: 40, cols: 8, w: 800, h: 800, bg: "#e9edf2", alt: "Pote de iogurte Vial sabor Morango com tampa de alumínio impressa girando: frente com logo e morango, tabela nutricional, lupa frontal e código de barras" };
  SP["planet-box"] = { sprite: "img/spin/planet-box.webp", poster: "img/spin/planet-box-0.webp", frames: 40, cols: 8, w: 800, h: 800, bg: "#1d1814", alt: "Caixa de transporte Planet Gourmet em kraft girando, com o logotipo em hot stamping dourado refletindo a luz e o lacre de segurança" };
  SP["ydh-pulse"] = { sprite: "img/spin/ydh-pulse.webp", poster: "img/spin/ydh-pulse-0.webp", frames: 40, cols: 8, w: 800, h: 800, bg: "#141518", alt: "Massageador percussivo YDH Pulse Pro girando, com anel de LED verde-água e ponteira esférica" };
  SP["planet-bag"] = { sprite: "img/spin/planet-bag.webp", poster: "img/spin/planet-bag-0.webp", frames: 40, cols: 8, w: 720, h: 900, bg: "#1d1814", alt: "Sacola kraft Planet Gourmet com alças de papel torcido e faixa preta com logotipo dourado, girando" };
  SP["vial-bottle"] = { sprite: "img/spin/vial-bottle.webp", poster: "img/spin/vial-bottle-0.webp", frames: 40, cols: 8, w: 720, h: 900, bg: "#e5e9ee", alt: "Garrafa de bebida láctea Vial sabor Morango girando: frente, tabela nutricional, ingredientes e código de barras" };

  /* renders 3D que substituem mocks desenhados (ver renderMocks em main.js) */
  LC.renders = LC.renders || {};
  var R = LC.renders;
  R["ydh-box"] = { src: "img/3d/ydh-hero.webp", w: 1600, h: 1200, bg: "#141518", alt: "Render 3D da caixa do massageador YDH Pulse Pro com o produto ao lado, em estúdio escuro com recorte de luz verde-água" };
  R["planet-box"] = { src: "img/3d/planet-kit.webp", w: 1600, h: 1000, bg: "#1d1814", alt: "Kit de delivery Planet Gourmet em kraft: sacola com alças de papel torcido e logotipo em hot stamping dourado, caixa de transporte com tampa em hot stamping e verniz localizado, lacre de segurança e pote com rótulo artesanal" };
  R["planet-foil"] = { src: "img/3d/planet-foil.webp", w: 1200, h: 1200, bg: "#1d1814", alt: "Close da tampa kraft: logotipo Planet em hot stamping dourado e órbitas em verniz UV localizado sob luz rasante" };
  R["planet-open"] = { src: "img/3d/planet-box-open.webp", w: 1600, h: 1000, bg: "#1d1814", alt: "Caixa Planet Gourmet aberta com papel de seda preto fechado por adesivo dourado, a tampa ao lado e o pote em primeiro plano" };
  R["vial-line"] = { src: "img/3d/vial-line.webp", w: 1600, h: 900, bg: "#e9edf2", alt: "Linha Vial Laticínios: garrafas de bebida láctea Morango e Pêssego, potes de iogurte Natural, Morango, Pêssego, Coco e Ameixa e um pote de requeijão cremoso, cada sabor com sua cor" };
  R["vial-hero"] = { src: "img/3d/vial-hero.webp", w: 1200, h: 1200, bg: "#f0dcdc", alt: "Pote de iogurte Vial sabor Morango com a tampa de alumínio meio aberta, cercado de morangos" };
  R["vial-unroll"] = { src: "img/3d/vial-cup-label.webp", w: 1600, h: 1000, bg: "#eceff3", alt: "Pote de iogurte Vial com o rótulo se desenrolando até virar o arco plano da faca" };
  R["ydh-family"] = { src: "img/3d/ydh-family.webp", w: 1600, h: 900, bg: "#16171a", alt: "Linha YDH: caixas do Pulse Pro, Neck Relax, Eye Calm e Shiatsu lado a lado, cada uma com sua cor de categoria, com os produtos à frente" };
  R["ydh-catalog"] = { src: "img/3d/ydh-catalog.webp", w: 1600, h: 1000, bg: "#e9e6e1", alt: "Catálogo YDH aberto: abertura com o massageador Pulse Pro e página de massageadores com seis produtos, ao lado do massageador cervical" };
  R["ydh-hero-light"] = { src: "img/3d/ydh-hero-light.webp", w: 1600, h: 1200, bg: "#e9e6e1", alt: "Caixa e massageador YDH Pulse Pro em fundo claro de estúdio" };
  R["ydh-still"] = { src: "img/3d/ydh-still.webp", w: 1200, h: 1500, bg: "#dcdcd9", alt: "Foto de estúdio do massageador percussivo YDH em fundo infinito claro, com duas ponteiras avulsas" };

  /* ---------- utilidades expostas para os outros arquivos de mock ---------- */
  LC.svgRegmark = function (size) {
    size = size || 28;
    return '<svg class="regmark" width="' + size + '" height="' + size + '" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true"><circle cx="14" cy="14" r="7"/><path d="M14 0v28M0 14h28"/><path d="M14 7a7 7 0 0 1 0 14z" fill="currentColor"/></svg>';
  };
  LC.barcode = function (w, h, seed) {
    w = w || 120; h = h || 40; seed = seed || 7;
    var x = 0, bars = "", s = seed;
    while (x < w) {
      s = (s * 9301 + 49297) % 233280;
      var bw = 1 + Math.floor((s / 233280) * 3);
      if ((s & 3) !== 0) bars += '<rect x="' + x + '" y="0" width="' + bw + '" height="' + h + '"/>';
      x += bw + 1;
    }
    return '<svg viewBox="0 0 ' + w + ' ' + (h + 10) + '" width="' + w + '" aria-hidden="true"><g fill="currentColor">' + bars + '</g><text x="' + w / 2 + '" y="' + (h + 9) + '" font-family="JetBrains Mono, monospace" font-size="8" text-anchor="middle" fill="currentColor">7 891234 567' + seed + '0</text></svg>';
  };

  M.regmark = function (el, d) { return LC.svgRegmark(+d.size || 28); };
  M.colorbar = function () { return '<div class="colorbar" aria-hidden="true">' + "<i></i>".repeat(8) + "</div>"; };

  /* ---------- Caixa 3D: "a embalagem do portfólio" ---------- */
  M["hero-box"] = function () {
    var front =
      '<div class="lcbox__face lcbox__front">' +
        '<div class="lcbox__top"><span>Nº 01</span><span>ED. ' + new Date().getFullYear() + "</span></div>" +
        '<div class="lcbox__brand">Leticia<br>Costa<em>design</em></div>' +
        '<div class="lcbox__claim">Gráfico&nbsp;+&nbsp;Produto&nbsp;+&nbsp;Social</div>' +
        '<div class="lcbox__foot"><span class="lcbox__seal">100%<br>autoral</span><span>Conteúdo:<br>ideias bem fechadas</span></div>' +
      "</div>";
    var side =
      '<div class="lcbox__face lcbox__right">' +
        '<div class="lcbox__table"><b>Informação de portfólio</b><small>Porção de 1 projeto</small>' +
        "<dl>" +
          "<div><dt>Conceito criativo</dt><dd>100%</dd></div>" +
          "<div><dt>Pré-impressão</dt><dd>100%</dd></div>" +
          "<div><dt>Pantone &amp; CMYK</dt><dd>100%</dd></div>" +
          "<div><dt>UX / UI</dt><dd>100%</dd></div>" +
          "<div><dt>Prazo cumprido</dt><dd>100%</dd></div>" +
          "<div><dt>Retrabalho</dt><dd>0%</dd></div>" +
        "</dl><small>* Valores diários com base em muito café.</small></div>" +
      "</div>";
    var left =
      '<div class="lcbox__face lcbox__left"><div class="lcbox__vert">DO PAPEL À TELA</div><div class="lcbox__bc">' + LC.barcode(84, 30, 3) + "</div></div>";
    var back =
      '<div class="lcbox__face lcbox__back"><div class="lcbox__steps"><b>Modo de uso</b><ol><li>Leia o briefing</li><li>Abra a faca</li><li>Feche o arquivo</li><li>Aprove a prova</li><li>Encante na gôndola</li></ol></div></div>';
    var top = '<div class="lcbox__face lcbox__lid"><span>LC</span></div>';
    var bottom = '<div class="lcbox__face lcbox__base"></div>';
    return (
      '<div class="lcbox-scene" aria-label="Caixa de embalagem 3D com a marca Leticia Costa" role="img">' +
        '<div class="lcbox">' + front + back + side + left + top + bottom + "</div>" +
        '<div class="lcbox__shadow"></div>' +
      "</div>"
    );
  };

  /* ---------- Celular com interface (produto digital) ---------- */
  M["hero-phone"] = function () {
    var rows = [
      ["08:00", "Ana P.", "confirmada", "#6e7b5e"],
      ["09:00", "Bloqueio", "pausa", "#c4bdb0"],
      ["10:30", "Marcos T.", "agendada", "#d1845e"],
      ["14:00", "Júlia R.", "realizada", "#2b2926"],
      ["15:30", "Pedro L.", "agendada", "#d1845e"]
    ].map(function (r) {
      return '<li><span class="ui-time">' + r[0] + '</span><span class="ui-card" style="--s:' + r[3] + '"><b>' + r[1] + "</b><i>" + r[2] + "</i></span></li>";
    }).join("");
    return (
      '<div class="phone" style="--w:236px"><div class="phone__screen ui">' +
        '<div class="ui-status"><span>9:41</span><span>●●● ▮</span></div>' +
        '<div class="ui-head"><small>Terça, 14</small><b>Sua agenda</b></div>' +
        '<div class="ui-days">' + ["S", "T", "Q", "Q", "S"].map(function (d, i) { return "<span" + (i === 1 ? ' class="on"' : "") + ">" + d + "<b>" + (13 + i) + "</b></span>"; }).join("") + "</div>" +
        '<ul class="ui-list">' + rows + "</ul>" +
        '<div class="ui-fab">+</div>' +
      "</div></div>"
    );
  };

  /* ---------- Post de rede social ---------- */
  M["hero-post"] = function () {
    return (
      '<div class="ig">' +
        '<div class="ig__head"><i></i><b>sua.marca</b><span>•••</span></div>' +
        '<div class="ig__art"><div class="ig__kicker">Lançamento</div><div class="ig__title">Nova<br>linha<br><em>chegou.</em></div><div class="ig__dots"><i class="on"></i><i></i><i></i><i></i></div></div>' +
        '<div class="ig__bar"><span>♥</span><span>✦</span><span>➚</span><span class="r">⌑</span></div>' +
        '<div class="ig__cap"><b>2.418 curtidas</b></div>' +
      "</div>"
    );
  };

  /* ---------- Faca técnica (dieline) de caixa cartucho ---------- */
  M.dieline = function (el, d) {
    var dark = d.theme === "dark";
    var cut = dark ? "#f2eee6" : "#121212";
    return (
      '<svg viewBox="0 0 560 420" fill="none" role="img" aria-label="Faca técnica de caixa cartucho com linhas de corte, vinco e sangria">' +
        '<defs><pattern id="bleed" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0v6" stroke="#e6007e" stroke-width="1" opacity=".35"/></pattern></defs>' +
        // sangria
        '<path d="M86 56h388v52h40v204h-40v52H86v-52H46V108h40z" fill="url(#bleed)" stroke="#e6007e" stroke-width=".8" stroke-dasharray="2 3" opacity=".9"/>' +
        // corte
        '<path class="dl-cut" d="M96 66h368l-6 42h46v204h-46l6 42H96l6-42H56V108h46z" stroke="' + cut + '" stroke-width="1.6"/>' +
        // vincos
        '<g class="dl-crease" stroke="#00a0e3" stroke-width="1.4" stroke-dasharray="6 5"><path d="M102 108h356M102 312h356M196 108v204M364 108v204M102 108v204M458 108v204"/></g>' +
        // abas de cola
        '<path d="M96 66l20 42M464 66l-20 42M96 354l20-42M464 354l-20-42" stroke="' + cut + '" stroke-width=".8" opacity=".4"/>' +
        // painéis
        '<g font-family="JetBrains Mono, monospace" font-size="10" fill="' + cut + '" opacity=".7" text-anchor="middle">' +
          '<text x="149" y="214">LATERAL</text><text x="280" y="214">FRENTE</text><text x="411" y="214">LATERAL</text>' +
          '<text x="280" y="92">TAMPA</text><text x="280" y="338">FUNDO</text><text x="78" y="214" transform="rotate(-90 78 214)">COLA</text><text x="482" y="214" transform="rotate(90 482 214)">ABA</text>' +
        "</g>" +
        // cotas
        '<g stroke="' + cut + '" stroke-width=".7" opacity=".55"><path d="M196 390h168M196 385v10M364 385v10"/><path d="M530 108v204M525 108h10M525 312h10"/></g>' +
        '<g font-family="JetBrains Mono, monospace" font-size="9" fill="' + cut + '" opacity=".75"><text x="280" y="406" text-anchor="middle">84 mm</text><text x="545" y="214" transform="rotate(90 545 214)" text-anchor="middle">102 mm</text></g>' +
        // legenda
        '<g font-family="JetBrains Mono, monospace" font-size="9" fill="' + cut + '">' +
          '<path d="M20 22h22" stroke="' + cut + '" stroke-width="1.6"/><text x="48" y="25">CORTE</text>' +
          '<path d="M110 22h22" stroke="#00a0e3" stroke-width="1.4" stroke-dasharray="6 5"/><text x="138" y="25">VINCO</text>' +
          '<path d="M200 22h22" stroke="#e6007e" stroke-dasharray="2 3"/><text x="228" y="25">SANGRIA 3 mm</text>' +
        "</g>" +
      "</svg>"
    );
  };

  /* ---------- Comparador antes/depois (arraste) ---------- */
  M["photo-compare"] = function (el, d) {
    var before = LC.assetBase + (d.before || "img/3d/ydh-still-raw.webp");
    var after = LC.assetBase + (d.after || "img/3d/ydh-still.webp");
    el.innerHTML =
      '<div class="cmp" style="--p:50%">' +
        '<img src="' + after + '" alt="' + (d.altAfter || "Foto tratada") + '" loading="lazy">' +
        '<div class="cmp__before"><img src="' + before + '" alt="' + (d.altBefore || "Arquivo bruto") + '" loading="lazy"></div>' +
        '<span class="cmp__line" aria-hidden="true"><i></i></span>' +
        '<span class="cmp__tag cmp__tag--l">Antes · bruto</span><span class="cmp__tag cmp__tag--r">Depois · tratado</span>' +
        '<input class="cmp__range" type="range" min="0" max="100" value="50" aria-label="Comparar foto bruta e foto tratada">' +
      "</div>";
    var box = el.firstChild, range = el.querySelector("input");
    range.addEventListener("input", function () { box.style.setProperty("--p", range.value + "%"); });
  };
})();
