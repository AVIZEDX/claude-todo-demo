/* CUTLINE motion helpers: every helper adds tweens to a paused GSAP timeline at an absolute time.
   Durations and eases mirror frame.md `motion`. Seek-safe: only fromTo/to on the given timeline. */
(function () {
  const E = { snap: "expo.out", settle: "back.out(1.7)", push: "power4.inOut", drift: "sine.inOut", draw: "power2.inOut" };
  const D = { micro: 0.18, enter: 0.42, move: 0.6, push: 0.8 };

  // Wrap each word of an element in a mask so it can Rise. Call once at build time.
  function splitWords(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = "";
    return words.map((w, i) => {
      const m = document.createElement("span");
      m.className = "cl-mask";
      const s = document.createElement("span");
      s.className = "cl-word";
      s.textContent = w;
      m.appendChild(s);
      el.appendChild(m);
      if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
      return s;
    });
  }

  const Cutline = {
    E, D, splitWords,

    beat(bpm) { return 60 / (bpm || 120); },

    rise(tl, words, at, opts = {}) {
      tl.fromTo(words, { yPercent: 105 }, { yPercent: 0, duration: opts.duration || D.enter, ease: E.snap, stagger: opts.stagger ?? 0.06 }, at);
    },

    stretch(tl, el, at, opts = {}) {
      tl.fromTo(el, { fontStretch: "62%", letterSpacing: "-0.08em" },
        { fontStretch: (opts.to || 125) + "%", letterSpacing: "-0.02em", duration: opts.duration || D.move, ease: E.push }, at);
    },

    swap(tl, el, at) {
      tl.fromTo(el, { opacity: 0, y: 12, filter: "blur(6px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.3, ease: E.snap }, at);
    },

    typeOn(tl, el, at, opts = {}) {
      const full = el.dataset.text || el.textContent;
      el.dataset.text = full;
      const p = { n: 0 };
      const per = opts.per || 0.025;
      tl.fromTo(p, { n: 0 }, {
        n: full.length, duration: full.length * per, ease: "none",
        onUpdate: () => { el.textContent = full.slice(0, Math.round(p.n)); },
      }, at);
    },

    count(tl, el, at, to, opts = {}) {
      const p = { v: 0 };
      const suffix = opts.suffix || "";
      tl.fromTo(p, { v: 0 }, {
        v: to, duration: opts.duration || 0.8, ease: E.snap,
        onUpdate: () => { el.textContent = Math.round(p.v).toLocaleString("en-US") + suffix; },
      }, at);
    },

    underline(tl, line, at, opts = {}) {
      tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: opts.duration || 0.35, ease: E.draw }, at);
    },

    chip(tl, el, at, opts = {}) {
      tl.fromTo(el, { scale: 0.4, opacity: 0, rotation: opts.tilt ?? -8 },
        { scale: 1, opacity: 1, rotation: opts.rest ?? -2, duration: D.enter, ease: E.settle }, at);
    },

    // Camera punch-in on a wrapper; holds, then optional pull-out.
    punch(tl, cam, at, opts = {}) {
      tl.to(cam, { scale: opts.scale || 1.3, duration: opts.duration || D.push * 0.6, ease: "expo.out" }, at);
      if (opts.release) tl.to(cam, { scale: 1, duration: D.push, ease: E.push }, opts.release);
    },

    // Idle drift so nothing is ever static.
    drift(tl, el, at, dur, opts = {}) {
      tl.fromTo(el, { scale: 1 }, { scale: opts.scale || 1.03, duration: dur, ease: E.drift }, at);
    },

    // Cutline Wipe: a vertical line sweeps left→right; `next` is revealed behind it.
    wipe(tl, line, next, at, opts = {}) {
      const d = opts.duration || D.move;
      tl.fromTo(line, { left: "-2%" }, { left: "101%", duration: d, ease: E.draw }, at);
      tl.fromTo(next, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: d, ease: E.draw }, at);
    },

    // Iris: signal disc expands from (x,y) to cover the frame.
    iris(tl, disc, at, x, y, opts = {}) {
      tl.set(disc, { left: x, top: y }, at);
      tl.fromTo(disc, { scale: 0 }, { scale: opts.scale || 24, duration: opts.duration || 0.5, ease: "power3.in" }, at);
    },

    // Whip: out with x-blur, next in from the opposite side.
    whip(tl, out, next, at, opts = {}) {
      const d = opts.duration || 0.35, dir = opts.dir || -1;
      tl.to(out, { xPercent: 120 * dir, filter: "blur(24px)", duration: d, ease: E.push }, at);
      tl.fromTo(next, { xPercent: -120 * dir, filter: "blur(24px)" }, { xPercent: 0, filter: "blur(0px)", duration: d, ease: E.push }, at);
    },

    // HUD timecode, frame-accurate to composition time (fps default 30).
    timecode(tl, el, start, dur, fps = 30) {
      const p = { t: start };
      const fmt = (t) => {
        const f = Math.floor(t * fps + 1e-6);
        const s = Math.floor(f / fps), fr = f % fps;
        const pad = (n) => String(n).padStart(2, "0");
        return `00:${pad(Math.floor(s / 60))}:${pad(s % 60)}:${pad(fr)}`;
      };
      el.textContent = fmt(start);
      tl.fromTo(p, { t: start }, { t: start + dur, duration: dur, ease: "none", onUpdate: () => { el.textContent = fmt(p.t); } }, start);
    },
  };

  window.Cutline = Cutline;
})();
