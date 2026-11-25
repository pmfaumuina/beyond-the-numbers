/* =====================================================================
   THE HUMAN PULSE — SITE SCRIPT
   ---------------------------------------------------------------------
   No libraries. Everything is driven by window.EPISODES and
   window.TOPICS from js/episodes.js.

   Sections:
     1. Helpers (storage, formatting, toasts, announcements)
     2. Rendering (topic tiles, filter bar, episode cards)
     3. Audio availability + durations (auto-detects MP3s in /audio)
     4. Persistent audio player (+ Web Audio visualizer, Media Session)
     5. Episode details modal (focus trap, ESC)
     6. Filtering & topic tiles
     7. Navbar, scroll progress, active link, mobile menu
     8. Motion: scroll reveal, swooshes, ECG beats, parallax, count-up
     9. Testimonial carousel
    10. Newsletter form (front-end only)
    11. Accessibility toolbar
   ===================================================================== */
(function () {
  "use strict";

  var EPISODES = window.EPISODES || [];
  var TOPICS = window.TOPICS || [];
  var root = document.documentElement;

  /* -------------------------------------------------------------------
     1. HELPERS
     ------------------------------------------------------------------- */
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var STORE_PLAYER = "thp-player";
  var STORE_A11Y = "thp-a11y";

  function storeGet(key) {
    try { return JSON.parse(localStorage.getItem(key) || "null"); } catch (e) { return null; }
  }
  function storeSet(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
  }

  function motionOff() { return root.classList.contains("motion-off"); }

  function formatTime(sec) {
    if (!isFinite(sec) || sec < 0) return "—:—";
    sec = Math.floor(sec);
    var h = Math.floor(sec / 3600);
    var m = Math.floor((sec % 3600) / 60);
    var s = sec % 60;
    var ss = (s < 10 ? "0" : "") + s;
    if (h) return h + ":" + (m < 10 ? "0" : "") + m + ":" + ss;
    return m + ":" + ss;
  }

  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function icon(id, cls) {
    return '<svg aria-hidden="true"' + (cls ? ' class="' + cls + '"' : "") + '><use href="#i-' + id + '"/></svg>';
  }

  function topicById(id) {
    for (var i = 0; i < TOPICS.length; i++) if (TOPICS[i].id === id) return TOPICS[i];
    return { id: id, label: id, icon: "pulse", gradient: "grad-teal" };
  }

  /* Screen-reader announcement via the aria-live region */
  var srStatus = $("#sr-status");
  function announce(msg) {
    if (!srStatus) return;
    srStatus.textContent = "";
    setTimeout(function () { srStatus.textContent = msg; }, 60);
  }

  /* Toast notifications (also announced to screen readers) */
  var toastWrap = $("#toasts");
  function toast(msg, type) {
    var el = document.createElement("div");
    el.className = "toast" + (type ? " " + type : "");
    el.innerHTML = icon(type === "warn" ? "info" : "check") + "<span></span>";
    el.querySelector("span").textContent = msg;
    toastWrap.appendChild(el);
    announce(msg);
    setTimeout(function () {
      el.classList.add("out");
      setTimeout(function () { el.remove(); }, 400);
    }, 4200);
  }

  /* Image slot: gradient card + <img> with graceful fallback.
     SVGs are treated as illustrations (contained); other files as photos (cover). */
  function mediaSlot(src, gradient, fallbackIcon, extraClass) {
    var isSvg = /\.svg(\?|$)/i.test(src || "");
    return (
      '<div class="media ' + gradient + (extraClass ? " " + extraClass : "") + '">' +
        (src ? '<img src="' + escapeHTML(src) + '" alt="" loading="lazy" class="' + (isSvg ? "illus" : "photo") + '" />' : "") +
        '<span class="media-fallback">' + icon(fallbackIcon) + "</span>" +
      "</div>"
    );
  }
  /* Any image that fails to load shows its gradient + icon fallback */
  document.addEventListener("error", function (e) {
    var t = e.target;
    if (t && t.tagName === "IMG" && t.parentElement && t.parentElement.classList.contains("media")) {
      t.parentElement.classList.add("img-failed");
    }
  }, true);

  /* -------------------------------------------------------------------
     2. RENDERING
     ------------------------------------------------------------------- */
  var topicGrid = $("#topic-grid");
  var filterBar = $("#filter-bar");
  var episodeGrid = $("#episode-grid");

  function playButtonHTML(ep, extraClass) {
    return (
      '<button type="button" class="ep-play' + (extraClass ? " " + extraClass : "") + '" data-play-id="' + ep.id + '" aria-label="Play episode ' + ep.number + '">' +
        icon("play", "ico-play") + icon("pause", "ico-pause") +
      "</button>"
    );
  }

  function hostHTML(ep, extraClass) {
    if (!ep.host) return "";
    return '<p class="ep-host' + (extraClass ? " " + extraClass : "") + '">' + icon("mic") +
      "<span>Hosted by <strong>" + escapeHTML(ep.host) + "</strong></span></p>";
  }

  function renderTopics() {
    topicGrid.innerHTML = TOPICS.map(function (t) {
      var ep = EPISODES.filter(function (e) { return e.topic === t.id; })[0];
      return (
        '<button type="button" class="topic-tile" data-topic="' + t.id + '"' +
          ' aria-label="' + escapeHTML(t.label) + (ep ? ": view episode " + ep.number : "") + '">' +
          mediaSlot(ep ? ep.image : "", t.gradient, t.icon) +
          '<span class="topic-label">' + icon(t.icon) + "<span>" + escapeHTML(t.label) + "</span>" +
            (ep ? '<span class="topic-num">Ep. ' + ep.number + "</span>" : "") +
          "</span>" +
          '<span class="topic-view" aria-hidden="true">View episode ' + icon("arrow") + "</span>" +
        "</button>"
      );
    }).join("");
  }

  function renderFilters() {
    var pills = [{ id: "all", label: "All" }].concat(TOPICS);
    filterBar.innerHTML = pills.map(function (t, i) {
      return '<button type="button" class="filter-pill" data-filter="' + t.id + '" aria-pressed="' + (i === 0) + '">' + escapeHTML(t.label) + "</button>";
    }).join("");
  }

  function renderEpisodes() {
    episodeGrid.innerHTML = EPISODES.map(function (ep) {
      var t = topicById(ep.topic);
      return (
        '<article class="episode-card" id="card-' + ep.id + '" data-topic="' + ep.topic + '" data-id="' + ep.id + '" aria-labelledby="title-' + ep.id + '">' +
          '<div class="ep-media-wrap" style="position:relative">' +
            mediaSlot(ep.image, t.gradient, t.icon, "ep-media") +
            '<span class="ep-number">Episode ' + ep.number + "</span>" +
            '<span class="ep-soon" data-soon-id="' + ep.id + '" hidden>' + icon("clock") + "Coming Soon</span>" +
          "</div>" +
          '<div class="ep-body">' +
            '<span class="ep-tag">' + escapeHTML(t.label) + "</span>" +
            '<h3 class="ep-title" id="title-' + ep.id + '" tabindex="-1">' + escapeHTML(ep.title) + "</h3>" +
            hostHTML(ep) +
            '<p class="ep-desc">' + escapeHTML(ep.description) + "</p>" +
            '<div class="ep-foot">' +
              '<span class="ep-duration">' + icon("clock") + '<span data-duration-id="' + ep.id + '">' + escapeHTML(ep.duration) + "</span></span>" +
              '<button type="button" class="btn btn-outline btn-sm" data-details-id="' + ep.id + '">Episode details</button>' +
              playButtonHTML(ep) +
            "</div>" +
          "</div>" +
        "</article>"
      );
    }).join("");
  }

  renderTopics();
  renderFilters();
  renderEpisodes();

  /* -------------------------------------------------------------------
     3. AUDIO AVAILABILITY + DURATIONS
     Each episode's MP3 is probed once. If it loads, its duration fills in.
     If it errors (file not uploaded yet), the card gets "Coming Soon".
     ------------------------------------------------------------------- */
  function probeEpisode(ep) {
    if (ep._probe) return ep._probe;
    ep._probe = new Promise(function (resolve) {
      if (!ep.audio) { ep.available = false; return resolve(false); }
      var a = new Audio();
      a.preload = "metadata";
      var done = false;
      function finish(ok) {
        if (done) return;
        done = true;
        ep.available = ok;
        if (ok && isFinite(a.duration)) setDuration(ep, a.duration);
        updateAvailabilityUI(ep);
        a.removeAttribute("src"); a.load(); // release the probe
        resolve(ok);
      }
      a.addEventListener("loadedmetadata", function () { finish(true); });
      a.addEventListener("error", function () { finish(false); });
      a.src = ep.audio;
    });
    return ep._probe;
  }

  function setDuration(ep, seconds) {
    ep.durationSeconds = seconds;
    ep.duration = formatTime(seconds);
    $$('[data-duration-id="' + ep.id + '"]').forEach(function (el) { el.textContent = ep.duration; });
  }

  function updateAvailabilityUI(ep) {
    var missing = ep.available === false;
    $$('[data-soon-id="' + ep.id + '"]').forEach(function (el) { el.hidden = !missing; });
    $$('[data-play-id="' + ep.id + '"]').forEach(function (el) { el.classList.toggle("is-unavailable", missing); });
    if (missing) $$('[data-duration-id="' + ep.id + '"]').forEach(function (el) { el.textContent = "Coming soon"; });
  }

  EPISODES.forEach(probeEpisode);

  /* -------------------------------------------------------------------
     4. PERSISTENT AUDIO PLAYER
     ------------------------------------------------------------------- */
  var audio = new Audio();
  audio.preload = "metadata";

  var player = $("#player");
  var els = {
    play: $("#btn-play"), back: $("#btn-back"), fwd: $("#btn-fwd"),
    prev: $("#btn-prev"), next: $("#btn-next"), close: $("#btn-close"),
    speed: $("#btn-speed"), mute: $("#btn-mute"), volume: $("#volume"),
    cur: $("#time-current"), dur: $("#time-duration"),
    title: $("#player-title"), ep: $("#player-ep"), cover: $("#player-cover"),
    progress: $("#progress"), track: $("#progress-track"), fill: $("#progress-fill"),
    buffer: $("#progress-buffer"), tip: $("#progress-tooltip"), canvas: $("#viz-canvas")
  };

  var SPEEDS = [0.75, 1, 1.25, 1.5, 2];
  var state = { index: -1, visible: false, hasPlayed: false, lastSave: 0 };
  var saved = storeGet(STORE_PLAYER) || {};

  // Restore preferences
  if (typeof saved.volume === "number") { audio.volume = saved.volume; els.volume.value = saved.volume; }
  if (saved.muted) audio.muted = true;
  if (SPEEDS.indexOf(saved.speed) > -1) audio.playbackRate = audio.defaultPlaybackRate = saved.speed;
  updateSpeedUI(); updateVolumeUI();

  function currentEp() { return EPISODES[state.index] || null; }
  function indexOfId(id) {
    for (var i = 0; i < EPISODES.length; i++) if (EPISODES[i].id === id) return i;
    return -1;
  }

  function savePlayerState(force) {
    var now = Date.now();
    if (!force && now - state.lastSave < 4000) return;
    state.lastSave = now;
    var ep = currentEp();
    storeSet(STORE_PLAYER, {
      id: ep ? ep.id : saved.id,
      time: ep ? Math.floor(audio.currentTime || 0) : saved.time,
      volume: audio.volume, muted: audio.muted, speed: audio.playbackRate
    });
  }

  function showPlayer() {
    if (state.visible) return;
    state.visible = true;
    player.hidden = false;
    // next frame so the slide-up transition runs
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        player.classList.add("is-visible");
        syncPlayerHeight();
      });
    });
  }
  function hidePlayer() {
    state.visible = false;
    player.classList.remove("is-visible");
    root.style.setProperty("--player-h", "0px");
    setTimeout(function () { if (!state.visible) player.hidden = true; }, 550);
  }
  function syncPlayerHeight() {
    if (!state.visible) return;
    root.style.setProperty("--player-h", (player.offsetHeight + 16) + "px");
  }
  window.addEventListener("resize", syncPlayerHeight);

  /* Load an episode into the player (does not play) */
  function loadEpisode(index, startAt) {
    var ep = EPISODES[index];
    if (!ep) return;
    state.index = index;
    audio.src = ep.audio;
    audio.playbackRate = audio.defaultPlaybackRate = SPEEDS.indexOf(saved.speed) > -1 ? saved.speed : audio.playbackRate;
    if (startAt) {
      audio.addEventListener("loadedmetadata", function seek() {
        audio.removeEventListener("loadedmetadata", seek);
        if (startAt < audio.duration - 5) audio.currentTime = startAt;
      });
    }
    var t = topicById(ep.topic);
    els.title.textContent = ep.title;
    els.title.title = ep.title;
    els.ep.textContent = "Episode " + ep.number + (ep.host ? " · Hosted by " + ep.host : " · " + t.label);
    els.cover.className = "player-cover media " + t.gradient;
    els.cover.innerHTML = mediaSlot(ep.image, t.gradient, t.icon).replace(/^<div[^>]*>|<\/div>$/g, "");
    els.dur.textContent = ep.durationSeconds ? formatTime(ep.durationSeconds) : "—:—";
    els.cur.textContent = "0:00";
    setProgress(0);
    updateMediaSession(ep);
    syncButtons();
  }

  /* Main entry point used by every play button on the page */
  function playEpisode(index, opts) {
    opts = opts || {};
    var ep = EPISODES[index];
    if (!ep) return;

    // Same episode: toggle
    if (index === state.index && audio.src && !opts.restart) { togglePlay(); return; }

    if (ep.available === false) { comingSoon(ep); return; }
    ensureAnalyser(); // must happen inside the click for autoplay rules

    var go = function (ok) {
      if (!ok) { comingSoon(ep); return; }
      var resumeAt = (saved.id === ep.id && saved.time) ? saved.time : 0;
      loadEpisode(index, resumeAt);
      showPlayer();
      doPlay();
    };
    if (ep.available === true) go(true);
    else probeEpisode(ep).then(go);
  }

  function comingSoon(ep) {
    toast("Episode " + ep.number + " is coming soon — audio not yet uploaded.", "warn");
  }

  function doPlay() {
    var p = audio.play();
    if (p && p.catch) p.catch(function (err) {
      if (err && err.name === "NotAllowedError") toast("Press play to start listening.", "warn");
    });
  }
  function togglePlay() {
    if (state.index < 0) return;
    if (audio.paused) { ensureAnalyser(); doPlay(); } else audio.pause();
  }
  function seekBy(delta) {
    if (state.index < 0 || !isFinite(audio.duration)) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration, audio.currentTime + delta));
  }
  function step(dir) {
    if (state.index < 0) return;
    var n = EPISODES.length;
    for (var k = 1; k <= n; k++) {
      var i = (state.index + dir * k + n) % n;
      if (EPISODES[i].available !== false) { playEpisode(i, { restart: true }); return; }
    }
    toast("No other episodes are available yet.", "warn");
  }

  /* Keep every play button on the page in sync with the player */
  function syncButtons() {
    var playing = !audio.paused && !audio.ended;
    var ep = currentEp();
    $$("[data-play-id]").forEach(function (btn) {
      var id = btn.getAttribute("data-play-id");
      var e = EPISODES[indexOfId(id)];
      var active = ep && id === ep.id && playing;
      btn.classList.toggle("is-playing", !!active);
      btn.setAttribute("aria-label", (active ? "Pause" : "Play") + " episode " + (e ? e.number : ""));
    });
    $$(".episode-card").forEach(function (card) {
      card.classList.toggle("is-playing", !!(ep && card.getAttribute("data-id") === ep.id && playing));
    });
    els.play.innerHTML = icon(playing ? "pause" : "play");
    els.play.setAttribute("aria-label", playing ? "Pause" : "Play");
    player.classList.toggle("is-playing", playing);
    if ("mediaSession" in navigator) navigator.mediaSession.playbackState = playing ? "playing" : "paused";
  }

  /* Audio element events */
  audio.addEventListener("play", function () {
    state.hasPlayed = true;
    syncButtons();
    var ep = currentEp();
    if (ep) announce("Playing episode " + ep.number + ": " + ep.title);
    startViz();
  });
  audio.addEventListener("pause", function () {
    syncButtons();
    savePlayerState(true);
    if (!audio.ended) announce("Paused");
  });
  audio.addEventListener("ended", function () {
    syncButtons();
    var ep = currentEp();
    if (ep) { saved.id = ep.id; saved.time = 0; }
    savePlayerState(true);
    announce("Episode finished");
  });
  audio.addEventListener("loadedmetadata", function () {
    var ep = currentEp();
    if (ep && isFinite(audio.duration)) {
      setDuration(ep, audio.duration);
      els.dur.textContent = formatTime(audio.duration);
    }
  });
  audio.addEventListener("timeupdate", function () {
    var d = audio.duration;
    var c = audio.currentTime;
    els.cur.textContent = formatTime(c);
    if (isFinite(d) && d > 0) setProgress(c / d);
    var ep = currentEp();
    if (ep) { saved.id = ep.id; saved.time = c; }
    savePlayerState(false);
    updatePositionState();
  });
  audio.addEventListener("progress", function () {
    if (audio.buffered.length && isFinite(audio.duration)) {
      els.buffer.style.width = (audio.buffered.end(audio.buffered.length - 1) / audio.duration * 100) + "%";
    }
  });
  audio.addEventListener("error", function () {
    var ep = currentEp();
    if (!ep || !audio.getAttribute("src")) return;
    ep.available = false;
    updateAvailabilityUI(ep);
    comingSoon(ep);
    syncButtons();
    if (!state.hasPlayed) hidePlayer();
  });
  audio.addEventListener("ratechange", updateSpeedUI);
  audio.addEventListener("volumechange", updateVolumeUI);

  /* Progress / seek bar */
  var lastPct = 0;
  function setProgress(ratio) {
    lastPct = Math.max(0, Math.min(1, ratio));
    els.fill.style.width = (lastPct * 100) + "%";
    els.track.setAttribute("aria-valuenow", Math.round(lastPct * 100));
    els.track.setAttribute("aria-valuetext", formatTime(audio.currentTime) + " of " + formatTime(audio.duration));
  }
  function ratioFromEvent(e) {
    var r = els.track.getBoundingClientRect();
    return Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
  }
  var dragging = false;
  els.progress.addEventListener("pointerdown", function (e) {
    if (!isFinite(audio.duration)) return;
    dragging = true;
    els.progress.setPointerCapture(e.pointerId);
    audio.currentTime = ratioFromEvent(e) * audio.duration;
  });
  els.progress.addEventListener("pointermove", function (e) {
    var ratio = ratioFromEvent(e);
    var r = els.track.getBoundingClientRect();
    var pr = els.progress.getBoundingClientRect();
    els.tip.style.left = (r.left - pr.left + ratio * r.width) + "px";
    els.tip.textContent = isFinite(audio.duration) ? formatTime(ratio * audio.duration) : "—:—";
    if (dragging && isFinite(audio.duration)) audio.currentTime = ratio * audio.duration;
  });
  ["pointerup", "pointercancel"].forEach(function (t) {
    els.progress.addEventListener(t, function () { dragging = false; });
  });
  els.track.addEventListener("keydown", function (e) {
    var handled = true;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") seekBy(5);
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") seekBy(-5);
    else if (e.key === "PageUp") seekBy(30);
    else if (e.key === "PageDown") seekBy(-30);
    else if (e.key === "Home") audio.currentTime = 0;
    else if (e.key === "End" && isFinite(audio.duration)) audio.currentTime = audio.duration - 1;
    else handled = false;
    if (handled) { e.preventDefault(); e.stopPropagation(); }
  });

  /* Controls */
  els.play.addEventListener("click", togglePlay);
  els.back.addEventListener("click", function () { seekBy(-15); });
  els.fwd.addEventListener("click", function () { seekBy(30); });
  els.prev.addEventListener("click", function () { step(-1); });
  els.next.addEventListener("click", function () { step(1); });
  els.close.addEventListener("click", function () {
    audio.pause();
    hidePlayer();
    announce("Player closed");
    var b = $('[data-play-id="' + (currentEp() || {}).id + '"]');
    if (b) b.focus({ preventScroll: true });
  });
  els.speed.addEventListener("click", function () {
    var i = SPEEDS.indexOf(audio.playbackRate);
    var next = SPEEDS[(i + 1) % SPEEDS.length];
    audio.playbackRate = audio.defaultPlaybackRate = next;
    saved.speed = next;
    savePlayerState(true);
    announce("Playback speed " + next + "x");
  });
  function updateSpeedUI() {
    var r = audio.playbackRate;
    els.speed.textContent = r + "x";
    els.speed.setAttribute("aria-label", "Playback speed " + r + "x. Click to change.");
  }
  els.mute.addEventListener("click", toggleMute);
  function toggleMute() {
    audio.muted = !audio.muted;
    if (!audio.muted && audio.volume === 0) audio.volume = 0.6;
    savePlayerState(true);
    announce(audio.muted ? "Muted" : "Unmuted");
  }
  els.volume.addEventListener("input", function () {
    audio.volume = parseFloat(els.volume.value);
    audio.muted = audio.volume === 0;
    savePlayerState(true);
  });
  function updateVolumeUI() {
    var muted = audio.muted || audio.volume === 0;
    els.mute.innerHTML = icon(muted ? "mute" : "volume");
    els.mute.setAttribute("aria-label", muted ? "Unmute" : "Mute");
    els.volume.value = audio.muted ? 0 : audio.volume;
  }

  /* Every [data-play-id] button on the page (cards, modal) */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-play-id]");
    if (btn) { playEpisode(indexOfId(btn.getAttribute("data-play-id"))); return; }

    var action = e.target.closest("[data-action]");
    if (!action) return;
    var a = action.getAttribute("data-action");
    if (a === "trailer") {
      playEpisode(0);
    } else if (a === "listen-latest") {
      closeMenu();
      // Nav "Listen Now" resumes where you left off; otherwise play the latest episode
      var idx = -1;
      if (action.classList.contains("nav-cta") && saved.id) idx = indexOfId(saved.id);
      if (idx < 0 || EPISODES[idx].available === false) idx = latestAvailableIndex();
      var card = $("#card-" + EPISODES[idx].id);
      if (card) {
        resetFilter();
        card.scrollIntoView({ behavior: motionOff() ? "auto" : "smooth", block: "center" });
        highlight(card);
      }
      if (state.index === idx && !audio.paused) return;
      playEpisode(idx, { restart: state.index !== idx });
    }
  });
  function latestAvailableIndex() {
    for (var i = EPISODES.length - 1; i >= 0; i--) if (EPISODES[i].available !== false) return i;
    return EPISODES.length - 1;
  }

  /* Keyboard shortcuts: Space, ←/→, M */
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (!$("#episode-modal").hidden) return;
    var t = e.target;
    var tag = (t.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select" || t.isContentEditable) return;
    if (state.index < 0) return;
    var interactive = tag === "button" || tag === "a" || t.getAttribute("role") === "slider";

    if ((e.key === " " || e.code === "Space") && !interactive) {
      e.preventDefault(); togglePlay();
    } else if (e.key === "ArrowRight" && !interactive) {
      e.preventDefault(); seekBy(5);
    } else if (e.key === "ArrowLeft" && !interactive) {
      e.preventDefault(); seekBy(-5);
    } else if (e.key === "m" || e.key === "M") {
      toggleMute();
    }
  });

  /* Media Session API: lock-screen / OS media controls */
  function updateMediaSession(ep) {
    if (!("mediaSession" in navigator)) return;
    try {
      var art = new URL(ep.image, location.href).href;
      navigator.mediaSession.metadata = new MediaMetadata({
        title: ep.title,
        artist: ep.host ? "Hosted by " + ep.host + " · The Human Pulse" : "The Human Pulse",
        album: "Episode " + ep.number,
        artwork: [{ src: art, sizes: "512x512", type: /\.svg$/i.test(ep.image) ? "image/svg+xml" : "image/jpeg" }]
      });
    } catch (e) { /* ignore */ }
  }
  function updatePositionState() {
    if (!("mediaSession" in navigator) || !navigator.mediaSession.setPositionState) return;
    if (!isFinite(audio.duration)) return;
    try {
      navigator.mediaSession.setPositionState({ duration: audio.duration, playbackRate: audio.playbackRate, position: audio.currentTime });
    } catch (e) { /* ignore */ }
  }
  if ("mediaSession" in navigator) {
    var handlers = {
      play: function () { doPlay(); },
      pause: function () { audio.pause(); },
      seekbackward: function (d) { seekBy(-((d && d.seekOffset) || 15)); },
      seekforward: function (d) { seekBy((d && d.seekOffset) || 30); },
      previoustrack: function () { step(-1); },
      nexttrack: function () { step(1); },
      seekto: function (d) { if (d && typeof d.seekTime === "number") audio.currentTime = d.seekTime; }
    };
    Object.keys(handlers).forEach(function (k) {
      try { navigator.mediaSession.setActionHandler(k, handlers[k]); } catch (e) { /* unsupported action */ }
    });
  }

  window.addEventListener("pagehide", function () { savePlayerState(true); });

  /* --- Live visualizer (Web Audio AnalyserNode), with CSS fallback --- */
  var viz = { ctx: null, analyser: null, data: null, raf: 0, ok: false, tried: false };
  // Web Audio can only read audio served over http(s). Opening index.html
  // straight from disk (file://) would silence it, so fall back there.
  var canAnalyse = /^https?:$/.test(location.protocol) && !!(window.AudioContext || window.webkitAudioContext);
  if (!canAnalyse) player.classList.add("use-fake-wave");

  function ensureAnalyser() {
    if (!canAnalyse) return;
    if (viz.tried) { if (viz.ctx && viz.ctx.state === "suspended") viz.ctx.resume(); return; }
    viz.tried = true;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      viz.ctx = new AC();
      var src = viz.ctx.createMediaElementSource(audio);
      viz.analyser = viz.ctx.createAnalyser();
      viz.analyser.fftSize = 64;
      viz.analyser.smoothingTimeConstant = 0.8;
      src.connect(viz.analyser);
      viz.analyser.connect(viz.ctx.destination);
      viz.data = new Uint8Array(viz.analyser.frequencyBinCount);
      viz.ok = true;
    } catch (e) {
      viz.ok = false;
      player.classList.add("use-fake-wave");
    }
  }

  function startViz() {
    if (!viz.ok || viz.raf) return;
    var c = els.canvas;
    var dpr = window.devicePixelRatio || 1;
    c.width = 120 * dpr; c.height = 32 * dpr;
    var g = c.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    var bars = 16, gap = 3, w = (120 - gap * (bars - 1)) / bars;
    var grad = g.createLinearGradient(0, 32, 0, 0);
    grad.addColorStop(0, "#0E7C86");
    grad.addColorStop(1, "#1F6FB2");

    (function draw() {
      viz.raf = requestAnimationFrame(draw);
      viz.analyser.getByteFrequencyData(viz.data);
      g.clearRect(0, 0, 120, 32);
      for (var i = 0; i < bars; i++) {
        var v = viz.data[i + 1] / 255;
        var h = Math.max(3, v * 30);
        g.fillStyle = i % 5 === 4 ? "#FF6B6B" : grad;
        roundRect(g, i * (w + gap), 32 - h, w, h, 2);
      }
      if (audio.paused) { cancelAnimationFrame(viz.raf); viz.raf = 0; }
    })();
  }
  function roundRect(g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r);
    g.lineTo(x + w, y + h); g.lineTo(x, y + h); g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y);
    g.closePath(); g.fill();
  }

  /* -------------------------------------------------------------------
     5. EPISODE DETAILS MODAL
     ------------------------------------------------------------------- */
  var modal = $("#episode-modal");
  var modalBody = $("#modal-body");
  var modalDialog = $(".modal-dialog", modal);
  var lastFocus = null;

  function openModal(ep, opener) {
    var t = topicById(ep.topic);
    lastFocus = opener || document.activeElement;
    modalBody.innerHTML =
      '<div class="modal-hero ' + t.gradient + '">' +
        '<img src="' + escapeHTML(ep.image) + '" alt="" class="' + (/\.svg$/i.test(ep.image) ? "illus" : "photo") + '" />' +
      "</div>" +
      '<div class="modal-content">' +
        '<div class="modal-meta">' +
          '<span class="ep-tag">Episode ' + ep.number + " · " + escapeHTML(t.label) + "</span>" +
          hostHTML(ep, "modal-host") +
          '<span class="ep-duration">' + icon("clock") + '<span data-duration-id="' + ep.id + '">' +
            (ep.available === false ? "Coming soon" : escapeHTML(ep.duration)) + "</span></span>" +
        "</div>" +
        '<h2 id="modal-title">' + escapeHTML(ep.title) + "</h2>" +
        '<div class="modal-actions">' +
          playButtonHTML(ep) +
          '<span style="align-self:center;font-weight:600;color:var(--ink)">' +
            (ep.available === false ? "Audio coming soon" : "Listen to this episode") + "</span>" +
        "</div>" +
        "<h3>Show notes</h3><p>" + escapeHTML(ep.longDescription) + "</p>" +
        "<h3>Key questions</h3><ol class=\"q-list\">" +
          ep.keyQuestions.map(function (q) { return "<li>" + escapeHTML(q) + "</li>"; }).join("") +
        "</ol>" +
        "<h3>Voices in this episode</h3><ul class=\"guest-list\">" +
          ep.guests.map(function (g) { return "<li>" + icon("people") + escapeHTML(g) + "</li>"; }).join("") +
        "</ul>" +
        "<h3>Transcript</h3>" +
        '<div class="transcript' + (ep.transcript ? "" : " empty") + '" tabindex="0" aria-label="Transcript">' +
          (ep.transcript ? escapeHTML(ep.transcript) : "Transcript coming soon.") +
        "</div>" +
      "</div>";

    modal.hidden = false;
    document.body.style.overflow = "hidden";
    syncButtons();
    updateAvailabilityUI(ep);
    requestAnimationFrame(function () {
      modal.classList.add("is-open");
      $(".modal-close", modal).focus();
    });
  }
  function closeModal() {
    if (modal.hidden) return;
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(function () { modal.hidden = true; modalBody.innerHTML = ""; }, motionOff() ? 0 : 300);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  document.addEventListener("click", function (e) {
    var d = e.target.closest("[data-details-id]");
    if (d) { openModal(EPISODES[indexOfId(d.getAttribute("data-details-id"))], d); return; }
    if (e.target.closest("[data-close-modal]")) closeModal();
  });
  modal.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { e.preventDefault(); closeModal(); return; }
    if (e.key !== "Tab") return;
    // Focus trap
    var f = $$('button, [href], input, [tabindex]:not([tabindex="-1"])', modalDialog).filter(function (el) {
      return !el.disabled && el.offsetParent !== null;
    });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* -------------------------------------------------------------------
     6. FILTERING & TOPIC TILES
     ------------------------------------------------------------------- */
  var filterEmpty = $("#filter-empty");
  function applyFilter(topic) {
    $$(".filter-pill", filterBar).forEach(function (p) {
      p.setAttribute("aria-pressed", String(p.getAttribute("data-filter") === topic));
    });
    var shown = 0;
    $$(".episode-card", episodeGrid).forEach(function (card) {
      var match = topic === "all" || card.getAttribute("data-topic") === topic;
      if (match) shown++;
      clearTimeout(card._t);
      if (match) {
        if (card.hidden || card.classList.contains("is-hiding")) {
          card.hidden = false;
          card.classList.remove("is-hiding");
          if (!motionOff()) {
            card.classList.remove("is-entering");
            void card.offsetWidth; // restart animation
            card.classList.add("is-entering");
          }
        }
      } else if (!card.hidden) {
        if (motionOff()) { card.hidden = true; return; }
        card.classList.add("is-hiding");
        card._t = setTimeout(function () { card.hidden = true; card.classList.remove("is-hiding"); }, 320);
      }
    });
    filterEmpty.hidden = shown > 0;
    var label = topic === "all" ? "all topics" : topicById(topic).label;
    announce("Showing " + shown + " episode" + (shown === 1 ? "" : "s") + " for " + label);
  }
  function resetFilter() {
    var active = $('.filter-pill[aria-pressed="true"]', filterBar);
    if (active && active.getAttribute("data-filter") !== "all") {
      $$(".episode-card", episodeGrid).forEach(function (c) { clearTimeout(c._t); c.hidden = false; c.classList.remove("is-hiding"); });
      $$(".filter-pill", filterBar).forEach(function (p) { p.setAttribute("aria-pressed", String(p.getAttribute("data-filter") === "all")); });
      filterEmpty.hidden = true;
    }
  }
  filterBar.addEventListener("click", function (e) {
    var p = e.target.closest(".filter-pill");
    if (p) applyFilter(p.getAttribute("data-filter"));
  });
  episodeGrid.addEventListener("animationend", function (e) {
    e.target.classList.remove("is-entering", "is-highlight");
  });

  function highlight(card) {
    card.classList.remove("is-highlight");
    void card.offsetWidth;
    card.classList.add("is-highlight");
  }
  topicGrid.addEventListener("click", function (e) {
    var tile = e.target.closest(".topic-tile");
    if (!tile) return;
    var topic = tile.getAttribute("data-topic");
    var ep = EPISODES.filter(function (x) { return x.topic === topic; })[0];
    if (!ep) return;
    resetFilter();
    var card = $("#card-" + ep.id);
    card.scrollIntoView({ behavior: motionOff() ? "auto" : "smooth", block: "center" });
    highlight(card);
    $("#title-" + ep.id).focus({ preventScroll: true });
  });

  /* -------------------------------------------------------------------
     7. NAVBAR, SCROLL PROGRESS, ACTIVE LINK, MOBILE MENU
     ------------------------------------------------------------------- */
  var navbar = $("#navbar");
  var progressBar = $("#scroll-progress");
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY || window.pageYOffset;
      navbar.classList.toggle("scrolled", y > 10);
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var navLinks = $$(".nav-link");
  if ("IntersectionObserver" in window) {
    var sectionObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.id;
        navLinks.forEach(function (l) {
          var on = l.getAttribute("data-section") === id;
          l.classList.toggle("active", on);
          if (on) l.setAttribute("aria-current", "true"); else l.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    navLinks.forEach(function (l) {
      var s = document.getElementById(l.getAttribute("data-section"));
      if (s) sectionObs.observe(s);
    });
  }

  var hamburger = $("#hamburger");
  var navMenu = $("#nav-links");
  function closeMenu() {
    navMenu.classList.remove("open");
    navbar.classList.remove("menu-open");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Open menu");
  }
  hamburger.addEventListener("click", function () {
    var open = !navMenu.classList.contains("open");
    navMenu.classList.toggle("open", open);
    navbar.classList.toggle("menu-open", open);
    hamburger.setAttribute("aria-expanded", String(open));
    hamburger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open) { var first = $(".nav-link", navMenu); if (first) first.focus(); }
  });
  navMenu.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navMenu.classList.contains("open")) { closeMenu(); hamburger.focus(); }
  });
  document.addEventListener("click", function (e) {
    if (navMenu.classList.contains("open") && !e.target.closest("#navbar")) closeMenu();
  });

  /* -------------------------------------------------------------------
     8. MOTION
     ------------------------------------------------------------------- */
  // Stagger children by 80ms
  function setStagger(container) {
    Array.prototype.forEach.call(container.children, function (c, i) { c.style.setProperty("--delay", (i * 80) + "ms"); });
  }
  $$(".reveal-stagger").forEach(setStagger);

  // After revealing, drop the reveal classes so hover transitions work normally
  function finishReveal(el) {
    var count = el.classList.contains("reveal-stagger") ? el.children.length : 1;
    setTimeout(function () {
      el.classList.remove("reveal", "reveal-stagger", "is-visible");
      Array.prototype.forEach.call(el.children, function (c) { c.style.removeProperty("--delay"); });
    }, motionOff() ? 0 : 900 + count * 80);
  }

  if ("IntersectionObserver" in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-visible");
        revealObs.unobserve(en.target);
        finishReveal(en.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal, .reveal-stagger").forEach(function (el) { revealObs.observe(el); });

    var swooshObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-drawn");
        swooshObs.unobserve(en.target);
      });
    }, { threshold: 0.6 });
    $$(".swoosh").forEach(function (el) { swooshObs.observe(el); });
  } else {
    $$(".reveal, .reveal-stagger").forEach(function (el) { el.classList.add("is-visible"); });
    $$(".swoosh").forEach(function (el) { el.classList.add("is-drawn"); });
  }

  // ECG: add a travelling coral "beat" on top of every ECG line
  $$(".ecg-path").forEach(function (p, i) {
    var beat = p.cloneNode(false);
    beat.setAttribute("class", "ecg-beat");
    beat.setAttribute("pathLength", "1000");
    beat.style.animationDelay = (-i * 1.3) + "s";
    p.parentNode.appendChild(beat);
  });

  // Hero parallax on mouse move (desktop, fine pointer, motion allowed)
  var heroVisual = $("#hero-visual");
  var hero = $(".hero");
  var finePointer = window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (heroVisual && finePointer) {
    var layers = $$("[data-depth]", heroVisual);
    hero.addEventListener("mousemove", function (e) {
      if (motionOff() || window.innerWidth < 960) return;
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      layers.forEach(function (l) {
        var d = parseFloat(l.getAttribute("data-depth")) || 10;
        l.style.setProperty("--px", (-x * d).toFixed(1) + "px");
        l.style.setProperty("--py", (-y * d).toFixed(1) + "px");
      });
    });
    hero.addEventListener("mouseleave", function () {
      layers.forEach(function (l) { l.style.setProperty("--px", "0px"); l.style.setProperty("--py", "0px"); });
    });
  }

  // Count-up stats
  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-target")) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    if (motionOff()) { el.textContent = target + suffix; return; }
    var start = null, dur = 1400;
    (function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    })(performance.now());
  }
  var counters = $$(".count");
  if ("IntersectionObserver" in window) {
    var countObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        countUp(en.target);
        countObs.unobserve(en.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { countObs.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = c.getAttribute("data-target") + (c.getAttribute("data-suffix") || ""); });
  }

  /* -------------------------------------------------------------------
     9. TESTIMONIAL CAROUSEL (autoplay, swipe, dots)
     ------------------------------------------------------------------- */
  (function carousel() {
    var wrap = $("#carousel");
    if (!wrap) return;
    var track = $("#carousel-track");
    var slides = $$(".slide", track);
    var dotsWrap = $("#carousel-dots");
    var idx = 0, timer = 0, paused = false;

    dotsWrap.innerHTML = slides.map(function (_, i) {
      return '<button type="button" aria-label="Show feedback ' + (i + 1) + ' of ' + slides.length + '"></button>';
    }).join("");
    var dots = $$("button", dotsWrap);

    function go(i) {
      idx = (i + slides.length) % slides.length;
      track.style.transform = "translateX(" + (-idx * 100) + "%)";
      slides.forEach(function (s, k) {
        s.setAttribute("aria-hidden", String(k !== idx));
        if (k !== idx) s.setAttribute("inert", ""); else s.removeAttribute("inert");
      });
      dots.forEach(function (d, k) {
        if (k === idx) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
      });
    }
    function schedule() {
      clearInterval(timer);
      if (motionOff()) return;
      timer = setInterval(function () { if (!paused && !document.hidden) go(idx + 1); }, 6000);
    }
    dots.forEach(function (d, k) { d.addEventListener("click", function () { go(k); schedule(); }); });
    $("#carousel-prev").addEventListener("click", function () { go(idx - 1); schedule(); });
    $("#carousel-next").addEventListener("click", function () { go(idx + 1); schedule(); });
    wrap.addEventListener("mouseenter", function () { paused = true; });
    wrap.addEventListener("mouseleave", function () { paused = false; });
    wrap.addEventListener("focusin", function () { paused = true; });
    wrap.addEventListener("focusout", function () { paused = false; });

    // Swipe
    var startX = null, startY = null;
    track.addEventListener("pointerdown", function (e) { startX = e.clientX; startY = e.clientY; });
    track.addEventListener("pointerup", function (e) {
      if (startX === null) return;
      var dx = e.clientX - startX, dy = e.clientY - startY;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { go(idx + (dx < 0 ? 1 : -1)); schedule(); }
      startX = null;
    });
    track.addEventListener("pointercancel", function () { startX = null; });

    go(0);
    schedule();
    window.__thpCarouselSchedule = schedule;
  })();

  /* -------------------------------------------------------------------
     10. NEWSLETTER (front-end only: nothing is sent anywhere)
     ------------------------------------------------------------------- */
  var form = $("#news-form");
  if (form) {
    var input = $("#news-email");
    var field = $(".news-field", form);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = input.value.trim();
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      field.classList.toggle("invalid", !ok);
      input.setAttribute("aria-invalid", String(!ok));
      if (!ok) { toast("Please enter a valid email address.", "warn"); input.focus(); return; }
      form.reset();
      toast("Thanks for subscribing! (Demo only: no email was sent or stored.)");
    });
    input.addEventListener("input", function () {
      field.classList.remove("invalid");
      input.removeAttribute("aria-invalid");
    });
  }

  /* -------------------------------------------------------------------
     11. ACCESSIBILITY TOOLBAR
     ------------------------------------------------------------------- */
  var a11yToggle = $("#a11y-toggle");
  var a11yPanel = $("#a11y-panel");
  var a11yClass = { largeText: "a11y-large-text", highContrast: "a11y-high-contrast", reduceMotion: "a11y-reduce-motion" };
  var a11y = storeGet(STORE_A11Y) || {};
  var osReduce = window.matchMedia ? matchMedia("(prefers-reduced-motion: reduce)") : null;

  function applyA11y() {
    Object.keys(a11yClass).forEach(function (k) {
      root.classList.toggle(a11yClass[k], !!a11y[k]);
      var b = $('[data-a11y="' + k + '"]');
      if (b) b.setAttribute("aria-pressed", String(!!a11y[k]));
    });
    root.classList.toggle("motion-off", !!a11y.reduceMotion || !!(osReduce && osReduce.matches));
    if (window.__thpCarouselSchedule) window.__thpCarouselSchedule();
    syncPlayerHeight();
  }
  applyA11y();
  if (osReduce && osReduce.addEventListener) osReduce.addEventListener("change", applyA11y);

  a11yToggle.addEventListener("click", function () {
    var open = a11yPanel.hidden;
    a11yPanel.hidden = !open;
    a11yToggle.setAttribute("aria-expanded", String(open));
    if (open) $(".a11y-option", a11yPanel).focus();
  });
  a11yPanel.addEventListener("click", function (e) {
    var b = e.target.closest("[data-a11y]");
    if (!b) return;
    var k = b.getAttribute("data-a11y");
    a11y[k] = !a11y[k];
    storeSet(STORE_A11Y, a11y);
    applyA11y();
    announce(b.textContent.trim() + (a11y[k] ? " on" : " off"));
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !a11yPanel.hidden) { a11yPanel.hidden = true; a11yToggle.setAttribute("aria-expanded", "false"); a11yToggle.focus(); }
  });
  document.addEventListener("click", function (e) {
    if (!a11yPanel.hidden && !e.target.closest("#a11y")) { a11yPanel.hidden = true; a11yToggle.setAttribute("aria-expanded", "false"); }
  });
})();
