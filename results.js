/* GROUNDINGBENCH — all numbers transcribed from the paper (Tables 1–5, §3.2, §4).
   Every metric pair is [fixed, parseable-only]. Scores are 0–100. */
window.GB = (function () {
  const configs = [
    { id: 'gemini', name: 'Gemini 3.5 Flash',     short: 'Gemini',   vendor: 'Google',    color: '#4DE3C1' },
    { id: 'qwen',   name: 'Qwen 3.7 Plus',        short: 'Qwen-max', vendor: 'Alibaba',   color: '#8AB4FF' },
    { id: 'doubao', name: 'Doubao Seed-2.0-Pro',  short: 'Doubao',   vendor: 'ByteDance', color: '#FFC24B' },
    { id: 'kimi',   name: 'Kimi K2.7 Code',       short: 'Kimi',     vendor: 'Moonshot',  color: '#FF6B57' }
  ];

  const budgets = [8, 16, 24, 32, 64];
  const metrics = [
    { id: 'iou2', label: 'IoU²',    note: 'canonical target, fixed denominator' },
    { id: 'ioup', label: 'IoUp',    note: 'unreduced source part' },
    { id: 'ioun', label: 'IoUn',    note: 'fidelity-normalised' },
    { id: 'a10',  label: 'Acc@.1',  note: 'threshold accuracy' },
    { id: 'a30',  label: 'Acc@.3',  note: 'threshold accuracy' },
    { id: 'a50',  label: 'Acc@.5',  note: 'headline threshold' },
    { id: 'a70',  label: 'Acc@.7',  note: 'threshold accuracy' },
    { id: 'a90',  label: 'Acc@.9',  note: 'near-exact contour' }
  ];

  // rows: [iou2, ioup, ioun, a10, a30, a50, a70, a90] each [fixed, parseable]
  const R = (...v) => {
    const o = {};
    metrics.forEach((m, i) => { o[m.id] = v[i]; });
    return o;
  };

  const table1 = {
    8: {
      doubao: R([41.2,41.2],[41.9,41.9],[47.3,47.3],[75.0,75.0],[59.3,59.3],[43.3,43.3],[24.2,24.2],[1.7,1.7]),
      kimi:   R([38.2,38.2],[38.6,38.6],[43.6,43.6],[83.8,83.8],[63.1,63.1],[33.8,33.8],[10.1,10.1],[0.1,0.1]),
      qwen:   R([48.2,48.4],[49.1,49.2],[55.4,55.6],[81.3,81.7],[71.1,71.4],[56.0,56.2],[30.3,30.4],[1.9,1.9]),
      gemini: R([62.6,62.6],[63.6,63.6],[71.7,71.7],[93.0,93.0],[87.8,87.8],[76.0,76.0],[48.8,48.8],[8.0,8.0])
    },
    16: {
      doubao: R([46.8,46.8],[46.8,46.8],[48.7,48.7],[78.7,78.7],[65.1,65.1],[51.5,51.5],[33.4,33.4],[3.5,3.5]),
      kimi:   R([37.3,37.3],[37.3,37.3],[38.8,38.8],[82.3,82.3],[60.0,60.0],[32.9,32.9],[10.1,10.1],[0.1,0.1]),
      qwen:   R([49.7,49.9],[49.7,49.8],[51.6,51.8],[81.4,81.7],[71.5,71.8],[58.1,58.3],[33.3,33.4],[2.2,2.2]),
      gemini: R([64.7,64.9],[64.7,64.9],[67.2,67.3],[90.6,90.8],[84.6,84.8],[76.0,76.2],[59.8,59.9],[11.0,11.0])
    },
    24: {
      doubao: R([43.4,43.4],[43.3,43.3],[44.1,44.1],[76.9,76.9],[60.0,60.0],[45.6,45.6],[29.1,29.1],[2.8,2.8]),
      kimi:   R([35.9,35.9],[35.8,35.8],[36.5,36.5],[81.8,81.8],[57.9,57.9],[29.7,29.7],[7.2,7.2],[0.3,0.3]),
      qwen:   R([49.1,49.3],[49.1,49.3],[49.9,50.1],[82.1,82.5],[71.3,71.6],[56.6,56.8],[32.4,32.5],[1.7,1.7]),
      gemini: R([65.9,66.3],[65.8,66.2],[67.0,67.4],[92.0,92.6],[87.2,87.7],[79.6,80.1],[58.2,58.6],[11.0,11.1])
    },
    32: {
      doubao: R([44.4,44.4],[44.3,44.3],[44.8,44.8],[77.1,77.2],[61.2,61.2],[46.8,46.8],[30.6,30.6],[3.0,3.0]),
      kimi:   R([33.7,34.0],[33.7,33.9],[34.1,34.3],[78.5,79.1],[55.3,55.7],[26.8,27.0],[6.5,6.6],[0.2,0.2]),
      qwen:   R([48.6,48.8],[48.6,48.8],[49.1,49.2],[81.4,81.7],[71.3,71.5],[56.7,56.9],[30.9,31.0],[1.9,1.9]),
      gemini: R([57.8,63.3],[57.8,63.2],[58.4,63.9],[80.8,88.4],[76.4,83.6],[69.4,75.9],[49.8,54.5],[10.0,10.9])
    },
    64: {
      doubao: R([37.6,41.6],[37.5,41.6],[37.8,41.8],[69.3,76.7],[54.6,60.5],[39.5,43.8],[21.3,23.6],[1.7,1.9]),
      kimi:   R([24.4,30.2],[24.4,30.2],[24.5,30.4],[58.3,72.1],[38.5,47.6],[18.9,23.4],[5.1,6.3],[0.0,0.0]),
      qwen:   R([38.5,44.9],[38.5,44.9],[38.7,45.2],[68.8,80.3],[56.3,65.7],[42.5,49.6],[22.7,26.5],[1.1,1.2]),
      gemini: R([37.7,63.4],[37.7,63.4],[37.9,63.7],[52.8,88.9],[49.4,83.2],[44.8,75.4],[33.6,56.6],[7.6,12.8])
    },
    pooled: {
      doubao: R([42.7,43.5],[42.8,43.6],[44.5,45.4],[75.4,76.9],[60.1,61.3],[45.3,46.3],[27.7,28.3],[2.5,2.6]),
      kimi:   R([33.9,35.3],[34.0,35.4],[35.5,37.0],[76.9,80.1],[55.0,57.2],[28.4,29.6],[7.8,8.1],[0.1,0.2]),
      qwen:   R([46.8,48.4],[47.0,48.5],[48.9,50.5],[79.0,81.6],[68.3,70.5],[54.0,55.7],[29.9,30.9],[1.8,1.8]),
      gemini: R([57.7,64.2],[57.9,64.3],[60.4,67.1],[81.8,90.9],[77.1,85.6],[69.2,76.8],[50.0,55.6],[9.5,10.6]),
      mean:   R([45.3,47.9],[45.4,48.0],[47.3,50.0],[78.3,82.4],[65.1,68.7],[49.2,52.1],[28.9,30.7],[3.5,3.8])
    }
  };

  // Table 2 — prompt cues & image evidence (fixed IoU, Qwen grid). [N8, N16, N24, mean]
  const cues = [
    { id: 'base', label: 'Baseline prompt',    group: 'control', v: [47.8, 49.3, 48.2, 48.4] },
    { id: 'S',    label: 'True spatial',      group: 'true',    v: [45.5, 47.2, 48.5, 47.1] },
    { id: 'C',    label: 'True colour',       group: 'true',    v: [45.3, 46.5, 45.4, 45.7] },
    { id: 'SC',   label: 'Both true',         group: 'true',    v: [44.7, 46.9, 45.8, 45.8] },
    { id: 'WC',   label: 'Wrong colour',      group: 'wrong',   v: [38.5, 39.4, 39.6, 39.2] },
    { id: 'WS',   label: 'Wrong spatial',     group: 'wrong',   v: [22.6, 24.6, 25.8, 24.3] },
    { id: 'WSC',  label: 'Both wrong',        group: 'wrong',   v: [20.6, 22.6, 23.2, 22.1] },
    { id: 'grey', label: 'Greyscale',         group: 'image',   v: [46.8, 48.2, 47.5, 47.5] },
    { id: 'half', label: 'Half resolution',   group: 'image',   v: [42.4, 41.6, 42.5, 42.2] },
    { id: 'noimg',label: 'No image',          group: 'image',   v: [14.1, 13.2, 13.3, 13.5] }
  ];

  // Table 3 — thinking, decoding, repeatability. p = parseable-only.
  const runtime = [
    { id: 'max',   label: 'Max thinking',      group: 'think',  v: [48.2, 49.7, 49.1, 49.0], p: [48.4, 49.9, 49.3, 49.2] },
    { id: 'med',   label: 'Medium thinking',   group: 'think',  v: [48.0, 49.0, 47.4, 48.1], p: [48.7, 49.2, 49.7, 49.2] },
    { id: 'off',   label: 'Thinking off',      group: 'think',  v: [20.5, 14.7, 17.0, 17.4], p: [27.0, 18.7, 19.4, 21.7] },
    { id: 't0',    label: 'Temperature 0',     group: 'decode', v: [48.2, 49.7, 49.1, 49.0] },
    { id: 't05',   label: 'Temperature 0.5',   group: 'decode', v: [47.2, 48.6, 50.9, 48.9] },
    { id: 't10',   label: 'Temperature 1.0',   group: 'decode', v: [45.9, 50.5, 49.2, 48.5] },
    { id: 'rep',   label: 'Independent repeat',group: 'decode', v: [46.7, 49.1, 49.9, 48.6] }
  ];

  // Table 4 — selection / tracing, best-effort view. per budget: [Sel, Con, IoU]
  const selcon = {
    rows: [
      { id: 'doubao',  label: 'Doubao',   color: '#FFC24B' },
      { id: 'kimi',    label: 'Kimi',     color: '#FF6B57' },
      { id: 'qwenoff', label: 'Qwen-off', color: '#5C6C78' },
      { id: 'qwen',    label: 'Qwen-max', color: '#8AB4FF' },
      { id: 'gemini',  label: 'Gemini',   color: '#4DE3C1' },
      { id: 'mean',    label: 'Mean',     color: '#8695A1' }
    ],
    data: {
      doubao:  { 8:[76.9,53.9,41.2], 16:[80.5,57.7,46.8], 24:[78.7,54.5,43.4], 32:[80.0,54.9,44.4], 64:[71.2,52.0,37.6] },
      kimi:    { 8:[85.5,44.6,38.2], 16:[84.7,43.3,37.3], 24:[83.5,42.1,35.9], 32:[80.9,40.8,33.7], 64:[60.7,38.5,24.4] },
      qwenoff: { 8:[60.9,33.8,20.5], 16:[62.6,23.4,14.7], 24:[68.7,24.2,17.0], 32:[71.3,25.6,18.8], 64:[3.8,25.8,1.0] },
      qwen:    { 8:[85.2,57.5,48.2], 16:[86.5,57.6,49.7], 24:[85.7,57.4,49.1], 32:[85.9,56.7,48.6], 64:[70.5,54.1,38.5] },
      gemini:  { 8:[94.2,68.1,62.6], 16:[92.4,70.8,64.7], 24:[93.4,71.3,65.9], 32:[86.0,70.1,59.5], 64:[62.2,67.7,41.9] },
      mean:    { 8:[80.5,51.6,42.1], 16:[81.3,50.6,42.7], 24:[82.0,49.9,42.2], 32:[80.8,49.6,41.0], 64:[53.7,47.6,28.7] }
    }
  };

  // Table 5 — pooled fixed-IoU slices
  const slices = {
    axes: [
      { id: 'diff',  label: 'Composite difficulty', cols: ['Easy', 'Medium', 'Hard'], counts: [436, 554, 510] },
      { id: 'D',     label: 'Distractors D',        cols: ['D1', 'D2', 'D3+'],        counts: [705, 276, 519] },
      { id: 'Q',     label: 'Contour complexity Q', cols: ['Q1', 'Q2', 'Q3'] },
      { id: 'RS',    label: 'Relative scale RS',    cols: ['RS1', 'RS2', 'RS3'] },
      { id: 'group', label: 'Semantic group',       cols: ['Animal', 'Food', 'Indoor', 'Outdoor', 'Person', 'Vehicle'] }
    ],
    data: {
      doubao:  { diff:[50.7,43.0,35.4], D:[45.9,40.5,39.4], Q:[46.5,44.5,35.9], RS:[37.0,42.9,49.8], group:[42.8,41.9,39.9,37.6,46.7,44.9] },
      kimi:    { diff:[42.5,33.7,26.8], D:[36.3,33.1,31.0], Q:[39.6,33.8,26.5], RS:[29.3,34.2,39.6], group:[32.3,34.1,35.0,30.6,33.9,36.5] },
      qwenoff: { diff:[17.5,13.7,12.5], D:[15.9,13.8,12.7], Q:[15.3,14.0,13.6], RS:[12.6,14.6,16.5], group:[17.3,13.9,11.9,12.8,15.6,14.1] },
      qwen:    { diff:[55.6,46.4,39.8], D:[50.3,45.7,42.6], Q:[52.2,46.9,39.6], RS:[42.9,47.3,51.5], group:[46.7,48.1,45.5,42.7,46.4,50.3] },
      gemini:  { diff:[65.1,58.1,51.0], D:[61.8,57.6,52.3], Q:[63.4,57.8,50.2], RS:[54.2,58.8,61.4], group:[63.4,59.3,53.6,59.4,57.4,61.3] },
      mean:    { diff:[46.3,39.0,33.1], D:[42.0,38.2,35.6], Q:[43.4,39.4,33.2], RS:[35.2,39.6,43.8], group:[40.5,39.5,37.2,36.6,40.0,41.4] }
    }
  };

  // §3.1 / §3.3 — construction fidelity C_N (higher = less approximation loss)
  const fidelity = { 8: 88.6, 16: 96.2, 24: 98.3, 32: 99.0, 64: 99.4 };

  const facts = {
    questions: 1500,
    sources: [
      { id: 'refcoco',  label: 'RefCOCO',   n: 500 },
      { id: 'refcocop', label: 'RefCOCO+',  n: 500 },
      { id: 'refcocog', label: 'RefCOCOg',  n: 500 }
    ],
    boxIoU: 88.2, boxAcc50: 97.1, polyIoU: 57.7, polyAcc50: 69.2,
    boxDerived: 57.3,
    collected: '10–17 July 2026',
    maxSide: 1024,
    multiPart: 148, multiPartCoverage: 71.76, multiPartLargest: 85.14,
    longestLegalAnswer: 520, tightestAllowance: 1280,
    legal64Coverage: 7.5, legal64IoU: 4.2
  };

  return { configs, budgets, metrics, table1, cues, runtime, selcon, slices, fidelity, facts };
})();
