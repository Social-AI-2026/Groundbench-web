/* GROUNDBENCH — page behaviour, live figures, charts. */
(function () {
  const D = window.GB, G = window.GEO, S = window.SHAPES;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const fmt = v => (v == null ? '—' : v.toFixed(1));
  const T = (k, f) => (window.T ? window.T(k, f) : f || k);
  const CFG = D.configs;
  const byId = Object.fromEntries(CFG.map(c => [c.id, c]));
  const RERENDER = [];
  addEventListener('gb:lang', () => RERENDER.forEach(fn => { try { fn(); } catch (e) {} }));

  /* ------------------------------ chrome -------------------------------- */
  const burger = $('#burger'), links = $('#navlinks');
  if (burger) burger.addEventListener('click', () => links.classList.toggle('open'));
  $$('#navlinks a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

  const spies = $$('[data-spy]');
  if (spies.length) {
    const secs = spies.map(a => $('#' + a.dataset.spy)).filter(Boolean);
    const onScroll = () => {
      let cur = null;
      for (const s of secs) if (s.getBoundingClientRect().top <= 140) cur = s.id;
      spies.forEach(a => a.classList.toggle('on', a.dataset.spy === cur));
    };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.08 });
  document.documentElement.classList.add('reveal');
  $$('.blk .wrap > *, .fcard, .panel').forEach(el => { el.classList.add('rv'); io.observe(el); });
  // Fail-safe: reveal whatever is already on screen without waiting for the
  // observer to schedule its first callback.
  const revealVisible = () => $$('.rv:not(.in)').forEach(el => {
    if (el.getBoundingClientRect().top < innerHeight * 1.1) { el.classList.add('in'); io.unobserve(el); }
  });
  revealVisible();
  addEventListener('load', revealVisible);
  addEventListener('gb:unlock', revealVisible);
  addEventListener('scroll', revealVisible, { passive: true });
  setTimeout(revealVisible, 600);
  // Last resort: if nothing ever reported in, drop the effect rather than
  // leave the page invisible.
  setTimeout(() => { if (!document.querySelector('.rv.in')) document.documentElement.classList.remove('reveal'); }, 2500);

  $$('.copy').forEach(b => b.addEventListener('click', () => {
    const t = $(b.dataset.copy); if (!t) return;
    navigator.clipboard.writeText(t.innerText.trim()).then(() => {
      b.textContent = T('ui.copied', 'Copied'); b.classList.add('done');
      setTimeout(() => { b.textContent = T('ui.copy', 'Copy'); b.classList.remove('done'); }, 1400);
    });
  }));

  /* ------------------------------ chip sets ----------------------------- */
  function chips(host, items, initial, onPick) {
    if (!host) return;
    const made = [];
    items.forEach(it => {
      const b = document.createElement('button');
      b.className = 'chip' + (it.v === initial ? ' on' : '');
      b.textContent = it.key ? T(it.key, it.label) : it.label;
      b.addEventListener('click', () => {
        made.forEach(x => x.classList.remove('on'));
        b.classList.add('on'); onPick(it.v);
      });
      host.appendChild(b); made.push(b);
    });
    RERENDER.push(() => items.forEach((it, i) => { if (it.key) made[i].textContent = T(it.key, it.label); }));
    onPick(initial);
  }

  const shapeChips = () => S.list.map(s => ({ label: s.id, key: 'shape.' + s.id, v: s.id }));
  const tagFor = s => 'uid ' + s.uid + ' · ' + T('expr.' + s.id, s.id);

  /* ------------------------------ bar chart ----------------------------- */
  function bars(host, rows, opt) {
    opt = opt || {};
    const max = opt.max != null ? opt.max : Math.max(...rows.map(r => r.v));
    const min = opt.min || 0;
    const pct = r => Math.max(0, Math.min(100, ((r.v - min) / (max - min)) * 100));
    host.innerHTML = rows.map(r => `<div class="bar${r.muted ? ' muted' : ''}"><div class="nm">${r.label}</div>
      <div class="track"><div class="fill" style="width:0;background:${r.color || 'var(--ref)'}"></div></div>
      <div class="val">${r.v.toFixed(1)}</div></div>`).join('');
    requestAnimationFrame(() => $$('.fill', host).forEach((f, i) => { f.style.width = pct(rows[i]) + '%'; }));
    setTimeout(() => $$('.fill', host).forEach((f, i) => { f.style.width = pct(rows[i]) + '%'; }), 40);
  }

  function groupChart(host, groups, opt) {
    opt = opt || {};
    const max = opt.max != null ? opt.max : Math.max(...groups.flatMap(g => g.rows.map(r => r.v)));
    host.innerHTML = groups.map(g => `<div class="gcol"><div class="gl">${g.label}</div>${
      g.rows.map(r => `<div class="gser"><div class="gn">${r.label}</div>
        <div class="gt"><div class="gf" style="width:0;background:${r.color}"></div></div>
        <div class="gv">${r.v.toFixed(1)}</div></div>`).join('')}</div>`).join('');
    const flat = groups.flatMap(g => g.rows);
    const paint = () => $$('.gf', host).forEach((f, i) => { f.style.width = Math.min(100, (flat[i].v / max) * 100) + '%'; });
    requestAnimationFrame(paint); setTimeout(paint, 40);
  }

  function hexA(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  }

  const plotGrid = (ctx, ox, oy, size, n) => G.plate(ctx, ox, oy, size, n);

  /* ============================ HERO CANVAS ============================== */
  (function hero() {
    const cv = $('#hero-canvas'); if (!cv) return;
    const nEl = $('#hero-n'), iEl = $('#hero-iou'), tagEl = $('#hero-tag');
    const BUDGETS = [8, 16, 64];
    const stages = [];
    S.list.forEach(shape => BUDGETS.forEach(N => {
      const t = G.exactN(shape.pts, N);
      const p = G.predict(t, N, N >= 64 ? 0.40 : 0.84);
      stages.push({ shape, N, t, p, box: G.bbox(shape.pts), iou: G.iou(t, p) });
    }));
    let i = 0, t0 = performance.now();
    const DUR = 5200;

    function frame(now) {
      const st = G.hidpi(cv); if (!st) { requestAnimationFrame(frame); return; }
      const { ctx, w, h } = st;
      let e = (now - t0) / DUR;
      if (e >= 1) { i = (i + 1) % stages.length; t0 = now; e = 0; }
      const s = stages[i];
      const pad = 26, sz = Math.min(w, h) - pad * 2, ox = (w - sz) / 2, oy = (h - sz) / 2;

      ctx.clearRect(0, 0, w, h);
      plotGrid(ctx, ox, oy, sz, 10);

      G.path(ctx, s.shape.pts, sz, sz, ox, oy);
      ctx.fillStyle = 'rgba(255,255,255,.10)'; ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.30)'; ctx.lineWidth = 1.1; ctx.stroke();
      S.decor(ctx, s.shape, sz, ox, oy);

      G.drawBox(ctx, s.box, sz, sz, { ox, oy, stroke: 'rgba(255,194,75,.5)', dash: [4, 4], width: 1.2, corners: true });

      const ta = Math.min(1, e / 0.22), pa = Math.min(1, Math.max(0, (e - 0.26) / 0.22));
      ctx.globalAlpha = e > 0.9 ? 1 - (e - 0.9) / 0.1 : 1;
      partial(ctx, s.t, ta, sz, ox, oy, '#4DE3C1', 2, true);
      if (pa > 0) partial(ctx, s.p, pa, sz, ox, oy, '#FF6B57', 1.6, false);
      ctx.globalAlpha = 1;

      nEl.textContent = 'N = ' + s.N;
      tagEl.textContent = tagFor(s.shape);
      const shown = pa >= 1 ? s.iou : (pa > 0 ? s.iou * pa : null);
      iEl.textContent = shown == null ? 'IoU —' : 'IoU ' + (shown * 100).toFixed(1);
      iEl.style.color = pa >= 1 ? (s.iou > 0.6 ? '#4DE3C1' : '#FF6B57') : '';
      requestAnimationFrame(frame);
    }

    function partial(ctx, pts, k, sz, ox, oy, col, lw, dots) {
      const n = pts.length, upto = Math.max(2, Math.round(n * k));
      ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineJoin = 'round';
      ctx.beginPath();
      for (let j = 0; j < upto; j++) {
        const p = pts[j % n], x = ox + p[0] * sz, y = oy + p[1] * sz;
        j ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      if (k >= 1) { ctx.closePath(); ctx.fillStyle = hexA(col, 0.07); ctx.fill(); }
      ctx.stroke();
      if (dots) {
        ctx.fillStyle = col;
        for (let j = 0; j < upto; j++) {
          const p = pts[j % n];
          ctx.beginPath(); ctx.arc(ox + p[0] * sz, oy + p[1] * sz, 2.6, 0, 6.284); ctx.fill();
        }
      }
    }
    // Paint one frame synchronously so the figure is never blank, then let
    // rAF drive it (some embedded viewers throttle rAF until first paint).
    frame(performance.now());
    addEventListener('gb:unlock', () => frame(performance.now()));
  })();

  /* ============================ GAP CANVAS =============================== */
  (function gap() {
    const cv = $('#gap-canvas'); if (!cv) return;
    const sl = $('#gap-slider'), nv = $('#gap-nval'), tagEl = $('#gap-tag');
    let shape = S.list[0], N = 16, src = shape.pts, B = G.bbox(src), boxIoU = 0;

    function pick(id) {
      shape = S.byId[id]; src = shape.pts; B = G.bbox(src);
      boxIoU = G.iou(src, G.boxToPoly(B, 64));
      draw();
    }

    function draw() {
      const st = G.hidpi(cv); if (!st) return;
      const { ctx, w, h } = st;
      const pad = 30, sz = Math.min(w, h) - pad * 2, ox = (w - sz) / 2, oy = (h - sz) / 2;
      const tgt = G.exactN(src, N);
      ctx.clearRect(0, 0, w, h);
      plotGrid(ctx, ox, oy, sz, 12);

      G.path(ctx, src, sz, sz, ox, oy);
      ctx.fillStyle = 'rgba(255,255,255,.11)'; ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.30)'; ctx.lineWidth = 1.1; ctx.stroke();
      S.decor(ctx, shape, sz, ox, oy);

      ctx.save();
      ctx.beginPath();
      ctx.rect(ox + B[0] * sz, oy + B[1] * sz, (B[2] - B[0]) * sz, (B[3] - B[1]) * sz);
      ctx.clip();
      ctx.strokeStyle = 'rgba(255,194,75,.30)'; ctx.lineWidth = 1;
      for (let d = -sz; d < sz * 2; d += 7) { ctx.beginPath(); ctx.moveTo(ox + d, oy); ctx.lineTo(ox + d + sz, oy + sz); ctx.stroke(); }
      ctx.globalCompositeOperation = 'destination-out';
      G.path(ctx, src, sz, sz, ox, oy);
      ctx.fillStyle = '#000'; ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      ctx.restore();

      G.drawBox(ctx, B, sz, sz, { ox, oy, stroke: '#FFC24B', width: 1.5, corners: true });
      G.drawPoly(ctx, tgt, sz, sz, { ox, oy, stroke: '#4DE3C1', width: 2, vertex: true, vertexR: 3, fill: 'rgba(77,227,193,.07)' });

      tagEl.textContent = tagFor(shape);
      $('#gap-box').textContent = T('gap.box', 'Box vs region') + '  ' + (boxIoU * 100).toFixed(1);
      $('#gap-poly').textContent = T('gap.poly', 'Exact-N vs region').replace('N', N) + '  ' + (G.iou(src, tgt) * 100).toFixed(1);
    }

    chips($('#gap-shape'), shapeChips(), S.list[0].id, pick);
    sl.addEventListener('input', () => { N = D.budgets[+sl.value]; nv.textContent = 'N = ' + N; draw(); });
    addEventListener('resize', draw);
    RERENDER.push(draw);
    setTimeout(draw, 40); addEventListener('gb:unlock', () => setTimeout(draw, 60));
  })();

  /* =========================== ALGORITHM CANVAS ========================== */
  (function algo() {
    const cv = $('#algo-canvas'); if (!cv) return;
    const tag = $('#algo-tag'), opEl = $('#algo-op'), cntEl = $('#algo-count');
    let shape = S.list[0], src = shape.pts, C = src.map(p => p.slice()), target = 16, timer = null, mark = null;

    function step() {
      if (C.length === target) { opEl.textContent = T('algo.done', 'done · |C| = N'); mark = null; draw(); return stop(); }
      one();
      cntEl.textContent = '|C| = ' + C.length;
      draw();
    }
    function one() {
      if (C.length < target) {
        let k = 0, best = -1;
        for (let j = 0; j < C.length; j++) {
          const q = C[(j + 1) % C.length], d = Math.hypot(q[0] - C[j][0], q[1] - C[j][1]);
          if (d > best) { best = d; k = j; }
        }
        const q = C[(k + 1) % C.length], m = [(C[k][0] + q[0]) / 2, (C[k][1] + q[1]) / 2];
        mark = { type: 'ins', a: C[k], b: q }; C.splice(k + 1, 0, m);
        opEl.textContent = T('algo.insert', 'insert midpoint of longest edge');
      } else {
        let k = 0, best = Infinity;
        for (let j = 0; j < C.length; j++) {
          const a = C[(j - 1 + C.length) % C.length], b = C[j], c = C[(j + 1) % C.length];
          const ar = Math.abs((a[0] - b[0]) * (c[1] - b[1]) - (a[1] - b[1]) * (c[0] - b[0])) / 2;
          if (ar < best) { best = ar; k = j; }
        }
        mark = { type: 'rem', a: C[(k - 1 + C.length) % C.length], b: C[k], c: C[(k + 1) % C.length] };
        C.splice(k, 1);
        opEl.textContent = T('algo.remove', 'remove minimum-area vertex');
      }
    }
    function stop() { clearInterval(timer); timer = null; }
    function run() {
      stop(); C = src.map(p => p.slice()); mark = null;
      tag.textContent = T('algo.source', 'Source contour') + ' · V = ' + src.length + ' → N = ' + target;
      // A 300-vertex source needs ~280 removals; animating each one takes half a
      // minute and the interesting decisions are all at the end. Fast-forward to
      // N + 18 in one silent pass, then animate the last steps one at a time.
      const lead = 18, guard = src.length + target + 40;
      let n = 0;
      while (Math.abs(C.length - target) > lead && n++ < guard) one();
      mark = null;
      cntEl.textContent = '|C| = ' + C.length;
      opEl.textContent = C.length === src.length ? T('algo.ready', 'ready') : T('algo.ff', 'fast-forwarded to N + 18');
      draw();
      timer = setInterval(step, 190);
    }
    function draw() {
      const st = G.hidpi(cv); if (!st) return;
      const { ctx, w, h } = st;
      const pad = 28, sz = Math.min(w, h) - pad * 2, ox = (w - sz) / 2, oy = (h - sz) / 2;
      ctx.clearRect(0, 0, w, h);
      plotGrid(ctx, ox, oy, sz, 12);
      G.path(ctx, src, sz, sz, ox, oy);
      ctx.fillStyle = 'rgba(255,255,255,.10)'; ctx.fill();
      S.decor(ctx, shape, sz, ox, oy);
      G.drawPoly(ctx, src, sz, sz, { ox, oy, stroke: 'rgba(255,255,255,.30)', width: 1.1 });
      if (mark) {
        ctx.strokeStyle = mark.type === 'ins' ? '#FFC24B' : '#FF6B57'; ctx.lineWidth = 2.4;
        ctx.beginPath();
        if (mark.type === 'ins') { ctx.moveTo(ox + mark.a[0] * sz, oy + mark.a[1] * sz); ctx.lineTo(ox + mark.b[0] * sz, oy + mark.b[1] * sz); }
        else {
          ctx.moveTo(ox + mark.a[0] * sz, oy + mark.a[1] * sz);
          ctx.lineTo(ox + mark.b[0] * sz, oy + mark.b[1] * sz);
          ctx.lineTo(ox + mark.c[0] * sz, oy + mark.c[1] * sz);
          ctx.closePath(); ctx.fillStyle = 'rgba(255,107,87,.20)'; ctx.fill();
        }
        ctx.stroke();
      }
      G.drawPoly(ctx, C, sz, sz, { ox, oy, stroke: '#4DE3C1', width: 1.8, vertex: true, vertexR: 2.8, fill: 'rgba(77,227,193,.06)' });
    }
    chips($('#algo-shape'), shapeChips(), S.list[0].id, id => { shape = S.byId[id]; src = shape.pts; run(); });
    chips($('#algo-chips'), D.budgets.map(n => ({ label: 'N = ' + n, v: n })), 16, n => { target = n; run(); });
    addEventListener('resize', draw);
    RERENDER.push(draw);
    addEventListener('gb:unlock', () => setTimeout(run, 60));
  })();

  /* ============================ FIDELITY BARS ============================ */
  (function fid() {
    const host = $('#fidelity-bars'); if (!host) return;
    bars(host, D.budgets.map(n => ({ label: 'N = ' + n, v: D.fidelity[n], color: '#4DE3C1' })), { min: 80, max: 100 });
  })();

  /* ============================ SLICE CHART ============================== */
  (function slices() {
    const host = $('#slice-chart'); if (!host) return;
    const four = ['gemini', 'qwen', 'doubao', 'kimi'];
    let cur = 'diff';
    function render() {
      const ax = D.slices.axes.find(a => a.id === cur);
      groupChart(host, ax.cols.map((c, ci) => ({
        label: T('col.' + c, c) + (ax.counts ? `  ·  ${ax.counts[ci]}${T('slice.q', ' q')}` : ''),
        rows: four.map(f => ({ label: byId[f].short, v: D.slices.data[f][cur][ci], color: byId[f].color }))
      })), { max: 70 });
    }
    chips($('#slice-axis'), D.slices.axes.map(a => ({ label: a.label.split(' ')[0], key: 'slice.' + a.id, v: a.id })), 'diff', id => { cur = id; render(); });
    RERENDER.push(render);
  })();

  /* ============================ RESULTS TABLE ============================ */
  (function results() {
    const tbl = $('#res-table'); if (!tbl) return;
    let budget = 'pooled';
    const order = ['gemini', 'qwen', 'doubao', 'kimi'];

    function render() {
      const row = D.table1[budget];
      const cells = D.metrics.map(m => {
        const vals = order.map(id => row[id][m.id][0]).sort((a, b) => b - a);
        return { best: vals[0], second: vals[1] };
      });
      let html = `<tr><th>${T('ui.configuration', 'Configuration')}</th>${D.metrics.map(m => `<th title="${m.note}">${m.label}</th>`).join('')}</tr>`;
      order.concat(budget === 'pooled' ? ['mean'] : []).forEach(id => {
        const c = byId[id], color = c ? c.color : '#8695A1';
        const nm = c
          ? `<div class="mdl"><span class="swatch" style="background:${c.color}"></span><span>${c.name}<br /><span class="vendor">${c.vendor}</span></span></div>`
          : `<div class="mdl"><span class="swatch" style="background:#3A464F"></span><span>${T('ui.mean', 'Mean')}</span></div>`;
        html += `<tr${c ? '' : ' class="meanrow"'}><td>${nm}</td>` + D.metrics.map((m, mi) => {
          const p = row[id][m.id];
          const cls = c && p[0] === cells[mi].best ? 'best' : (c && p[0] === cells[mi].second ? 'second' : '');
          return `<td class="num"><span class="cbp" style="width:${Math.min(100, p[1])}%;background:${color}"></span>`
            + `<span class="cb" style="width:${Math.min(100, p[0])}%;background:${color}"></span>`
            + `<span class="${cls}">${fmt(p[0])}</span><span class="par"> / ${fmt(p[1])}</span></td>`;
        }).join('') + '</tr>';
      });
      tbl.querySelector('tbody').innerHTML = html;
    }
    chips($('#res-budget'), D.budgets.map(n => ({ label: 'N ' + n, v: String(n) })).concat([{ label: 'Pooled', key: 'ui.pooled', v: 'pooled' }]), 'pooled', v => { budget = v; render(); });
    RERENDER.push(render);
  })();

  /* ============================ BUDGET CURVE ============================= */
  (function curve() {
    const cv = $('#curve-canvas'); if (!cv) return;
    $('#curve-legend').innerHTML = CFG.map(c => `<span><i style="border-color:${c.color}"></i>${c.short}</span>`).join('');
    let metric = 'iou2';
    function draw() {
      const st = G.hidpi(cv); if (!st) return;
      const { ctx, w, h } = st;
      const L = 40, R = 14, Tp = 16, Bm = 30, iw = w - L - R, ih = h - Tp - Bm;
      const vals = CFG.flatMap(c => D.budgets.map(n => D.table1[n][c.id][metric][0]));
      const hi = Math.ceil(Math.max(...vals) / 10) * 10, lo = Math.max(0, Math.floor(Math.min(...vals) / 10) * 10 - 5);
      ctx.clearRect(0, 0, w, h);
      ctx.font = '10px "JetBrains Mono", monospace'; ctx.textBaseline = 'middle';
      for (let g = 0; g <= 5; g++) {
        const v = lo + ((hi - lo) * g) / 5, y = Tp + ih - (ih * g) / 5;
        ctx.strokeStyle = 'rgba(255,255,255,.055)'; ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(w - R, y); ctx.stroke();
        ctx.fillStyle = '#5D6C77'; ctx.textAlign = 'right'; ctx.fillText(v.toFixed(0), L - 8, y);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      D.budgets.forEach((n, i) => ctx.fillText('N=' + n, L + (iw * i) / 4, Tp + ih + 9));
      CFG.forEach(c => {
        const pts = D.budgets.map((n, i) => [L + (iw * i) / 4, Tp + ih - ((D.table1[n][c.id][metric][0] - lo) / (hi - lo)) * ih]);
        ctx.strokeStyle = c.color; ctx.lineWidth = 2; ctx.lineJoin = 'round';
        ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
        ctx.fillStyle = c.color; pts.forEach(p => { ctx.beginPath(); ctx.arc(p[0], p[1], 3.2, 0, 6.284); ctx.fill(); });
      });
    }
    chips($('#curve-metric'), [{ label: 'IoU²', v: 'iou2' }, { label: 'Acc@.5', v: 'a50' }, { label: 'Acc@.7', v: 'a70' }, { label: 'IoUn', v: 'ioun' }], 'iou2', v => { metric = v; draw(); });
    addEventListener('resize', draw);
    setTimeout(draw, 40); addEventListener('gb:unlock', () => setTimeout(draw, 60));
  })();

})();
