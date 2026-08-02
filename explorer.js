/* GROUNDBENCH — results explorer */
(function () {
  const D = window.GB, G = window.GEO;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const f1 = v => v.toFixed(1);
  const T = (k, f) => (window.T ? window.T(k, f) : f || k);
  const CFG = D.configs, byId = Object.fromEntries(CFG.map(c => [c.id, c]));
  const ORDER = ['gemini', 'qwen', 'doubao', 'kimi'];
  const RERENDER = [];
  addEventListener('gb:lang', () => RERENDER.forEach(fn => { try { fn(); } catch (e) {} }));

  const burger = $('#burger'), links = $('#navlinks');
  if (burger) burger.addEventListener('click', () => links.classList.toggle('open'));

  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.05 });
  document.documentElement.classList.add('reveal');
  $$('.blk .wrap > *').forEach(el => { el.classList.add('rv'); io.observe(el); });
  // Fail-safe: reveal whatever is already on screen without waiting for the
  // observer to schedule its first callback.
  const revealVisible = () => $$('.rv:not(.in)').forEach(el => {
    if (el.getBoundingClientRect().top < innerHeight * 1.1) { el.classList.add('in'); io.unobserve(el); }
  });
  revealVisible();
  addEventListener('load', revealVisible);
  addEventListener('scroll', revealVisible, { passive: true });
  setTimeout(revealVisible, 600);
  setTimeout(() => { if (!document.querySelector('.rv.in')) document.documentElement.classList.remove('reveal'); }, 2500);

  function chips(host, items, initial, onPick) {
    if (!host) return;
    const made = [];
    items.forEach(it => {
      const b = document.createElement('button');
      b.className = 'chip' + (it.v === initial ? ' on' : '');
      b.textContent = it.key ? T(it.key, it.label) : it.label;
      b.addEventListener('click', () => { made.forEach(x => x.classList.remove('on')); b.classList.add('on'); onPick(it.v); });
      host.appendChild(b); made.push(b);
    });
    RERENDER.push(() => items.forEach((it, i) => { if (it.key) made[i].textContent = T(it.key, it.label); }));
    onPick(initial);
  }

  const swatch = id => byId[id]
    ? `<div class="mdl"><span class="swatch" style="background:${byId[id].color}"></span><span>${byId[id].name}</span></div>`
    : `<div class="mdl"><span class="swatch" style="background:#3A464F"></span><span>${T('ui.mean', 'Mean')}</span></div>`;

  /* ------------------------------- Table 1 ------------------------------- */
  (function t1() {
    const tbl = $('#t1'); if (!tbl) return;

    // number + bar: solid = fixed, ghost behind = parseable-only
    const cell = (p, cls, color) => `<td class="num">`
      + `<span class="cbp" style="width:${Math.min(100, p[1])}%;background:${color}"></span>`
      + `<span class="cb" style="width:${Math.min(100, p[0])}%;background:${color}"></span>`
      + `<span class="${cls}">${f1(p[0])}</span><span class="par"> / ${f1(p[1])}</span></td>`;

    function rank(block, mid) {
      const vals = ORDER.map(id => block[id][mid][0]).sort((a, b) => b - a);
      return { best: vals[0], second: vals[1] };
    }

    let budget = 'pooled';
    function render() {
      const block = D.table1[budget];
      const rk = D.metrics.map(m => rank(block, m.id));
      let body = `<tr><th>${T('ui.configuration', 'Configuration')}</th>${D.metrics.map(m => `<th title="${m.note}">${m.label}</th>`).join('')}</tr>`;
      ORDER.concat(block.mean ? ['mean'] : []).forEach(id => {
        const color = byId[id] ? byId[id].color : '#8695A1';
        body += `<tr${byId[id] ? '' : ' class="meanrow"'}><td>${swatch(id)}</td>` + D.metrics.map((m, mi) => {
          const p = block[id][m.id];
          const cls = byId[id] ? (p[0] === rk[mi].best ? 'best' : p[0] === rk[mi].second ? 'second' : '') : '';
          return cell(p, cls, color);
        }).join('') + '</tr>';
      });
      tbl.querySelector('tbody').innerHTML = body;
      const fid = $('#t1-fid');
      if (fid) fid.textContent = budget === 'pooled'
        ? T('ex.t1.fid.pooled', 'All five budgets pooled.')
        : 'C\u2099 = ' + D.fidelity[budget] + '  ·  N = ' + budget;
    }
    chips($('#t1-budget'), D.budgets.map(b => ({ label: 'N ' + b, v: String(b) }))
      .concat([{ label: T('ui.pooled', 'Pooled'), key: 'ui.pooled', v: 'pooled' }]),
      'pooled', v => { budget = v; render(); });
    render(); RERENDER.push(render);
  })();

  /* ------------------------------ bar chart ------------------------------ */
  function bars(host, rows, opt) {
    opt = opt || {};
    const max = opt.max != null ? opt.max : Math.max(...rows.map(r => r.v));
    host.innerHTML = rows.map(r => `<div class="bar"><div class="nm">${r.label}</div>
      <div class="track"><div class="fill" style="width:0;background:${r.color || 'var(--ref)'}"></div></div>
      <div class="val">${r.v.toFixed(1)}</div></div>`).join('');
    const paint = () => $$('.fill', host).forEach((f, i) => { f.style.width = Math.max(0, Math.min(100, (rows[i].v / max) * 100)) + '%'; });
    requestAnimationFrame(paint); setTimeout(paint, 40);
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

  /* --------------------- T1 chart: fixed vs parseable --------------------- */
  (function t1chart() {
    const host = $('#t1-chart'); if (!host) return;
    let metric = 'iou2';
    function render() {
      const groups = [...D.budgets, 'pooled'].map(b => ({
        label: b === 'pooled' ? T('ui.pooled', 'Pooled') : 'N = ' + b,
        rows: ORDER.map(id => {
          const p = D.table1[b][id][metric];
          return { label: byId[id].short, fixed: p[0], parse: p[1], color: byId[id].color };
        })
      }));
      host.innerHTML = groups.map(g => `<div class="gcol"><div class="gl">${g.label}</div>${
        g.rows.map(r => `<div class="gser"><div class="gn">${r.label}</div>
          <div class="gt"><div class="gf ghost" style="width:0;background:${r.color}"></div><div class="gf" style="width:0;background:${r.color}"></div></div>
          <div class="gv">${r.fixed.toFixed(1)}</div></div>`).join('')}</div>`).join('');
      const flat = groups.flatMap(g => g.rows);
      const paint = () => $$('.gser', host).forEach((row, i) => {
        const f = $$('.gf', row);
        f[0].style.width = Math.min(100, flat[i].parse) + '%';
        f[1].style.width = Math.min(100, flat[i].fixed) + '%';
      });
      requestAnimationFrame(paint); setTimeout(paint, 40);
    }
    chips($('#t1-metric'), D.metrics.map(m => ({ label: m.label, v: m.id })), 'iou2', v => { metric = v; render(); });
    RERENDER.push(render);
  })();

  /* --------------------------- shared line chart -------------------------- */
  function lineChart(cv, xLabels, series) {
    const st = G.hidpi(cv); if (!st) return;
    const { ctx, w, h } = st;
    const L = 42, R = 16, Tp = 18, Bm = 32, iw = w - L - R, ih = h - Tp - Bm;
    const vals = series.flatMap(s => s.v);
    const hi = Math.ceil(Math.max(...vals) / 10) * 10, lo = Math.max(0, Math.floor(Math.min(...vals) / 10) * 10 - 5);
    ctx.clearRect(0, 0, w, h);
    ctx.font = '10px "JetBrains Mono", monospace'; ctx.textBaseline = 'middle';
    for (let g = 0; g <= 5; g++) {
      const v = lo + ((hi - lo) * g) / 5, y = Tp + ih - (ih * g) / 5;
      ctx.strokeStyle = 'rgba(255,255,255,.055)'; ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(w - R, y); ctx.stroke();
      ctx.fillStyle = '#5D6C77'; ctx.textAlign = 'right'; ctx.fillText(v.toFixed(0), L - 8, y);
    }
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    const n = xLabels.length - 1;
    xLabels.forEach((lab, i) => ctx.fillText(lab, L + (iw * i) / n, Tp + ih + 10));
    series.forEach(s => {
      const pts = s.v.map((val, i) => [L + (iw * i) / n, Tp + ih - ((val - lo) / (hi - lo)) * ih]);
      ctx.strokeStyle = s.color; ctx.lineWidth = 2; ctx.lineJoin = 'round';
      ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
      ctx.fillStyle = s.color; pts.forEach(p => { ctx.beginPath(); ctx.arc(p[0], p[1], 3.2, 0, 6.284); ctx.fill(); });
    });
  }
  const legendHTML = () => CFG.map(c => `<span><i style="border-color:${c.color}"></i>${c.short}</span>`).join('');

  /* ---------------------------- budget curve ------------------------------ */
  (function curve() {
    const cv = $('#ex-curve'); if (!cv) return;
    $('#ex-legend').innerHTML = legendHTML();
    let metric = 'iou2';
    const draw = () => lineChart(cv, D.budgets.map(n => 'N=' + n),
      CFG.map(c => ({ color: c.color, v: D.budgets.map(n => D.table1[n][c.id][metric][0]) })));
    chips($('#ex-metric'), D.metrics.map(m => ({ label: m.label, v: m.id })), 'iou2', v => { metric = v; draw(); });
    addEventListener('resize', draw); setTimeout(draw, 60);
  })();

  /* -------------------------- threshold profile --------------------------- */
  (function thresh() {
    const cv = $('#ex-thresh'); if (!cv) return;
    $('#ex-legend2').innerHTML = legendHTML();
    const ts = ['a10', 'a30', 'a50', 'a70', 'a90'];
    let budget = 'pooled';
    const draw = () => lineChart(cv, ['τ=.1', '.3', '.5', '.7', '.9'],
      CFG.map(c => ({ color: c.color, v: ts.map(t => D.table1[budget][c.id][t][0]) })));
    chips($('#ex-tbudget'), D.budgets.map(n => ({ label: 'N ' + n, v: String(n) })).concat([{ label: 'Pooled', key: 'ui.pooled', v: 'pooled' }]), 'pooled', v => { budget = v; draw(); });
    addEventListener('resize', draw); setTimeout(draw, 60);
  })();

  /* ------------------------------ Table 2/3 ------------------------------ */
  (function t23() {
    const t2 = $('#t2'), t3 = $('#t3');
    function render() {
      if (t2) {
        const groups = { control: T('ui.baseline', 'Baseline'), true: T('ui.truecue', 'Truthful cue'), wrong: T('ui.falsecue', 'False cue'), image: T('ui.imgev', 'Image evidence') };
        let last = null, body = `<tr><th>${T('ui.condition', 'Condition')}</th><th>N 8</th><th>N 16</th><th>N 24</th><th>${T('ui.mean', 'Mean')}</th></tr>`;
        D.cues.forEach(c => {
          if (c.group !== last) { body += `<tr class="grp"><td colspan="5">${groups[c.group]}</td></tr>`; last = c.group; }
          const col = c.group === 'wrong' || c.v[3] < 30 ? 'var(--pred)' : 'var(--ink-2)';
          body += `<tr><td>${T('cue.' + c.id, c.label)}</td>` + c.v.map((v, i) => `<td style="${i === 3 ? 'color:' + col + ';font-weight:700' : ''}">${f1(v)}</td>`).join('') + '</tr>';
        });
        t2.querySelector('tbody').innerHTML = body;
      }
      if (t3) {
        const groups = { think: T('ui.think', 'Thinking depth'), decode: T('ui.decode', 'Decoding & repeatability') };
        let last = null, body = `<tr><th>${T('ui.condition', 'Condition')}</th><th>N 8</th><th>N 16</th><th>N 24</th><th>${T('ui.mean', 'Mean')}</th></tr>`;
        D.runtime.forEach(r => {
          if (r.group !== last) { body += `<tr class="grp"><td colspan="5">${groups[r.group]}</td></tr>`; last = r.group; }
          const col = r.v[3] < 30 ? 'var(--pred)' : 'var(--ink-2)';
          body += `<tr><td>${T('rt.' + r.id, r.label)}</td>` + r.v.map((v, i) => `<td style="${i === 3 ? 'color:' + col + ';font-weight:700' : ''}">${f1(v)}</td>`).join('') + '</tr>';
          if (r.p) body += `<tr class="meanrow"><td style="padding-left:26px">${T('ui.parseonly', 'parseable-only')}</td>` + r.p.map(v => `<td class="par">${f1(v)}</td>`).join('') + '</tr>';
        });
        t3.querySelector('tbody').innerHTML = body;
      }
    }
    render(); RERENDER.push(render);
  })();

  /* ------------------------------- Table 4 ------------------------------- */
  (function t4() {
    const tbl = $('#t4'); if (!tbl) return;
    function render() {
      let body = `<tr><th>${T('ui.configuration', 'Configuration')}</th>${D.budgets.map(n => `<th colspan="3" style="text-align:center;border-left:1px solid var(--line)">N = ${n}</th>`).join('')}</tr>`
        + `<tr><th></th>${D.budgets.map(() => '<th style="border-left:1px solid var(--line)">Sel</th><th>Con</th><th>IoU</th>').join('')}</tr>`;
      D.selcon.rows.forEach(r => {
        body += `<tr${r.id === 'mean' ? ' class="meanrow"' : ''}><td><div class="mdl"><span class="swatch" style="background:${r.color}"></span><span>${r.id === 'mean' ? T('ui.mean', 'Mean') : r.label}</span></div></td>`
          + D.budgets.map(n => {
            const v = D.selcon.data[r.id][n];
            return `<td style="border-left:1px solid var(--line)">${f1(v[0])}</td><td>${f1(v[1])}</td><td style="color:var(--ink);font-weight:600">${f1(v[2])}</td>`;
          }).join('') + '</tr>';
      });
      tbl.querySelector('tbody').innerHTML = body;
    }
    render(); RERENDER.push(render);
  })();

  /* ------------------------------- Table 5 ------------------------------- */
  (function t5() {
    const tbl = $('#t5'); if (!tbl) return;
    const ax = D.slices.axes;
    function render() {
      let head = `<tr><th rowspan="2">${T('ui.configuration', 'Configuration')}</th>${ax.map(a => `<th colspan="${a.cols.length}" style="text-align:center;border-left:1px solid var(--line)">${T('slice.' + a.id, a.label)}</th>`).join('')}</tr>`;
      head += '<tr>' + ax.map(a => a.cols.map((c, i) => `<th${i === 0 ? ' style="border-left:1px solid var(--line)"' : ''}>${T('col.' + c, c)}</th>`).join('')).join('') + '</tr>';
      let body = '';
      ['gemini', 'qwen', 'doubao', 'kimi', 'qwenoff', 'mean'].forEach(id => {
        const meta = D.selcon.rows.find(r => r.id === id);
        body += `<tr${id === 'mean' ? ' class="meanrow"' : ''}><td><div class="mdl"><span class="swatch" style="background:${meta.color}"></span><span>${byId[id] ? byId[id].name : (id === 'mean' ? T('ui.mean', 'Mean') : meta.label)}</span></div></td>`
          + ax.map(a => D.slices.data[id][a.id].map((v, i) => `<td${i === 0 ? ' style="border-left:1px solid var(--line)"' : ''}>${f1(v)}</td>`).join('')).join('') + '</tr>';
      });
      tbl.querySelector('tbody').innerHTML = head + body;
    }
    render(); RERENDER.push(render);
  })();

  /* --------------------- T4 / T5 pane switch ----------------------------- */
  (function diag() {
    const host = $('#diag-tab'); if (!host) return;
    const panes = $$('[data-pane]');
    chips(host, [{ label: 'Selection vs tracing', key: 'ex.t4.title', v: 'sel' },
                 { label: 'Cohort slices', key: 'ex.t5.title', v: 'slice' }], 'sel',
      v => panes.forEach(p => { p.hidden = p.dataset.pane !== v; }));
  })();
  /* ============================ ABLATIONS ================================ */
  (function ablation() {
    const cueHost = $('#cue-bars'), grid = $('#cue-grid');
    const cue = id => D.cues.find(c => c.id === id);
    function render() {
      if (cueHost) bars(cueHost, [
        { label: T('ab.maxthink', 'Max thinking'), v: 49.0, color: '#4DE3C1' },
        { label: T('ab.base', 'Baseline prompt'), v: cue('base').v[3], color: '#4DE3C1' },
        { label: T('cue.grey', 'Greyscale'), v: cue('grey').v[3], color: '#8AB4FF' },
        { label: T('cue.half', 'Half resolution'), v: cue('half').v[3], color: '#8AB4FF' },
        { label: T('rt.off', 'Thinking off'), v: 17.4, color: '#FF6B57' },
        { label: T('cue.noimg', 'No image'), v: cue('noimg').v[3], color: '#FF6B57' }
      ], { max: 55 });

      if (grid) {
        const ids = ['base', 'S', 'C', 'SC', 'WC', 'WS', 'WSC'];
        const col = g => g === 'control' ? '#8695A1' : g === 'true' ? '#4DE3C1' : '#FF6B57';
        groupChart(grid, [0, 1, 2].map(i => ({
          label: 'N = ' + [8, 16, 24][i],
          rows: ids.map(id => { const c = cue(id); return { label: T('cue.' + id, c.label), v: c.v[i], color: col(c.group) }; })
        })), { max: 55 });
      }
    }
    render(); RERENDER.push(render);
  })();

  /* ========================== SELECTION / TRACING ======================== */
  (function selcon() {
    const host = $('#sel-chart'); if (!host) return;
    let cur = '24';
    function render() {
      const keys = ['sel.g1', 'sel.g2', 'sel.g3'];
      groupChart(host, [0, 1, 2].map(k => ({
        label: T(keys[k]),
        rows: D.selcon.rows.map(r => ({ label: r.label, v: D.selcon.data[r.id][cur][k], color: r.color }))
      })), { max: 100 });
    }
    chips($('#sel-budget'), D.budgets.map(n => ({ label: 'N ' + n, v: String(n) })), '24', v => { cur = v; render(); });
    RERENDER.push(render);
  })();

})();
