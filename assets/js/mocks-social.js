/* Mockups da trilha Social media, vídeo e foto.
   Exporta: ig-grid-deep, carousel-deep, reel-phone, video-timeline, photo-product,
            social-formats, post-anatomy, social-wall.
   Estilos em assets/css/social.css (prefixo .so-). Carregar antes de main.js. */
(function () {
  "use strict";
  var LC = (window.LC = window.LC || {});
  var M = (LC.mocks = LC.mocks || {});
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var uidN = 0;
  function uid(p) { return (p || "so") + "-" + (++uidN); }

  /* ---------- paletas ---------- */
  var DS = { sage: "#6E775D", sageD: "#4C5340", sageL: "#DDE1D3", terra: "#CB8461", terraL: "#F3DFD1", cream: "#F8F6F3", sand: "#EFE8DE", ink: "#2B2926", tan: "#C4A27E", white: "#FFFFFF" };
  var YD = { bg: "#0B0C0E", bg2: "#16181C", ac: "#45E0C0", mist: "#C9CED6" };

  /* ---------- ícones de interface (traço) ---------- */
  function ico(d, extra) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' + (extra || "") + ">" + d + "</svg>"; }
  var I = {
    heart: ico('<path d="M12 20.3s-7.6-4.6-9.4-9.3C1.3 7.6 3.5 4.3 7 4.3c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.5 0 5.7 3.3 4.4 6.7-1.8 4.7-9.4 9.3-9.4 9.3z"/>'),
    comment: ico('<path d="M20.6 12a8.6 8.6 0 0 1-12.5 7.7L3.4 21l1.3-4.5A8.6 8.6 0 1 1 20.6 12z"/>'),
    send: ico('<path d="M21.4 3 10.4 13.8M21.4 3 14.8 21l-4.4-7.2L3 9.5z"/>'),
    save: ico('<path d="M18.5 20.5 12 15.2l-6.5 5.3V3.5h13z"/>'),
    more: ico('<circle cx="5" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="19" cy="12" r="1.2" fill="currentColor"/>'),
    back: ico('<path d="M15 4 7 12l8 8"/>'),
    bell: ico('<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>'),
    grid: ico('<rect x="3.5" y="3.5" width="17" height="17" rx="1"/><path d="M9.2 3.5v17M14.8 3.5v17M3.5 9.2h17M3.5 14.8h17"/>'),
    reels: ico('<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M3.5 8.5h17M9 3.5l2.6 5M14.4 3.5 17 8.5"/><path d="m10.3 11.6 4.2 2.4-4.2 2.4z" fill="currentColor"/>'),
    tag: ico('<rect x="3.5" y="3.5" width="17" height="17" rx="2"/><circle cx="12" cy="10" r="2.8"/><path d="M6.5 18.5c1-2.4 3-3.6 5.5-3.6s4.5 1.2 5.5 3.6"/>'),
    camera: ico('<path d="M3.5 8h3l1.6-2.5h7.8L17.5 8h3v11h-17z"/><circle cx="12" cy="13.2" r="3.4"/>'),
    music: ico('<path d="M9 18V5.5l10-2V16"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>'),
    chev: ico('<path d="m6 9 6 6 6-6"/>'),
    person: ico('<circle cx="10" cy="8" r="3.5"/><path d="M3.5 19.5c.8-3.4 3.3-5.2 6.5-5.2s5.7 1.8 6.5 5.2M18 8v6M15 11h6"/>'),
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>',
    multi: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" fill="currentColor"/><path d="M3 7v12a2 2 0 0 0 2 2h12" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3 21 9l-2.2.6-3.6 3.6.4 4.4-1.6 1.6-3.8-3.8L5 20.6 3.4 19l5.2-5.2-3.8-3.8 1.6-1.6 4.4.4 3.6-3.6z" fill="currentColor"/></svg>',
    reelTile: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" fill="currentColor"/><path d="M3 8h18M8.5 3l2.6 5M14 3l2.6 5" stroke="#000" stroke-opacity=".35" stroke-width="1.4"/><path d="m10 11 5 3-5 3z" fill="#000" fill-opacity=".45"/></svg>'
  };

  /* estrela de quatro pontas (assinatura visual da Deep Saúde) */
  var SPK = "M12 0C12.9 7.1 16.9 11.1 24 12 16.9 12.9 12.9 16.9 12 24 11.1 16.9 7.1 12.9 0 12 7.1 11.1 11.1 7.1 12 0Z";
  function spk(x, y, s, c, op) {
    return '<svg class="so-spk" viewBox="0 0 24 24" aria-hidden="true" style="left:' + x + "%;top:" + y + "%;width:" + s + "cqw;color:" + c + (op ? ";opacity:" + op : "") + '"><path d="' + SPK + '" fill="currentColor"/></svg>';
  }
  function spkInline(c) { return '<svg class="so-spk-i" viewBox="0 0 24 24" aria-hidden="true"><path d="' + SPK + '" fill="' + (c || "currentColor") + '"/></svg>'; }

  /* ---------- ilustrações (viewBox 100x100) ---------- */
  var ILL = {
    sun: function (c) {
      return '<svg viewBox="0 0 100 100" aria-hidden="true"><g stroke="' + c.a + '" stroke-width="2.4" stroke-linecap="round">' +
        '<path d="M50 22v-9M28 30l-6-6M72 30l6-6M18 50H9M82 50h9"/></g>' +
        '<path d="M22 64a28 28 0 0 1 56 0z" fill="' + c.a + '"/>' +
        '<g stroke="' + c.b + '" stroke-width="2.4" stroke-linecap="round"><path d="M10 71h80M24 79h52M38 87h24"/></g></svg>';
    },
    leaf: function (c) {
      return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 96C50 70 46 44 30 10" fill="none" stroke="' + c.b + '" stroke-width="2.2" stroke-linecap="round"/>' +
        '<path d="M44 58C26 58 14 48 12 34c16-2 30 6 32 24z" fill="' + c.a + '"/>' +
        '<path d="M47 40c12-4 26-16 26-32-14 2-26 14-26 32z" fill="' + c.a + '" opacity=".75"/>' +
        '<path d="M49 76c16 0 30-8 34-22-16-2-30 6-34 22z" fill="' + c.a + '" opacity=".9"/>' +
        '<path d="M37 24c-8-6-12-14-12-20 8 2 14 10 12 20z" fill="' + c.a + '" opacity=".6"/></svg>';
    },
    chairs: function (c) {
      return '<svg viewBox="0 0 100 100" aria-hidden="true">' +
        '<rect x="56" y="10" width="34" height="38" rx="2" fill="none" stroke="' + c.b + '" stroke-width="1.6"/><path d="M73 10v38M56 29h34" stroke="' + c.b + '" stroke-width="1.6"/>' +
        '<path d="M6 92h88" stroke="' + c.b + '" stroke-width="1.6" stroke-linecap="round"/>' +
        '<path d="M8 54q0-10 10-10h8q10 0 10 10v18H8z" fill="' + c.a + '"/><rect x="5" y="64" width="34" height="14" rx="5" fill="' + c.a + '"/><rect x="10" y="62" width="24" height="8" rx="3" fill="#fff" opacity=".22"/><path d="M10 78v12M34 78v12" stroke="' + c.b + '" stroke-width="2"/>' +
        '<path d="M64 54q0-10 10-10h8q10 0 10 10v18H64z" fill="' + c.c + '"/><rect x="61" y="64" width="34" height="14" rx="5" fill="' + c.c + '"/><rect x="66" y="62" width="24" height="8" rx="3" fill="#fff" opacity=".22"/><path d="M66 78v12M90 78v12" stroke="' + c.b + '" stroke-width="2"/>' +
        '<rect x="44" y="70" width="12" height="2" fill="' + c.b + '"/><path d="M50 72v18" stroke="' + c.b + '" stroke-width="1.6"/>' +
        '<path d="M47 70c-4-6-4-12 3-18 7 6 7 12 3 18z" fill="' + c.a + '" opacity=".7"/><path d="M50 70c-6-2-10-6-10-12 6 0 10 4 10 12z" fill="' + c.c + '" opacity=".7"/></svg>';
    },
    waves: function (c) {
      return '<svg viewBox="0 0 100 100" aria-hidden="true" fill="none" stroke-linecap="round">' +
        '<circle cx="72" cy="30" r="14" fill="' + c.b + '" stroke="none"/>' +
        '<path d="M0 58q12-8 25 0t25 0 25 0 25 0" stroke="' + c.a + '" stroke-width="3"/>' +
        '<path d="M0 70q12-8 25 0t25 0 25 0 25 0" stroke="' + c.a + '" stroke-width="3" opacity=".7"/>' +
        '<path d="M0 82q12-8 25 0t25 0 25 0 25 0" stroke="' + c.a + '" stroke-width="3" opacity=".45"/></svg>';
    },
    ribbon: function (c) {
      return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 12c-10 0-16 8-16 18 0 9 6 17 11 24L28 88h12l10-22 10 22h12L55 54c5-7 11-15 11-24 0-10-6-18-16-18zm0 9c5 0 7 4 7 9 0 5-3 10-7 15-4-5-7-10-7-15 0-5 2-9 7-9z" fill="' + c.a + '"/></svg>';
    },
    cup: function (c) {
      return '<svg viewBox="0 0 100 100" aria-hidden="true" fill="none" stroke-linecap="round">' +
        '<path d="M42 30c-4-6 4-10 0-16M54 30c-4-6 4-10 0-16" stroke="' + c.b + '" stroke-width="2.2"/>' +
        '<path d="M24 40h48v16a24 24 0 0 1-48 0z" fill="' + c.a + '"/><path d="M72 46h4a8 8 0 0 1 0 16h-6" stroke="' + c.a + '" stroke-width="4"/>' +
        '<path d="M14 88h68" stroke="' + c.b + '" stroke-width="2.2"/></svg>';
    }
  };

  /* ---------- produto YDH (massageador percussivo, vista lateral) ---------- */
  function gun(cls) {
    var id = uid("gun");
    return (
      '<svg class="so-gun ' + (cls || "") + '" viewBox="0 0 400 300" aria-hidden="true">' +
        "<defs>" +
          '<linearGradient id="' + id + 'b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#555b65"/><stop offset=".16" stop-color="#2c3036"/><stop offset=".62" stop-color="#16181c"/><stop offset="1" stop-color="#08090b"/></linearGradient>' +
          '<linearGradient id="' + id + 'h" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0d0e11"/><stop offset=".42" stop-color="#3a3e46"/><stop offset=".62" stop-color="#23262b"/><stop offset="1" stop-color="#0b0c0e"/></linearGradient>' +
          '<linearGradient id="' + id + 'n" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2e6ec"/><stop offset=".45" stop-color="#8d939c"/><stop offset="1" stop-color="#3a3e45"/></linearGradient>' +
          '<radialGradient id="' + id + 'r" cx=".34" cy=".3" r=".78"><stop offset="0" stop-color="#6a707a"/><stop offset=".45" stop-color="#2a2d33"/><stop offset="1" stop-color="#0a0b0d"/></radialGradient>' +
          '<linearGradient id="' + id + 'l" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".3" stop-color="#fff" stop-opacity=".55"/><stop offset=".85" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
        "</defs>" +
        '<path d="M150 118h66l-12 146q-2 20-22 20h-16q-21 0-21-20z" fill="url(#' + id + 'h)"/>' +
        '<g stroke="#fff" stroke-opacity=".06" stroke-width="2"><path d="M151 160h62M151 172h61M151 184h60M151 196h59M151 208h58M151 220h57"/></g>' +
        '<path d="M146 246h63" stroke="' + YD.ac + '" stroke-width="2.5" stroke-opacity=".85"/>' +
        '<rect x="50" y="42" width="252" height="94" rx="47" fill="url(#' + id + 'b)"/>' +
        '<path d="M97 42v94H97a47 47 0 0 1 0-94z" fill="#0a0b0d"/>' +
        '<rect x="99" y="42" width="4" height="94" fill="' + YD.ac + '" opacity=".9"/>' +
        '<rect x="84" y="50" width="206" height="11" rx="5.5" fill="url(#' + id + 'l)" opacity=".7"/>' +
        '<path d="M60 66a47 47 0 0 0 0 46" fill="none" stroke="' + YD.ac + '" stroke-width="2" stroke-opacity=".55"/>' +
        '<g fill="' + YD.ac + '"><circle cx="122" cy="89" r="2.4"/><circle cx="122" cy="98" r="2.4" opacity=".7"/><circle cx="122" cy="80" r="2.4" opacity=".45"/></g>' +
        '<text x="200" y="96" font-family="Bricolage Grotesque, Arial, sans-serif" font-weight="800" font-size="17" letter-spacing="5" fill="#8f96a0">YDH</text>' +
        '<g class="so-gun__head"><rect x="300" y="70" width="34" height="38" rx="6" fill="url(#' + id + 'n)"/><rect x="302" y="72" width="30" height="5" rx="2.5" fill="#fff" opacity=".4"/>' +
        '<circle cx="358" cy="89" r="32" fill="url(#' + id + 'r)"/><ellipse cx="346" cy="74" rx="11" ry="6.5" fill="#fff" opacity=".2"/></g>' +
      "</svg>"
    );
  }
  LC.ydhGun = gun;

  /* ponteiras (vista frontal simplificada) */
  function tip(kind) {
    var g = '<defs><radialGradient id="TIP" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#5d636c"/><stop offset="1" stop-color="#0d0e10"/></radialGradient></defs>';
    var id = uid("tip");
    g = g.replace("TIP", id);
    var f = 'fill="url(#' + id + ')"';
    var shape = {
      bola: '<circle cx="50" cy="50" r="34" ' + f + "/>",
      plana: '<rect x="18" y="30" width="64" height="40" rx="20" ' + f + '/><rect x="26" y="36" width="48" height="6" rx="3" fill="#fff" opacity=".15"/>',
      bala: '<path d="M50 12c14 0 20 16 20 34v34H30V46c0-18 6-34 20-34z" ' + f + "/>",
      garfo: '<path d="M24 80V44c0-14 6-24 12-24s12 10 12 24v6h4v-6c0-14 6-24 12-24s12 10 12 24v36z" ' + f + "/>"
    }[kind];
    return '<svg viewBox="0 0 100 100" aria-hidden="true">' + g + shape + '<ellipse cx="50" cy="90" rx="26" ry="3" fill="#000" opacity=".25"/></svg>';
  }

  /* ==========================================================================
     Posts: biblioteca de peças (Deep Saúde e YDH)
     ========================================================================== */
  var DEEP_POSTS = [
    { t: "quote", bg: DS.cream, fg: DS.sage, ac: DS.terra, text: "Você não precisa dar conta de <em>tudo</em> sozinha.", pin: 1, sp: [[78, 10, 9, DS.terra], [12, 74, 6, DS.tan, .7]] },
    { t: "cover", bg: DS.sage, fg: DS.cream, ac: DS.terraL, kicker: "Ansiedade · carrossel", text: "5 sinais de ansiedade que a gente <em>normaliza</em>", ui: "multi", sp: [[80, 8, 8, DS.terraL]] },
    { t: "reel", bg: DS.terra, fg: DS.cream, ac: DS.ink, text: "Terapia não é só para <em>crise</em>", ill: "waves", ic: { a: DS.cream, b: DS.terraL }, ui: "reel" },
    { t: "quiz", bg: DS.sand, fg: DS.sage, ac: DS.terra, ui: "multi" },
    { t: "ill", bg: DS.sageL, fg: DS.sageD, ac: DS.terra, text: "Pausa também é <em>cuidado</em>.", ill: "cup", ic: { a: DS.sage, b: DS.terra } },
    { t: "num", bg: DS.cream, fg: DS.sage, ac: DS.terra, big: "3", text: "mitos sobre terapia <em>online</em>", ui: "multi", sp: [[82, 72, 7, DS.terra]] },
    { t: "quote", bg: DS.sageD, fg: DS.cream, ac: DS.tan, text: "Cuidar da sua saúde mental é um ato de <em>amor-próprio</em>.", sp: [[14, 10, 7, DS.tan], [80, 78, 5, DS.tan, .6]] },
    { t: "reel", bg: DS.cream, fg: DS.sage, ac: DS.terra, text: "O que acontece na <em>primeira sessão</em>?", ill: "chairs", ic: { a: DS.sage, b: DS.tan, c: DS.terra }, ui: "reel" },
    { t: "list", bg: DS.terraL, fg: DS.ink, ac: DS.terra, text: "Autocuidado não é <em>luxo</em>", items: ["Dormir sem culpa", "Pedir ajuda", "Dizer não"] },
    { t: "vs", bg: DS.cream, fg: DS.cream, ac: DS.terra, ui: "multi" },
    { t: "ill", bg: DS.terra, fg: DS.cream, ac: DS.ink, text: "Um passo de cada vez também é <em>caminho</em>.", ill: "leaf", ic: { a: DS.cream, b: DS.terraL } },
    { t: "date", bg: DS.sage, fg: DS.cream, ac: DS.terraL, sp: [[80, 10, 7, DS.terraL], [10, 60, 5, DS.cream, .5]] }
  ];

  var YDH_POSTS = [
    { t: "y-hero" }, { t: "y-claim" }, { t: "y-tips" }, { t: "y-detail" }, { t: "y-spec" }, { t: "y-light" }
  ];

  function handle() { return '<span class="so-post__h">@deepsaudepsicologia</span>'; }
  function uiBadge(p, show) {
    if (!show) return "";
    if (p.pin) return '<span class="so-post__ui">' + I.pin + "</span>";
    if (p.ui === "multi") return '<span class="so-post__ui">' + I.multi + "</span>";
    if (p.ui === "reel") return '<span class="so-post__ui">' + I.reelTile + "</span>";
    return "";
  }

  function deepPost(p, opt) {
    opt = opt || {};
    var st = "--bg:" + p.bg + ";--fg:" + p.fg + ";--ac:" + p.ac;
    var sp = (p.sp || []).map(function (s) { return spk(s[0], s[1], s[2], s[3], s[4]); }).join("");
    var body = "";
    switch (p.t) {
      case "quote":
        body = '<span class="so-q">“</span><p class="so-t so-t--lg">' + p.text + '</p><div class="so-post__foot">' + handle() + spkInline() + "</div>";
        break;
      case "cover":
        body = '<span class="so-k">' + p.kicker + '</span><p class="so-t so-t--lg">' + p.text + '</p><div class="so-post__foot"><span class="so-pill">Arraste para o lado →</span></div>';
        break;
      case "reel":
        body = '<div class="so-post__ill">' + ILL[p.ill](p.ic) + '</div><p class="so-t">' + p.text + '</p><div class="so-post__foot">' + handle() + "</div>";
        break;
      case "quiz":
        body = '<div class="so-quizcard"><span class="so-k">Quiz de match</span><p class="so-t">Não sabe qual profissional escolher?</p><p class="so-b">Responda a 7 perguntas rápidas.</p><span class="so-btn">' + spkInline("#fff") + "Encontrar a minha especialista</span></div>" + spk(84, 6, 7, DS.terra) + spk(6, 84, 5, DS.sage, .5);
        break;
      case "ill":
        body = '<div class="so-post__ill so-post__ill--top">' + ILL[p.ill](p.ic) + '</div><p class="so-t">' + p.text + '</p><div class="so-post__foot">' + handle() + "</div>";
        break;
      case "num":
        body = '<span class="so-big">' + p.big + '</span><p class="so-t so-t--lg">' + p.text + '</p><div class="so-post__foot"><span class="so-pill so-pill--line">1/6</span>' + spkInline() + "</div>";
        break;
      case "list":
        body = '<p class="so-t so-t--lg">' + p.text + '</p><ul class="so-list">' + p.items.map(function (x) { return "<li>" + x + "</li>"; }).join("") + '</ul><div class="so-post__foot">' + handle() + "</div>";
        break;
      case "vs":
        body = '<div class="so-vs"><div style="background:' + DS.sage + '"><span class="so-k">Ansiedade</span><i>antecipa</i></div><div style="background:' + DS.terra + '"><span class="so-k">Estresse</span><i>reage</i></div></div><p class="so-vs__t">qual a <em>diferença</em>?</p>';
        break;
      case "date":
        body = '<div class="so-date"><b>10</b><span>out</span></div><p class="so-t">Dia Mundial da <em>Saúde Mental</em></p><div class="so-post__ill so-post__ill--sm">' + ILL.ribbon({ a: DS.terraL }) + '</div><div class="so-post__foot">' + handle() + "</div>";
        break;
    }
    return '<div class="so-post so-post--' + p.t + '" style="' + st + '">' + sp + '<div class="so-post__in">' + body + "</div>" + uiBadge(p, opt.ui) + "</div>";
  }

  function ydhPost(p) {
    var body = "";
    switch (p.t) {
      case "y-hero":
        body = '<span class="so-yk">Novo</span><div class="so-ypost__prod">' + gun() + '</div><p class="so-yt">Massageador<br>Percussivo</p><span class="so-ymark">YDH</span>';
        break;
      case "y-claim":
        body = '<p class="so-yt so-yt--xl">Desliga a<br>tensão.</p><div class="so-ypost__prod so-ypost__prod--tilt">' + gun() + '</div><span class="so-ymark">YDH</span>';
        break;
      case "y-tips":
        body = '<span class="so-yk">Ponteiras intercambiáveis</span><div class="so-ytips">' + ["bola", "plana", "bala", "garfo"].map(function (k) { return "<div>" + tip(k) + "<small>" + k + "</small></div>"; }).join("") + '</div><span class="so-ymark">YDH</span>';
        break;
      case "y-detail":
        body = '<div class="so-ydetail"><i></i><i></i><i></i></div><p class="so-yt">Percussão<br><span>profunda</span></p><span class="so-ymark">YDH</span>';
        break;
      case "y-spec":
        body = '<span class="so-yk">Ficha</span><dl class="so-yspec"><div><dt>Uso</dt><dd>pós-treino</dd></div><div><dt>Bateria</dt><dd>recarregável</dd></div><div><dt>Ruído</dt><dd>baixo</dd></div><div><dt>Peso</dt><dd>compacto</dd></div></dl><span class="so-ymark">YDH</span>';
        break;
      case "y-light":
        body = '<div class="so-ypost__prod">' + gun() + '</div><p class="so-yt so-yt--dark">Pós-treino<br>em casa.</p><span class="so-ymark so-ymark--dark">YDH</span>';
        break;
    }
    return '<div class="so-post so-ypost so-ypost--' + p.t + '">' + '<div class="so-post__in">' + body + "</div></div>";
  }
  LC.socialPosts = { deep: function (i, o) { return deepPost(DEEP_POSTS[i % DEEP_POSTS.length], o); }, ydh: function (i) { return ydhPost(YDH_POSTS[i % YDH_POSTS.length]); } };

  /* ==========================================================================
     Relógio compartilhado: anima reels e linha do tempo só quando visíveis
     ========================================================================== */
  var clocks = [], looping = false;
  function addClock(el, cycle, fn, still) {
    var c = { el: el, cycle: cycle, fn: fn, vis: true, t0: null };
    if (reduced) { fn(still); return; }
    if ("IntersectionObserver" in window) {
      c.vis = false;
      new IntersectionObserver(function (es) { c.vis = es[0].isIntersecting; }, { rootMargin: "120px" }).observe(el);
    }
    clocks.push(c);
    fn(0);
    if (!looping) { looping = true; requestAnimationFrame(loop); }
  }
  function loop(now) {
    for (var i = 0; i < clocks.length; i++) {
      var c = clocks[i];
      if (!c.vis) { c.t0 = null; continue; }
      if (c.t0 === null) c.t0 = now - (c.last || 0) * 1000;
      c.last = ((now - c.t0) / 1000) % c.cycle;
      c.fn(c.last);
    }
    requestAnimationFrame(loop);
  }
  // os mocks são inseridos por main.js logo após o retorno da função; liga depois
  function after(fn) { setTimeout(fn, 0); }

  /* ==========================================================================
     Reel: cenas, legendas palavra a palavra e interface
     ========================================================================== */
  var REELS = {
    deep: {
      handle: "deepsaudepsicologia", audio: "Áudio original · deepsaudepsicologia",
      caption: "Terapia sem mistério: o que esperar da primeira sessão",
      scenes: [
        { dur: 2.6, words: "Medo da|primeira sessão|de terapia?", html: function () {
          return '<div class="so-sc so-sc--d1">' + spk(14, 16, 9, DS.terraL) + spk(78, 26, 6, DS.cream, .6) + spk(70, 70, 11, DS.terraL, .5) +
            '<span class="so-pop so-sticker" style="--dl:.05s">' + spkInline() + " terapia sem mistério</span>" +
            '<p class="so-pop so-sc__title" style="--dl:.15s">A primeira<br><em>sessão</em></p></div>'; } },
        { dur: 3.4, words: "Você não|precisa chegar|com tudo|resolvido.", html: function () {
          return '<div class="so-sc so-sc--d2"><p class="so-pop so-sc__kick" style="--dl:.1s">o que ninguém te conta</p><div class="so-kb so-sc__ill">' + ILL.chairs({ a: DS.sage, b: DS.tan, c: DS.terra }) + "</div></div>"; } },
        { dur: 3.2, words: "Responda|7 perguntas|e encontre|a sua especialista.", html: function () {
          return '<div class="so-sc so-sc--d3"><div class="so-pop so-mquiz" style="--dl:.05s"><div class="so-mquiz__bar"><i></i></div><small>Passo 1 de 7</small><b>Qual destas situações descreve melhor o que você está sentindo agora?</b>' +
            "<span class=\"on\">Uma ansiedade e estresse constantes, que me sobrecarregam.</span><span>Ando com humor deprimido, sem energia e motivação.</span><span>Tenho pensamentos repetitivos.</span></div></div>"; } },
        { dur: 2.8, words: "Comece|no seu tempo.|Link na bio.", html: function () {
          return '<div class="so-sc so-sc--d4">' + spk(12, 12, 8, DS.cream, .8) + spk(80, 20, 5, DS.cream, .6) +
            '<p class="so-pop so-sc__title" style="--dl:.05s">Encontre uma especialista <em>ideal</em> para si</p>' +
            '<span class="so-pop so-sc__cta" style="--dl:.25s">' + spkInline() + " Encontrar a minha especialista</span><small class=\"so-pop\" style=\"--dl:.35s\">deepsaude.com</small></div>"; } }
      ]
    },
    ydh: {
      handle: "ydh", audio: "Trilha original · ydh",
      caption: "Pós-treino sem tensão. Massageador Percussivo YDH",
      scenes: [
        { dur: 2.4, words: "Sabe aquela|tensão|depois do treino?", html: function () {
          return '<div class="so-sc so-sc--y1"><div class="so-streaks"><i></i><i></i><i></i><i></i></div><p class="so-pop so-sc__ytitle" style="--dl:.05s">Tensão<br>pós-treino?</p><div class="so-kb so-sc__gun">' + gun("is-buzz") + "</div></div>"; } },
        { dur: 3.0, words: "Percussão|que alcança|onde a mão|não chega.", html: function () {
          return '<div class="so-sc so-sc--y2"><div class="so-rings"><i></i><i></i><i></i></div><div class="so-kb so-sc__gun so-sc__gun--close">' + gun("is-buzz") + '</div><p class="so-pop so-sc__ylabel" style="--dl:.2s">percussão profunda</p></div>'; } },
        { dur: 3.2, words: "Uma ponteira|para cada|músculo.", html: function () {
          return '<div class="so-sc so-sc--y3"><p class="so-pop so-sc__ylabel" style="--dl:.05s">4 ponteiras</p><div class="so-ytips so-ytips--reel">' +
            [["bola", "grandes músculos"], ["plana", "uso geral"], ["bala", "pontos de tensão"], ["garfo", "ao longo da coluna"]].map(function (k, i) {
              return '<div class="so-pop" style="--dl:' + (0.12 + i * 0.14).toFixed(2) + 's">' + tip(k[0]) + "<small>" + k[0] + "<em>" + k[1] + "</em></small></div>";
            }).join("") + "</div></div>"; } },
        { dur: 3.4, words: "Seu pós-treino|agora em casa.|Link na bio.", html: function () {
          return '<div class="so-sc so-sc--y4"><div class="so-glow"></div><div class="so-kb so-sc__gun so-sc__gun--hero">' + gun() + '</div><span class="so-pop so-ymark so-ymark--big" style="--dl:.1s">YDH</span><p class="so-pop so-sc__ysub" style="--dl:.2s">Massageador Percussivo</p><span class="so-pop so-sc__ycta" style="--dl:.32s">Conheça a linha</span></div>'; } }
      ]
    }
  };

  function captionHTML(words) {
    return '<div class="so-cap" aria-hidden="true">' + words.split("|").map(function (line) {
      return '<p class="so-cap__line">' + line.split(" ").map(function (w) { return "<span>" + w + "</span>"; }).join(" ") + "</p>";
    }).join("") + "</div>";
  }

  function reelScreen(cfg) {
    return cfg.scenes.map(function (s, i) {
      return '<div class="so-scene' + (i === 0 ? " is-on" : "") + '">' + s.html() + captionHTML(s.words) + "</div>";
    }).join("");
  }

  // controla cortes de cena, legenda e barra de progresso de um conjunto de cenas
  function reelPlayer(root, cfg, onTick) {
    var scenes = root.querySelectorAll(".so-scene"), starts = [], acc = 0;
    cfg.scenes.forEach(function (s) { starts.push(acc); acc += s.dur; });
    var data = Array.prototype.map.call(scenes, function (sc) {
      var lines = sc.querySelectorAll(".so-cap__line"), words = [];
      lines.forEach(function (l, li) { l.querySelectorAll("span").forEach(function (w) { words.push({ el: w, line: li }); }); });
      return { el: sc, lines: lines, words: words };
    });
    var cur = -1, curW = -9;
    function update(t) {
      var i = 0;
      while (i < starts.length - 1 && t >= starts[i + 1]) i++;
      if (i !== cur) {
        data.forEach(function (d, k) { d.el.classList.toggle("is-on", k === i); });
        // reinicia as animações de entrada da cena (efeito de corte)
        var on = data[i].el; on.classList.remove("is-cut"); void on.offsetWidth; on.classList.add("is-cut");
        cur = i; curW = -9;
      }
      var d = data[i], n = d.words.length, local = t - starts[i];
      var w = Math.max(0, Math.min(n - 1, Math.floor((local - 0.12) / ((cfg.scenes[i].dur - 0.35) / n))));
      if (w !== curW) {
        var line = d.words[w].line;
        d.lines.forEach(function (l, li) { l.classList.toggle("is-on", li === line); });
        d.words.forEach(function (x, k) { x.el.className = k < w ? "on" : k === w ? "on cur" : ""; });
        curW = w;
      }
      if (onTick) onTick(t, acc);
    }
    return { cycle: acc, update: update };
  }

  M["reel-phone"] = function (el, d) {
    var v = REELS[d.variant] ? d.variant : "deep", cfg = REELS[v];
    var avatar = v === "deep"
      ? '<i class="so-av so-av--deep">' + spkInline(DS.cream) + "</i>"
      : '<i class="so-av so-av--ydh">Y</i>';
    var html =
      '<div class="so-reel so-reel--' + v + '" role="img" aria-label="Celular exibindo um Reels editado (' + (v === "deep" ? "Deep Saúde" : "YDH") + '): cortes de cena, legenda dinâmica palavra a palavra e barra de progresso">' +
        '<div class="so-reel__dev"><div class="so-reel__screen">' +
          reelScreen(cfg) +
          '<div class="so-reel__ui">' +
            '<div class="so-reel__top"><b>Reels</b>' + I.chev + '<span class="so-reel__cam">' + I.camera + "</span></div>" +
            '<div class="so-reel__rail"><span>' + I.heart + "</span><span>" + I.comment + "</span><span>" + I.send + "</span><span>" + I.more + '</span><span class="so-reel__disc">' + avatar + "</span></div>" +
            '<div class="so-reel__info"><div class="so-reel__who">' + avatar + "<b>" + cfg.handle + '</b><span class="so-reel__follow">Seguir</span></div>' +
              '<p class="so-reel__cap">' + cfg.caption + ' <span>… mais</span></p><p class="so-reel__audio">' + I.music + "<span>" + cfg.audio + "</span></p></div>" +
            '<div class="so-reel__prog"><i></i></div>' +
          "</div>" +
        "</div></div>" +
      "</div>";
    after(function () {
      var root = el.querySelector(".so-reel"); if (!root) return;
      var bar = root.querySelector(".so-reel__prog i");
      var p = reelPlayer(root, cfg, function (t, total) { bar.style.transform = "scaleX(" + (t / total).toFixed(4) + ")"; });
      addClock(root, p.cycle, p.update, cfg.scenes[0].dur - 0.05);
    });
    return html;
  };

  /* ==========================================================================
     Perfil do Instagram: @deepsaudepsicologia
     ========================================================================== */
  M["ig-grid-deep"] = function (el, d) {
    function stat(v, label) {
      return "<div><b>" + (v ? v : '<i class="so-skel" aria-label="número oculto"></i>') + "</b><span>" + label + "</span></div>";
    }
    var hl = [
      ["Quiz", "sparkle", DS.terra], ["Terapia", "chairs", DS.sage], ["Ansiedade", "waves", DS.sageD], ["Autocuidado", "cup", DS.terra], ["Dúvidas", "q", DS.sage]
    ].map(function (h) {
      var art = h[1] === "sparkle" ? '<svg viewBox="0 0 24 24"><path d="' + SPK + '" fill="' + DS.cream + '"/></svg>'
        : h[1] === "q" ? '<span class="so-hl__q">?</span>'
        : ILL[h[1]]({ a: DS.cream, b: DS.terraL, c: DS.terraL });
      return '<li><span class="so-hl__c" style="background:' + h[2] + '">' + art + "</span><small>" + h[0] + "</small></li>";
    }).join("");
    var count = Math.min(DEEP_POSTS.length, +d.posts || 12);
    var grid = "";
    for (var i = 0; i < count; i++) grid += deepPost(DEEP_POSTS[i], { ui: true });
    return (
      '<div class="so-ig" role="img" aria-label="Perfil do Instagram @deepsaudepsicologia com grade de posts no estilo da Deep Saúde: sálvia, terracota e creme, títulos serifados e estrelinhas">' +
        '<div class="so-ig__status"><b>9:41</b><span><i></i><i></i><i></i></span></div>' +
        '<div class="so-ig__bar">' + I.back + "<b>deepsaudepsicologia</b>" + I.bell + I.more + "</div>" +
        '<div class="so-ig__head"><span class="so-ig__ring"><i class="so-av so-av--deep so-av--lg">' + spkInline(DS.cream) + "</i></span>" +
          '<div class="so-ig__nums">' + stat(d.countPosts, "posts") + stat(d.followers, "seguidores") + stat(d.following, "seguindo") + "</div></div>" +
        '<div class="so-ig__bio"><b>Deep Saúde</b><span class="so-ig__cat">Saúde mental</span>' +
          "<p>Encontre uma especialista ideal para&nbsp;si&nbsp;" + spkInline(DS.terra) + "<br>Cuidar da sua saúde mental é um ato de amor-próprio.<br>Faça o quiz e encontre o seu match.</p>" +
          '<a tabindex="-1">deepsaude.com</a></div>' +
        '<div class="so-ig__btns"><span class="is-pri">Seguir</span><span>Mensagem</span><span class="is-ico">' + I.person + "</span></div>" +
        '<ul class="so-ig__hl">' + hl + "</ul>" +
        '<div class="so-ig__tabs"><span class="on">' + I.grid + "</span><span>" + I.reels + "</span><span>" + I.tag + "</span></div>" +
        '<div class="so-ig__grid">' + grid + "</div>" +
      "</div>"
    );
  };

  /* ==========================================================================
     Carrossel educativo: 7 slides com linha contínua entre eles
     ========================================================================== */
  M["carousel-deep"] = function () {
    var signs = [
      ["Preocupação que não desliga", "Os pensamentos ficam girando no mesmo assunto, mesmo quando você tenta descansar."],
      ["Corpo sempre em alerta", "Ombros tensos, mandíbula travada, aperto no peito sem motivo aparente."],
      ["Sono que não descansa", "Demora para pegar no sono ou acorda no meio da noite com a cabeça a mil."],
      ["Irritação à flor da pele", "Pequenas coisas parecem enormes e a paciência some rápido."],
      ["Dificuldade de concentração", "Ler, trabalhar ou assistir algo até o fim vira um esforço."]
    ];
    var bgs = [DS.cream, DS.sageL, DS.cream, DS.terraL, DS.cream];
    var slides = [];
    slides.push('<div class="so-cs so-cs--cover" style="--bg:' + DS.sage + ';--fg:' + DS.cream + ";--ac:" + DS.terraL + '">' + spk(76, 8, 9, DS.terraL) + spk(10, 70, 5, DS.cream, .5) +
      '<span class="so-k">Ansiedade · guia rápido</span><p class="so-t so-t--xl">5 sinais de ansiedade que a gente <em>normaliza</em></p><div class="so-post__foot"><span class="so-post__h">@deepsaudepsicologia</span><span class="so-pill">Arraste →</span></div></div>');
    signs.forEach(function (s, i) {
      slides.push('<div class="so-cs" style="--bg:' + bgs[i] + ";--fg:" + DS.sageD + ";--ac:" + DS.terra + '"><span class="so-cs__n">0' + (i + 1) + '</span><p class="so-t">' + s[0] + '</p><p class="so-b">' + s[1] + '</p><div class="so-post__foot"><span class="so-post__h">@deepsaudepsicologia</span><span class="so-cs__pg">' + (i + 2) + "/7</span></div></div>");
    });
    slides.push('<div class="so-cs so-cs--cta" style="--bg:' + DS.terra + ";--fg:" + DS.cream + ";--ac:" + DS.ink + '">' + spk(80, 10, 8, DS.cream, .8) +
      '<p class="so-t so-t--lg">Se identificou? Não precisa esperar a <em>crise</em>.</p><p class="so-b">Só uma profissional pode avaliar o seu caso. O quiz ajuda a encontrar a especialista que combina com o seu momento.</p><span class="so-btn so-btn--light">' + spkInline() + ' Fazer o quiz</span><div class="so-post__foot"><span class="so-post__h">deepsaude.com</span><span class="so-cs__pg">7/7</span></div></div>');
    // linha ondulada contínua: cada slide mostra o seu trecho (panorama recortado)
    var path = "M0 118 C 30 111, 62 124, 100 116 S 160 109, 200 115 S 262 124, 300 116 S 362 109, 400 114 S 462 123, 500 116 S 562 109, 600 114 S 668 122, 700 115";
    var stars = [100, 300, 500].map(function (x, k) { return '<path transform="translate(' + (x - 5) + " " + [111, 111, 111][k] + ') scale(.42)" d="' + SPK + '" fill="' + DS.terra + '"/>'; }).join("");
    function line(i) {
      return '<svg class="so-cs__line" viewBox="0 0 700 125" aria-hidden="true" style="left:' + (-i * 100) + '%"><path d="' + path + '" fill="none" stroke="' + DS.terra + '" stroke-width="1.6" stroke-linecap="round"/>' + stars + "</svg>";
    }
    var labels = ["Capa · gancho", "Sinal 1", "Sinal 2", "Sinal 3", "Sinal 4", "Sinal 5", "CTA · quiz"];
    return (
      '<div class="so-car" role="img" aria-label="Carrossel educativo de 7 slides: 5 sinais de ansiedade que a gente normaliza, com capa, cinco sinais e chamada para o quiz">' +
        '<div class="so-car__strip">' + slides.map(function (s, i) {
          var withLine = s.replace(/^(<div[^>]*>)/, "$1" + line(i));
          return '<div class="so-car__slide"><div class="so-car__frame">' + withLine + '</div><span class="so-car__lbl">' + labels[i] + "</span></div>";
        }).join("") +
        "</div>" +
      "</div>"
    );
  };

  /* ==========================================================================
     Linha do tempo de edição (genérica, sem marcas de software)
     ========================================================================== */
  function wave(n, seed, amp, gaps) {
    var s = seed, pts = [], h = 40;
    for (var i = 0; i <= n; i++) {
      s = (s * 9301 + 49297) % 233280;
      var r = s / 233280, x = (i / n) * 1000;
      var silent = gaps && gaps.some(function (g) { return x > g[0] && x < g[1]; });
      var a = silent ? 0.6 : (0.25 + r * 0.75) * amp * (0.6 + 0.4 * Math.sin(i / 7));
      pts.push([x, Math.max(0.6, a)]);
    }
    var top = pts.map(function (p) { return p[0].toFixed(1) + " " + (h / 2 - p[1] * h / 2).toFixed(2); }).join(" L");
    var bot = pts.slice().reverse().map(function (p) { return p[0].toFixed(1) + " " + (h / 2 + p[1] * h / 2).toFixed(2); }).join(" L");
    return '<svg viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true"><path d="M' + top + " L" + bot + 'Z" fill="currentColor"/></svg>';
  }

  M["video-timeline"] = function (el, d) {
    var cfg = REELS.deep, total = 0;
    cfg.scenes.forEach(function (s) { total += s.dur; });
    function pct(t) { return (t / total * 100).toFixed(3) + "%"; }
    // trilha V1: clipes de vídeo nas mesmas durações das cenas do reel
    var names = ["A001_hook_sala.mp4", "B-roll_poltronas.mp4", "tela_quiz.mov", "cta_final.mp4"];
    var tones = [DS.sage, DS.cream, DS.sand, DS.terra];
    var acc = 0, v1 = "", v3 = "", cuts = [];
    cfg.scenes.forEach(function (s, i) {
      v1 += '<div class="so-clip so-clip--v" style="left:' + pct(acc) + ";width:" + pct(s.dur) + '"><span class="so-clip__th" style="--t:' + tones[i] + '"></span><span class="so-clip__th" style="--t:' + tones[i] + '"></span><b>' + names[i] + "</b></div>";
      var lines = s.words.split("|"), seg = (s.dur - 0.2) / lines.length;
      lines.forEach(function (l, k) { v3 += '<div class="so-clip so-clip--t" style="left:' + pct(acc + 0.1 + k * seg) + ";width:" + pct(seg - 0.06) + '"><b>' + l + "</b></div>"; });
      acc += s.dur; if (i < cfg.scenes.length - 1) cuts.push(acc);
    });
    var v2 = '<div class="so-clip so-clip--g" style="left:' + pct(0.1) + ";width:" + pct(2.3) + '"><b>Título · A primeira sessão</b></div>' +
      '<div class="so-clip so-clip--g" style="left:' + pct(6.4) + ";width:" + pct(2.6) + '"><b>Zoom 110% · quiz</b></div>' +
      '<div class="so-clip so-clip--g" style="left:' + pct(9.4) + ";width:" + pct(2.5) + '"><b>CTA + ✦</b></div>';
    var gapsV = [[205, 232], [490, 520], [770, 795]];
    var a1 = '<div class="so-clip so-clip--a" style="left:0;width:100%"><b>VO_roteiro_take3.wav</b>' + wave(260, 11, 1, gapsV) + "</div>";
    var a2 = '<div class="so-clip so-clip--m" style="left:0;width:100%"><b>trilha_calma_loop.wav</b>' + wave(200, 5, 0.55) +
      '<svg class="so-vol" viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true"><path d="M0 8 L40 8 L70 26 L930 26 L960 8 L1000 8" fill="none" stroke="#ffd600" stroke-width="1.5" vector-effect="non-scaling-stroke"/></svg></div>';
    var ticks = "";
    for (var s = 0; s <= total; s += 0.5) {
      var major = s % 2 === 0;
      ticks += '<i class="' + (major ? "mj" : "") + '" style="left:' + pct(s) + '">' + (major ? "<b>00:" + (s < 10 ? "0" : "") + s + "</b>" : "") + "</i>";
    }
    var markers = [[0.05, "gancho"], [cuts[0], "corte"], [6.4, "zoom"], [9.25, "CTA"]].map(function (m) {
      return '<span class="so-mk" style="left:' + pct(m[0]) + '"><b>' + m[1] + "</b></span>";
    }).join("");
    var cutLines = cuts.map(function (c) { return '<i class="so-cutl" style="left:' + pct(c) + '"></i>'; }).join("");
    var tracks = [["V3", "Legendas", v3], ["V2", "Gráficos", v2], ["V1", "Vídeo", v1], ["A1", "Voz", a1], ["A2", "Trilha", a2]];
    var html =
      '<div class="so-tl" role="img" aria-label="Interface de edição de vídeo com monitor de programa em 9:16, trilhas de vídeo, gráficos, legenda, voz e trilha sonora, marcadores de corte e cursor de reprodução animado">' +
        '<div class="so-tl__top"><span class="so-tl__dots"><i></i><i></i><i></i></span><b>DS_2026-10_reel-primeira-sessao_v02</b><span class="so-tl__menu">Edição · Cor · Áudio · Legendas · Exportar</span></div>' +
        '<div class="so-tl__body">' +
          '<div class="so-tl__mon">' +
            '<div class="so-tl__screen"><div class="so-tl__frame">' + reelScreen(cfg) + '<div class="so-tl__safe"><i></i><i></i></div></div></div>' +
            '<div class="so-tl__transport"><span class="so-tl__tc">00:00:00:00</span><span class="so-tl__btns"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h2v14H6zM19 5v14L9 12z" fill="currentColor"/></svg><svg class="pl" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15L19.5 12z" fill="currentColor"/></svg><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 5h2v14h-2zM5 5v14l10-7z" fill="currentColor"/></svg></span><span class="so-tl__tc so-tl__tc--dim">00:00:' + total.toFixed(0) + ':00</span></div>' +
          "</div>" +
          '<div class="so-tl__insp"><b class="so-tl__h">Legenda · estilo</b>' +
            '<dl><div><dt>Fonte</dt><dd>Lato Black · 64 pt</dd></div><div><dt>Destaque</dt><dd><i style="background:' + DS.terra + '"></i>#CB8461</dd></div><div><dt>Animação</dt><dd>palavra a palavra</dd></div><div><dt>Posição</dt><dd>terço central</dd></div><div><dt>Área segura</dt><dd>ativada</dd></div></dl>' +
            '<b class="so-tl__h">Exportação</b><dl><div><dt>Formato</dt><dd>1080 × 1920 · 9:16</dd></div><div><dt>Quadros</dt><dd>30 fps · H.264</dd></div></dl>' +
            '<div class="so-tl__meters"><i></i><i></i></div>' +
          "</div>" +
        "</div>" +
        '<div class="so-tl__tracks">' +
          '<div class="so-tl__ruler"><div class="so-tl__lane">' + ticks + markers + "</div></div>" +
          tracks.map(function (t) {
            return '<div class="so-tl__row so-tl__row--' + t[0].toLowerCase() + '"><div class="so-tl__th"><b>' + t[0] + "</b><span>" + t[1] + '</span></div><div class="so-tl__lane">' + t[2] + "</div></div>";
          }).join("") +
          '<div class="so-tl__over"><div class="so-tl__lane">' + cutLines + '<i class="so-ph"></i></div></div>' +
        "</div>" +
      "</div>";
    after(function () {
      var root = el.querySelector(".so-tl"); if (!root) return;
      var ph = root.querySelector(".so-ph"), tc = root.querySelector(".so-tl__tc"), lastF = -1;
      var p = reelPlayer(root.querySelector(".so-tl__frame"), cfg, function (t, tot) {
        ph.style.left = (t / tot * 100).toFixed(3) + "%";
        var f = Math.floor(t * 30);
        if (f !== lastF) { lastF = f; var sec = Math.floor(t), fr = f % 30; tc.textContent = "00:00:" + (sec < 10 ? "0" : "") + sec + ":" + (fr < 10 ? "0" : "") + fr; }
      });
      addClock(root, p.cycle, p.update, 4.6);
    });
    return html;
  };

  /* ==========================================================================
     Fotografia de produto: still de estúdio + antes/depois
     ========================================================================== */
  function still(raw) {
    var id = uid("st");
    var dust = "";
    if (raw) {
      var s = 13;
      for (var i = 0; i < 26; i++) {
        s = (s * 9301 + 49297) % 233280; var x = 40 + (s / 233280) * 720;
        s = (s * 9301 + 49297) % 233280; var y = 30 + (s / 233280) * 500;
        s = (s * 9301 + 49297) % 233280; var r = 0.8 + (s / 233280) * 2.2;
        dust += '<circle cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" r="' + r.toFixed(1) + '" fill="' + (i % 3 ? "#fff" : "#3b362e") + '" opacity="' + (i % 3 ? ".55" : ".35") + '"/>';
      }
    }
    var product = '<svg x="170" y="165" width="440" height="330" viewBox="0 0 400 300">' + gun().replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "") + "</svg>";
    var tips = '<g transform="translate(560 435)"><svg width="70" height="70" viewBox="0 0 100 100">' + tip("bola").replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "") + '</svg></g>' +
      '<g transform="translate(628 447)"><svg width="58" height="58" viewBox="0 0 100 100">' + tip("bala").replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "") + "</svg></g>";
    return (
      '<svg class="so-still" viewBox="0 0 800 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
        "<defs>" +
          '<radialGradient id="' + id + 'bg" cx=".56" cy=".36" r=".85"><stop offset="0" stop-color="' + (raw ? "#d6cfbf" : "#fbfaf8") + '"/><stop offset=".55" stop-color="' + (raw ? "#bdb5a4" : "#e7e3dd") + '"/><stop offset="1" stop-color="' + (raw ? "#7d7566" : "#c9c3ba") + '"/></radialGradient>' +
          '<linearGradient id="' + id + 'fl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + (raw ? "#c4bcab" : "#ece9e4") + '" stop-opacity="0"/><stop offset=".25" stop-color="' + (raw ? "#c4bcab" : "#ece9e4") + '"/><stop offset="1" stop-color="' + (raw ? "#9c9483" : "#dcd7cf") + '"/></linearGradient>' +
          '<radialGradient id="' + id + 'sh"><stop offset="0" stop-color="#000" stop-opacity="' + (raw ? ".55" : ".42") + '"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>' +
          '<linearGradient id="' + id + 'rf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
          '<filter id="' + id + 'bl" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="40"/></filter>' +
          '<mask id="' + id + 'mk"><rect x="0" y="481" width="800" height="140" fill="url(#' + id + 'rf)"/></mask>' +
        "</defs>" +
        '<rect width="800" height="560" fill="url(#' + id + 'bg)"/>' +
        (raw ? "" : '<ellipse cx="470" cy="250" rx="300" ry="190" fill="#fff" opacity=".6" filter="url(#' + id + 'bl)"/>') +
        '<rect y="330" width="800" height="230" fill="url(#' + id + 'fl)"/>' +
        (raw
          ? '<path d="M0 392 Q400 380 800 396" stroke="#8a8270" stroke-width="2" fill="none" opacity=".6"/>' +
            '<rect x="712" y="-10" width="120" height="580" fill="#6f6a60" opacity=".55"/><rect x="700" y="40" width="34" height="14" fill="#e9e0c8" opacity=".85" transform="rotate(-12 717 47)"/>' +
            '<path d="M232 483 C 200 510, 120 496, 90 526 S 30 560, 0 552" stroke="#151515" stroke-width="6" fill="none" stroke-linecap="round"/>' +
            '<ellipse cx="420" cy="491" rx="150" ry="10" fill="url(#' + id + 'sh)" transform="translate(-30 4)"/>'
          : '<ellipse cx="402" cy="483" rx="210" ry="13" fill="url(#' + id + 'sh)"/><ellipse cx="380" cy="485" rx="90" ry="5" fill="#000" opacity=".35"/>' +
            '<g mask="url(#' + id + 'mk)" opacity=".3"><g transform="translate(0 966) scale(1 -1)">' + product + "</g></g>") +
        product + tips +
        (raw ? dust + '<rect width="800" height="560" fill="#5a4a2a" opacity=".1"/>' : '<rect width="800" height="560" fill="url(#' + id + 'bg)" opacity="0"/>') +
      "</svg>"
    );
  }

  M["photo-product"] = function (el, d) {
    if (d.view === "still") {
      var pins = [
        [17, 14, "Fundo infinito, sem emenda nem sombra dura"],
        [47, 39.6, "Luz principal suave, de cima, desenhando o volume"],
        [26.5, 47, "Luz de recorte separando a traseira do fundo"],
        [62, 86.5, "Sombra de contato para o produto “pousar”"],
        [40, 92, "Reflexo discreto no acrílico"]
      ];
      return (
        '<figure class="so-photo" role="img" aria-label="Still de estúdio do massageador percussivo YDH com fundo infinito, luz suave, sombra de contato e reflexo">' +
          '<div class="so-photo__img">' + still(false) +
            pins.map(function (p, i) { return '<span class="so-pin" style="left:' + p[0] + "%;top:" + p[1] + '%">' + (i + 1) + "</span>"; }).join("") +
            '<span class="so-photo__tag">YDH · Massageador Percussivo · still 5:4</span>' +
          "</div>" +
          '<ol class="so-photo__legend">' + pins.map(function (p) { return "<li>" + p[2] + "</li>"; }).join("") + "</ol>" +
        "</figure>"
      );
    }
    var html =
      '<div class="so-ba" style="--pos:50%">' +
        '<div class="so-ba__layer so-ba__after">' + still(false) + "</div>" +
        '<div class="so-ba__layer so-ba__before">' + still(true) + "</div>" +
        '<span class="so-ba__lbl so-ba__lbl--l">Antes · arquivo bruto</span><span class="so-ba__lbl so-ba__lbl--r">Depois · tratado</span>' +
        '<span class="so-ba__handle" aria-hidden="true"><i></i></span>' +
        '<input class="so-ba__range" type="range" min="0" max="100" value="50" aria-label="Comparar foto antes e depois do tratamento">' +
      "</div>";
    return html;
  };
  // controle do comparador antes/depois (delegado, vale para qualquer instância)
  document.addEventListener("input", function (e) {
    var r = e.target;
    if (!r.classList || !r.classList.contains("so-ba__range")) return;
    r.closest(".so-ba").style.setProperty("--pos", r.value + "%");
  });

  /* ==========================================================================
     Guia de formatos: a mesma peça adaptada para cada tela
     ========================================================================== */
  M["social-formats"] = function () {
    var title = "Terapia não é só para <em>crise</em>.";
    function frame(k, name, px, ratio, inner, extra) {
      return '<figure class="so-fmt__item so-fmt__item--' + k + '"><div class="so-fmt__frame" style="aspect-ratio:' + px[0] + "/" + px[1] + '">' + inner + (extra || "") + "</div>" +
        "<figcaption><b>" + name + "</b><span>" + px[0] + " × " + px[1] + " px</span><span>" + ratio + "</span></figcaption></figure>";
    }
    var feed = '<div class="so-fx" style="--bg:' + DS.sage + ";--fg:" + DS.cream + ";--ac:" + DS.terraL + '">' + spk(78, 8, 9, DS.terraL) + '<span class="so-k">10/out · saúde mental</span><p class="so-t so-t--lg">' + title + '</p><span class="so-post__h">@deepsaudepsicologia</span></div>';
    var car = '<div class="so-fx so-fx--stack" style="--bg:' + DS.cream + ";--fg:" + DS.sage + ";--ac:" + DS.terra + '"><span class="so-k">1 / 6</span><p class="so-t so-t--lg">' + title + '</p><span class="so-pill">Arraste →</span></div>';
    var story = '<div class="so-fx so-fx--v" style="--bg:' + DS.cream + ";--fg:" + DS.sage + ";--ac:" + DS.terra + '">' + spk(70, 30, 10, DS.terra) + '<p class="so-t so-t--lg">' + title + '</p><span class="so-btn">' + spkInline("#fff") + ' Fazer o quiz</span></div>';
    var reel = '<div class="so-fx so-fx--v so-fx--reel" style="--bg:' + DS.terra + ";--fg:" + DS.cream + ";--ac:" + DS.ink + '"><p class="so-t so-t--lg">' + title + '</p><span class="so-fx__cap"><span>não</span> <span class="cur">precisa</span></span></div>';
    var cover = '<div class="so-fx so-fx--v so-fx--cover" style="--bg:' + DS.sageD + ";--fg:" + DS.cream + ";--ac:" + DS.tan + '">' + spk(20, 30, 9, DS.tan) + '<p class="so-t so-t--lg">' + title + "</p></div>";
    var li = '<div class="so-fx so-fx--h" style="--bg:' + DS.cream + ";--fg:" + DS.sage + ";--ac:" + DS.terra + '"><div><span class="so-k">Deep Saúde</span><p class="so-t">' + title + '</p></div><div class="so-fx__ill">' + ILL.chairs({ a: DS.sage, b: DS.tan, c: DS.terra }) + "</div></div>";
    var yt = '<div class="so-fx so-fx--h so-fx--yt" style="--bg:' + DS.sage + ";--fg:" + DS.cream + ";--ac:" + DS.terraL + '"><div><p class="so-t so-t--lg">' + title + '</p><span class="so-k">Primeira sessão: o que esperar</span></div><div class="so-fx__ill">' + ILL.chairs({ a: DS.cream, b: DS.terraL, c: DS.terraL }) + "</div></div>";
    var safeStory = '<i class="so-safe so-safe--t"><b>250 px livres</b></i><i class="so-safe so-safe--b"><b>250 px livres</b></i>';
    var safeReel = '<i class="so-safe so-safe--t so-safe--sm"></i><i class="so-safe so-safe--b so-safe--lg"><b>legenda e perfil</b></i><i class="so-safe so-safe--r"></i>';
    var crop = '<i class="so-crop"><b>recorte 3:4 no grid</b></i>';
    return (
      '<div class="so-fmt" role="img" aria-label="Guia de formatos desenhados em escala: Feed 4:5, Carrossel, Stories e Reels 9:16 com áreas seguras, capa de Reels com recorte para o grid, LinkedIn e YouTube"><div class="so-fmt__grid">' +
        frame("feed", "Feed", [1080, 1350], "4:5", feed) +
        frame("car", "Carrossel", [1080, 1350], "4:5 · até 20 slides", car) +
        frame("story", "Stories", [1080, 1920], "9:16", story, safeStory) +
        frame("reel", "Reels", [1080, 1920], "9:16", reel, safeReel) +
        frame("cover", "Capa de Reels", [1080, 1920], "9:16 → 3:4 no perfil", cover, crop) +
        '<div class="so-fmt__col">' + frame("li", "LinkedIn", [1200, 627], "1,91:1", li) + frame("yt", "YouTube · miniatura", [1280, 720], "16:9", yt) + "</div>" +
      "</div></div>"
    );
  };

  /* ==========================================================================
     Anatomia do template de post (grade, margens e componentes)
     ========================================================================== */
  M["post-anatomy"] = function () {
    var callouts = [
      [104, 10, "1", "Selo ✦, assinatura da marca"],
      [-4, 56, "2", "Título Lora Bold, entrelinha 1,1"],
      [104, 72, "3", "Destaque em itálico terracota"],
      [-4, 92, "4", "Assinatura @ no rodapé"],
      [-4, 5.9, "5", "Margem de segurança 80 px"]
    ];
    return (
      '<div class="so-anat" role="img" aria-label="Template de post 1080 por 1350 com grade de 6 colunas, margens de 80 px e componentes numerados">' +
        '<div class="so-anat__post">' +
          '<div class="so-post so-post--quote" style="--bg:' + DS.cream + ";--fg:" + DS.sage + ";--ac:" + DS.terra + '">' + spk(78, 8, 8, DS.terra) +
            '<div class="so-post__in"><span class="so-k">Ansiedade · carrossel</span><p class="so-t so-t--lg">Respirar fundo também é um <em>recomeço</em>.</p><div class="so-post__foot"><span class="so-post__h">@deepsaudepsicologia</span>' + spkInline() + "</div></div></div>" +
          '<div class="so-anat__grid" aria-hidden="true">' + "<i></i>".repeat(6) + "</div>" +
          '<div class="so-anat__margin" aria-hidden="true"></div>' +
          callouts.map(function (c) { return '<span class="so-pin so-pin--sm" style="left:' + c[0] + "%;top:" + c[1] + '%">' + c[2] + "</span>"; }).join("") +
          '<span class="so-anat__dim so-anat__dim--w">1080 px</span><span class="so-anat__dim so-anat__dim--h">1350 px</span>' +
        "</div>" +
        '<ol class="so-anat__legend">' + callouts.map(function (c) { return "<li><b>" + c[2] + "</b>" + c[3] + "</li>"; }).join("") + "</ol>" +
      "</div>"
    );
  };

  /* ==========================================================================
     Parede de posts em perspectiva (hero)
     ========================================================================== */
  M["social-wall"] = function () {
    var cols = [
      ["d0", "y0", "d1", "d4", "y3"],
      ["d2", "d6", "y1", "d8", "d5"],
      ["y2", "d3", "d10", "y5", "d7"],
      ["d11", "y4", "d9", "d1", "y0"]
    ];
    function item(code) { var n = +code.slice(1); return '<div class="so-wall__p">' + (code[0] === "d" ? deepPost(DEEP_POSTS[n]) : ydhPost(YDH_POSTS[n])) + "</div>"; }
    return (
      '<div class="so-wall" aria-hidden="true"><div class="so-wall__plane">' +
        cols.map(function (c, i) {
          var set = c.map(item).join("");
          return '<div class="so-wall__col' + (i % 2 ? " is-rev" : "") + '"><div class="so-wall__track">' + set + set + "</div></div>";
        }).join("") +
      "</div></div>"
    );
  };
})();
