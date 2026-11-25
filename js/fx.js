/* =====================================================================
   BEYOND THE NUMBERS — VISUAL EFFECTS (decorative only)
   ---------------------------------------------------------------------
   1. Hero "data particles": drifting dots linked by faint lines,
      with a few coral "heartbeat" particles.
   2. Floating medical line icons (drop, CGM sensor, insulin pen,
      meter, DNA, heart) behind each light section.
   3. Spotlight glow that follows the pointer on cards.
   Everything here is aria-hidden and respects "reduce motion".
   ===================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  function motionOff() { return root.classList.contains("motion-off"); }

  /* -------------------------------------------------------------------
     1. HERO PARTICLES
     ------------------------------------------------------------------- */
  var canvas = document.getElementById("hero-particles");
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var hero = canvas.closest(".hero");
    var W = 0, H = 0, dpr = 1, pts = [], running = false, visible = true, raf = 0;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = hero.clientWidth; H = hero.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.round(Math.min(70, Math.max(26, (W * H) / 16000)));
      pts = [];
      for (var i = 0; i < count; i++) {
        pts.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
          r: Math.random() * 1.6 + 0.8,
          warm: Math.random() < 0.14,          // coral "heartbeat" particles
          phase: Math.random() * Math.PI * 2
        });
      }
      draw(0);
    }

    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      var maxD = 130, i, j, p, q, dx, dy, d;
      for (i = 0; i < pts.length; i++) {
        p = pts[i];
        for (j = i + 1; j < pts.length; j++) {
          q = pts[j]; dx = p.x - q.x; dy = p.y - q.y; d = dx * dx + dy * dy;
          if (d < maxD * maxD) {
            ctx.strokeStyle = "rgba(94, 234, 212," + (0.16 * (1 - Math.sqrt(d) / maxD)).toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
      }
      for (i = 0; i < pts.length; i++) {
        p = pts[i];
        var pulse = p.warm ? 1 + Math.max(0, Math.sin(t / 380 + p.phase)) * 1.4 : 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = p.warm ? "rgba(255, 120, 140, .85)" : "rgba(125, 233, 255, .75)";
        ctx.shadowColor = p.warm ? "rgba(255, 107, 139, .9)" : "rgba(34, 211, 238, .8)";
        ctx.shadowBlur = p.warm ? 12 : 6;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }

    function step(t) {
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = W + 10; else if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10; else if (p.y > H + 10) p.y = -10;
      }
      draw(t);
      raf = requestAnimationFrame(step);
    }

    function sync() {
      var should = visible && !motionOff() && !document.hidden;
      if (should && !running) { running = true; raf = requestAnimationFrame(step); }
      else if (!should && running) { running = false; cancelAnimationFrame(raf); draw(0); }
    }

    resize();
    var rt;
    window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(resize, 150); });
    document.addEventListener("visibilitychange", sync);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; sync(); }).observe(hero);
    }
    new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ["class"] });
    sync();
  }

  /* -------------------------------------------------------------------
     2. FLOATING MEDICAL ICONS
     Positions are percentages of the section; icons sit behind content.
     ------------------------------------------------------------------- */
  var sets = {
    directories:  [["cgm", 6, 14, 54], ["insulin", 90, 70, 60], ["cross", 48, 88, 30]],
    topics:       [["drop", 4, 10, 46], ["dna", 93, 18, 58], ["heart", 88, 86, 40], ["pill", 8, 82, 40]],
    episodes:     [["meter", 95, 8, 56], ["cgm", 3, 40, 48], ["insulin", 92, 60, 64], ["drop", 6, 92, 36]],
    about:        [["heart", 4, 8, 44], ["dna", 94, 40, 60], ["cross", 50, 4, 28]],
    testimonials: [["drop", 94, 12, 40], ["heart", 3, 80, 46]],
    resources:    [["steth", 95, 10, 54], ["meter", 4, 60, 50], ["pill", 90, 90, 38]]
  };
  Object.keys(sets).forEach(function (name) {
    var sec = document.querySelector("section." + name);
    if (!sec) return;
    var wrap = document.createElement("div");
    wrap.className = "med-float";
    wrap.setAttribute("aria-hidden", "true");
    wrap.innerHTML = sets[name].map(function (s, i) {
      return '<svg style="left:' + s[1] + "%;top:" + s[2] + "%;width:" + s[3] + "px;height:" + s[3] +
        "px;animation-delay:" + (-i * 2.3) + 's"><use href="#i-' + s[0] + '"/></svg>';
    }).join("");
    sec.insertBefore(wrap, sec.firstChild);
  });

  /* -------------------------------------------------------------------
     3. POINTER SPOTLIGHT ON CARDS
     ------------------------------------------------------------------- */
  var glowSel = ".episode-card, .feature-card, .resource-card, .topic-tile, .stats";
  document.addEventListener("pointermove", function (e) {
    if (e.pointerType !== "mouse") return;
    var el = e.target.closest && e.target.closest(glowSel);
    if (!el) return;
    var r = el.getBoundingClientRect();
    el.style.setProperty("--mx", (e.clientX - r.left) + "px");
    el.style.setProperty("--my", (e.clientY - r.top) + "px");
  }, { passive: true });
})();
