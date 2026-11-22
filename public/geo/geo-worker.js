/* NICS Vision Geo: runs the model in a background thread so the screen never freezes. */
importScripts("geo-engine.js?v=1");
var model = null;
self.onmessage = function (e) {
  var d = e.data;
  try {
    if (d.type === "load") {
      model = new self.NicsGeo.Model(d.meta, d.buffer);
      self.postMessage({ type: "ready" });
    } else if (d.type === "classify") {
      var t = Date.now();
      var probs = model.classify(new Uint8ClampedArray(d.rgba), d.views);
      self.postMessage({ type: "result", id: d.id, probs: probs, ms: Date.now() - t });
    }
  } catch (err) {
    self.postMessage({ type: "error", id: d.id, message: String(err && err.message || err) });
  }
};
