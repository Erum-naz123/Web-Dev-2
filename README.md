# 🌌 BigPlanetarium

An educational website about the Milky Way galaxy and our Solar System, built for the Web Development assessment. The site is designed to be accessible, engaging, and informative for a wide range of users.

---

## 📁 Project Structure

```
bigplanetarium/
├── index.html        ← Home page (Milky Way overview + quiz)
├── planets.html      ← All 8 planets with facts and images
├── mars.html         ← Mars deep-dive (tabs, gallery, lightbox)
├── css/
│   └── style.css     ← All styles (dark theme, responsive, accessible)
├── js/
│   └── main.js       ← All JavaScript interactions
├── dev-document.md   ← Development document (submit alongside site)
└── README.md         ← This file
```

---

## 🚀 How to Run

This is a **plain HTML/CSS/JavaScript** website — no build tools, no frameworks, no installation required.

### Option 1 — Open directly in a browser (quickest)

1. Download and unzip `bigplanetarium.zip`
2. Open the `bigplanetarium/` folder
3. Double-click `index.html`

> ⚠️ Some browsers block certain features (like fonts) when opening files directly from disk. If anything looks off, use Option 2 below.

---

### Option 2 — Use VS Code Live Server (recommended)

1. Install [Visual Studio Code](https://code.visualstudio.com/)
2. Install the **Live Server** extension:
   - Open VS Code → Extensions (`Ctrl+Shift+X` / `Cmd+Shift+X`)
   - Search for **Live Server** by Ritwick Dey → click Install
3. Open the `bigplanetarium/` folder in VS Code (`File → Open Folder`)
4. Right-click `index.html` in the file explorer → **Open with Live Server**
5. The site opens automatically at `http://127.0.0.1:5500`

---

### Option 3 — Python local server

If you have Python installed, open a terminal inside the `bigplanetarium/` folder and run:

**Python 3:**
```bash
python -m http.server 8000
```

**Python 2:**
```bash
python -m SimpleHTTPServer 8000
```

Then open your browser and go to: `http://localhost:8000`

---

### Option 4 — Push to GitHub and view via GitHub Pages

1. Create a new repository on [github.com](https://github.com)
2. Inside the `bigplanetarium/` folder, open a terminal and run:

```bash
git init
git add .
git commit -m "Initial commit — BigPlanetarium"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git push -u origin main
```

3. On GitHub: go to your repo → **Settings** → **Pages**
4. Under **Source**, select `main` branch and `/ (root)` → click **Save**
5. Your site will be live at: `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

> Replace `YOUR-USERNAME` and `YOUR-REPO-NAME` with your actual GitHub username and repository name.

---

## 🌐 Pages

| Page | URL (local) | Description |
|---|---|---|
| Home | `/index.html` | Milky Way overview, stats, video, quiz, planet previews |
| Planets | `/planets.html` | All 8 planets with images and key facts |
| Mars | `/mars.html` | Tabbed content, image gallery with lightbox, video |

---

## ✅ Requirements Met

| Requirement | How it's implemented |
|---|---|
| Semantic HTML | `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<figure>`, `<dl>` |
| CSS styling | Custom properties, Grid, Flexbox, fluid typography with `clamp()` |
| JavaScript interactions | Starfield canvas, quiz, tabs, lightbox, scroll reveal, nav toggle |
| 3+ pages with navigation | `index.html`, `planets.html`, `mars.html` — all linked in nav |
| Rich media | NASA images on every page + 2 YouTube video embeds |
| Accessibility (additional req.) | Skip link, ARIA roles/labels, keyboard navigation, focus styles, reduced-motion support, high colour contrast |
| Well-formatted code | Consistent indentation + comments throughout all files |

---

## 🖼️ Image Credits

All images are sourced directly from **NASA's Planetary Photojournal** (`photojournal.jpl.nasa.gov`) and are in the public domain. No third-party image hosting is used.

All videos are official NASA content hosted on YouTube.

---

## 🔧 No Dependencies

- No npm / Node.js required
- No frameworks (no React, Vue, Bootstrap, etc.)
- Google Fonts are loaded via CDN (requires internet connection)
- All images load from NASA's servers (requires internet connection)

---

*Built for BigPlanetarium, Bristol — Web Development Assessment 2024*
