/* Mockups da trilha de produto digital: Cuidawise (SaaS para clínicas de
   psicologia) e Deep Saúde (match paciente ↔ psicóloga).
   Cada função recebe (el, dataset) e devolve uma string HTML.
   Telas de app são desenhadas em pixels numa prancheta fixa (ex.: 1280×800)
   e escaladas para a largura do container via ResizeObserver (.pd-scale). */
(function () {
  "use strict";
  var LC = (window.LC = window.LC || {});
  var M = (LC.mocks = LC.mocks || {});

  /* ---------- Escala das pranchetas ---------- */
  var ro = "ResizeObserver" in window
    ? new ResizeObserver(function (entries) { entries.forEach(function (e) { applyScale(e.target); }); })
    : null;
  function applyScale(box) {
    var dw = parseFloat(box.getAttribute("data-dw")) || 1280;
    box.style.setProperty("--s", (box.clientWidth / dw).toFixed(4));
  }
  function watch(host) {
    requestAnimationFrame(function () {
      host.querySelectorAll(".pd-scale").forEach(function (box) {
        applyScale(box);
        if (ro) ro.observe(box);
        else window.addEventListener("resize", function () { applyScale(box); });
      });
    });
  }
  function board(w, h, inner, label, cls) {
    return '<div class="pd-scale ' + (cls || "") + '" data-dw="' + w + '" style="aspect-ratio:' + w + "/" + h + '" role="img" aria-label="' + label + '">' +
      '<div class="pd-scale__in" style="width:' + w + "px;height:" + h + 'px">' + inner + "</div></div>";
  }

  /* ---------- Ícones (traço 1.7, grade 24) ---------- */
  var P = {
    home: '<path d="M3.5 10.5 12 3.5l8.5 7V20a1 1 0 0 1-1 1H15v-6H9v6H4.5a1 1 0 0 1-1-1z"/>',
    calendar: '<rect x="3" y="4.5" width="18" height="16.5" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.8c1.9.7 3.1 2.4 3.5 5.2"/>',
    file: '<path d="M14 2.5H6.5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8z"/><path d="M14 2.5V8h5.5M8.5 13h7M8.5 17h5"/>',
    wallet: '<rect x="2.5" y="5.5" width="19" height="14" rx="2.5"/><path d="M2.5 9.5h19M16 14.5h2"/>',
    sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
    key: '<circle cx="8" cy="15" r="4.5"/><path d="m11.2 11.8 9.3-9.3M17 6l2.5 2.5M14.5 8.5 16 10"/>',
    shield: '<path d="M12 2.8 4.5 5.6v6c0 4.6 3.1 8.3 7.5 9.6 4.4-1.3 7.5-5 7.5-9.6v-6z"/><path d="m8.8 12 2.2 2.2 4.2-4.4"/>',
    lock: '<rect x="4.5" y="10.5" width="15" height="10.5" rx="2.2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    chevL: '<path d="m14.5 6-6 6 6 6"/>',
    chevR: '<path d="m9.5 6 6 6-6 6"/>',
    chevUD: '<path d="m8 9 4-4 4 4M8 15l4 4 4-4"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    checkc: '<circle cx="12" cy="12" r="8.5"/><path d="m8.2 12.3 2.6 2.6 5-5.2"/>',
    x: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
    alert: '<path d="M12 3.5 2.8 19.5h18.4z"/><path d="M12 10v4.2M12 17.2v.1"/>',
    repeat: '<path d="m17 2.5 3 3-3 3M4 11.5v-1a5 5 0 0 1 5-5h11M7 21.5l-3-3 3-3M20 12.5v1a5 5 0 0 1-5 5H4"/>',
    video: '<rect x="2.5" y="6" width="13" height="12" rx="2.5"/><path d="m15.5 10.5 6-3.5v10l-6-3.5"/>',
    pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    chat: '<path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.6-4.2A8.5 8.5 0 1 1 20.5 11.5z"/>',
    sync: '<path d="M20 8.5A8.5 8.5 0 0 0 4.6 7M4 15.5A8.5 8.5 0 0 0 19.4 17"/><path d="M4.5 3v4.5H9M19.5 21v-4.5H15"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/>',
    bell: '<path d="M6 9.5a6 6 0 0 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15.5 6 9.5z"/><path d="M10 20.5a2.2 2.2 0 0 0 4 0"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
    arrowR: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.2 4.2-6.5 8-6.5s7 2.3 8 6.5"/>',
    more: '<path d="M5 12h.01M12 12h.01M19 12h.01" stroke-width="3"/>',
    building: '<path d="M4 21V5a1.5 1.5 0 0 1 1.5-1.5h8A1.5 1.5 0 0 1 15 5v16M15 9h3.5A1.5 1.5 0 0 1 20 10.5V21M2.5 21h19M8 7.5h3M8 11.5h3M8 15.5h3"/>',
    sparkle: '<path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7z"/>',
    download: '<path d="M12 3.5v12M7 10.5l5 5 5-5M4 20.5h16"/>',
    leaf: '<path d="M5.2 18.8C3.6 11.6 8.6 4.9 19.3 4.7c.3 10.5-6.3 15.7-14.1 14.1z"/><path d="M5.2 18.8C8 14.6 11.2 11.6 15.2 9.2"/>'
  };
  function ic(n, cls) {
    return '<svg class="cw-ic' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + P[n] + "</svg>";
  }
  LC.cwIcon = ic;

  var ST = {
    agendada: { l: "Agendada", i: "clock" },
    confirmada: { l: "Aconteceu?", i: "clock" },
    realizada: { l: "Aconteceu", i: "check" },
    cancelada: { l: "Cancelada", i: "x" },
    falta: { l: "Falta", i: "alert" }
  };
  function chip(s, extra) {
    return '<span class="cw-chip cw-s--' + s + (extra ? " " + extra : "") + '">' + ic(ST[s].i) + ST[s].l + "</span>";
  }
  var PSY = [
    { n: "Ana R.", i: "AR", c: "#dfe4d5" },
    { n: "Bruna L.", i: "BL", c: "#f3dccb" },
    { n: "Carla M.", i: "CM", c: "#ebdfcc" }
  ];

  function logo(cls) {
    return '<span class="cw-logo ' + (cls || "") + '"><span class="cw-logo__mark">' + ic("leaf") + '</span><span class="cw-logo__word">cuida<i>wise</i></span></span>';
  }

  /* ---------- Barra lateral do app ---------- */
  function side(active, me) {
    me = me || ["FS", "#e7dccd", "Fernanda S.", "Administradora"];
    var main = [["home", "Início"], ["calendar", "Agenda"], ["users", "Pacientes"], ["file", "Prontuários"], ["wallet", "Financeiro"]];
    var adm = [["key", "Equipe e acessos"], ["sync", "Integrações"], ["sliders", "Configurações"]];
    function item(it) {
      return '<li class="' + (it[1] === active ? "on" : "") + '">' + ic(it[0]) + "<span>" + it[1] + "</span></li>";
    }
    return (
      '<aside class="cw-side">' +
        '<div class="cw-side__logo">' + logo() + "</div>" +
        '<div class="cw-clinic"><span class="cw-clinic__ic">' + ic("building") + '</span><span><b>Clínica Aurora</b><small>Unidade Centro</small></span>' + ic("chevUD", "cw-clinic__sw") + "</div>" +
        '<ul class="cw-nav">' + main.map(item).join("") + "</ul>" +
        '<span class="cw-nav__label">Clínica</span>' +
        '<ul class="cw-nav">' + adm.map(item).join("") + "</ul>" +
        '<div class="cw-side__foot">' +
          '<div class="cw-me"><span class="cw-av" style="--av:' + me[1] + '">' + me[0] + "</span><span><b>" + me[2] + "</b><small>" + me[3] + "</small></span>" + ic("more") + "</div>" +
          '<div class="cw-secure">' + ic("lock") + "Ambiente seguro Cuidawise</div>" +
        "</div>" +
      "</aside>"
    );
  }

  /* ---------- Agenda semanal (desktop) ---------- */
  var HOUR = 58, START = 8, END = 18;
  var EVENTS = [
    // [dia, início, duração, paciente, psicóloga, estado, recorrente, modalidade]
    [0, 8, .83, "Mariana C.", 0, "realizada", 1, "video"],
    [0, 9, .83, "João P.", 1, "realizada", 0, "pin"],
    [0, 13, .83, "Helena S.", 2, "falta", 0, "pin"],
    [0, 14, .83, "Rafael M.", 0, "realizada", 1, "video"],
    [0, 16, .83, "Luísa F.", 1, "cancelada", 0, "video"],
    [1, 8.5, .83, "Tiago R.", 2, "realizada", 1, "pin"],
    [1, 10, .83, "Beatriz L.", 0, "realizada", 1, "video"],
    [1, 14, .83, "Camila D.", 1, "realizada", 0, "pin"],
    [1, 15, .83, "Otávio N.", 0, "realizada", 0, "video"],
    [2, 8, .83, "Pedro A.", 0, "realizada", 1, "pin"],
    [2, 9.5, .83, "Sofia G.", 2, "realizada", 0, "video"],
    [2, 11, .83, "Bianca T.", 1, "realizada", 1, "pin"],
    [2, 14, .83, "Mariana C.", 0, "confirmada", 1, "video", "sel"],
    [2, 15.25, .83, "Gustavo V.", 1, "confirmada", 0, "pin"],
    [2, 16.5, .83, "Laura M.", 2, "agendada", 0, "video"],
    [3, 8, .83, "Henrique B.", 1, "confirmada", 0, "pin"],
    [3, 10, .83, "Isabela R.", 0, "agendada", 1, "video"],
    [3, 14, .83, "Davi C.", 2, "agendada", 0, "pin"],
    [3, 15, .83, "Clara F.", 0, "cancelada", 0, "video"],
    [3, 16.5, .83, "Vítor S.", 1, "agendada", 1, "pin"],
    [4, 9, .83, "Alice P.", 2, "agendada", 0, "video"],
    [4, 10, .83, "Manuela K.", 0, "agendada", 1, "pin"],
    [4, 14, .83, "Nina O.", 1, "confirmada", 0, "video"],
    [4, 16, .83, "Lucas E.", 0, "agendada", 1, "video"]
  ];
  var BLOCKS = [
    [0, 10, 1.5, "Supervisão clínica", "Bloqueio · Ana R."],
    [1, 12, 1, "Almoço", "Bloqueio · equipe"],
    [2, 12, 1, "Almoço", "Bloqueio · equipe"],
    [3, 11, 1, "Reunião de equipe", "Bloqueio · todas"],
    [4, 12, 1, "Almoço", "Bloqueio · equipe"]
  ];
  function fmt(h) {
    var hh = Math.floor(h), mm = Math.round((h - hh) * 60);
    return (hh < 10 ? "0" : "") + hh + ":" + (mm < 10 ? "0" : "") + mm;
  }
  function y(h) { return ((h - START) * HOUR).toFixed(1); }

  function agendaGrid() {
    var days = [["Seg", 12], ["Ter", 13], ["Qua", 14], ["Qui", 15], ["Sex", 16]];
    var head = '<div class="cw-cal__head"><span class="cw-cal__tz">GMT−3</span>' + days.map(function (d, i) {
      return '<span class="' + (i === 2 ? "today" : "") + '"><small>' + d[0] + "</small><b>" + d[1] + "</b></span>";
    }).join("") + "</div>";
    var hours = "";
    for (var h = START; h <= END; h++) hours += '<span style="top:' + y(h) + 'px">' + fmt(h) + "</span>";
    var cols = days.map(function (d, di) {
      var inner = "";
      BLOCKS.filter(function (b) { return b[0] === di; }).forEach(function (b) {
        inner += '<div class="cw-blk" style="top:' + y(b[1]) + "px;height:" + (b[2] * HOUR - 3) + 'px"><b>' + b[3] + "</b><small>" + b[4] + "</small></div>";
      });
      EVENTS.filter(function (e) { return e[0] === di; }).forEach(function (e) {
        var p = PSY[e[4]];
        inner +=
          '<div class="cw-ev cw-s--' + e[5] + (e[8] ? " is-sel" : "") + '" style="top:' + y(e[1]) + "px;height:" + (e[2] * HOUR - 3) + 'px">' +
            '<span class="cw-ev__top"><b>' + e[3] + "</b>" + (e[6] ? ic("repeat", "cw-ev__rec") : "") + '<span class="cw-av cw-av--xs" style="--av:' + p.c + '">' + p.i + "</span></span>" +
            '<span class="cw-ev__meta">' + ic(ST[e[5]].i) + ST[e[5]].l + '<span class="cw-ev__t">' + fmt(e[1]) + "</span></span>" +
          "</div>";
      });
      if (di === 1) {
        inner += '<div class="cw-gcal" style="top:' + y(17) + "px;height:" + (HOUR - 3) + 'px">' + ic("sync") + "<span><b>Ocupado</b><small>Google Calendar · Ana R.</small></span></div>";
      }
      if (di === 2) inner += '<div class="cw-now" style="top:' + y(14.33) + 'px"><i></i></div>';
      return '<div class="cw-cal__col' + (di === 2 ? " today" : "") + '">' + inner + "</div>";
    }).join("");
    var lines = "";
    for (var k = 0; k < END - START; k++) lines += "<i></i>";
    return (
      '<div class="cw-cal">' + head +
        '<div class="cw-cal__body" style="height:' + ((END - START) * HOUR) + 'px">' +
          '<div class="cw-cal__hours">' + hours + "</div>" +
          '<div class="cw-cal__lines" style="--hour:' + HOUR + 'px">' + lines + "</div>" +
          '<div class="cw-cal__cols">' + cols + "</div>" +
        "</div>" +
        '<div class="cw-legend">' + Object.keys(ST).map(function (s) { return chip(s); }).join("") +
          '<span class="cw-legend__blk">Bloqueio</span><span class="cw-legend__g">' + ic("sync") + "Google Calendar</span></div>" +
      "</div>"
    );
  }

  function sessionPanel() {
    var opts = Object.keys(ST).map(function (s) {
      return '<li class="cw-s--' + s + (s === "confirmada" ? " on" : "") + '"><span class="cw-radio"></span>' + ic(ST[s].i) + ST[s].l + "</li>";
    }).join("");
    return (
      '<aside class="cw-panel">' +
        '<div class="cw-panel__head"><span>Sessão</span>' + ic("more") + ic("x") + "</div>" +
        '<div class="cw-patient"><span class="cw-av cw-av--lg" style="--av:#dfe4d5">MC</span><span><b>Mariana Couto</b><small>24ª sessão · paciente desde mar 2025</small></span></div>' +
        '<ul class="cw-rows">' +
          "<li>" + ic("calendar") + "<span>Qua, 14 out · <b>14:00 - 14:50</b></span></li>" +
          "<li>" + ic("clock") + "<span>Fuso da clínica · Brasília (GMT−3)</span></li>" +
          "<li>" + ic("video") + "<span>Online · link enviado</span></li>" +
          "<li>" + ic("user") + "<span>Psicóloga: <b>Ana R.</b></span></li>" +
          "<li>" + ic("repeat") + "<span>Semanal · toda quarta</span></li>" +
        "</ul>" +
        '<span class="cw-panel__label">Status da sessão</span>' +
        '<ul class="cw-status">' + opts + "</ul>" +
        '<div class="cw-panel__actions">' +
          '<span class="cw-btn cw-btn--primary">' + ic("lock") + "Abrir prontuário</span>" +
          '<span class="cw-btn cw-btn--ghost">' + ic("chat") + "Lembrete por WhatsApp</span>" +
        "</div>" +
        '<div class="cw-panel__note">' + ic("shield") + "<span>Cada acesso ao prontuário fica registrado.</span></div>" +
        '<div class="cw-panel__note">' + ic("sync") + "<span>Sincronizada na agenda “Cuidawise” do Google Calendar.</span></div>" +
      "</aside>"
    );
  }

  function topbar(title, sub, crumbs) {
    return (
      '<header class="cw-top">' +
        '<div class="cw-top__t">' + (crumbs ? '<small class="cw-crumbs">' + crumbs + "</small>" : "") + "<h4>" + title + "</h4>" + (sub ? "<span>" + sub + "</span>" : "") + "</div>" +
        '<div class="cw-top__r">' +
          '<span class="cw-search">' + ic("search") + "Buscar paciente, sessão…<kbd>⌘K</kbd></span>" +
          '<span class="cw-iconbtn cw-iconbtn--dot">' + ic("bell") + "</span>" +
          '<span class="cw-iconbtn">' + ic("sun") + "</span>" +
        "</div>" +
      "</header>"
    );
  }

  M["cw-agenda"] = function (el) {
    var toolbar =
      '<div class="cw-toolbar">' +
        '<span class="cw-btn cw-btn--soft">Hoje</span>' +
        '<span class="cw-arrows"><span>' + ic("chevL") + "</span><span>" + ic("chevR") + "</span></span>" +
        '<span class="cw-seg"><span>Dia</span><span class="on">Semana</span></span>' +
        '<span class="cw-sep"></span>' +
        '<span class="cw-filter-l">Psicólogas</span>' +
        PSY.map(function (p, i) { return '<span class="cw-pchip' + (i === 2 ? " off" : "") + '"><span class="cw-av cw-av--xs" style="--av:' + p.c + '">' + p.i + "</span>" + p.n + (i === 2 ? "" : ic("check")) + "</span>"; }).join("") +
        '<span class="cw-grow"></span>' +
        '<span class="cw-btn cw-btn--primary">' + ic("plus") + "Nova sessão</span>" +
      "</div>";
    var html =
      '<div class="cw-app">' + side("Agenda") +
        '<div class="cw-main">' +
          topbar("Agenda", "12 a 16 de outubro de 2026") +
          toolbar +
          '<div class="cw-body">' + agendaGrid() + sessionPanel() + "</div>" +
        "</div>" +
      "</div>";
    watch(el);
    return board(1280, 800, html, "Tela de agenda semanal do Cuidawise: barra lateral, filtros por psicóloga, grade com sessões coloridas por estado, bloqueios hachurados e painel lateral com os detalhes da sessão selecionada", "pd-scale--app");
  };

  /* ---------- Prontuário (desktop) ---------- */
  M["cw-record"] = function (el) {
    var sessions = [
      ["14 out", "Sessão 24", "rascunho"], ["08 out", "Sessão 23", "realizada"], ["01 out", "Sessão 22", "realizada"],
      ["24 set", "Sessão 21", "falta"], ["17 set", "Sessão 20", "realizada"], ["10 set", "Sessão 19", "realizada"], ["03 set", "Sessão 18", "realizada"]
    ].map(function (s, i) {
      var st = s[2] === "rascunho" ? '<span class="cw-draft">' + ic("edit") + "Rascunho</span>" : chip(s[2], "cw-chip--sm");
      return '<li class="' + (i === 0 ? "on" : "") + '"><span class="cw-sl__d">' + s[0] + "</span><b>" + s[1] + "</b>" + st + "</li>";
    }).join("");
    var log = [
      ["AR", "#dfe4d5", "Ana R.", "Psicóloga responsável", "Editou · Sessão 24", "hoje, 14:55", "edit"],
      ["AR", "#dfe4d5", "Ana R.", "Psicóloga responsável", "Visualizou", "hoje, 14:51", "eye"],
      ["FS", "#e7dccd", "Fernanda S.", "Administradora", "Acesso bloqueado · sem permissão", "07 out, 10:14", "lock"],
      ["AR", "#dfe4d5", "Ana R.", "Psicóloga responsável", "Criou registro · Sessão 23", "08 out, 15:02", "plus"],
      ["AR", "#dfe4d5", "Ana R.", "Psicóloga responsável", "Visualizou", "08 out, 14:49", "eye"]
    ].map(function (l) {
      return '<li class="' + (l[6] === "lock" ? "deny" : "") + '"><span class="cw-av" style="--av:' + l[1] + '">' + l[0] + "</span><span><b>" + l[2] + "</b> <small>· " + l[3] + "</small><em>" + ic(l[6]) + l[4] + "</em><time>" + l[5] + "</time></span></li>";
    }).join("");
    var mental = [["Humor", "ansioso"], ["Afeto", "congruente"], ["Pensamento", "organizado"], ["Sono", "alterado"], ["Risco", "sem indicativos"]]
      .map(function (m) { return '<span class="cw-obs"><small>' + m[0] + "</small>" + m[1] + "</span>"; }).join("");
    var html =
      '<div class="cw-app">' + side("Prontuários", ["AR", "#dfe4d5", "Ana R.", "Psicóloga"]) +
        '<div class="cw-main">' +
          topbar("Mariana Couto", "", "Pacientes / Mariana Couto / Prontuário") +
          '<div class="cw-phead">' +
            '<span class="cw-av cw-av--lg" style="--av:#dfe4d5">MC</span>' +
            '<div class="cw-phead__t"><span class="cw-tags"><span>34 anos</span><span>' + ic("video") + "Online</span><span>" + ic("repeat") + "Semanal</span><span>Psicóloga: Ana R.</span></span></div>" +
            '<span class="cw-private">' + ic("lock") + "Sigiloso · visível só para a psicóloga responsável</span>" +
          "</div>" +
          '<nav class="cw-tabs"><span>Resumo</span><span class="on">Sessões</span><span>Documentos</span><span>Financeiro</span><span>' + ic("eye") + "Registro de acesso</span></nav>" +
          '<div class="cw-rec">' +
            '<div class="cw-sl"><div class="cw-sl__h"><b>Sessões</b><span>24</span></div><ul>' + sessions + "</ul></div>" +
            '<div class="cw-editor">' +
              '<div class="cw-editor__h"><div><h5>Sessão 24</h5><small>Qua, 14 out 2026 · 14:00 - 14:50 · Online</small></div><span class="cw-saved">' + ic("check") + "Salvo automaticamente · 14:56</span></div>" +
              '<div class="cw-field"><label>Queixa principal</label><p>Ansiedade antecipatória ligada ao retorno ao trabalho; dificuldade para dormir nas noites de domingo.</p></div>' +
              '<div class="cw-field"><label>Resumo técnico</label><p>Revisão do registro de pensamentos da semana. Identificado padrão de catastrofização em situações de avaliação. Treino de respiração diafragmática; combinada exposição gradual a reuniões de equipe.<span class="cw-caret"></span></p></div>' +
              '<div class="cw-field"><label>Observações de estado mental</label><div class="cw-obsrow">' + mental + "</div></div>" +
              '<div class="cw-field"><label>Encaminhamentos</label><p class="cw-check"><span class="cw-cb on">' + ic("check") + "</span>Avaliação psiquiátrica sugerida · aguardando retorno da paciente</p></div>" +
              '<div class="cw-field"><label>Plano para a próxima sessão</label><p>Retomar registro de pensamentos; primeira exposição: apresentar uma pauta curta na reunião de segunda.</p></div>' +
              '<div class="cw-editor__f"><span class="cw-btn cw-btn--ghost">Salvar rascunho</span><span class="cw-btn cw-btn--sage">' + ic("check") + "Finalizar registro</span></div>" +
            "</div>" +
            '<aside class="cw-log"><div class="cw-log__h">' + ic("eye") + "<b>Registro de acesso</b></div><p>Cada abertura deste prontuário fica registrada: quem, quando e o quê.</p><ul>" + log + '</ul><span class="cw-link">' + ic("download") + "Exportar histórico (LGPD)</span></aside>" +
          "</div>" +
        "</div>" +
      "</div>";
    watch(el);
    return board(1280, 800, html, "Tela de prontuário do Cuidawise: lista de sessões, registro da sessão com queixa principal, resumo técnico, observações de estado mental e encaminhamentos, e painel de registro de acesso", "pd-scale--app");
  };

  /* ---------- Agenda do dia (mobile) ---------- */
  M["cw-mobile"] = function (el) {
    var list = EVENTS.filter(function (e) { return e[0] === 2; }).map(function (e) {
      var p = PSY[e[4]];
      return (
        '<li class="cw-mev cw-s--' + e[5] + (e[8] ? " is-sel" : "") + '">' +
          '<span class="cw-mev__t">' + fmt(e[1]) + "<small>" + fmt(e[1] + .83) + "</small></span>" +
          '<span class="cw-mev__c"><span class="cw-mev__n"><b>' + e[3] + "</b>" + (e[6] ? ic("repeat", "cw-ev__rec") : "") + '</span><span class="cw-mev__m">' + chip(e[5], "cw-chip--sm") + "<small>" + ic(e[7]) + p.n + "</small></span></span>" +
        "</li>" + (e[1] === 11 ? '<li class="cw-mblk"><span class="cw-mev__t">12:00</span><span>Almoço · bloqueio</span></li><li class="cw-mnow"><span>14:20</span><i></i></li>' : "")
      );
    }).join("");
    var days = ["S", "T", "Q", "Q", "S", "S", "D"].map(function (d, i) {
      return '<span class="' + (i === 2 ? "on" : "") + '">' + d + "<b>" + (12 + i) + "</b>" + (i < 5 ? "<i></i>" : "") + "</span>";
    }).join("");
    var html =
      '<div class="cw-m">' +
        '<div class="cw-m__status"><b>9:41</b><span>' + '<svg viewBox="0 0 40 12" width="40" height="12" aria-hidden="true"><g fill="currentColor"><rect x="0" y="7" width="3" height="5" rx="1"/><rect x="5" y="5" width="3" height="7" rx="1"/><rect x="10" y="2.5" width="3" height="9.5" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/><rect x="24" y="1" width="14" height="10" rx="2.5" fill="none" stroke="currentColor"/><rect x="26" y="3" width="9" height="6" rx="1"/></g></svg>' + "</span></div>" +
        '<div class="cw-m__head"><span class="cw-logo__mark">' + ic("leaf") + '</span><span class="cw-m__clinic">Clínica Aurora' + ic("chevUD") + '</span><span class="cw-av" style="--av:#dfe4d5">AR</span></div>' +
        '<div class="cw-m__title"><small>Quarta, 14 de outubro</small><h4>Sua agenda</h4></div>' +
        '<div class="cw-m__week">' + days + "</div>" +
        '<div class="cw-m__sum"><span>' + ic("calendar") + "6 sessões</span><span>" + ic("clock") + "1 a confirmar</span></div>" +
        '<ul class="cw-m__list">' + list + "</ul>" +
        '<span class="cw-m__fab">' + ic("plus") + "</span>" +
        '<nav class="cw-m__tab"><span class="on">' + ic("calendar") + "Agenda</span><span>" + ic("users") + "Pacientes</span><span>" + ic("file") + "Prontuários</span><span>" + ic("more") + "Mais</span></nav>" +
      "</div>";
    watch(el);
    return '<div class="phone pd-phone" style="--w:' + (el.dataset.w || "280px") + '"><div class="phone__screen">' +
      board(390, 880, html, "Agenda do dia no app Cuidawise para celular, com sessões, estados e barra de navegação inferior", "pd-scale--fill") +
      "</div></div>";
  };

  /* ---------- Chips de estado de sessão (cor + ícone + rótulo) ---------- */
  M["cw-states"] = function () {
    return '<div class="cw-states" role="img" aria-label="Estados de sessão: agendada, confirmada, realizada, cancelada e falta, cada um com cor, ícone e rótulo">' +
      Object.keys(ST).map(function (s) { return chip(s); }).join("") + "</div>";
  };

  /* ---------- Identidade visual ---------- */
  M["cw-identity"] = function (el) {
    var mark = function (size, cls) { return '<span class="cwi-mark ' + (cls || "") + '" style="--sz:' + size + 'px">' + ic("leaf") + "</span>"; };
    var construction =
      '<svg viewBox="0 0 300 300" class="cwi-build" aria-hidden="true">' +
        '<g stroke="#c9bfb0" stroke-width=".8" fill="none">' +
          '<path d="M0 50h300M0 250h300M50 0v300M250 0v300" stroke-dasharray="3 4"/>' +
          '<path d="M0 150h300M150 0v300" opacity=".6"/>' +
          '<circle cx="150" cy="150" r="74"/><circle cx="150" cy="150" r="100" stroke-dasharray="2 4"/>' +
          '<path d="M60 240 250 50" stroke="#D3845A" stroke-dasharray="5 4" stroke-width="1"/>' +
        "</g>" +
        '<rect x="50" y="50" width="200" height="200" rx="44" fill="#6F7B60"/>' +
        '<g transform="translate(78 78) scale(6)" fill="none" stroke="#F9F6F2" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round">' + P.leaf + "</g>" +
        '<g stroke="#2B2926" stroke-width=".8" fill="none"><path d="M50 272h200M50 267v10M250 267v10M272 50v44M267 50h10M267 94h10"/><path d="M206 50a44 44 0 0 1 44 44" stroke="#D3845A" stroke-width="1.4"/></g>' +
        '<g font-family="JetBrains Mono, monospace" font-size="9" fill="#2B2926" letter-spacing=".5">' +
          '<text x="150" y="290" text-anchor="middle">1x = 200</text>' +
          '<text x="286" y="76" transform="rotate(90 286 76)" text-anchor="middle">r = 22%</text>' +
          '<text x="244" y="34" fill="#b5653d" text-anchor="end">eixo da folha · 45°</text>' +
        "</g>" +
      "</svg>";
    var sw = [
      ["Sálvia", "#6F7B60", "Marca · estrutura", "#fff"],
      ["Terracota", "#D3845A", "Ação primária", "#fff"],
      ["Tan wise", "#C4A27E", "Acento · wordmark", "#2B2926"],
      ["Creme", "#F9F6F2", "Superfície", "#2B2926"],
      ["Carvão", "#2B2926", "Texto", "#fff"]
    ].map(function (s) {
      return '<li style="--c:' + s[1] + ";--f:" + s[3] + '"><b>' + s[0] + "</b><span>" + s[1] + "</span><small>" + s[2] + "</small></li>";
    }).join("");
    var html =
      '<div class="cwi">' +
        '<div class="cwi-tile cwi-hero">' +
          '<span class="cwi-ring"></span><span class="cwi-ring cwi-ring--2"></span>' +
          '<span class="cwi-k">Marca · versão principal sobre sálvia</span>' +
          '<div class="cwi-logo">' + mark(118, "cwi-mark--glass") + '<span class="cwi-word">cuida<i>wise</i></span></div>' +
          '<span class="cwi-pill">' + ic("sparkle") + "Cuidado também é organização</span>" +
        "</div>" +
        '<div class="cwi-tile cwi-cons"><span class="cwi-k">Construção do símbolo</span>' + construction + "</div>" +
        '<div class="cwi-tile cwi-pal"><span class="cwi-k">Paleta</span><ul>' + sw + "</ul></div>" +
        '<div class="cwi-tile cwi-type"><span class="cwi-k">Tipografia</span>' +
          '<div class="cwi-ty"><span class="cwi-aa cwi-aa--serif">Aa</span><span><b>Playfair Display</b><small>Títulos e momentos de respiro · itálico para ênfase</small></span></div>' +
          '<div class="cwi-ty"><span class="cwi-aa cwi-aa--sans">Aa</span><span><b>Montserrat</b><small>Interface, dados e formulários</small></span></div>' +
          '<p class="cwi-sample">Sua prática clínica, <i>em equilíbrio.</i></p>' +
        "</div>" +
        '<div class="cwi-tile cwi-voice"><span class="cwi-k">Ícone de app · tom de voz</span>' +
          '<div class="cwi-icons">' + mark(64, "cwi-mark--terra") + mark(64) + mark(64, "cwi-mark--line") + "</div>" +
          '<ul class="cwi-dos">' +
            '<li class="y">' + ic("check") + "<span>“Entre no seu espaço.”</span></li>" +
            '<li class="n">' + ic("x") + "<span>“Efetue login para continuar.”</span></li>" +
            '<li class="y">' + ic("check") + "<span>“Sua agenda e seus pacientes estão esperando por você.”</span></li>" +
          "</ul>" +
        "</div>" +
      "</div>";
    watch(el);
    return board(1280, 800, html, "Prancha de identidade visual do Cuidawise: logotipo com folha em quadrado arredondado e wordmark cuida wise, construção do símbolo, paleta sálvia, terracota, tan e creme, tipografia e tom de voz", "");
  };

  /* ---------- Design system ---------- */
  function dsPanel(theme) {
    var chips = Object.keys(ST).map(function (s) { return chip(s); }).join("");
    return (
      '<div class="cwds-panel cwds-panel--' + theme + '">' +
        '<div class="cwds-panel__h"><span>' + ic(theme === "dark" ? "moon" : "sun") + (theme === "dark" ? "Escuro" : "Claro") + "</span><small>mesmos tokens semânticos</small></div>" +
        '<div class="cwds-row"><span class="cw-btn cw-btn--primary">Entrar com segurança' + ic("arrowR") + '</span><span class="cw-btn cw-btn--outline">Continuar com Google</span><span class="cw-btn cw-btn--ghost">Cancelar</span><span class="cw-btn cw-btn--primary is-dis">Salvar</span></div>' +
        '<div class="cwds-row cwds-row--inputs">' +
          '<label class="cw-in"><span>E-mail</span><i>email@exemplo.com</i></label>' +
          '<label class="cw-in is-focus"><span>Paciente</span><i class="v">Mariana Co<b class="cw-caret"></b></i></label>' +
          '<label class="cw-in is-err"><span>Telefone (WhatsApp)</span><i class="v">(21) 9980</i><em>' + ic("alert") + "Informe um número com DDD.</em></label>" +
        "</div>" +
        '<div class="cwds-row cwds-row--chips">' + chips + "</div>" +
        '<div class="cwds-row cwds-row--2">' +
          '<div class="cw-ev cw-s--confirmada cwds-card"><span class="cw-ev__top"><b>Mariana C.</b>' + ic("repeat", "cw-ev__rec") + '<span class="cw-av cw-av--xs" style="--av:#dfe4d5">AR</span></span><span class="cw-ev__meta">' + ic("check") + 'Confirmada<span class="cw-ev__t">14:00</span>' + ic("video", "cw-ev__mod") + "</span></div>" +
          '<div class="cw-toast">' + ic("checkc") + '<span><b>Sessão confirmada</b><small>Lembrete enviado por WhatsApp</small></span><span class="cw-toast__u">Desfazer</span></div>' +
        "</div>" +
        '<div class="cwds-row cwds-row--2">' +
          '<div class="cw-empty">' + ic("calendar") + "<b>Nenhuma sessão hoje</b><small>Que tal revisar os prontuários pendentes?</small></div>" +
          '<div class="cw-skel"><i></i><i></i><i class="s"></i><span class="cw-skel__row"><span class="cw-toggle"><b></b></span><small>Lembretes automáticos</small></span></div>' +
        "</div>" +
      "</div>"
    );
  }
  M["cw-design-system"] = function (el) {
    var tokens = [
      ["bg/canvas", "#F9F6F2", "#171815"], ["bg/surface", "#FFFFFF", "#22231F"], ["text/primary", "#2B2926", "#ECE7DF"],
      ["text/muted", "#7A746B", "#A39D92"], ["brand/sage", "#6F7B60", "#9AA88A"], ["action/primary", "#D3845A", "#E09A74"],
      ["accent/wise", "#C4A27E", "#CDB08F"], ["border/subtle", "#E7E1D7", "#34352F"]
    ].map(function (t) {
      return '<li><span class="cwds-sw"><i style="background:' + t[1] + '"></i><i style="background:' + t[2] + '"></i></span><code>color/' + t[0] + "</code><small>" + t[1] + "</small></li>";
    }).join("");
    var type = [["display", "40/44", "Playfair 500", 30], ["heading", "26/32", "Playfair 500", 22], ["title", "17/24", "Montserrat 600", 16], ["body", "14/22", "Montserrat 400", 14], ["label", "11/16", "Montserrat 600 · caps", 11]]
      .map(function (t) { return '<li><span class="cwds-ty cwds-ty--' + t[0] + '" style="font-size:' + t[3] + 'px">' + (t[0] === "label" ? "STATUS" : "Equilíbrio") + "</span><code>" + t[0] + "</code><small>" + t[1] + " · " + t[2] + "</small></li>"; }).join("");
    var space = [4, 8, 12, 16, 24, 32, 48].map(function (s) { return '<li><i style="width:' + s * 1.6 + 'px"></i><code>space/' + s + "</code></li>"; }).join("");
    var html =
      '<div class="cwds">' +
        '<header class="cwds-h">' + logo("cw-logo--sm") + '<span class="cwds-h__v">Design system · v1.4</span><nav><span class="on">Fundamentos</span><span>Componentes</span><span>Padrões</span><span>Acessibilidade</span></nav><span class="cwds-h__aa">' + ic("shield") + "Contraste AA verificado</span></header>" +
        '<div class="cwds-b">' +
          '<div class="cwds-found">' +
            '<section><h6>Cor · tokens semânticos</h6><ul class="cwds-tokens">' + tokens + '</ul><p class="cwds-note"><i></i>claro <i class="d"></i>escuro</p></section>' +
            '<section><h6>Tipografia</h6><ul class="cwds-type">' + type + "</ul></section>" +
            '<section class="cwds-split"><div><h6>Espaçamento · base 4</h6><ul class="cwds-space">' + space + '</ul></div><div><h6>Raio</h6><ul class="cwds-radius"><li><i style="border-radius:6px"></i>6</li><li><i style="border-radius:12px"></i>12</li><li><i style="border-radius:18px"></i>18</li><li><i style="border-radius:99px"></i>pill</li></ul></div></section>' +
          "</div>" +
          dsPanel("light") + dsPanel("dark") +
        "</div>" +
      "</div>";
    watch(el);
    return board(1280, 860, html, "Design system do Cuidawise: tokens de cor para tema claro e escuro, escala tipográfica, espaçamento, raios e componentes como botões, campos, chips de estado de sessão, cartão, toast, estado vazio e carregamento", "");
  };

  /* ---------- Deep Saúde: fluxo do quiz de match ---------- */
  M["deep-quiz-flow"] = function () {
    var star = function (x, y, s, c) { return '<i class="dq-star" style="left:' + x + "%;top:" + y + "%;--sz:" + s + "px;--c:" + c + '">✦</i>'; };
    var steps = [
      { k: "Entrada", t: "Não sabe qual profissional escolher?", entry: 1,
        note: "Ponto de entrada no topo da listagem: oferece um atalho para quem trava diante de dezenas de perfis, sem esconder a busca livre." },
      { k: "Momento", q: "Qual destas situações descreve melhor o que você está sentindo agora?", o: ["Uma ansiedade e estresse constantes, que me sobrecarregam.", "Ando com humor deprimido, sem energia e motivação.", "Tenho pensamentos repetitivos que não consigo controlar."], sel: 0,
        note: "Opções em primeira pessoa e linguagem do dia a dia, sem jargão clínico. A pessoa se reconhece em vez de se diagnosticar." },
      { k: "Tempo", q: "Há quanto tempo você se sente assim?", o: ["Há algumas semanas", "Há alguns meses", "Há mais de um ano", "Prefiro não dizer"], sel: 1,
        note: "Uma pergunta por tela: carga cognitiva baixa para quem chega em sofrimento. Sempre existe uma saída que não exige expor-se." },
      { k: "Experiência", q: "Você já fez terapia antes?", o: ["Nunca fiz", "Já fiz e foi uma boa experiência", "Já fiz, mas não me adaptei"], sel: 0,
        note: "Calibra o tom do resultado: para quem nunca fez terapia, o perfil sugerido explica como é a primeira sessão." },
      { k: "Estilo", q: "Como você gostaria que fossem as sessões?", o: ["Mais práticas, com exercícios e metas", "Mais abertas, para conversar e me entender", "Não sei ainda, quero uma indicação"], sel: 0,
        note: "Traduz abordagem terapêutica (TCC, psicanálise…) em expectativa concreta, sem exigir que a pessoa conheça os termos." },
      { k: "Profissional", q: "O que é mais importante para você numa especialista?", o: ["Que seja acolhedora e paciente", "Que seja direta e objetiva", "Que tenha experiência com o meu tema"], sel: 2,
        note: "Preferência explícita vira critério de ordenação, e reaparece no resultado como motivo do match." },
      { k: "Horário", q: "Quais horários funcionam melhor para você?", multi: ["Manhã", "Tarde", "Noite", "Fim de semana"], msel: [2, 3],
        note: "Seleção múltipla com chips: disponibilidade é restrição real; filtrar cedo evita um match que a pessoa não consegue agendar." },
      { k: "Formato", q: "Como você prefere ser atendida?", o: ["Online", "Presencial", "Tanto faz"], sel: 0, last: 1,
        note: "Última pergunta com CTA claro. O progresso visível desde o passo 1 reduz o abandono no meio do caminho." },
      { k: "Resultado", result: 1,
        note: "O resultado mostra por que a especialista combina, com tags da listagem e ação direta: Agendar ou Ver perfil." }
    ];
    var cards = steps.map(function (s, i) {
      var screen;
      if (s.entry) {
        screen =
          '<div class="dq-screen dq-screen--entry">' + star(8, 12, 14, "#d9c3a6") + star(86, 70, 18, "#cdd3c3") + star(80, 10, 10, "#e8c9b8") +
            '<h6 class="dq-serif">Encontre uma especialista ideal para si</h6>' +
            '<div class="dq-card"><b class="dq-serif">' + s.t + '</b><p>Responda a 7 perguntas rápidas e o nosso sistema encontra a especialista que mais combina com o seu momento.</p><span class="dq-cta">✨ Encontrar a minha especialista ideal</span></div>' +
          "</div>";
      } else if (s.result) {
        screen =
          '<div class="dq-screen dq-screen--result">' + star(88, 6, 12, "#e8c9b8") +
            '<small class="dq-ok">' + ic("sparkle") + "3 especialistas combinam com você</small>" +
            '<div class="dq-match"><span class="dq-avatar"><i></i></span><div><b class="dq-serif">Júlia M.</b><small>Psicóloga · CRP 05/•••••</small></div><span class="dq-pct">Melhor match</span></div>' +
            '<div class="dq-tags"><span>Ansiedade</span><span>TCC</span><span>Online</span><span>Noite</span></div>' +
            '<p class="dq-why"><b>Por que combina:</b> trabalha com ansiedade usando sessões práticas e tem horários à noite.</p>' +
            '<div class="dq-actions"><span class="dq-btn dq-btn--sage">Agendar</span><span class="dq-btn dq-btn--line">Ver perfil</span></div>' +
            '<div class="dq-next"><span class="dq-avatar dq-avatar--sm"><i></i></span><span class="dq-avatar dq-avatar--sm dq-avatar--t"><i></i></span><small>+ 2 perfis compatíveis</small></div>' +
          "</div>";
      } else {
        var body = s.multi
          ? '<div class="dq-multi">' + s.multi.map(function (m, j) { return '<span class="' + (s.msel.indexOf(j) > -1 ? "on" : "") + '">' + (s.msel.indexOf(j) > -1 ? ic("check") : "") + m + "</span>"; }).join("") + "</div>"
          : '<ul class="dq-opts">' + s.o.map(function (o, j) { return '<li class="' + (j === s.sel ? "on" : "") + '">' + o + "</li>"; }).join("") + "</ul>";
        screen =
          '<div class="dq-screen">' +
            '<span class="dq-back">‹ Ver todas as profissionais</span>' +
            '<div class="dq-prog"><i style="width:' + (i / 7 * 100).toFixed(1) + '%"></i></div>' +
            '<small class="dq-step">Passo ' + i + " de 7</small>" +
            '<b class="dq-q dq-serif">' + s.q + "</b>" + body +
            (s.last || s.multi ? '<span class="dq-next-btn">' + (s.last ? "Ver minhas especialistas" : "Continuar") + "</span>" : "") +
          "</div>";
      }
      var n = i === 0 ? "00" : i === 8 ? "✓" : "0" + i;
      return (
        '<li class="dq-node">' +
          '<div class="dq-node__h"><span class="dq-n">' + n + '</span><span class="dq-k">' + s.k + "</span></div>" +
          screen +
          '<p class="dq-note">' + s.note + "</p>" +
          (i < steps.length - 1 ? '<span class="dq-arrow" aria-hidden="true"><svg viewBox="0 0 40 14"><path d="M0 7h36M30 1l7 6-7 6" fill="none" stroke="currentColor" stroke-width="1.4"/></svg></span>' : "") +
        "</li>"
      );
    }).join("");
    return (
      '<div class="dq" role="group" aria-label="Fluxo do quiz de match da Deep Saúde: entrada, sete perguntas e resultado">' +
        '<div class="dq-legend"><span><i class="dq-l1"></i>Tela</span><span><i class="dq-l2"></i>Decisão de design</span><span class="dq-swipe">Arraste para ver o fluxo →</span></div>' +
        '<ol class="dq-flow">' + cards + "</ol>" +
      "</div>"
    );
  };

  /* ---------- Arquitetura de informação + permissões ---------- */
  M["cw-ia"] = function () {
    var mods = [
      ["calendar", "Agenda", ["Dia · semana", "Bloqueios", "Recorrências", "Estados de sessão"]],
      ["users", "Pacientes", ["Cadastro e contato", "WhatsApp", "Documento e endereço", "Vínculo com a psicóloga"]],
      ["file", "Prontuário", ["Registro por sessão", "Estado mental", "Encaminhamentos", "Log de acesso"]],
      ["wallet", "Financeiro", ["Pagamentos", "Repasses em lote"]],
      ["sync", "Integrações", ["Google Calendar · agenda isolada"]]
    ].map(function (m) {
      return '<li><span class="pd-ia-mod">' + ic(m[0]) + m[1] + "</span><ul>" + m[2].map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul></li>";
    }).join("");
    var Y = '<span class="pd-ia-y" title="acesso">' + ic("check") + "</span>";
    var O = '<span class="pd-ia-o" title="somente os próprios">' + ic("user") + "</span>";
    var N = '<span class="pd-ia-n" title="sem acesso">×</span>';
    var rows = [
      ["Agenda", Y, O, Y], ["Pacientes", Y, O, Y], ["Prontuário", N, O, N], ["Financeiro", Y, O, Y], ["Equipe e acessos", Y, N, N]
    ].map(function (r) { return "<tr><th>" + r[0] + "</th><td>" + r[1] + "</td><td>" + r[2] + "</td><td>" + r[3] + "</td></tr>"; }).join("");
    return (
      '<div class="pd-ia">' +
        '<div class="pd-ia-tree">' +
          '<div class="pd-ia-tenant">' +
            '<div class="pd-ia-tenant__h"><span class="pd-ia-badge">' + ic("building") + 'Clínica A</span><span class="pd-ia-iso">' + ic("lock") + "Cada clínica vê só o que é dela</span></div>" +
            '<ul class="pd-ia-mods">' + mods + "</ul>" +
          "</div>" +
          '<div class="pd-ia-tenant pd-ia-tenant--ghost"><span class="pd-ia-badge">' + ic("building") + "Clínica B</span><span>dados isolados</span></div>" +
        "</div>" +
        '<div class="pd-ia-perm">' +
          '<table><caption>Matriz de permissões por papel</caption><thead><tr><th></th><th>Admin.</th><th>Psicóloga</th><th>Secretária</th></tr></thead><tbody>' + rows + "</tbody></table>" +
          '<p class="pd-ia-key"><span>' + Y + "acesso</span><span>" + O + "só os próprios</span><span>" + N + "sem acesso</span></p>" +
        "</div>" +
      "</div>"
    );
  };

  /* ---------- Índice de capítulos do case (destaca a seção visível) ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var bar = document.querySelector("[data-chapters]");
    if (!bar || !("IntersectionObserver" in window)) return;
    var links = bar.querySelectorAll("a[href^='#']");
    var map = {};
    links.forEach(function (a) { var t = document.querySelector(a.getAttribute("href")); if (t) map[t.id] = a; });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove("on"); });
        var a = map[e.target.id];
        if (a) {
          a.classList.add("on");
          bar.scrollTo({ left: a.offsetLeft - bar.clientWidth / 2 + a.offsetWidth / 2, behavior: "smooth" });
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    Object.keys(map).forEach(function (id) { io.observe(document.getElementById(id)); });
  });
})();
