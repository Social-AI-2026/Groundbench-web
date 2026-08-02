/* Geometry kit: source contours, Algorithm 1 (exact-N construction), raster IoU, drawing. */
window.GEO = (function () {

  /* ---- source contours -------------------------------------------------- */
  // Smooth closed curve from a harmonic sum. Returns V densely-sampled points
  // in a 0..1 box. Deterministic per seed.
  function contour(seed, V) {
    V = V || 260;
    const rnd = mulberry(seed);
    const harm = [];
    for (let k = 2; k <= 7; k++) harm.push({ k, a: (rnd() - 0.5) * (0.30 / (k - 0.6)), p: rnd() * Math.PI * 2 });
    const pts = [];
    for (let i = 0; i < V; i++) {
      const t = (i / V) * Math.PI * 2;
      let r = 0.34;
      for (const h of harm) r += h.a * Math.cos(h.k * t + h.p);
      pts.push([0.5 + r * Math.cos(t) * 1.18, 0.5 + r * Math.sin(t) * 0.98]);
    }
    return normalise(pts);
  }

  function mulberry(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function normalise(pts, pad) {
    pad = pad == null ? 0.07 : pad;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const p of pts) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); }
    const s = (1 - 2 * pad) / Math.max(x1 - x0, y1 - y0);
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    return pts.map(p => [0.5 + (p[0] - cx) * s, 0.5 + (p[1] - cy) * s]);
  }

  /* ---- corner-aware smoothing -------------------------------------------
     Centripetal Catmull-Rom through the control points, except where the
     contour genuinely turns a corner (a bus roofline, a wing tip, an ear).
     Those vertices keep their crease; everything else becomes a curve, so a
     silhouette reads as an object rather than a coarse polygon. */
  function spline(pts, seg, keepDeg) {
    seg = seg || 6;
    const n = pts.length, keepCos = Math.cos((keepDeg == null ? 58 : keepDeg) * Math.PI / 180);
    const sharp = pts.map((p, i) => {
      const a = pts[(i - 1 + n) % n], c = pts[(i + 1) % n];
      const ux = p[0] - a[0], uy = p[1] - a[1], vx = c[0] - p[0], vy = c[1] - p[1];
      const lu = Math.hypot(ux, uy) || 1e-9, lv = Math.hypot(vx, vy) || 1e-9;
      return (ux * vx + uy * vy) / (lu * lv) < keepCos;
    });
    const mirror = (a, b) => [2 * a[0] - b[0], 2 * a[1] - b[1]];
    const out = [];
    for (let i = 0; i < n; i++) {
      const p1 = pts[i], p2 = pts[(i + 1) % n];
      const p0 = sharp[i] ? mirror(p1, p2) : pts[(i - 1 + n) % n];
      const p3 = sharp[(i + 1) % n] ? mirror(p2, p1) : pts[(i + 2) % n];
      const t = [0, 0, 0, 0];
      const step = (a, b) => Math.max(1e-6, Math.pow(Math.hypot(b[0] - a[0], b[1] - a[1]), 0.5));
      t[1] = t[0] + step(p0, p1); t[2] = t[1] + step(p1, p2); t[3] = t[2] + step(p2, p3);
      for (let s = 0; s < seg; s++) {
        const tt = t[1] + (t[2] - t[1]) * (s / seg);
        const A1 = mix(p0, p1, (t[1] - tt) / (t[1] - t[0]), (tt - t[0]) / (t[1] - t[0]));
        const A2 = mix(p1, p2, (t[2] - tt) / (t[2] - t[1]), (tt - t[1]) / (t[2] - t[1]));
        const A3 = mix(p2, p3, (t[3] - tt) / (t[3] - t[2]), (tt - t[2]) / (t[3] - t[2]));
        const B1 = mix(A1, A2, (t[2] - tt) / (t[2] - t[0]), (tt - t[0]) / (t[2] - t[0]));
        const B2 = mix(A2, A3, (t[3] - tt) / (t[3] - t[1]), (tt - t[1]) / (t[3] - t[1]));
        out.push(mix(B1, B2, (t[2] - tt) / (t[2] - t[1]), (tt - t[1]) / (t[2] - t[1])));
      }
    }
    return out;
  }

  const mix = (a, b, wa, wb) => [a[0] * wa + b[0] * wb, a[1] * wa + b[1] * wb];

  /* ---- Algorithm 1: canonical exact-N target ---------------------------- */
  const _exc = new WeakMap();
  function exactN(src, N) {
    let m = _exc.get(src);
    if (!m) { m = new Map(); _exc.set(src, m); }
    const hit = m.get(N);
    if (hit) return hit.map(p => p.slice());
    const C = _exactN(src, N);
    m.set(N, C.map(p => p.slice()));
    return C;
  }

  function _exactN(src, N) {
    const C = src.map(p => p.slice());
    while (C.length < N) {
      let k = 0, best = -1;
      for (let j = 0; j < C.length; j++) {
        const q = C[(j + 1) % C.length];
        const d = Math.hypot(q[0] - C[j][0], q[1] - C[j][1]);
        if (d > best) { best = d; k = j; }
      }
      const q = C[(k + 1) % C.length];
      C.splice(k + 1, 0, [(C[k][0] + q[0]) / 2, (C[k][1] + q[1]) / 2]);
    }
    while (C.length > N) {
      let k = 0, best = Infinity;
      for (let j = 0; j < C.length; j++) {
        const a = C[(j - 1 + C.length) % C.length], b = C[j], c = C[(j + 1) % C.length];
        const area = Math.abs((a[0] - b[0]) * (c[1] - b[1]) - (a[1] - b[1]) * (c[0] - b[0])) / 2;
        if (area < best) { best = area; k = j; }
      }
      C.splice(k, 1);
    }
    return C;
  }

  /* ---- a plausible model prediction ------------------------------------- */
  // Degrades with N the way the paper reports: fine at moderate budgets,
  // drifting and self-tangling at the densest one.
  function predict(target, N, quality) {
    const q = quality == null ? 0.75 : quality;
    const rnd = mulberry(N * 977 + Math.round(q * 1000));
    const c = centroid(target);
    const drift = 0.012 + 0.055 * Math.max(0, (N - 24) / 40) + (1 - q) * 0.06;
    return target.map((p, i) => {
      const wob = Math.sin(i * 1.7 + N) * 0.4 + (rnd() - 0.5);
      const sx = 1 + (rnd() - 0.5) * 0.05 * (1 - q);
      return [
        c[0] + (p[0] - c[0]) * sx + wob * drift,
        c[1] + (p[1] - c[1]) * sx + (rnd() - 0.5) * drift * 1.6
      ];
    });
  }

  function centroid(pts) {
    let x = 0, y = 0;
    for (const p of pts) { x += p[0]; y += p[1]; }
    return [x / pts.length, y / pts.length];
  }

  function bbox(pts) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const p of pts) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); }
    return [x0, y0, x1, y1];
  }

  // Uniformly sample a rectangle's perimeter into an exact-N polygon (the
  // paper's box→polygon matched control).
  function boxToPoly(box, N) {
    const [x0, y0, x1, y1] = box;
    const w = x1 - x0, h = y1 - y0, per = 2 * (w + h);
    const out = [];
    for (let i = 0; i < N; i++) {
      let d = (i / N) * per;
      if (d < w) out.push([x0 + d, y0]);
      else if (d < w + h) out.push([x1, y0 + (d - w)]);
      else if (d < 2 * w + h) out.push([x1 - (d - w - h), y1]);
      else out.push([x0, y1 - (d - 2 * w - h)]);
    }
    return out;
  }

  /* ---- rasterised IoU ---------------------------------------------------- */
  let _ca, _cb;
  function iou(a, b, res) {
    res = res || 220;
    if (!_ca) { _ca = document.createElement('canvas'); _cb = document.createElement('canvas'); }
    _ca.width = _cb.width = res; _ca.height = _cb.height = res;
    const A = _ca.getContext('2d', { willReadFrequently: true });
    const B = _cb.getContext('2d', { willReadFrequently: true });
    fill(A, a, res); fill(B, b, res);
    const da = A.getImageData(0, 0, res, res).data, db = B.getImageData(0, 0, res, res).data;
    let inter = 0, uni = 0;
    for (let i = 3; i < da.length; i += 4) {
      const x = da[i] > 127, y = db[i] > 127;
      if (x && y) inter++;
      if (x || y) uni++;
    }
    return uni ? inter / uni : 0;
  }

  function fill(ctx, pts, res) {
    ctx.clearRect(0, 0, res, res);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(p[0] * res, p[1] * res) : ctx.moveTo(p[0] * res, p[1] * res)));
    ctx.closePath();
    ctx.fill();
  }

  /* ---- drawing ----------------------------------------------------------- */
  function path(ctx, pts, W, H, ox, oy, keep) {
    ox = ox || 0; oy = oy || 0;
    if (!keep) ctx.beginPath();
    pts.forEach((p, i) => {
      const x = ox + p[0] * W, y = oy + p[1] * H;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.closePath();
  }

  function drawPoly(ctx, pts, W, H, o) {
    o = o || {};
    path(ctx, pts, W, H, o.ox, o.oy);
    if (o.fill) { ctx.fillStyle = o.fill; ctx.fill(); }
    if (o.stroke) {
      ctx.strokeStyle = o.stroke; ctx.lineWidth = o.width || 1.6;
      ctx.lineJoin = 'round'; ctx.setLineDash(o.dash || []);
      ctx.stroke(); ctx.setLineDash([]);
    }
    if (o.vertex) {
      ctx.fillStyle = o.vertexFill || o.stroke;
      const r = o.vertexR || 2.6;
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc((o.ox || 0) + p[0] * W, (o.oy || 0) + p[1] * H, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function drawBox(ctx, box, W, H, o) {
    o = o || {};
    const ox = o.ox || 0, oy = o.oy || 0;
    const x = ox + box[0] * W, y = oy + box[1] * H, w = (box[2] - box[0]) * W, h = (box[3] - box[1]) * H;
    if (o.fill) { ctx.fillStyle = o.fill; ctx.fillRect(x, y, w, h); }
    ctx.strokeStyle = o.stroke || '#FFC24B';
    ctx.lineWidth = o.width || 1.4;
    ctx.setLineDash(o.dash || []);
    ctx.strokeRect(x, y, w, h);
    ctx.setLineDash([]);
    if (o.corners) {
      ctx.fillStyle = o.stroke || '#FFC24B';
      [[x, y], [x + w, y], [x + w, y + h], [x, y + h]].forEach(c => ctx.fillRect(c[0] - 2.5, c[1] - 2.5, 5, 5));
    }
  }

  // The square region every referent is drawn into. Painted as a lightened
  // "image plate" — a soft plane, a fine grid, a border and corner ticks — so
  // the source silhouette reads as sitting on a photo rather than on black.
  function plate(ctx, ox, oy, size, n) {
    n = n || 10;
    const g = ctx.createLinearGradient(ox, oy, ox, oy + size);
    g.addColorStop(0, '#1B2126'); g.addColorStop(0.55, '#151A1E'); g.addColorStop(1, '#101417');
    ctx.fillStyle = g; ctx.fillRect(ox, oy, size, size);
    const v = ctx.createRadialGradient(ox + size / 2, oy + size * 0.42, size * 0.12, ox + size / 2, oy + size / 2, size * 0.78);
    v.addColorStop(0, 'rgba(255,255,255,.05)'); v.addColorStop(1, 'rgba(0,0,0,.22)');
    ctx.fillStyle = v; ctx.fillRect(ox, oy, size, size);
    ctx.strokeStyle = 'rgba(255,255,255,.05)'; ctx.lineWidth = 1;
    for (let k = 1; k < n; k++) {
      const p = Math.round(ox + (size * k) / n) + 0.5, q = Math.round(oy + (size * k) / n) + 0.5;
      ctx.beginPath(); ctx.moveTo(p, oy); ctx.lineTo(p, oy + size); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ox, q); ctx.lineTo(ox + size, q); ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(255,255,255,.17)';
    ctx.strokeRect(Math.round(ox) + 0.5, Math.round(oy) + 0.5, size - 1, size - 1);
    ctx.strokeStyle = 'rgba(255,255,255,.34)'; ctx.lineWidth = 1.4;
    const t = Math.max(10, size * 0.045);
    [[ox, oy, 1, 1], [ox + size, oy, -1, 1], [ox + size, oy + size, -1, -1], [ox, oy + size, 1, -1]].forEach(c => {
      ctx.beginPath();
      ctx.moveTo(c[0] + c[2] * t, c[1]); ctx.lineTo(c[0], c[1]); ctx.lineTo(c[0], c[1] + c[3] * t);
      ctx.stroke();
    });
  }

  // Pins the CSS box, then matches the backing store to devicePixelRatio.
  // Only touches canvas.width/height when the box actually changed, so the
  // per-frame path is a cheap clearRect rather than a full canvas reset.
  function hidpi(canvas) {
    const r = window.devicePixelRatio || 1;
    const b = canvas.getBoundingClientRect();
    if (!b.width) return null;
    const w = Math.round(b.width), h = Math.round(b.height);
    if (canvas._gw !== w || canvas._gh !== h || canvas._gr !== r) {
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      canvas.width = Math.round(w * r);
      canvas.height = Math.round(h * r);
      canvas._gw = w; canvas._gh = h; canvas._gr = r;
    }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(r, 0, 0, r, 0, 0);
    return { ctx, w, h };
  }

  function lerpPoly(a, b, t) {
    return a.map((p, i) => [p[0] + (b[i][0] - p[0]) * t, p[1] + (b[i][1] - p[1]) * t]);
  }

  const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  return { contour, exactN, spline, predict, centroid, bbox, boxToPoly, iou, drawPoly, drawBox, path, plate, hidpi, lerpPoly, ease, normalise, mulberry };
})();
