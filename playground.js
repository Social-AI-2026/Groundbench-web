/* GROUNDBENCH — tracing playground */
(function () {
  const D = window.GB, G = window.GEO, SH = window.SHAPES;
  const $ = id => document.getElementById(id);
  const T = (k, f) => (window.T ? window.T(k, f) : f || k);
  const cv = $('pg-canvas'); if (!cv) return;

  const burger = $('burger'), links = $('navlinks');
  if (burger) burger.addEventListener('click', () => links.classList.toggle('open'));
  document.querySelectorAll('.copy').forEach(b => b.addEventListener('click', () => {
    const t = document.querySelector(b.dataset.copy); if (!t) return;
    navigator.clipboard.writeText(t.innerText.trim()).then(() => {
      b.textContent = T('ui.copied', 'Copied'); b.classList.add('done');
      setTimeout(() => { b.textContent = T('ui.copy', 'Copy'); b.classList.remove('done'); }, 1400);
    });
  }));

  let mode = 'zebra', N = 8, shape = SH.byId.zebra, src = shape.pts, target = null;
  let pts = [], reveal = false, hover = null;
  const stage = $('pg-stage'), float = $('pg-float');

  /* ------------------------------ geometry ------------------------------- */
  const segInt = (a, b, c, d) => {
    const o = (p, q, r) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]));
    return o(a, b, c) !== o(a, b, d) && o(c, d, a) !== o(c, d, b);
  };
  function simple(p) {
    const n = p.length;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      if ((j + 1) % n === i || (i + 1) % n === j) continue;
      if (segInt(p[i], p[(i + 1) % n], p[j], p[(j + 1) % n])) return false;
    }
    return true;
  }
  function area(p) {
    let a = 0;
    for (let i = 0; i < p.length; i++) { const q = p[(i + 1) % p.length]; a += p[i][0] * q[1] - q[0] * p[i][1]; }
    return Math.abs(a) / 2;
  }
  const distinct = p => new Set(p.map(q => Math.round(q[0] * 999) + ',' + Math.round(q[1] * 999))).size === p.length;

  /* -------------------------------- draw --------------------------------- */
  function draw() {
    const st = G.hidpi(cv); if (!st) return;
    const { ctx, w, h } = st;
    const pad = 30, S = Math.min(w, h) - pad * 2, ox = (w - S) / 2, oy = (h - S) / 2;
    cv._box = { S, ox, oy };
    ctx.clearRect(0, 0, w, h);

    G.plate(ctx, ox, oy, S, 12);

    G.path(ctx, src, S, S, ox, oy);
    ctx.fillStyle = 'rgba(255,255,255,.13)'; ctx.fill();
    SH.decor(ctx, shape, S, ox, oy);
    ctx.strokeStyle = 'rgba(255,255,255,.40)'; ctx.lineWidth = 1.3;
    G.path(ctx, src, S, S, ox, oy); ctx.stroke();
    if (reveal && target) G.drawPoly(ctx, target, S, S, { ox, oy, stroke: '#4DE3C1', width: 1.8, vertex: true, vertexR: 3, fill: 'rgba(77,227,193,.06)' });

    if (pts.length) {
      const done = pts.length >= N;
      ctx.strokeStyle = '#FF6B57'; ctx.lineWidth = 2; ctx.lineJoin = 'round';
      ctx.beginPath();
      pts.forEach((p, i) => { const x = ox + p[0] * S, y = oy + p[1] * S; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
      if (done) { ctx.closePath(); ctx.fillStyle = 'rgba(255,107,87,.10)'; ctx.fill(); }
      else if (hover) ctx.lineTo(ox + hover[0] * S, oy + hover[1] * S);
      ctx.stroke();
      pts.forEach((p, i) => {
        ctx.fillStyle = i === 0 ? '#fff' : '#FF6B57';
        ctx.beginPath(); ctx.arc(ox + p[0] * S, oy + p[1] * S, i === 0 ? 3.8 : 3, 0, 6.284); ctx.fill();
      });
    }
  }

  /* -------------------------------- score -------------------------------- */
  function score() {
    const okCount = pts.length === N, okSimple = simple(pts), okArea = area(pts) > 1e-5, okDupe = distinct(pts);
    const legal = okCount && okSimple && okArea && okDupe;
    flag('fl-count', okCount); flag('fl-simple', okSimple); flag('fl-area', okArea); flag('fl-dupe', okDupe);
    coords();

    const el = $('pg-iou');
    const v = G.iou(pts, target) * 100;
    el.textContent = v.toFixed(1);
    el.classList.toggle('bad', v < 50);
    const models = D.configs.map(c => ({ name: c.short, v: D.table1[N][c.id].iou2[0], color: c.color }));
    const beat = models.filter(m => v > m.v).length;
    $('pg-verdict').innerHTML = legal
      ? T('pg.legal').replace('%b', beat).replace('%n', N) + ' ' + (v >= 90 ? T('pg.v90') : v >= 70 ? T('pg.v70') : T('pg.v0'))
      : T('pg.illegal').replace('%v', v.toFixed(1));
    bars(models.concat([{ name: T('pg.you', 'You'), v, color: '#fff', you: true }]).sort((x, y) => y.v - x.v));
  }
  const flag = (id, ok) => { $(id).className = 'flag ' + (ok ? 'ok' : 'no'); };

  function coords() {
    const box = $('pg-coords');
    if (pts.length < N) { box.textContent = '—'; box.className = 'dim'; return; }
    box.className = '';
    box.textContent = pts.map(p => Math.round(p[0] * 999) + ' ' + Math.round(p[1] * 999)).join(' ');
  }

  function bars(rows) {
    const max = Math.max(100, ...rows.map(r => r.v));
    $('pg-bars').innerHTML = rows.map(r => `<div class="bar"><div class="nm"${r.you ? ' style="color:#fff;font-weight:700"' : ''}>${r.name}</div>
      <div class="track"><div class="fill" style="width:${(r.v / max) * 100}%;background:${r.color};${r.you ? '' : 'opacity:.8'}"></div></div>
      <div class="val">${r.v.toFixed(1)}</div></div>`).join('');
  }
  const idleBars = () => bars(D.configs.map(c => ({ name: c.short, v: D.table1[N][c.id].iou2[0], color: c.color })).sort((a, b) => b.v - a.v));

  /* ------------------------------- events -------------------------------- */
  function toNorm(ev) {
    const b = cv.getBoundingClientRect(), g = cv._box;
    return [Math.max(0, Math.min(1, (ev.clientX - b.left - g.ox) / g.S)), Math.max(0, Math.min(1, (ev.clientY - b.top - g.oy) / g.S))];
  }

  // Floating counter that follows the cursor while the outline is unfinished.
  function moveFloat(ev) {
    if (pts.length >= N) { float.hidden = true; return; }
    const s = stage.getBoundingClientRect();
    float.hidden = false;
    float.style.left = (ev.clientX - s.left) + 'px';
    float.style.top = (ev.clientY - s.top) + 'px';
    float.innerHTML = T('pg.float').replace('%n', '<b>' + (N - pts.length) + '</b>')
      + (pts.length ? '<i>' + T('pg.float.undo') + '</i>' : '');
  }

  cv.addEventListener('pointermove', e => {
    moveFloat(e);
    if (pts.length && pts.length < N) { hover = toNorm(e); draw(); }
  });
  cv.addEventListener('pointerleave', () => { hover = null; float.hidden = true; draw(); });
  cv.addEventListener('pointerdown', e => {
    if (e.button === 2) return;
    e.preventDefault();
    if (pts.length >= N) pts = [];
    pts.push(toNorm(e)); hover = null;
    if (pts.length >= N) score(); else reset(false);
    sync(); draw(); moveFloat(e);
  });
  // Right-click undoes the last vertex instead of opening the context menu.
  cv.addEventListener('contextmenu', e => {
    e.preventDefault();
    if (!pts.length) return;
    pts.pop(); reset(false); sync(); draw(); moveFloat(e);
  });
  // Clicking anywhere outside the canvas abandons an unfinished outline.
  document.addEventListener('pointerdown', e => {
    if (cv.contains(e.target) || !pts.length || pts.length >= N) return;
    pts = []; hover = null; float.hidden = true; reset(true); sync(); draw();
  }, true);

  function reset(clearPts) {
    if (clearPts) pts = [];
    $('pg-iou').textContent = '—'; $('pg-iou').classList.remove('bad');
    ['fl-count', 'fl-simple', 'fl-area', 'fl-dupe'].forEach(i => { $(i).className = 'flag'; });
    $('pg-verdict').innerHTML = T('pg.idle');
    coords(); idleBars();
  }

  function sync() {
    const left = Math.max(0, N - pts.length);
    $('pg-left').textContent = (pts.length >= N ? T('pg.left0') : T('pg.left1')).replace('%n', pts.length >= N ? N : left);
    $('pg-hint').textContent = pts.length >= N ? T('pg.hint.restart') : T('pg.hint.place');
    $('pg-tag').textContent = 'uid ' + shape.uid + ' · ' + T('expr.' + shape.id);
  }

  function setShape(id) {
    mode = id; shape = SH.byId[id]; src = shape.pts; target = G.exactN(src, N);
    pts = []; reveal = false; $('pg-reveal').textContent = T('pg.reveal');
    reset(true); sync(); draw();
  }

  $('pg-new').addEventListener('click', () => {
    const others = SH.list.filter(s => s.id !== mode);
    setShape(others[Math.floor(Math.random() * others.length)].id);
    const host = $('pg-shape');
    Array.from(host.querySelectorAll('.chip')).forEach(c => c.classList.toggle('on', c.dataset.v === mode));
  });
  $('pg-undo').addEventListener('click', () => { pts.pop(); reset(false); sync(); draw(); });
  $('pg-clear').addEventListener('click', () => { float.hidden = true; reset(true); sync(); draw(); });
  $('pg-reveal').addEventListener('click', () => { reveal = !reveal; $('pg-reveal').textContent = reveal ? T('pg.hide') : T('pg.reveal'); draw(); });

  /* -------------------------------- chips -------------------------------- */
  function chipRow(host, items, initial, onPick) {
    const made = [];
    items.forEach(it => {
      const b = document.createElement('button');
      b.className = 'chip' + (it.v === initial ? ' on' : '');
      b.dataset.v = it.v; b.textContent = it.key ? T(it.key, it.label) : it.label;
      b.addEventListener('click', () => { made.forEach(x => x.classList.remove('on')); b.classList.add('on'); onPick(it.v); });
      host.appendChild(b); made.push(b);
    });
    return () => items.forEach((it, i) => { if (it.key) made[i].textContent = T(it.key, it.label); });
  }

  const relabelShape = chipRow($('pg-shape'),
    SH.list.map(s => ({ label: s.id, key: 'shape.' + s.id, v: s.id })),
    'zebra', setShape);
  const relabelBudget = chipRow($('pg-budget'), D.budgets.map(n => ({ label: 'N = ' + n, v: n })), 8, n => {
    N = n; target = G.exactN(src, N);
    pts = []; float.hidden = true; reset(true); sync(); draw();
  });

  addEventListener('resize', draw);
  addEventListener('gb:lang', () => { relabelShape(); relabelBudget(); reset(pts.length < N); sync(); if (pts.length >= N) score(); draw(); });

  target = G.exactN(src, N);
  reset(true); sync(); draw();
})();
