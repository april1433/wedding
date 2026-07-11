# Renz & Joy — Wedding Site

A full wedding website: landing page, countdown, story, events, gallery,
entourage, RSVP form, guestbook, registry — plus a password-protected
**admin dashboard** that shows every RSVP in a live guest list.

Guest data is stored in a **Google Sheet** (free, no server needed).

---

## 1. What's in this folder

```
index.html              → the public wedding site
admin.html               → the admin dashboard (guest list)
style.css                → all styling (maroon & gold theme)
script.js                → countdown, RSVP + guestbook logic
config.js                → EDIT THIS: your backend URL + admin password
google-apps-script/
  Code.gs                → paste into Google Apps Script (backend)
```

---

## 2. Edit your wedding details

- **index.html** — replace "Renz & Joy", the date, venue names, and
  the "(replace)" photo placeholders with real `<img>` tags once you
  have photos (e.g. `<img src="assets/photo1.jpg">` instead of the
  placeholder `<div class="photo-slot">`).
- **script.js** — update `WEDDING_DATE` at the top to your real date/time.
- **admin.html / config.js** — change `ADMIN_PASSWORD` to something only
  you know.

---

## 3. Connect the free backend (5–10 minutes, one-time)

This lets RSVP and Guestbook submissions save to a Google Sheet you own,
and lets the admin page read them back.

**Step 1 — Create the sheet**
1. Go to [sheets.google.com](https://sheets.google.com) → create a
   new blank spreadsheet. Name it e.g. "Wedding RSVPs".

**Step 2 — Add the backend script**
1. In the sheet, click **Extensions → Apps Script**.
2. Delete any starter code in the editor.
3. Open `google-apps-script/Code.gs` from this folder, copy everything,
   and paste it into the Apps Script editor.
4. Click the **Save** icon (💾).

**Step 3 — Deploy it as a Web App**
1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" → choose **Web app**.
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**.
5. Google will ask you to **authorize** the script — click through the
   permission screens (click "Advanced" → "Go to project (unsafe)" if
   warned — this is your own script, it's safe).
6. Copy the **Web App URL** it gives you (looks like
   `https://script.google.com/macros/s/AKfycb.../exec`).

**Step 4 — Paste the URL into your site**
1. Open `config.js` in this folder.
2. Replace `PASTE_YOUR_WEB_APP_URL_HERE` with the URL you copied.
3. Save.

That's it — your RSVP form, guestbook, and admin dashboard are now live.
The first RSVP or guestbook post will automatically create "RSVP" and
"Guestbook" tabs in your spreadsheet.

> **Note:** whenever you edit `Code.gs`, you must go to
> **Deploy → Manage deployments → Edit (pencil) → New version → Deploy**
> for changes to go live. Just saving isn't enough.

---

## 4. Host it for free

Any static host works since this is plain HTML/CSS/JS:

- **Netlify** — drag this whole folder onto [app.netlify.com/drop](https://app.netlify.com/drop)
- **GitHub Pages** — push this folder to a GitHub repo, enable Pages
  in repo Settings
- **Vercel** — `vercel` CLI or drag-and-drop import

Once hosted, share the site link with guests, and keep
`yoursite.com/admin.html` private for yourselves.

---

## 5. Using the admin dashboard

Go to `admin.html`, enter your password, and you'll see:
- Total responses, attending count, declined count, total guest count
- A searchable table of every guest
- An **Export CSV** button to download the full list (e.g. for your
  caterer or seating chart)

---

## 6. Adding real photos

Put your images in an `assets/` folder (create it if it isn't there),
then in `index.html` replace a placeholder like:

```html
<div class="photo-slot">Photo 1<br>(replace)</div>
```

with:

```html
<img src="assets/photo1.jpg" alt="Renz and Joy">
```

Recommended: crop photos to roughly a 3:4 portrait ratio for the story
section, and square (1:1) for the gallery section, so they align neatly.
