/* NICS Vision Geo: our own inference engine for GeoNet, plain JavaScript, no libraries.
 * Runs entirely on the device: the photo never leaves the phone.
 * Model files: geo-model.json (layers, classes, texts) + geo-model.bin (float16 weights,
 * BatchNorm already folded), exported by nics-ai-lab scripts/geo_export_web.py.
 * Tensors are Float32Array in CHW order. */
(function (root) {
  "use strict";

  function f16ToF32(u16) {
    var out = new Float32Array(u16.length);
    for (var i = 0; i < u16.length; i++) {
      var h = u16[i], s = (h & 0x8000) ? -1 : 1, e = (h >> 10) & 0x1f, f = h & 0x3ff;
      out[i] = e === 0 ? s * Math.pow(2, -14) * (f / 1024)
        : e === 31 ? (f ? NaN : s * Infinity)
        : s * Math.pow(2, e - 15) * (1 + f / 1024);
    }
    return out;
  }

  function silu(x) { return x / (1 + Math.exp(-x)); }
  function sigmoid(x) { return 1 / (1 + Math.exp(-x)); }

  // General convolution (used for the 3x3 stem and depthwise layers; 1x1 has a fast path)
  function conv(x, c, h, w, L, W) {
    var k = L.k, s = L.s, p = L.p, g = L.g, cout = L.cout, cin = L.cin;
    var ho = Math.floor((h + 2 * p - k) / s) + 1, wo = Math.floor((w + 2 * p - k) / s) + 1;
    var out = new Float32Array(cout * ho * wo);
    var wt = W(L.w), bias = W(L.b);
    var cinG = cin / g, coutG = cout / g;
    if (k === 1 && s === 1 && g === 1) {
      var hw = h * w;
      for (var co = 0; co < cout; co++) {
        var o = co * hw, bv = bias[co];
        for (var j = 0; j < hw; j++) out[o + j] = bv;
        for (var ci = 0; ci < cin; ci++) {
          var wv = wt[co * cin + ci];
          if (wv === 0) continue;
          var ii = ci * hw;
          for (var j2 = 0; j2 < hw; j2++) out[o + j2] += wv * x[ii + j2];
        }
      }
    } else {
      for (var co2 = 0; co2 < cout; co2++) {
        var grp = Math.floor(co2 / coutG), ob = co2 * ho * wo, b2 = bias[co2];
        for (var oy = 0; oy < ho; oy++) {
          for (var ox = 0; ox < wo; ox++) {
            var acc = b2;
            for (var cg = 0; cg < cinG; cg++) {
              var cidx = grp * cinG + cg, xb = cidx * h * w, wb = ((co2 * cinG) + cg) * k * k;
              for (var ky = 0; ky < k; ky++) {
                var iy = oy * s - p + ky;
                if (iy < 0 || iy >= h) continue;
                for (var kx = 0; kx < k; kx++) {
                  var ix = ox * s - p + kx;
                  if (ix < 0 || ix >= w) continue;
                  acc += wt[wb + ky * k + kx] * x[xb + iy * w + ix];
                }
              }
            }
            out[ob + oy * wo + ox] = acc;
          }
        }
      }
    }
    if (L.act) for (var t = 0; t < out.length; t++) out[t] = silu(out[t]);
    return { x: out, c: cout, h: ho, w: wo };
  }

  function se(t, S, W) {
    var c = t.c, hw = t.h * t.w, x = t.x, mean = new Float32Array(c);
    for (var ch = 0; ch < c; ch++) { var sum = 0, o = ch * hw; for (var j = 0; j < hw; j++) sum += x[o + j]; mean[ch] = sum / hw; }
    var w1 = W(S.w1), b1 = W(S.b1), w2 = W(S.w2), b2 = W(S.b2), mid = S.mid, z = new Float32Array(mid);
    for (var m = 0; m < mid; m++) { var a = b1[m]; for (var k = 0; k < c; k++) a += w1[m * c + k] * mean[k]; z[m] = silu(a); }
    for (var ch2 = 0; ch2 < c; ch2++) {
      var a2 = b2[ch2]; for (var m2 = 0; m2 < mid; m2++) a2 += w2[ch2 * mid + m2] * z[m2];
      var g = sigmoid(a2), o2 = ch2 * hw;
      for (var j2 = 0; j2 < hw; j2++) x[o2 + j2] *= g;
    }
    return t;
  }

  function Model(meta, buffer) {
    this.meta = meta;
    var all = f16ToF32(new Uint16Array(buffer));
    this.W = function (ref) { return all.subarray(ref.o, ref.o + ref.n); };
  }

  // x: Float32Array 3*S*S normalised CHW -> logits Float32Array
  Model.prototype.logits = function (x, size) {
    var sp = this.meta.spec, W = this.W;
    var t = conv(x, 3, size, size, sp.stem, W);
    for (var i = 0; i < sp.blocks.length; i++) {
      var B = sp.blocks[i], inp = t, y = t;
      if (B.expand) y = conv(y.x, y.c, y.h, y.w, B.expand, W);
      y = conv(y.x, y.c, y.h, y.w, B.dw, W);
      y = se(y, B.se, W);
      y = conv(y.x, y.c, y.h, y.w, B.proj, W);
      if (B.skip) for (var j = 0; j < y.x.length; j++) y.x[j] += inp.x[j];
      t = y;
    }
    t = conv(t.x, t.c, t.h, t.w, sp.neck, W);
    var c = t.c, hw = t.h * t.w, f = new Float32Array(c);
    for (var ch = 0; ch < c; ch++) { var s = 0; for (var q = 0; q < hw; q++) s += t.x[ch * hw + q]; f[ch] = s / hw; }
    var L = sp.cls, w = W(L.w), b = W(L.b), out = new Float32Array(L.out);
    for (var o = 0; o < L.out; o++) { var a = b[o]; for (var k = 0; k < L.in; k++) a += w[o * L.in + k] * f[k]; out[o] = a; }
    return out;
  };

  // Bilinear resize of a CHW tensor, same as torch F.interpolate(mode="bilinear", align_corners=False)
  function resize(x, c, h, w, H, Wd) {
    var out = new Float32Array(c * H * Wd), sy = h / H, sx = w / Wd;
    for (var oy = 0; oy < H; oy++) {
      var fy = Math.max(0, (oy + 0.5) * sy - 0.5), y0 = Math.floor(fy), y1 = Math.min(y0 + 1, h - 1), dy = fy - y0;
      for (var ox = 0; ox < Wd; ox++) {
        var fx = Math.max(0, (ox + 0.5) * sx - 0.5), x0 = Math.floor(fx), x1 = Math.min(x0 + 1, w - 1), dx = fx - x0;
        for (var ch = 0; ch < c; ch++) {
          var b = ch * h * w;
          var v = (1 - dy) * ((1 - dx) * x[b + y0 * w + x0] + dx * x[b + y0 * w + x1]) +
            dy * ((1 - dx) * x[b + y1 * w + x0] + dx * x[b + y1 * w + x1]);
          out[ch * H * Wd + oy * Wd + ox] = v;
        }
      }
    }
    return out;
  }

  // Same as torch.rot90(x.flip(3) if flip else x, k, dims=(2, 3)): optional horizontal flip, then k
  // counter-clockwise quarter turns (out[i][j] = in[j][n-1-i] per turn)
  function view(x, c, n, k, flip) {
    var cur = x, nn = n * n;
    if (flip) {
      cur = new Float32Array(x.length);
      for (var ch = 0; ch < c; ch++) for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) cur[ch * nn + i * n + j] = x[ch * nn + i * n + (n - 1 - j)];
    }
    for (var r = 0; r < k; r++) {
      var nx = new Float32Array(x.length);
      for (var ch2 = 0; ch2 < c; ch2++) for (var i2 = 0; i2 < n; i2++) for (var j2 = 0; j2 < n; j2++) nx[ch2 * nn + i2 * n + j2] = cur[ch2 * nn + j2 * n + (n - 1 - i2)];
      cur = nx;
    }
    return cur === x ? new Float32Array(x) : cur;
  }

  // rgba: Uint8ClampedArray of a cache_size x cache_size square image -> {class: probability}
  Model.prototype.classify = function (rgba, views) {
    var m = this.meta, S = m.cache_size, N = m.image_size, x = new Float32Array(3 * S * S);
    for (var i = 0; i < S * S; i++) for (var ch = 0; ch < 3; ch++) x[ch * S * S + i] = (rgba[i * 4 + ch] / 255 - m.mean[ch]) / m.std[ch];
    var base = resize(x, 3, S, S, N, N), acc = new Float32Array(m.classes.length);
    var vs = views || [[0, false], [1, false], [2, false], [3, false]];
    for (var v = 0; v < vs.length; v++) {
      var lg = this.logits(view(base, 3, N, vs[v][0], vs[v][1]), N);
      for (var q = 0; q < acc.length; q++) acc[q] += lg[q] / vs.length;
    }
    var mx = -Infinity; for (q = 0; q < acc.length; q++) mx = Math.max(mx, acc[q] / m.temperature);
    var sum = 0, p = new Float32Array(acc.length);
    for (q = 0; q < acc.length; q++) { p[q] = Math.exp(acc[q] / m.temperature - mx); sum += p[q]; }
    var res = {}; for (q = 0; q < acc.length; q++) res[m.classes[q]] = p[q] / sum;
    return res;
  };

  // Same rules as nics.geo.advisor.answer
  function answer(meta, probs, lang) {
    var T = meta.texts, A = T.answer[lang] || T.answer.en;
    var ranked = Object.keys(probs).map(function (k) { return [k, probs[k]]; }).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 3);
    var nm = function (k) { return T.classes[k][lang] || T.classes[k].en; };
    var low = function (s) { return lang === "ru" ? s.toLowerCase() : s; };
    var pct = function (p) { return Math.round(p * 100); };
    var top = ranked[0], level;
    if (top[1] < T.abstain) level = "abstain";
    else level = top[1] >= T.sure ? "sure" : top[1] >= T.maybe ? "maybe" : "unsure";
    var headline = level === "abstain" ? A.abstain : A[level].replace("{name}", low(nm(top[0]))).replace("{p}", pct(top[1]));
    var alts = ranked.slice(1).filter(function (r) { return r[1] >= 0.05; }).map(function (r) { return low(nm(r[0])) + " (" + pct(r[1]) + " %)"; });
    var tests = [];
    ranked.slice(0, 2).forEach(function (r) {
      if (r[1] < 0.10) return;
      T.classes[r[0]].tests.forEach(function (tk) {
        var t = T.tests[tk][lang] || T.tests[tk].en, line = nm(r[0]) + ": " + t.charAt(0).toLowerCase() + t.slice(1);
        if (tests.indexOf(line) < 0) tests.push(line);
      });
    });
    var means = top[1] >= T.maybe ? T.classes[top[0]].indicates.map(function (k) { return T.indicators[k][lang] || T.indicators[k].en; }) : [];
    var cautions = [];
    ranked.slice(0, 2).forEach(function (r) {
      if (r[1] < 0.10) return;
      T.classes[r[0]].caution.forEach(function (ck) { var c = T.cautions[ck][lang] || T.cautions[ck].en; if (cautions.indexOf(c) < 0) cautions.push(c); });
    });
    return { level: level, headline: headline, retake: level === "abstain" ? A.retake : "", alts: alts.length ? A.alts.replace("{alts}", alts.join(", ")) : "",
      tests: tests, means: means, cautions: cautions, limit: A.limit, labels: { check: A.check, means: A.means, caution: A.caution },
      top: ranked.map(function (r) { return { key: r[0], name: nm(r[0]), p: r[1] }; }) };
  }

  var api = { Model: Model, answer: answer, resize: resize, view: view, f16ToF32: f16ToF32 };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.NicsGeo = api;
})(typeof self !== "undefined" ? self : this);
