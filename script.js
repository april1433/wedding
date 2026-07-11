/* =========================================================
   SUPABASE CLIENT
   Loaded via CDN in index.html
========================================================= */
const _sb = (typeof SUPABASE_URL !== 'undefined' && SUPABASE_URL && SUPABASE_ANON && SUPABASE_ANON !== 'YOUR_ANON_KEY_HERE')
  ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON)
  : null;

/* =========================================================
   COUNTDOWN
========================================================= */
const WEDDING_DATE = new Date("2026-07-18T14:00:00+08:00");

function updateCountdown(){
  const now = new Date();
  let diff = WEDDING_DATE - now;
  if (diff < 0) diff = 0;

  const days  = Math.floor(diff / (1000*60*60*24));
  const hours = Math.floor((diff / (1000*60*60)) % 24);
  const mins  = Math.floor((diff / (1000*60)) % 60);
  const secs  = Math.floor((diff / 1000) % 60);

  const pad = n => String(n).padStart(2,"0");
  const set = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };
  set("cd-days",  pad(days));
  set("cd-hours", pad(hours));
  set("cd-mins",  pad(mins));
  set("cd-secs",  pad(secs));
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* =========================================================
   NAV SCROLL STATE
========================================================= */
const nav = document.getElementById("nav");
if(nav){
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  });
}

/* =========================================================
   SCROLL REVEAL
========================================================= */
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

/* =========================================================
   RSVP FORM — Supabase
========================================================= */
const rsvpForm = document.getElementById("rsvp-form");
const rsvpNote = document.getElementById("rsvp-note");

if(rsvpForm){
  rsvpForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name      = document.getElementById("r-name")?.value.trim();
    const attending = document.getElementById("r-attend")?.value;
    const guests    = document.getElementById("r-guests")?.value || 1;
    const contact   = document.getElementById("r-email")?.value.trim();
    const message   = document.getElementById("r-message")?.value.trim();

    if (!name || !attending){
      rsvpNote.textContent = "Please fill in your name and attendance.";
      rsvpNote.className   = "rsvp-note err";
      return;
    }

    if (!_sb){
      rsvpNote.textContent = "Database not connected — add your Supabase anon key to config.js.";
      rsvpNote.className   = "rsvp-note err";
      return;
    }

    const submitBtn = rsvpForm.querySelector(".rsvp-pill-btn");
    if(submitBtn) submitBtn.disabled = true;
    rsvpNote.textContent = "Sending…";
    rsvpNote.className   = "rsvp-note";

    try {
      const { error } = await _sb.from("rsvp").insert({
        name, attending,
        guests:  parseInt(guests) || 1,
        contact: contact || null,
        message: message || null
      });

      if(error) throw error;

      rsvpNote.textContent = "🎉 Thank you! Your RSVP has been received.";
      rsvpNote.className   = "rsvp-note ok";
      rsvpForm.reset();
      const countDisplay = document.getElementById("rf-count");
      if(countDisplay) countDisplay.textContent = "1";
    } catch(err){
      console.error("RSVP error:", err);
      rsvpNote.textContent = "Error: " + (err.message || "Something went wrong. Please try again.");
      rsvpNote.className   = "rsvp-note err";
    } finally {
      if(submitBtn) submitBtn.disabled = false;
    }
  });
}

/* =========================================================
   GUESTBOOK — Supabase
========================================================= */
const gbForm = document.getElementById("gb-form");
const gbList = document.getElementById("gb-list");

function renderGuestbook(entries){
  if (!entries || !entries.length){
    gbList.innerHTML = `<div class="gb-entry"><div><div class="gb-msg">Be the first to leave a message!</div></div></div>`;
    return;
  }
  gbList.innerHTML = entries.map(entry => {
    const initial = (entry.name || "?").trim().charAt(0).toUpperCase();
    const date    = entry.created_at
      ? new Date(entry.created_at).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" })
      : "";
    return `
      <div class="gb-entry">
        <div class="gb-avatar">${initial}</div>
        <div>
          <span class="gb-date">${date}</span>
          <div class="gb-name">${escapeHtml(entry.name || "Guest")}</div>
          <div class="gb-msg">${escapeHtml(entry.message || "")}</div>
        </div>
      </div>`;
  }).join("");
}

function escapeHtml(str){
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

async function loadGuestbook(){
  if (!_sb) return;
  try {
    const { data, error } = await _sb
      .from("guestbook")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(8);
    if(error) throw error;
    renderGuestbook(data || []);
  } catch(err){
    console.error("Guestbook load error:", err);
  }
}
loadGuestbook();

if(gbForm){
  gbForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name    = document.getElementById("gb-name")?.value.trim();
    const message = document.getElementById("gb-msg")?.value.trim();
    if (!name || !message) return;

    if (!_sb){
      alert("Database not connected — add your Supabase anon key to config.js.");
      return;
    }

    try {
      const { error } = await _sb.from("guestbook").insert({ name, message });
      if(error) throw error;
      gbForm.reset();
      loadGuestbook();
    } catch(err){
      console.error("Guestbook post error:", err);
      alert("Could not post your message: " + (err.message || "Please try again."));
    }
  });
}

/* =========================================================
   BACKGROUND MUSIC WITH AUTOPLAY BYPASS
========================================================= */
(function() {
  const music = document.getElementById("bg-music");
  const toggle = document.getElementById("music-toggle");
  if (!music || !toggle) return;

  function playMusic() {
    music.play().then(() => {
      toggle.classList.remove("paused");
      toggle.classList.add("playing");
      removeInteractionListeners();
    }).catch(err => {
      console.log("Autoplay prevented. Waiting for user interaction...");
    });
  }

  function toggleMusic() {
    if (music.paused) {
      music.play();
      toggle.classList.remove("paused");
      toggle.classList.add("playing");
    } else {
      music.pause();
      toggle.classList.remove("playing");
      toggle.classList.add("paused");
    }
  }

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMusic();
  });

  // Try to play immediately on page load
  window.addEventListener("load", playMusic);

  // If blocked, play on first interaction
  const interactionEvents = ["click", "touchstart", "scroll", "keydown"];
  function handleFirstInteraction() {
    playMusic();
  }
  
  interactionEvents.forEach(evt => {
    document.addEventListener(evt, handleFirstInteraction, { once: true, passive: true });
  });

  function removeInteractionListeners() {
    interactionEvents.forEach(evt => {
      document.removeEventListener(evt, handleFirstInteraction);
    });
  }
})();

